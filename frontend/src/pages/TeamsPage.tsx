import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamService } from '../services/teamService';
import { dataService } from '../services/dataService';
import type { Team, JoinRequest, Skill, ProficiencyLevel, TeamRequirementCreate } from '../types';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Avatar } from '../components/Avatar';
import {
  Plus,
  Search,
  Users,
  ArrowRight,
  AlertCircle,
  Send,
  Trash2,
  FolderCheck
} from 'lucide-react';


export const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'discover' | 'my-teams'>('discover');

  // Discover state
  const [teams, setTeams] = useState<Team[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // My Teams state
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [myJoinRequests, setMyJoinRequests] = useState<JoinRequest[]>([]);
  const [isLoadingMyTeams, setIsLoadingMyTeams] = useState<boolean>(false);

  // Create Team Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [maxMembers, setMaxMembers] = useState<number>(4);
  const [requiredSkills, setRequiredSkills] = useState<TeamRequirementCreate[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<number | ''>('');
  const [selectedProficiency, setSelectedProficiency] = useState<ProficiencyLevel>('intermediate');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Quick Join Modal State
  const [quickJoinTeam, setQuickJoinTeam] = useState<Team | null>(null);
  const [joinMessage, setJoinMessage] = useState<string>('');
  const [isSubmittingJoin, setIsSubmittingJoin] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<boolean>(false);

  const fetchDiscoverTeams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await teamService.getTeams({
        status: 'open',
        search: searchQuery || undefined,
        skill_id: selectedSkillFilter ? Number(selectedSkillFilter) : undefined,
      });
      setTeams(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyTeamsData = async () => {
    if (!user) return;
    setIsLoadingMyTeams(true);
    try {
      const [userTeams, userReqs] = await Promise.all([
        teamService.getMyTeams(),
        teamService.getMyJoinRequests(),
      ]);
      setMyTeams(userTeams);
      setMyJoinRequests(userReqs);
    } catch (err) {
      console.error('Failed to load my teams data:', err);
    } finally {
      setIsLoadingMyTeams(false);
    }
  };

  useEffect(() => {
    fetchDiscoverTeams();
    dataService.getSkills().then(setAvailableSkills).catch(console.error);
  }, [searchQuery, selectedSkillFilter]);

  useEffect(() => {
    if (activeTab === 'my-teams') {
      fetchMyTeamsData();
    }
  }, [activeTab, user]);

  const handleOpenCreateModal = () => {
    setName('');
    setProjectTitle('');
    setDescription('');
    setMaxMembers(4);
    setRequiredSkills([]);
    setSelectedSkillId('');
    setCreateError(null);
    setIsCreateModalOpen(true);
  };

  const handleAddSkillToCreate = () => {
    if (!selectedSkillId) return;
    const sId = Number(selectedSkillId);
    if (requiredSkills.some((r) => r.skill_id === sId)) return;
    setRequiredSkills([...requiredSkills, { skill_id: sId, required_proficiency: selectedProficiency }]);
    setSelectedSkillId('');
  };

  const handleRemoveSkillFromCreate = (skillId: number) => {
    setRequiredSkills(requiredSkills.filter((r) => r.skill_id !== skillId));
  };

  const handleCreateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreateError(null);

    try {
      const newTeam = await teamService.createTeam({
        name,
        project_title: projectTitle,
        description,
        max_members: maxMembers,
        required_skills: requiredSkills,
      });

      setIsCreateModalOpen(false);
      navigate(`/teams/${newTeam.id}`);
    } catch (err: any) {
      setCreateError(err.response?.data?.detail || 'Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenQuickJoin = (team: Team) => {
    setQuickJoinTeam(team);
    setJoinMessage('');
    setJoinError(null);
    setJoinSuccess(false);
  };

  const handleQuickJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickJoinTeam) return;
    setIsSubmittingJoin(true);
    setJoinError(null);
    try {
      await teamService.submitJoinRequest(quickJoinTeam.id, { message: joinMessage });
      setJoinSuccess(true);
      setTimeout(() => {
        setQuickJoinTeam(null);
        fetchDiscoverTeams();
      }, 1500);
    } catch (err: any) {
      setJoinError(err.response?.data?.detail || 'Failed to submit join request');
    } finally {
      setIsSubmittingJoin(false);
    }
  };

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
    <div className="space-y-6">
      <PageHeader
        title="Teams & Hackathons"
        description="Form project teams, specify required technical skills, or apply to join active student teams"
        action={
          user ? (
            <Button variant="primary" onClick={handleOpenCreateModal} icon={<Plus className="w-4 h-4" />}>
              Create Team
            </Button>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('discover')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'discover'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Discover Teams
        </button>

        {user && (
          <button
            onClick={() => setActiveTab('my-teams')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'my-teams'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Teams & Requests
          </button>
        )}
      </div>

      {/* TAB 1: DISCOVER TEAMS */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          {/* Search & Filter controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search teams by name, project idea, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
            </div>

            <div className="w-full sm:w-64">
              <select
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="">All Required Skills</option>
                {availableSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category || 'General'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Teams Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center bg-rose-50 border border-rose-200 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-rose-800">{error}</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-100 rounded-2xl space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No open teams found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria or create your own project team to start recruiting teammates.
              </p>
              {user && (
                <Button variant="primary" size="sm" onClick={handleOpenCreateModal} icon={<Plus className="w-4 h-4" />}>
                  Create Team
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map((team) => {
                const isOwner = user && user.id === team.owner_id;
                const isMember = user && team.members.some((m) => m.user_id === user.id);

                return (
                  <Card key={team.id} hoverable className="flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="emerald">
                          {team.available_capacity > 0 ? `${team.available_capacity} Spots Open` : 'Full'}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          {team.current_member_count} / {team.max_members} Members
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {team.name}
                        </h3>
                        <p className="text-xs font-semibold text-indigo-600 mt-0.5">{team.project_title}</p>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                          {team.description || 'No project description provided.'}
                        </p>
                      </div>

                      {/* Required Skills Badges */}
                      {team.requirements.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <p className="text-[11px] font-semibold text-slate-500">Required Skills:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {team.requirements.map((req) => (
                              <Badge key={req.id} variant={proficiencyBadgeVariant(req.required_proficiency)}>
                                {req.skill.name} ({req.required_proficiency})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={team.owner.full_name} size="sm" />
                        <span className="text-xs text-slate-600 truncate max-w-[120px] sm:max-w-[150px]">
                          {team.owner.full_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/teams/${team.id}`)}
                          icon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          View
                        </Button>

                        {user && !isOwner && !isMember && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenQuickJoin(team)}
                            disabled={team.available_capacity <= 0}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY TEAMS & REQUESTS */}
      {activeTab === 'my-teams' && user && (
        <div className="space-y-8">
          {isLoadingMyTeams ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* My Teams Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FolderCheck className="w-5 h-5 text-indigo-600" />
                  Teams I Belong To ({myTeams.length})
                </h3>

                {myTeams.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl text-xs text-slate-500">
                    You haven't created or joined any teams yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myTeams.map((team) => {
                      const isOwner = team.owner_id === user.id;
                      return (
                        <Card key={team.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant={isOwner ? 'violet' : 'indigo'}>
                              {isOwner ? 'Team Owner' : 'Member'}
                            </Badge>
                            <Badge variant={team.status === 'open' ? 'emerald' : 'rose'}>
                              {team.status}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-slate-900">{team.name}</h4>
                            <p className="text-xs text-indigo-600 font-semibold">{team.project_title}</p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {team.current_member_count} / {team.max_members} Members
                            </p>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => navigate(`/teams/${team.id}`)}
                              icon={<ArrowRight className="w-3.5 h-3.5" />}
                            >
                              Manage Team
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* My Join Requests Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" />
                  My Submitted Join Requests ({myJoinRequests.length})
                </h3>

                {myJoinRequests.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl text-xs text-slate-500">
                    You haven't submitted any join requests yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myJoinRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {req.team ? req.team.name : `Team #${req.team_id}`}
                            </span>
                            <Badge
                              variant={
                                req.status === 'accepted' ? 'emerald' : req.status === 'rejected' ? 'rose' : 'amber'
                              }
                            >
                              {req.status}
                            </Badge>
                          </div>
                          {req.team && (
                            <p className="text-xs text-indigo-600 font-medium">{req.team.project_title}</p>
                          )}
                          {req.message && (
                            <p className="text-xs text-slate-600 mt-1 italic">"{req.message}"</p>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/teams/${req.team_id}`)}
                        >
                          View Team
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project Team">
        <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
          {createError && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200">
              {createError}
            </div>
          )}

          <Input
            label="Team Name"
            placeholder="e.g. AI Health Hackathon Squad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Project Title / Idea"
            placeholder="e.g. Real-Time Medical Triage Assistant"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Description</label>
            <textarea
              rows={3}
              placeholder="Describe your project goals, technology stack, and hackathon objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <Input
            label="Maximum Team Capacity (including owner)"
            type="number"
            min={2}
            max={50}
            value={maxMembers}
            onChange={(e) => setMaxMembers(Number(e.target.value))}
            required
          />

          {/* Skill requirements section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">Specify Required Technical Skills</label>
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

              <Button type="button" size="sm" variant="secondary" onClick={handleAddSkillToCreate} icon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {requiredSkills.map((req) => {
                const s = availableSkills.find((sk) => sk.id === req.skill_id);
                return (
                  <span
                    key={req.skill_id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200/60"
                  >
                    {s ? s.name : `Skill #${req.skill_id}`} ({req.required_proficiency})
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillFromCreate(req.skill_id)}
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
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Create Team
            </Button>
          </div>
        </form>
      </Modal>

      {/* QUICK JOIN MODAL */}
      <Modal isOpen={!!quickJoinTeam} onClose={() => setQuickJoinTeam(null)} title="Apply to Join Team">
        {quickJoinTeam && (
          <form onSubmit={handleQuickJoinSubmit} className="space-y-4">
            <p className="text-xs text-slate-600">
              Applying to join <strong className="text-slate-900">{quickJoinTeam.name}</strong>. Add an application note for team leader {quickJoinTeam.owner.full_name}.
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
                rows={3}
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="e.g. Hi! I have experience with React & Python and would love to contribute to your team."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setQuickJoinTeam(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={isSubmittingJoin}>
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
