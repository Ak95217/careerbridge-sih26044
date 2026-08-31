import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { Opportunity, Application, FacultyProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input } from '../common/Input';
import { 
  Building2, 
  Briefcase, 
  MapPin, 
  Users, 
  Send, 
  Award, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface FacultyIndustryCollabViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const FacultyIndustryCollabView: React.FC<FacultyIndustryCollabViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const faculty = user as FacultyProfile;

  const [opportunities] = useState<Opportunity[]>(() => StorageService.getOpportunities());
  const [applications] = useState<Application[]>(() => StorageService.getApplications());
  const [students] = useState(() => StorageService.getStudents());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOpportunities = opportunities.filter(opp => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return opp.title.toLowerCase().includes(q) || opp.companyName.toLowerCase().includes(q) || opp.requiredSkills.some(s => s.skillName.toLowerCase().includes(q));
  });

  const handleBroadcastOpportunity = (opp: Opportunity) => {
    // Find eligible matching students
    const matchingStudents = students.filter(st => {
      const matchCount = opp.requiredSkills.filter(req => 
        st.skills.some(s => s.name.toLowerCase() === req.skillName.toLowerCase())
      ).length;
      return matchCount >= Math.ceil(opp.requiredSkills.length * 0.5);
    });

    matchingStudents.forEach(st => {
      StorageService.addNotification({
        id: `notif-opp-rec-${Date.now()}-${st.id}`,
        userId: st.id,
        title: `Faculty Placement Alert: ${opp.title} 📢`,
        message: `${faculty?.fullName || 'College Placement Cell'} recommends applying for ${opp.title} at ${opp.companyName} (${opp.stipendOrSalary}). Your verified skills match key requirements.`,
        type: 'recommendation',
        read: false,
        createdAt: new Date().toISOString()
      });
    });

    addToast('success', 'Placement Broadcast Sent! 🚀', `Opportunity broadcasted to ${matchingStudents.length} matching students in your department.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Industry Recruiter Collaboration & Drives</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Active corporate partner drives, skill demand alignment, and student application pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateTab('placements')}
              leftIcon={<Award className="w-4 h-4 text-indigo-600" />}
            >
              Placement Records
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search partner companies, job openings, or required skills..."
          className="pl-9"
        />
      </div>

      {/* Opportunities & Recruiter List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpportunities.map(opp => {
          const oppApps = applications.filter(a => a.opportunityId === opp.id);
          const shortlists = oppApps.filter(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled' || a.status === 'Offered').length;

          return (
            <Card key={opp.id} className="hover:border-indigo-200 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
                        {opp.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                        <p className="text-xs text-slate-600 font-medium">{opp.companyName}</p>
                      </div>
                    </div>

                    <Badge variant={opp.type === 'Internship' ? 'primary' : 'success'} className="text-[10px] shrink-0">
                      {opp.type}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 line-clamp-2">{opp.description}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location} ({opp.workMode})
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">{opp.stipendOrSalary}</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Recruiter Mandatory Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.requiredSkills.map(req => (
                      <span
                        key={req.skillName}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium"
                      >
                        {req.skillName} ({req.minProficiency})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span><b>{oppApps.length}</b> Applications • <b className="text-emerald-600">{shortlists}</b> In Pipeline</span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 px-2.5"
                    onClick={() => handleBroadcastOpportunity(opp)}
                    leftIcon={<Send className="w-3.5 h-3.5 text-indigo-600" />}
                  >
                    Broadcast to Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
