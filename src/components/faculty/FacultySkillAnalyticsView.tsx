import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { FacultyProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Select } from '../common/Input';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  CheckSquare, 
  ArrowUpRight, 
  Sparkles, 
  GraduationCap,
  Layers,
  Building2
} from 'lucide-react';

interface FacultySkillAnalyticsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const FacultySkillAnalyticsView: React.FC<FacultySkillAnalyticsViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const faculty = user as FacultyProfile;

  const [categoryFilter, setCategoryFilter] = useState('All');

  // Compute live analytics from storage
  const analytics = useMemo(() => {
    return StorageService.getInstitutionalSkillAnalytics(faculty?.institutionName);
  }, [faculty?.institutionName]);

  const filteredList = useMemo(() => {
    if (categoryFilter === 'All') return analytics.comparativeList;
    return analytics.comparativeList.filter(item => item.category === categoryFilter);
  }, [analytics.comparativeList, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Academic Skill Supply vs Industry Demand Matrix</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic institutional benchmarking comparing active recruiter skill requirements against department student proficiencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigateTab('training')}
                leftIcon={<BookOpen className="w-4 h-4 text-indigo-600" />}
              >
                Create Upskilling Bootcamp
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onNavigateTab('assessments')}
                leftIcon={<CheckSquare className="w-4 h-4" />}
              >
                Publish Skill Test
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Critical Skill Gap Highlights */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            High Priority Campus Skill Gaps (Action Required)
          </h3>
          <span className="text-xs text-slate-500">{analytics.topGaps.length} Critical Deficits Detected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.topGaps.slice(0, 3).map(gap => (
            <Card key={gap.skillId} className="border-amber-200/70 bg-amber-50/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                      {gap.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{gap.skillName}</h4>
                  </div>
                  <Badge variant="warning" className="shrink-0 text-[10px]">
                    Deficit: -{gap.gapDeficit}%
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Industry Demand Weight:</span>
                    <b className="text-indigo-600">{gap.demandScore}/100</b>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${gap.demandScore}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Current Student Supply:</span>
                    <b className="text-amber-700">{gap.studentPercentage}% ({gap.studentCount} Students)</b>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${gap.studentPercentage}%` }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-100/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{gap.verifiedCount} verified with test</span>
                  {onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab('training')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                    >
                      Plan Bootcamp <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Filter & Full Comparative Table */}
      <Card>
        <CardHeader
          title="Institutional Skill Supply & Proficiency Roster"
          subtitle="Detailed audit of student proficiencies, verified counts, and recruiter demand alignment"
          action={
            <div className="w-48">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Domains' },
                  { value: 'Database', label: 'Database & Storage' },
                  { value: 'DevOps', label: 'DevOps & Containers' },
                  { value: 'Backend', label: 'Backend Architecture' },
                  { value: 'Frontend', label: 'Frontend Development' },
                  { value: 'Cloud', label: 'Cloud Infrastructure' },
                  { value: 'AI/ML', label: 'AI & Data Science' },
                  { value: 'Technical', label: 'Core Technical & DSA' }
                ]}
              />
            </div>
          }
        />
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-y border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Skill & Category</th>
                <th className="py-3 px-3 text-center">Recruiter Demand</th>
                <th className="py-3 px-3 text-center">Student Supply (%)</th>
                <th className="py-3 px-3 text-center">Verified Count</th>
                <th className="py-3 px-4">Proficiency Breakdown (Beg / Int / Adv / Exp)</th>
                <th className="py-3 px-3 text-center">Gap Status</th>
                <th className="py-3 px-4 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.map(item => (
                <tr key={item.skillId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{item.skillName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.category}</p>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="font-bold text-indigo-600">{item.demandScore}</span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-slate-800">{item.studentPercentage}%</span>
                      <span className="text-[10px] text-slate-400">{item.studentCount} / {analytics.totalStudents}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {item.verifiedCount}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 min-w-[200px]">
                    <div className="flex items-center gap-1 text-[10px] font-medium mb-1 text-slate-500 justify-between">
                      <span>B: {item.proficiencies.Beginner}</span>
                      <span>I: {item.proficiencies.Intermediate}</span>
                      <span>A: {item.proficiencies.Advanced}</span>
                      <span>E: {item.proficiencies.Expert}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                      <div style={{ width: `${(item.proficiencies.Beginner / (item.studentCount || 1)) * 100}%` }} className="bg-slate-300 h-full" title="Beginner" />
                      <div style={{ width: `${(item.proficiencies.Intermediate / (item.studentCount || 1)) * 100}%` }} className="bg-indigo-300 h-full" title="Intermediate" />
                      <div style={{ width: `${(item.proficiencies.Advanced / (item.studentCount || 1)) * 100}%` }} className="bg-indigo-600 h-full" title="Advanced" />
                      <div style={{ width: `${(item.proficiencies.Expert / (item.studentCount || 1)) * 100}%` }} className="bg-emerald-500 h-full" title="Expert" />
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {item.isCriticalGap ? (
                      <Badge variant="warning" className="text-[10px]">Critical Deficit</Badge>
                    ) : item.studentPercentage >= 65 ? (
                      <Badge variant="success" className="text-[10px]">Optimal Supply</Badge>
                    ) : (
                      <Badge variant="default" className="text-[10px]">Moderate</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {onNavigateTab && (
                      <Button
                        size="sm"
                        variant={item.isCriticalGap ? 'primary' : 'outline'}
                        className="text-[11px] h-7 px-2.5"
                        onClick={() => onNavigateTab(item.isCriticalGap ? 'training' : 'assessments')}
                      >
                        {item.isCriticalGap ? 'Plan Training' : 'Test Skill'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Branch Breakdown Comparison */}
      <Card>
        <CardHeader
          title="Branch-Wise Skill Adoption"
          subtitle="Cross-departmental comparison of key technical proficiencies"
        />
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.branchStats.map(branch => (
              <div key={branch.branchName} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{branch.branchName}</h4>
                  <Badge variant="default" className="text-[10px]">{branch.studentCount} Students</Badge>
                </div>

                <div className="space-y-2">
                  {branch.topSkills.map(sk => (
                    <div key={sk.skillName} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">{sk.skillName}</span>
                        <span className="font-bold text-slate-900">{sk.percentage}% ({sk.count})</span>
                      </div>
                      <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${sk.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
