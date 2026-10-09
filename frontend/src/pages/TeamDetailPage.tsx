import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamService } from '../services/teamService';
import { dataService } from '../services/dataService';
import type { Team, JoinRequest, Skill, ProficiencyLevel, TeamRequirementCreate } from '../types';
import { Card } from '../components/Card';

import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Avatar } from '../components/Avatar';
import {
  ArrowLeft,
  Users,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Send,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

export const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const id = Number(teamId);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [team, setTeam] = useState<Team | null>(null);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [userJoinRequests, setUserJoinRequests] = useState<JoinRequest[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [joinMessage, setJoinMessage] = useState<string>('');
  const [isSubmittingJoin, setIsSubmittingJoin] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<boolean>(false);

  // Edit Team Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editProjectTitle, setEditProjectTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editMaxMembers, setEditMaxMembers] = useState<number>(4);
  const [editRequirements, setEditRequirements] = useState<TeamRequirementCreate[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<number | ''>('');
  const [selectedProficiency, setSelectedProficiency] = useState<ProficiencyLevel>('intermediate');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);

  const isOwner = user && team && user.id === team.owner_id;
  const isMember = user && team && team.members.some((m) => m.user_id === user.id);
  const userRequest = userJoinRequests.find((r) => r.team_id === id);

  const fetchTeamData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await teamService.getTeamById(id);
      setTeam(data);

      if (user) {
        if (user.id === data.owner_id) {
          const reqs = await teamService.getTeamJoinRequests(id);
          setJoinRequests(reqs);
        }
        const myReqs = await teamService.getMyJoinRequests();
        setUserJoinRequests(myReqs);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load team details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTeamData();
    }
    dataService.getSkills().then(setAvailableSkills).catch(console.error);
  }, [id, user?.id]);

  const handleOpenJoinModal = () => {
    setJoinMessage('');
    setJoinError(null);
    setJoinSuccess(false);
    setIsJoinModalOpen(true);
  };

  const handleSubmitJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setIsSubmittingJoin(true);
    setJoinError(null);
    try {
      await teamService.submitJoinRequest(team.id, { message: joinMessage });
      setJoinSuccess(true);
      setTimeout(() => {
        setIsJoinModalOpen(false);
        fetchTeamData();
      }, 1500);
    } catch (err: any) {
      setJoinError(err.response?.data?.detail || 'Failed to submit join request');
    } finally {
      setIsSubmittingJoin(false);
    }
  };

  const handleReviewRequest = async (requestId: number, status: 'accepted' | 'rejected') => {
    if (!team) return;
    try {
      await teamService.reviewJoinRequest(team.id, requestId, { status });
      fetchTeamData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to process request');
    }
  };

  const handleCloseTeam = async () => {
    if (!team || !window.confirm('Are you sure you want to close this team to new members?')) return;
    try {
      await teamService.closeTeam(team.id);
      fetchTeamData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to close team');
    }
  };

  const handleOpenEditModal = () => {
    if (!team) return;
    setEditName(team.name);
    setEditProjectTitle(team.project_title);
    setEditDescription(team.description || '');
    setEditMaxMembers(team.max_members);
    setEditRequirements(
      team.requirements.map((r) => ({
        skill_id: r.skill_id,
        required_proficiency: r.required_proficiency,
      }))
    );
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleAddSkillToEdit = () => {
    if (!selectedSkillId) return;
    const sId = Number(selectedSkillId);
    if (editRequirements.some((r) => r.skill_id === sId)) return;
    setEditRequirements([...editRequirements, { skill_id: sId, required_proficiency: selectedProficiency }]);
    setSelectedSkillId('');
  };

  const handleRemoveSkillFromEdit = (skillId: number) => {
    setEditRequirements(editRequirements.filter((r) => r.skill_id !== skillId));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setIsSubmittingEdit(true);
    setEditError(null);
    try {
      await teamService.updateTeam(team.id, {
        name: editName,
        project_title: editProjectTitle,
        description: editDescription,
        max_members: editMaxMembers,
        required_skills: editRequirements,
      });
      setIsEditModalOpen(false);
      fetchTeamData();
    } catch (err: any) {
      setEditError(err.response?.data?.detail || 'Failed to update team');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-800">{error || 'Team not found'}</h3>
        <Button variant="outline" onClick={() => navigate('/teams')}>
          Back to Teams
        </Button>
      </div>
    );
  }

  const proficiencyBadgeVariant = (level: string) => {
    switch (level) {
      case 'expert':
        return 'rose';
      case 'advanced':
        return 'violet';
      case 'intermediate':
        return 'indigo';
      default:
        return 'slate';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/teams')}
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Teams
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{team.name}</h1>
            <Badge variant={team.status === 'open' ? 'emerald' : 'rose'} size="md">
              {team.status === 'open' ? 'Open for Members' : 'Closed'}
            </Badge>
          </div>
          <p className="text-base font-semibold text-indigo-600">{team.project_title}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isOwner && (
            <>
              <Button variant="secondary" onClick={handleOpenEditModal} icon={<Edit className="w-4 h-4" />}>
                Edit Team
              </Button>
              {team.status === 'open' && (
                <Button variant="outline" onClick={handleCloseTeam} icon={<Lock className="w-4 h-4" />}>
                  Close Team
                </Button>
              )}
            </>
          )}

          {!isOwner && (
            <>
              {isMember && (
                <Badge variant="emerald" size="md">
                  <CheckCircle className="w-4 h-4 mr-1 inline" /> Joined Member
                </Badge>
              )}

              {!isMember && userRequest && userRequest.status === 'pending' && (
                <Badge variant="amber" size="md">
                  <Clock className="w-4 h-4 mr-1 inline" /> Join Request Pending
                </Badge>
              )}

              {!isMember && (!userRequest || userRequest.status === 'rejected') && (
                <Button
                  variant="primary"
                  disabled={team.status === 'closed' || team.available_capacity <= 0}
                  onClick={handleOpenJoinModal}
                  icon={<Send className="w-4 h-4" />}
                >
                  {userRequest?.status === 'rejected' ? 'Re-apply to Join' : 'Request to Join'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Overview & Requirements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Project Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {team.description || 'No detailed description provided.'}
            </p>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div>
                <span className="font-semibold text-slate-700 block">Created On</span>
                {new Date(team.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </div>
              <div>
                <span className="font-semibold text-slate-700 block">Team Lead</span>
                {team.owner.full_name} ({team.owner.email})
              </div>
            </div>
          </Card>

          {/* Required Skills */}
          <Card className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Required Skills & Proficiencies ({team.requirements.length})
            </h3>
            {team.requirements.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific skill requirements listed.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {team.requirements.map((req) => (
                  <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{req.skill.name}</p>
                      <p className="text-xs text-slate-500">{req.skill.category || 'General'}</p>
                    </div>
                    <Badge variant={proficiencyBadgeVariant(req.required_proficiency)}>
                      {req.required_proficiency}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Owner Request Management Section */}
          {isOwner && (
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Incoming Join Requests ({joinRequests.length})
                </h3>
              </div>

              {joinRequests.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">No join requests received yet.</p>
              ) : (
                <div className="space-y-3">
                  {joinRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar name={req.user.full_name} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{req.user.full_name}</span>
                            <Badge
                              variant={
                                req.status === 'accepted' ? 'emerald' : req.status === 'rejected' ? 'rose' : 'amber'
                              }
                            >
                              {req.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">{req.user.email}</p>
                          {req.message && (
                            <p className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-100 mt-2 italic">
                              "{req.message}"
                            </p>
                          )}
                        </div>
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2 sm:self-center">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleReviewRequest(req.id, 'accepted')}
                            icon={<CheckCircle className="w-4 h-4" />}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReviewRequest(req.id, 'rejected')}
                            icon={<XCircle className="w-4 h-4" />}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right column: Capacity & Team Members */}
        <div className="space-y-6">
          {/* Capacity Card */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Team Capacity</span>
              <span className="text-indigo-600 font-extrabold">
                {team.current_member_count} / {team.max_members}
              </span>
            </h3>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  team.current_member_count >= team.max_members ? 'bg-rose-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(100, (team.current_member_count / team.max_members) * 100)}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-500">
              {team.available_capacity > 0
                ? `${team.available_capacity} open spot${team.available_capacity > 1 ? 's' : ''} available`
                : 'Team has reached maximum member capacity'}
            </p>
          </Card>

          {/* Members List */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Current Members ({team.members.length})
            </h3>

            <div className="space-y-3">
              {team.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.user.full_name} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{m.user.full_name}</p>
                      <p className="text-[11px] text-slate-400">{m.user.email}</p>
                    </div>
                  </div>
                  <Badge variant={m.role === 'owner' ? 'violet' : 'indigo'} size="sm">
                    {m.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Join Request Modal */}
      <Modal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} title="Apply to Join Team">
        <form onSubmit={handleSubmitJoinRequest} className="space-y-4">
          <p className="text-xs text-slate-600">
            Applying to join <strong className="text-slate-900">{team.name}</strong>. Introduce yourself or list your relevant skills for the team owner.
          </p>

          {joinError && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200">
              {joinError}
            </div>
          )}

          {joinSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs border border-emerald-200">
              Join request submitted successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Application Note (Optional)</label>
            <textarea
              rows={4}
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              placeholder="e.g. Hi! I have experience in React and FastAPI and would love to work on the medical triage project."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmittingJoin}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Team Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Team Details">
        <form onSubmit={handleSaveEdit} className="space-y-4">
          {editError && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200">
              {editError}
            </div>
          )}

          <Input
            label="Team Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />

          <Input
            label="Project Title / Idea"
            value={editProjectTitle}
            onChange={(e) => setEditProjectTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <Input
            label="Maximum Members"
            type="number"
            min={team.current_member_count}
            max={50}
            value={editMaxMembers}
            onChange={(e) => setEditMaxMembers(Number(e.target.value))}
            required
          />

          {/* Skill requirements section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">Required Skills & Proficiency</label>
            <div className="flex gap-2">
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value ? Number(e.target.value) : '')}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">Select skill...</option>
                {availableSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category || 'General'})
                  </option>
                ))}
              </select>

              <select
                value={selectedProficiency}
                onChange={(e) => setSelectedProficiency(e.target.value as ProficiencyLevel)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>

              <Button type="button" size="sm" variant="secondary" onClick={handleAddSkillToEdit} icon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {editRequirements.map((req) => {
                const s = availableSkills.find((sk) => sk.id === req.skill_id);
                return (
                  <span
                    key={req.skill_id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200/60"
                  >
                    {s ? s.name : `Skill #${req.skill_id}`} ({req.required_proficiency})
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillFromEdit(req.skill_id)}
                      className="text-indigo-400 hover:text-indigo-900"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmittingEdit}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
