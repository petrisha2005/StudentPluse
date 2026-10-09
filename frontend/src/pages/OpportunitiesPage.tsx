import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Opportunities"
        description="Discover student hackathons, open source grants, research roles, and startup internships"
      />

      <div className="space-y-4">
        {[
          {
            title: 'Global AI & Innovation Student Hackathon 2026',
            category: 'Hackathon',
            location: 'Virtual / Remote',
            prize: '$10,000 Prize Pool',
            deadline: 'Oct 30, 2026',
          },
          {
            title: 'Open Source Summer Student Fellowship',
            category: 'Grants & Fellowship',
            location: 'Remote',
            prize: '$3,000 Stipend',
            deadline: 'Nov 15, 2026',
          },
          {
            title: 'Campus Founder Incubator Program',
            category: 'Startup Acceleration',
            location: 'San Francisco, CA',
            prize: '$25,000 Pre-seed Funding',
            deadline: 'Dec 01, 2026',
          },
        ].map((opp, idx) => (
          <Card key={idx} hoverable className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="indigo">{opp.category}</Badge>
                <span className="text-xs text-emerald-600 font-semibold">{opp.prize}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{opp.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {opp.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Deadline: {opp.deadline}
                </span>
              </div>
            </div>

            <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
              Apply Now
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
