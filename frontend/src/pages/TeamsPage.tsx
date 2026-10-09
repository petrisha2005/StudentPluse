import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Plus } from 'lucide-react';

export const TeamsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams & Hackathons"
        description="Form project teams, post required skills, or apply to join existing student teams"
        action={
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Create Team
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="emerald">Recruiting 2 Roles</Badge>
            <span className="text-xs text-slate-400">Created 2 hours ago</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">AI Health Hackathon Project</h3>
            <p className="text-xs text-slate-600 mt-1">
              Building a real-time medical diagnosis assistant using LLMs and FastAPIs for the upcoming Global Tech Challenge.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700">Open Roles Needed:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="indigo">Full-Stack Dev (React)</Badge>
              <Badge variant="violet">UI/UX Designer (Figma)</Badge>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary">
              Request to Join
            </Button>
          </div>
        </Card>

        <Card hoverable className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="emerald">Recruiting 1 Role</Badge>
            <span className="text-xs text-slate-400">Created Yesterday</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">Web3 Campus Decentralized Voting</h3>
            <p className="text-xs text-slate-600 mt-1">
              Developing a transparent blockchain-backed student council voting application for campus elections.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700">Open Roles Needed:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="amber">Smart Contract Dev (Solidity)</Badge>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary">
              Request to Join
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
