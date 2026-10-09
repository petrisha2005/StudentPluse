import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { dataService } from '../services/dataService';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import type { Skill, Interest, College } from '../types';
import {
  GraduationCap,
  MapPin,
  Globe,
  Edit3,
  Check,
  Plus,
  X,
  BookOpen,
  Code2,
  Share2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [, setAvailableColleges] = useState<College[]>([]);

  // Form Fields
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [collegeName, setCollegeName] = useState(user?.profile?.college?.name || '');
  const [degree, setDegree] = useState(user?.profile?.degree || '');
  const [branch, setBranch] = useState(user?.profile?.branch || '');
  const [year, setYear] = useState(user?.profile?.year || '');
  const [city, setCity] = useState(user?.profile?.city || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [githubUrl, setGithubUrl] = useState(user?.profile?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.profile?.linkedin_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.profile?.portfolio_url || '');

  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>(
    user?.skills?.map((s) => s.skill_id) || []
  );
  const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>(
    user?.interests?.map((i) => i.interest_id) || []
  );

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setCollegeName(user.profile?.college?.name || '');
      setDegree(user.profile?.degree || '');
      setBranch(user.profile?.branch || '');
      setYear(user.profile?.year || '');
      setCity(user.profile?.city || '');
      setBio(user.profile?.bio || '');
      setGithubUrl(user.profile?.github_url || '');
      setLinkedinUrl(user.profile?.linkedin_url || '');
      setPortfolioUrl(user.profile?.portfolio_url || '');
      setSelectedSkillIds(user.skills?.map((s) => s.skill_id) || []);
      setSelectedInterestIds(user.interests?.map((i) => i.interest_id) || []);
    }
  }, [user]);

  useEffect(() => {
    dataService.getSkills().then(setAvailableSkills).catch(console.error);
    dataService.getInterests().then(setAvailableInterests).catch(console.error);
    dataService.getColleges().then(setAvailableColleges).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await profileService.updateMyProfile({
        full_name: fullName,
        college_name: collegeName,
        degree,
        branch,
        year,
        city,
        bio,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
        skill_ids: selectedSkillIds,
        interest_ids: selectedInterestIds,
      });
      await refreshUser();
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillId: number) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const toggleInterest = (interestId: number) => {
    setSelectedInterestIds((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Profile"
        description="Manage your professional student identity, skills, and portfolio"
        action={
          !isEditing ? (
            <Button variant="primary" icon={<Edit3 className="w-4 h-4" />} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )
        }
      />

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Info Card */}
        <Card className="space-y-6 text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <Avatar name={fullName || 'Student'} src={user?.profile?.profile_image} size="xl" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
              <Badge variant="indigo" size="sm" className="mt-2 capitalize">
                {user?.role || 'student'}
              </Badge>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{collegeName || 'College not specified'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                {degree || 'Degree'} {branch ? `• ${branch}` : ''} {year ? `(${year})` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{city || 'Location not specified'}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social & Portfolio Links</p>
            <div className="flex flex-wrap gap-2 pt-1 justify-center lg:justify-start">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
              {portfolioUrl && (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* Right Details / Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <Card className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Edit Profile Details</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  <Input
                    label="College / University"
                    placeholder="e.g. Stanford University"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Degree" placeholder="B.S. Computer Science" value={degree} onChange={(e) => setDegree(e.target.value)} />
                  <Input label="Branch / Major" placeholder="Software Engineering" value={branch} onChange={(e) => setBranch(e.target.value)} />
                  <Input label="Graduation Year" placeholder="3rd Year / 2026" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="City / Location" placeholder="San Francisco, CA" value={city} onChange={(e) => setCity(e.target.value)} />
                  <Input label="GitHub URL" placeholder="https://github.com/username" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/username" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                  <Input label="Portfolio Website" placeholder="https://yourportfolio.com" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / About You</label>
                  <textarea
                    rows={3}
                    className="w-full text-slate-900 bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Passionate full-stack student developer building web apps and interested in AI hackathons..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                {/* Skill Selection */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-700">Select Technical Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((sk) => {
                      const isSelected = selectedSkillIds.includes(sk.id);
                      return (
                        <button
                          type="button"
                          key={sk.id}
                          onClick={() => toggleSkill(sk.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {sk.name}
                          {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interest Selection */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-700">Select Interests & Goals</label>
                  <div className="flex flex-wrap gap-2">
                    {availableInterests.map((it) => {
                      const isSelected = selectedInterestIds.includes(it.id);
                      return (
                        <button
                          type="button"
                          key={it.id}
                          onClick={() => toggleInterest(it.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-violet-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {it.name}
                          {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={loading} icon={<Check className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <>
              {/* Bio Card */}
              <Card className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About Me</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {user?.profile?.bio || 'No bio added yet. Click Edit Profile to add a summary of your experience!'}
                </p>
              </Card>

              {/* Skills Card */}
              <Card className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Skills</h3>
                {user?.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((us) => (
                      <Badge key={us.id} variant="indigo" size="md">
                        {us.skill.name} • <span className="capitalize opacity-75">{us.proficiency}</span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No skills added yet.</p>
                )}
              </Card>

              {/* Interests Card */}
              <Card className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Interests & Collaboration Goals</h3>
                {user?.interests && user.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((ui) => (
                      <Badge key={ui.id} variant="violet" size="md">
                        {ui.interest.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No interests added yet.</p>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
