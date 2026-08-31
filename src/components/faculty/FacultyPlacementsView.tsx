import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { PlacementRecord, FacultyProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input, Select } from '../common/Input';
import { 
  Award, 
  Plus, 
  TrendingUp, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  Search, 
  X,
  FileText,
  DollarSign
} from 'lucide-react';

interface FacultyPlacementsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const FacultyPlacementsView: React.FC<FacultyPlacementsViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const faculty = user as FacultyProfile;

  const [placements, setPlacements] = useState<PlacementRecord[]>(() => StorageService.getPlacements());
  const [students] = useState(() => StorageService.getStudents());
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const stats = StorageService.calculatePlacementStats(faculty?.institutionName);

  // New Placement Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [packageLpa, setPackageLpa] = useState<number | ''>('');
  const [workMode, setWorkMode] = useState<'Onsite' | 'Remote' | 'Hybrid'>('Hybrid');
  const [placementDate, setPlacementDate] = useState(new Date().toISOString().split('T')[0]);
  const [placementStatus, setPlacementStatus] = useState<'Selected' | 'Offer Accepted' | 'Joined'>('Offer Accepted');

  const handleRecordPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      addToast('error', 'Select Student', 'Please choose a student from the department roster.');
      return;
    }

    const st = students.find(s => s.id === selectedStudentId);
    if (!st) return;

    const record: PlacementRecord = {
      id: `plc-${Date.now()}`,
      studentId: st.id,
      studentName: st.fullName,
      studentEmail: st.email,
      studentCollege: st.collegeName,
      studentBranch: st.branch,
      studentGraduationYear: st.graduationYear,
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      packageLpa: Number(packageLpa),
      workMode,
      placementDate,
      status: placementStatus,
      verifiedByFacultyId: faculty?.id || 'usr-faculty-1',
      createdAt: new Date().toISOString()
    };

    StorageService.addPlacement(record);
    setPlacements(StorageService.getPlacements());
    addToast('success', 'Placement Recorded! 🎉', `Recorded placement offer for ${st.fullName} at ${record.companyName} (${record.packageLpa} LPA).`);
    setShowAddModal(false);
  };

  const filteredPlacements = placements.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.studentName.toLowerCase().includes(q) || p.companyName.toLowerCase().includes(q) || p.jobTitle.toLowerCase().includes(q) || p.studentBranch.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Campus Placement Cell & Statistics</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official record of campus placement offers, CTC packages, recruiter hiring shares, and student conversion rates.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Record Placement Offer
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Placement Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{stats.placementRate}%</h3>
              <span className="text-xs text-emerald-600 font-semibold">{stats.placedCount} / {stats.eligibleStudents} Placed</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.placementRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Average Package (CTC)</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{stats.averagePackage} LPA</h3>
              <span className="text-xs text-indigo-600 font-semibold">Tier-1 Drives</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Calculated across verified offers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Highest Package Offered</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{stats.highestPackage} LPA</h3>
              <span className="text-xs text-amber-600 font-semibold">Top Bracket</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Cloud & AI Engineering Roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Seeking Placement</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{stats.seekingCount} Students</h3>
              <span className="text-xs text-indigo-600 font-semibold">Active Pool</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Targeted with upskilling bootcamps</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Records Table */}
      <Card>
        <CardHeader
          title="Verified Student Placement Records"
          subtitle="Official log of student selections by recruiting companies"
          action={
            <div className="w-64">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, role, company..."
                className="text-xs py-1.5"
              />
            </div>
          }
        />
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-y border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student & Branch</th>
                <th className="py-3 px-4">Recruiting Company</th>
                <th className="py-3 px-4">Job Role & Work Mode</th>
                <th className="py-3 px-3 text-center">Package (LPA)</th>
                <th className="py-3 px-3 text-center">Placement Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPlacements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No placement records found matching search.
                  </td>
                </tr>
              ) : (
                filteredPlacements.map(plc => (
                  <tr key={plc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{plc.studentName}</p>
                      <p className="text-[10px] text-slate-500">{plc.studentBranch} • Class of {plc.studentGraduationYear}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{plc.companyName}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-900">{plc.jobTitle}</p>
                      <p className="text-[10px] text-slate-400">{plc.workMode}</p>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                        ₹{plc.packageLpa} LPA
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-600">
                      {plc.placementDate}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Badge variant={plc.status === 'Offer Accepted' || plc.status === 'Joined' ? 'success' : 'primary'}>
                        {plc.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* MODAL: Record Placement */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Student Campus Placement</h3>
                <p className="text-xs text-slate-500">Log verified recruitment offer</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPlacement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Student <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  options={[
                    { value: '', label: '-- Choose Student from Roster --' },
                    ...students.map(s => ({
                      value: s.id,
                      label: `${s.fullName} (${s.branch}, CGPA: ${s.cgpa})`
                    }))
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Package (LPA) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={packageLpa}
                    onChange={(e) => setPackageLpa(parseFloat(e.target.value) || 12)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Mode
                  </label>
                  <Select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as any)}
                    options={[
                      { value: 'Hybrid', label: 'Hybrid' },
                      { value: 'Onsite', label: 'Onsite' },
                      { value: 'Remote', label: 'Remote' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <Select
                    value={placementStatus}
                    onChange={(e) => setPlacementStatus(e.target.value as any)}
                    options={[
                      { value: 'Offer Accepted', label: 'Offer Accepted' },
                      { value: 'Selected', label: 'Selected' },
                      { value: 'Joined', label: 'Joined' }
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Placement Offer Date
                </label>
                <Input
                  type="date"
                  value={placementDate}
                  onChange={(e) => setPlacementDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<Award className="w-4 h-4" />}>
                  Save Placement Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
