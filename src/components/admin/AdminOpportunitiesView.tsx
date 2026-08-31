import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { Opportunity } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Users, 
  Calendar, 
  Building2, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export const AdminOpportunitiesView: React.FC = () => {
  const opportunities = useMemo(() => StorageService.getOpportunities(), []);
  const applications = useMemo(() => StorageService.getApplications(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Internship' | 'Job'>('all');

  const filtered = useMemo(() => {
    return opportunities.filter(o => {
      const matchSearch = 
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === 'all' || o.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [opportunities, searchQuery, typeFilter]);

  return (
    <div id="admin-opportunities-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">National Opportunity Listings Oversight</h2>
              <Badge variant="primary">{opportunities.length} Total Postings</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Internship and full-time graduate openings posted by verified enterprise recruiters across India.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">Active Recruiter Pipeline</Badge>
        </div>
      </div>

      {/* Type Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              typeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Postings ({opportunities.length})
          </button>
          <button
            onClick={() => setTypeFilter('Internship')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              typeFilter === 'Internship'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Internships ({opportunities.filter(o => o.type === 'Internship').length})
          </button>
          <button
            onClick={() => setTypeFilter('Job')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              typeFilter === 'Job'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Full-Time Jobs ({opportunities.filter(o => o.type === 'Job').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search posting, role, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((opp) => {
          const oppApps = applications.filter(a => a.opportunityId === opp.id);

          return (
            <Card key={opp.id} className="hover:border-indigo-300 transition-all">
              <CardContent className="p-5 space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 shrink-0">
                      {opp.companyName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                      <p className="text-xs text-slate-600">{opp.companyName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {opp.location} ({opp.workMode})
                        </span>
                        <span>• {opp.stipendOrSalary}</span>
                      </p>
                    </div>
                  </div>
                  <Badge variant={opp.type === 'Internship' ? 'primary' : 'purple'}>
                    {opp.type}
                  </Badge>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Mandatory Prerequisites</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(opp.requiredSkills || []).map((req) => (
                      <span
                        key={req.skillName}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                          req.mandatory ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.skillName} ({req.proficiency})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{oppApps.length || opp.applicantCount || 0}</strong> Applicants
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Deadline: {opp.applicationDeadline}
                  </span>
                  <Badge variant={opp.status === 'Open' ? 'success' : 'neutral'}>
                    {opp.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
