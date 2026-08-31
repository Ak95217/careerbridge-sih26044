import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { StudentProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge, ProficiencyBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  GraduationCap, 
  Search, 
  Award, 
  CheckCircle2, 
  Briefcase, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const AdminStudentsView: React.FC = () => {
  const students = useMemo(() => StorageService.getStudents(), []);
  const applications = useMemo(() => StorageService.getApplications(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchQuery = 
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.collegeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBranch = selectedBranch === 'all' || s.branch === selectedBranch;
      return matchQuery && matchBranch;
    });
  }, [students, searchQuery, selectedBranch]);

  const branches = useMemo(() => {
    const set = new Set<string>();
    students.forEach(s => { if (s.branch) set.add(s.branch); });
    return Array.from(set);
  }, [students]);

  return (
    <div id="admin-students-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">National Student Talent Pool</h2>
              <Badge variant="primary">{students.length} Verified Candidates</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic skill profiles, assessment verification transcripts, CGPA records, and career placement readiness.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">Active Placement Batch 2026</Badge>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedBranch('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedBranch === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Departments ({students.length})
          </button>
          {branches.map(branch => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedBranch === branch
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {branch.length > 25 ? `${branch.substring(0, 22)}...` : branch}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, college, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Student Pool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((st) => {
          const studentApps = applications.filter(a => a.studentId === st.id);
          const verifiedSkills = (st.skills || []).filter(s => s.verified);

          return (
            <Card key={st.id} className="hover:border-indigo-300 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={st.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{st.fullName}</h3>
                    <p className="text-xs text-slate-600 line-clamp-1">{st.collegeName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{st.branch} • Batch {st.graduationYear}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">CGPA</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{st.cgpa} / 10</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Verified</span>
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">{verifiedSkills.length} Skills</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Profile</span>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{st.profileCompletion || 0}%</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">Top Skills Transcript</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(st.skills || []).slice(0, 4).map((sk) => (
                      <span
                        key={sk.id}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md"
                      >
                        {sk.name}
                        {sk.verified && (
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        )}
                      </span>
                    ))}
                    {(st.skills || []).length > 4 && (
                      <span className="text-[10px] text-slate-400 font-semibold self-center">
                        +{(st.skills || []).length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                  <span>Target: <strong className="text-slate-800">{st.targetRole || 'Full Stack Engineer'}</strong></span>
                  <span className="text-indigo-600 font-semibold">{studentApps.length} Active Apps</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
