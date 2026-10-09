import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { dataService } from '../services/dataService';
import type { User } from '../types';
import { Search, GraduationCap } from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService
      .getUsers(0, 20)
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const nameMatch = u.full_name.toLowerCase().includes(q);
    const collegeMatch = u.profile?.college?.name?.toLowerCase().includes(q);
    const skillMatch = u.skills?.some((s) => s.skill.name.toLowerCase().includes(q));
    return nameMatch || collegeMatch || skillMatch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Students"
        description="Find talented peers by skills, university, and collaboration interests"
      />

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by student name, college, or skill (e.g. React, Python)..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading student profiles...</div>
      ) : filteredUsers.length === 0 ? (
        <Card className="text-center py-12 space-y-2">
          <p className="text-sm font-bold text-slate-700">No student peers found matching "{search}"</p>
          <p className="text-xs text-slate-500">Try searching for a different skill or name.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <Card key={u.id} hoverable className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar name={u.full_name} src={u.profile?.profile_image} size="lg" />
                  <div className="overflow-hidden">
                    <h3 className="text-base font-bold text-slate-900 truncate">{u.full_name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                      {u.profile?.college?.name || 'University Student'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {u.profile?.bio || 'Passionate student collaborator looking for projects & hackathon teams.'}
                </p>

                {u.skills && u.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {u.skills.map((us) => (
                      <Badge key={us.id} variant="indigo" size="sm">
                        {us.skill.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {u.profile?.degree || 'Student'}
                </span>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
