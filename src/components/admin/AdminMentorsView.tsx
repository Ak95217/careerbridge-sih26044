import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { MentorProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Users, 
  Search, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  Star, 
  Target, 
  Calendar,
  Layers
} from 'lucide-react';

export const AdminMentorsView: React.FC = () => {
  const mentors = useMemo(() => StorageService.getMentors(), []);
  const goals = useMemo(() => StorageService.getMentorGoals(), []);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMentors = useMemo(() => {
    return mentors.filter(m => 
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mentors, searchQuery]);

  return (
    <div id="admin-mentors-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">National Industry Mentorship Network</h2>
              <Badge variant="primary">{mentors.length} Verified Senior Mentors</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Senior engineering leaders guiding students on deterministic skill roadmaps, system architecture, and placement interviews.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">All Mentors Active</Badge>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mentor, company, or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMentors.map((m) => {
          const mentorGoals = goals.filter(g => g.mentorId === m.id);
          const completedGoals = mentorGoals.filter(g => g.status === 'Completed').length;

          return (
            <Card key={m.id} className="hover:border-indigo-300 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={m.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                    alt={m.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{m.fullName}</h3>
                    <p className="text-xs text-slate-600">{m.designation}</p>
                    <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">{m.companyName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Experience</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{m.yearsOfExperience}+ Yrs</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Mentees</span>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{m.currentMenteesCount || 4} / {m.maxMentees || 6}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Goals Done</span>
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">{completedGoals}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">Expertise Domains</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(m.expertiseAreas || []).map((exp) => (
                      <span
                        key={exp}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    {m.availability || 'Available'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Rating: <strong>4.9/5.0 ★</strong>
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
