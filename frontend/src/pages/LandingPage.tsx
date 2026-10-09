import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import {
  Users,
  Compass,
  Briefcase,
  Rocket,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center space-y-8 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          The Student Innovation & Network Operating System
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Where Students Meet, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700">Collaborate & Build.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          A student networking platform to discover talented peers, build hackathon teams, find opportunities, and turn ideas into impactful projects.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/register">
            <Button size="lg" icon={<Users className="w-5 h-5" />}>
              Find Teammates
            </Button>
          </Link>
          <Link to="/discover">
            <Button variant="outline" size="lg" icon={<Compass className="w-5 h-5" />}>
              Explore Students
            </Button>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 text-left">
          {[
            { label: 'Student Founders & Engineers', value: '1,200+' },
            { label: 'Hackathon Teams Formed', value: '350+' },
            { label: 'Projects Completed', value: '850+' },
            { label: 'Colleges & Universities', value: '120+' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
              <p className="text-2xl font-black text-indigo-600">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Platform Pillars Section */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <Badge variant="violet" size="md">Platform Features</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900">Designed For Modern Student Builders</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">
            Everything you need to showcase your talent, find high-caliber partners, and jumpstart your technical journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hoverable className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Discover Students</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find peers by skillsets, branches, universities, and specific hackathon/project goals with rich profiles.
            </p>
          </Card>

          <Card hoverable className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Build Teams</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create teams, define exact required roles (Frontend, Backend, AI/ML, UI/UX), and manage join requests.
            </p>
          </Card>

          <Card hoverable className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Find Opportunities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access curated hackathons, open source bounties, student startups, and campus research positions.
            </p>
          </Card>

          <Card hoverable className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Grow Your Network</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with student developers, designers, and organizers across universities globally.
            </p>
          </Card>
        </div>
      </section>

      {/* Modern Workflow Preview */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
        <div className="max-w-2xl space-y-3">
          <Badge variant="indigo" size="md">How It Works</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white">From Idea to Team to Project Launch</h2>
          <p className="text-indigo-200 text-sm">
            Stop asking on random messaging groups. Build your verified profile and get matched with serious collaborators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm">1</div>
            <h4 className="font-bold text-base text-white">Create Your Profile</h4>
            <p className="text-xs text-indigo-200">List your skills (React, Python, Figma), degree, branch, GitHub, and project interests.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-full bg-violet-500 text-white font-bold flex items-center justify-center text-sm">2</div>
            <h4 className="font-bold text-base text-white">Post or Join Teams</h4>
            <p className="text-xs text-indigo-200">Specify needed roles like "Full-Stack Dev needed for AI Hackathon" and get applications.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">3</div>
            <h4 className="font-bold text-base text-white">Build & Showcase</h4>
            <p className="text-xs text-indigo-200">Collaborate, submit projects, build your portfolio, and gain recognition.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
