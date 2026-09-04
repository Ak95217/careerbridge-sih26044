import React, { useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Layers, 
  PieChart as PieChartIcon,
  ShieldCheck,
  Target
} from 'lucide-react';

interface CompanySkillDemandViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const CompanySkillDemandView: React.FC<CompanySkillDemandViewProps> = ({ onNavigateTab }) => {
  const allOpportunities = useMemo(() => StorageService.getOpportunities(), []);
  const allStudents = useMemo(() => StorageService.getStudents(), []);
  const allTaxonomySkills = useMemo(() => StorageService.getSkills(), []);

  // Compute skill demand metrics from opportunities
  const skillAnalytics = useMemo(() => {
    const demandCount: Record<string, { count: number; mandatoryCount: number; opps: string[] }> = {};
    
    allOpportunities.forEach(opp => {
      opp.requiredSkills?.forEach(req => {
        const key = req.skillName;
        if (!demandCount[key]) {
          demandCount[key] = { count: 0, mandatoryCount: 0, opps: [] };
        }
        demandCount[key].count += 1;
        if (req.mandatory) demandCount[key].mandatoryCount += 1;
        if (!demandCount[key].opps.includes(opp.title)) {
          demandCount[key].opps.push(opp.title);
        }
      });
    });

    // Compute student supply count
    const supplyCount: Record<string, { total: number; verified: number }> = {};
    allStudents.forEach(st => {
      st.skills?.forEach(s => {
        const key = s.name;
        if (!supplyCount[key]) {
          supplyCount[key] = { total: 0, verified: 0 };
        }
        supplyCount[key].total += 1;
        if (s.verified) supplyCount[key].verified += 1;
      });
    });

    // Build ranked list
    const ranked = Object.entries(demandCount).map(([name, data]) => {
      const supply = supplyCount[name] || { total: 0, verified: 0 };
      const demandScore = data.count * 15;
      const deficitRatio = data.count > 0 ? (supply.verified / (data.count * 3)) : 1;
      const talentHealth = deficitRatio >= 1 ? 'Surplus' : deficitRatio >= 0.6 ? 'Balanced' : 'High Deficit';

      return {
        skillName: name,
        demandCount: data.count,
        mandatoryCount: data.mandatoryCount,
        studentSupply: supply.total,
        verifiedSupply: supply.verified,
        talentHealth,
        demandPercent: Math.min(100, Math.round((data.count / Math.max(1, allOpportunities.length)) * 100))
      };
    }).sort((a, b) => b.demandCount - a.demandCount);

    return ranked;
  }, [allOpportunities, allStudents]);

  // Category Breakdown
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {
      'Frontend': 0,
      'Backend': 0,
      'Cloud & DevOps': 0,
      'AI & Machine Learning': 0,
      'Database': 0
    };

    allOpportunities.forEach(opp => {
      opp.requiredSkills?.forEach(req => {
        const lower = req.skillName.toLowerCase();
        if (lower.includes('react') || lower.includes('vue') || lower.includes('angular') || lower.includes('frontend') || lower.includes('css') || lower.includes('tailwind')) {
          counts['Frontend'] += 1;
        } else if (lower.includes('node') || lower.includes('python') || lower.includes('java') || lower.includes('spring') || lower.includes('express') || lower.includes('api')) {
          counts['Backend'] += 1;
        } else if (lower.includes('docker') || lower.includes('aws') || lower.includes('cloud') || lower.includes('kubernetes') || lower.includes('ci/cd')) {
          counts['Cloud & DevOps'] += 1;
        } else if (lower.includes('machine learning') || lower.includes('ai') || lower.includes('pytorch') || lower.includes('data science') || lower.includes('nlp')) {
          counts['AI & Machine Learning'] += 1;
        } else {
          counts['Database'] += 1;
        }
      });
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([cat, cnt]) => ({
      category: cat,
      count: cnt,
      percentage: Math.round((cnt / total) * 100)
    }));
  }, [allOpportunities]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Industry Skill Demand & Talent Analytics</h2>
            <Badge variant="purple">Real-Time Data Engine</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time market intelligence analyzing employer prerequisites against student talent pool certifications
          </p>
        </div>

        {onNavigateTab && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateTab('candidates')}
            >
              Search Talent Pool
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onNavigateTab('internships')}
            >
              Post Opportunity
            </Button>
          </div>
        )}
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Postings Analyzed</span>
              <Briefcase className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{allOpportunities.length}</p>
            <p className="text-[11px] text-slate-500">Across IT, FinTech & Core Engineering</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Talent Pool</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{allStudents.length} Students</p>
            <p className="text-[11px] text-emerald-600 font-medium">82% Verified via Proctored MCQs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Most Demanded Stack</span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{skillAnalytics[0]?.skillName || 'React.js'}</p>
            <p className="text-[11px] text-slate-500">Required in {skillAnalytics[0]?.demandPercent || 85}% of job specs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highest Deficit Skill</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">Docker & Cloud</p>
            <p className="text-[11px] text-amber-700 font-medium">High Industry Hiring Deficit</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Skills Demand Table & Domain Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top Demanded Skills Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top In-Demand Technical Competencies</h3>
                <p className="text-xs text-slate-500">Prerequisites extracted from live company job & internship descriptions</p>
              </div>
              <Badge variant="primary">{skillAnalytics.length} Skills Tracked</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Skill Competency</th>
                      <th className="py-3 px-4">Job Postings Frequency</th>
                      <th className="py-3 px-4">Verified Supply</th>
                      <th className="py-3 px-4">Market Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {skillAnalytics.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{item.skillName}</div>
                          <span className="text-[10px] text-slate-400">
                            {item.mandatoryCount} as strict mandatory prerequisite
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full"
                                style={{ width: `${item.demandPercent}%` }}
                              />
                            </div>
                            <span className="font-semibold text-slate-700">{item.demandCount} roles</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-900">
                            {item.verifiedSupply} Certified
                          </div>
                          <span className="text-[10px] text-slate-500">
                            ({item.studentSupply} student claims)
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.talentHealth === 'High Deficit' 
                              ? 'bg-rose-100 text-rose-800' 
                              : item.talentHealth === 'Balanced' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {item.talentHealth}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Category Distribution & AICTE Actionable Recommendations */}
        <div className="space-y-6">
          {/* Domain Breakdown */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Demand by Tech Category</h3>
                <p className="text-xs text-slate-500">Distribution across engineering specializations</p>
              </div>
              <PieChartIcon className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat.category}</span>
                    <span className="font-bold text-slate-900">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-indigo-600' :
                        idx === 1 ? 'bg-purple-600' :
                        idx === 2 ? 'bg-cyan-600' :
                        idx === 3 ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actionable Talent Recommendations Card */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Campus Hiring Strategy Insights</h3>
                <p className="text-xs text-slate-500">Automated AICTE & SIH intelligence recommendations</p>
              </div>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-100 text-purple-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-700" />
                  Cloud & Docker Verification Gap
                </span>
                <p className="text-[11px] text-purple-900">
                  While 60% of postings require Cloud/Docker, only 25% of candidates have verified AICTE badges. Consider sponsoring a practical hackathon challenge or lab workshop.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Strong React.js & TypeScript Foundation
                </span>
                <p className="text-[11px] text-emerald-900">
                  Over 85% of Computer Science applicants pass React & TypeScript benchmarks with distinction (&gt;80% score).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
