import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { dataService } from '../services/dataService';
import type { User } from '../types';
import {
  Sparkles,
  Users,
  Compass,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    dataService
      .getUsers(0, 5)
      .then((users) => {
        setSuggestedUsers(users.filter((u) => u.id !== user?.id));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingUsers(false));
  }, [user?.id]);

  const calculateCompletion = () => {
    if (!user) return 0;
    let score = 25;
    if (user.profile?.bio) score += 15;
    if (user.profile?.college_id || user.profile?.college) score += 15;
    if (user.profile?.degree || user.profile?.branch) score += 15;
    if (user.skills && user.skills.length > 0) score += 15;
    if (user.interests && user.interests.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const completionScore = calculateCompletion();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            Student Innovation Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name}! 👋
          </h1>
          <p className="text-sm text-indigo-100/90 leading-relaxed">
            Your collaboration dashboard is active. Connect with talented peers, discover upcoming hackathons, and form your next project team.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/profile">
              <Button size="sm" variant="secondary">
                Complete Profile ({completionScore}%)
              </Button>
            </Link>
            <Link to="/discover">
              <Button size="sm" variant="outline" className="text-white border-white/40 hover:bg-white/10">
                Explore Students
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Completion Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Profile Completion</h3>
                <p className="text-xs text-slate-500">Add your skills and degree to get discovered by team leads</p>
              </div>
              <span className="text-lg font-black text-indigo-600">{completionScore}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Basic Info', done: true },
                { label: 'College & Degree', done: !!user?.profile?.college || !!user?.profile?.degree },
                { label: 'Bio & Links', done: !!user?.profile?.bio },
                { label: 'Skills Added', done: (user?.skills?.length || 0) > 0 },
                { label: 'Interests', done: (user?.interests?.length || 0) > 0 },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    step.done
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${step.done ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className="font-medium truncate">{step.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/teams">
                <Card hoverable className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Find or Form a Team</h4>
                    <p className="text-xs text-slate-500">Post required roles or join existing teams</p>
                  </div>
                </Card>
              </Link>

              <Link to="/discover">
                <Card hoverable className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Discover Peers</h4>
                    <p className="text-xs text-slate-500">Filter students by skills and college</p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Suggested Teammates Placeholder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Suggested Teammates</h3>
              <Link to="/discover" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingUsers ? (
              <p className="text-xs text-slate-400">Loading recommendations...</p>
            ) : suggestedUsers.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-xs text-slate-500">No other students registered yet. You are the pioneer!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedUsers.map((su) => (
                  <Card key={su.id} hoverable className="space-y-3 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={su.full_name} src={su.profile?.profile_image} size="md" />
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{su.full_name}</h4>
                        <p className="text-xs text-slate-500 truncate">
                          {su.profile?.college?.name || su.profile?.degree || 'Student Collaborator'}
                        </p>
                      </div>
                    </div>
                    {su.skills && su.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {su.skills.slice(0, 3).map((us) => (
                          <Badge key={us.id} variant="indigo" size="sm">
                            {us.skill.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column Sidebar Widget */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Featured Opportunities
              </h3>
              <Badge variant="emerald">Live</Badge>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Global Student Hackathon 2026', type: 'Hackathon', date: 'In 3 Days', team: 'Teams of 4' },
                { title: 'Open-Source Summer Sprint', type: 'Bounty Program', date: 'Applications Open', team: 'Individual / Pair' },
                { title: 'Campus Founders Pitch Fest', type: 'Competition', date: 'Starts Nov 15', team: 'Teams of 2-5' },
              ].map((opp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{opp.type}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{opp.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-indigo-600">{opp.title}</h4>
                  <p className="text-[11px] text-slate-500">{opp.team}</p>
                </div>
              ))}
            </div>

            <Link to="/opportunities" className="block text-center pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Explore All Opportunities
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
