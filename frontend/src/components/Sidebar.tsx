import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Compass,
  Users,
  Briefcase,
  Network,
  MessageSquare,
  Bell,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Discover', path: '/discover', icon: Compass },
  { name: 'Teams', path: '/teams', icon: Users },
  { name: 'Opportunities', path: '/opportunities', icon: Briefcase },
  { name: 'Network', path: '/network', icon: Network },
  { name: 'Messages', path: '/messages', icon: MessageSquare },
  { name: 'Notifications', path: '/notifications', icon: Bell },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 hidden md:flex flex-col justify-between">
      <div className="space-y-1">
        <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Main Navigation
        </p>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              <Icon className="w-4 h-4 text-current" />
              {item.name}
            </NavLink>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100/60">
          <p className="text-xs font-bold text-indigo-900">Phase 1 Architecture</p>
          <p className="text-xs text-indigo-700/80 mt-1 leading-relaxed">
            Scalable foundation for Profiles, Discovery, Teams & Opportunities.
          </p>
        </div>
      </div>
    </aside>
  );
};
