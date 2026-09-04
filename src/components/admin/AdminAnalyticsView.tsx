import React, { useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Award, 
  ShieldCheck, 
  Target, 
  CheckCircle2, 
  PieChart as PieChartIcon, 
  ArrowUpRight,
  Layers,
  Sparkles,
  Sliders,
  Filter
} from 'lucide-react';

interface AdminAnalyticsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ onNavigateTab }) => {
  const analytics = useMemo(() => StorageService.getAdminPlatformAnalytics(), []);

  const totalOpportunities = analytics.totalOpportunities;
  const statusValues = Object.values(analytics.statusCounts) as number[];
  const domainValues = Object.values(analytics.domainCounts) as number[];
  const maxStatusCount = Math.max(...(statusValues.length > 0 ? statusValues : [1]), 1);
  const maxDomainCount = Math.max(...(domainValues.length > 0 ? domainValues : [1]), 1);

  return (
    <div id="admin-analytics-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">National Platform Intelligence & Analytics</h2>
              <Badge variant="primary">AICTE/Govt Portal</Badge>
              <Badge variant="success">Live Database</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cross-institutional skill supply, industry demand benchmarks, recruitment funnels, and demographic metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Sliders className="w-4 h-4" />}
                onClick={() => onNavigateTab('settings')}
              >
                Security Audit
              </Button>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Award className="w-4 h-4" />}
                onClick={() => onNavigateTab('skills')}
              >
                Skill Taxonomy
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Primary KPI Grid (8 Key Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Students</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{analytics.totalStudents}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Enrolled</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Companies</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{analytics.totalCompanies}</p>
          <span className="text-[10px] text-purple-600 font-semibold">Verified Partners</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Colleges</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{analytics.totalInstitutions}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Affiliated</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Mentors</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{analytics.totalMentors}</p>
          <span className="text-[10px] text-amber-600 font-semibold">Industry Experts</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Open Roles</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{analytics.totalOpportunities}</p>
          <span className="text-[10px] text-indigo-600 font-semibold">{analytics.internshipCount} Intern / {analytics.jobCount} Job</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Applications</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{analytics.totalApplications}</p>
          <span className="text-[10px] text-slate-600 font-semibold">In Pipeline</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Placements</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{analytics.placementCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Offers Confirmed</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Avg Fit Score</span>
          <p className="text-xl font-bold text-indigo-600 mt-1">{analytics.avgSkillMatch}%</p>
          <span className="text-[10px] text-indigo-700 font-semibold">Deterministic</span>
        </div>
      </div>

      {/* Analytics Section 1: Recruitment Funnel & Domain Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* National Application Funnel */}
        <div className="lg:col-span-6">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Application Pipeline Funnel</h3>
                </div>
                <Badge variant="neutral">{analytics.totalApplications} Total Submissions</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5">
              {Object.entries(analytics.statusCounts).map(([status, rawCount]) => {
                const count = Number(rawCount);
                const percentage = Math.round((count / Math.max(analytics.totalApplications, 1)) * 100);
                const widthPercent = Math.max(12, Math.round((count / maxStatusCount) * 100));
                
                let colorBg = 'bg-slate-600';
                let tagVariant: 'primary' | 'success' | 'warning' | 'purple' | 'neutral' = 'neutral';
                if (status === 'Applied') { colorBg = 'bg-slate-400'; tagVariant = 'neutral'; }
                else if (status === 'Under Review') { colorBg = 'bg-blue-500'; tagVariant = 'primary'; }
                else if (status === 'Shortlisted') { colorBg = 'bg-purple-500'; tagVariant = 'purple'; }
                else if (status === 'Interview') { colorBg = 'bg-amber-500'; tagVariant = 'warning'; }
                else if (status === 'Selected') { colorBg = 'bg-emerald-500'; tagVariant = 'success'; }

                return (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{status}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{count} candidates</span>
                        <span className="text-slate-400">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${colorBg} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Opportunity Distribution by Technical Domain */}
        <div className="lg:col-span-6">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Opportunities by Technical Domain</h3>
                </div>
                <Badge variant="purple">{totalOpportunities} Active Listings</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5">
              {Object.entries(analytics.domainCounts).map(([domain, rawCount]) => {
                const count = Number(rawCount);
                const percentage = totalOpportunities > 0 ? Math.round((count / totalOpportunities) * 100) : 0;
                const widthPercent = Math.max(10, Math.round((count / maxDomainCount) * 100));

                return (
                  <div key={domain} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{domain}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{count} openings</span>
                        <span className="text-slate-400">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Section 2: Most Demanded Skills vs Critical Student Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Demanded Industry Skills */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Highest Demanded Recruiter Skills</h3>
                </div>
                <Badge variant="success">Employer Demand</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {analytics.mostDemandedSkills.map((sk, idx) => (
                <div 
                  key={sk.name}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{sk.name}</h4>
                      <span className="text-[10px] text-slate-500">{sk.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {sk.count} Required in Postings
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Most Common Student Skill Gaps */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">National Student Skill Deficits</h3>
                </div>
                <Badge variant="warning">Curriculum Gaps</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {analytics.mostCommonSkillGaps.map((sk, idx) => (
                <div 
                  key={sk.skillName}
                  className="flex items-center justify-between p-3 rounded-xl border border-amber-200/60 bg-amber-50/20 hover:bg-amber-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-amber-200 text-xs font-bold text-amber-700 flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{sk.skillName}</h4>
                      <span className="text-[10px] text-slate-500">{sk.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                      Deficit Index: {sk.deficitScore}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Supply: {sk.studentSupply} / Demand: {sk.demandScore}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Section 3: Institutional Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Academic Department Enrollment Statistics</h3>
              <p className="text-xs text-slate-500">Student enrollment distribution across technical engineering faculties</p>
            </div>
            <Badge variant="neutral">Verified Batch 2026</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(analytics.departmentStats).map(([dept, rawCount]) => {
              const count = Number(rawCount);
              return (
                <div key={dept} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{dept}</h4>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-2xl font-bold text-slate-900">{count}</span>
                    <span className="text-xs text-slate-500">Students Enrolled</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${Math.round((count / Math.max(analytics.totalStudents, 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
