import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storage';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { 
  GraduationCap, 
  Search, 
  MapPin, 
  Award, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';

export const AdminCollegesView: React.FC = () => {
  const students = useMemo(() => StorageService.getStudents(), []);
  const institution = useMemo(() => StorageService.getInstitution(), []);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract colleges with student metrics
  const colleges = useMemo(() => {
    const list = [
      {
        id: 'col-1',
        name: institution.name,
        code: institution.code || 'ENG-7801',
        type: 'Autonomous State Technical University',
        location: `${institution.city || 'Pune'}, ${institution.state || 'Maharashtra'}`,
        studentCount: students.length,
        avgCgpa: (students.reduce((acc, s) => acc + s.cgpa, 0) / (students.length || 1)).toFixed(2),
        accreditation: 'NAAC A++ & NBA Tier-1 Accredited',
        verified: true
      },
      {
        id: 'col-2',
        name: 'National Institute of Technology, Karnataka',
        code: 'NITK-5600',
        type: 'Institute of National Importance',
        location: 'Surathkal, Karnataka',
        studentCount: 1420,
        avgCgpa: '8.45',
        accreditation: 'AICTE / NIRF Top 15',
        verified: true
      },
      {
        id: 'col-3',
        name: 'Vellore Institute of Technology',
        code: 'VIT-6320',
        type: 'Deemed to be University',
        location: 'Vellore, Tamil Nadu',
        studentCount: 2180,
        avgCgpa: '8.12',
        accreditation: 'NAAC A++ Accredited',
        verified: true
      },
      {
        id: 'col-4',
        name: 'College of Engineering, Guindy (Anna University)',
        code: 'CEG-6000',
        type: 'State University Faculty of Engineering',
        location: 'Chennai, Tamil Nadu',
        studentCount: 1850,
        avgCgpa: '8.34',
        accreditation: 'NBA Accredited',
        verified: true
      }
    ];
    return list;
  }, [students, institution]);

  const filteredColleges = useMemo(() => {
    return colleges.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [colleges, searchQuery]);

  return (
    <div id="admin-colleges-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Affiliated Academic Institutions</h2>
              <Badge variant="primary">{colleges.length} Verified Universities</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              AICTE / UGC accreditation records, institutional student cohorts, and academic placement performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">All Institutional Nodes Online</Badge>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search college, city, or AICTE code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Colleges List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredColleges.map((col) => (
          <Card key={col.id} className="hover:border-indigo-300 transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{col.name}</h3>
                    <p className="text-xs text-slate-500">{col.type}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {col.location} • Code: {col.code}
                    </p>
                  </div>
                </div>
                <Badge variant="success">AICTE Active</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Enrolled Pool</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{col.studentCount}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Cohort CGPA</span>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">{col.avgCgpa} / 10</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">Verified</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-[11px] text-slate-600">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {col.accreditation}
                </span>
                <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                  View Analytics →
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
