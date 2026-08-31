import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Check, 
  X, 
  FileText, 
  ExternalLink, 
  Calendar, 
  User, 
  Building2, 
  Tag, 
  AlertCircle,
  Sparkles,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { StudentCertification, CertificateVerificationStatus } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface AdminCertificatesViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const AdminCertificatesView: React.FC<AdminCertificatesViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [certificates, setCertificates] = useState<StudentCertification[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | CertificateVerificationStatus>('Pending Verification');
  const [searchQuery, setSearchQuery] = useState('');

  // Inspection & Action Modal
  const [selectedCert, setSelectedCert] = useState<StudentCertification | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'reject' | null>(null);
  const [verifierNote, setVerifierNote] = useState('');

  const loadCertificates = () => {
    const list = StorageService.getCertificates();
    setCertificates(list);
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const counts = useMemo(() => {
    const verified = certificates.filter(c => c.status === 'Verified').length;
    const pending = certificates.filter(c => c.status === 'Pending Verification' || !c.status).length;
    const notSubmitted = certificates.filter(c => c.status === 'Not Submitted').length;
    const rejected = certificates.filter(c => c.status === 'Rejected').length;
    return { total: certificates.length, verified, pending, notSubmitted, rejected };
  }, [certificates]);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q || 
        c.title.toLowerCase().includes(q) || 
        c.issuer.toLowerCase().includes(q) || 
        (c.studentName && c.studentName.toLowerCase().includes(q)) ||
        (c.studentEmail && c.studentEmail.toLowerCase().includes(q)) ||
        (c.credentialId && c.credentialId.toLowerCase().includes(q));
      
      return matchesStatus && matchesSearch;
    });
  }, [certificates, statusFilter, searchQuery]);

  const handleOpenActionModal = (cert: StudentCertification, type: 'verify' | 'reject') => {
    if (type === 'verify' && !cert.documentUrl) {
      showToast('error', 'Cannot Verify', 'This certificate has no attached document file. The student must submit proof first.');
      return;
    }
    setSelectedCert(cert);
    setActionType(type);
    setVerifierNote(
      type === 'verify' 
        ? 'Credential ID matched against verified registry index. Authenticity confirmed.'
        : 'Credential ID could not be validated with official issuer records.'
    );
  };

  const handleConfirmAction = () => {
    if (!selectedCert || !actionType) return;

    if (actionType === 'verify' && !selectedCert.documentUrl) {
      showToast('error', 'Action Blocked', 'Cannot verify a certificate without an attached document file.');
      return;
    }

    const status: CertificateVerificationStatus = actionType === 'verify' ? 'Verified' : 'Rejected';
    const verifierName = `${user?.fullName || 'National Verification Admin'} (AICTE Authority)`;

    StorageService.verifyCertificate(
      selectedCert.id,
      status,
      verifierName,
      verifierNote.trim()
    );

    loadCertificates();
    setSelectedCert(null);
    setActionType(null);
    setVerifierNote('');

    showToast(
      actionType === 'verify' ? 'success' : 'info',
      `Certificate ${status}`,
      `Certificate "${selectedCert.title}" marked as ${status}.`
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation */}
      {onNavigateTab && (
        <div className="flex items-center">
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin Dashboard
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">National Credential Verification Cell</h2>
              <Badge variant="success">AICTE Registry Authority</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Audit, inspect, and approve student certifications, micro-credentials, and institutional accreditations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={loadCertificates}
          >
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Total Submissions</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{counts.total}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Across all students</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-amber-800">Pending Review</p>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mt-1">{counts.pending}</h3>
          <p className="text-[11px] text-amber-700 mt-0.5 font-medium">Requires audit action</p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-800">Verified & Approved</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-900 mt-1">{counts.verified}</h3>
          <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">Synced with skill profiles</p>
        </div>

        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-rose-800">Rejected</p>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <h3 className="text-2xl font-bold text-rose-900 mt-1">{counts.rejected}</h3>
          <p className="text-[11px] text-rose-700 mt-0.5 font-medium">Invalid or unverified</p>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Pending Verification', 'Not Submitted', 'Verified', 'Rejected'] as const).map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {tab}
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab === 'All' ? counts.total :
                   tab === 'Pending Verification' ? counts.pending :
                   tab === 'Not Submitted' ? counts.notSubmitted :
                   tab === 'Verified' ? counts.verified : counts.rejected}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, credential ID, issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Submissions List */}
      {filteredCertificates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No certificate records in this queue</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {statusFilter === 'Pending Verification'
              ? 'There are currently no pending certificate verifications awaiting audit.'
              : 'Try changing the filter or search keywords.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Student & Certificate Info */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                  {cert.issuer.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{cert.title}</h4>
                    <Badge variant={
                      cert.status === 'Verified' ? 'success' :
                      cert.status === 'Rejected' ? 'error' : 'warning'
                    } size="sm">
                      {cert.status || 'Pending Verification'}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800">{cert.issuer}</strong> • Issued on {cert.issueDate}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <User className="w-3 h-3 text-slate-400" />
                      {cert.studentName || 'Student'} ({cert.studentEmail || 'student@college.edu'})
                    </span>

                    {cert.credentialId && (
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold text-[10px]">
                        ID: {cert.credentialId}
                      </span>
                    )}

                    {cert.skillCategory && (
                      <span className="text-indigo-600 font-medium">
                        {cert.skillCategory}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect
                </button>

                {cert.status !== 'Verified' && (
                  cert.documentUrl ? (
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenActionModal(cert, 'verify')}
                      className="bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                    >
                      Mark Verified
                    </Button>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                      Needs Document
                    </span>
                  )
                )}

                {cert.status !== 'Rejected' && (
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<X className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenActionModal(cert, 'reject')}
                    className="text-rose-600 hover:bg-rose-50 hover:border-rose-300 cursor-pointer"
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VERIFY / REJECT ACTION MODAL */}
      {/* ========================================================================= */}
      {actionType && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                  actionType === 'verify' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                  {actionType === 'verify' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {actionType === 'verify' ? 'Verify Certificate Credential' : 'Reject Certificate Verification'}
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedCert.title}</p>
                </div>
              </div>
              <button
                onClick={() => { setActionType(null); setSelectedCert(null); }}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 text-slate-700">
                <p><strong>Candidate:</strong> {selectedCert.studentName} ({selectedCert.studentEmail})</p>
                <p><strong>Issuer:</strong> {selectedCert.issuer}</p>
                <p><strong>Credential ID:</strong> <code className="font-mono font-bold text-slate-900">{selectedCert.credentialId}</code></p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Verification Audit Note / Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={verifierNote}
                  onChange={(e) => setVerifierNote(e.target.value)}
                  placeholder="Enter audit notes or rejection reason..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setActionType(null); setSelectedCert(null); }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmAction}
                className={actionType === 'verify' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}
              >
                {actionType === 'verify' ? 'Confirm Verification' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAIL INSPECTION MODAL */}
      {/* ========================================================================= */}
      {selectedCert && !actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  {selectedCert.issuer.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{selectedCert.title}</h3>
                  <p className="text-xs text-slate-500">{selectedCert.issuer}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Candidate</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedCert.studentName || 'Student'}</span>
                  <span className="text-[11px] text-slate-500 block">{selectedCert.studentEmail}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                  <div className="mt-0.5">
                    <Badge variant={selectedCert.status === 'Verified' ? 'success' : selectedCert.status === 'Rejected' ? 'error' : 'warning'}>
                      {selectedCert.status || 'Pending Verification'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Issue Date</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedCert.issueDate}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Credential ID</span>
                  <code className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                    {selectedCert.credentialId || 'N/A'}
                  </code>
                </div>
              </div>

              {selectedCert.verificationNote && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Verification Note:</span>
                  <p className="text-slate-700 italic">"{selectedCert.verificationNote}"</p>
                </div>
              )}

              {selectedCert.documentUrl ? (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Attached Document Preview:</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-2 text-center">
                    {selectedCert.documentUrl.startsWith('data:image') ? (
                      <img src={selectedCert.documentUrl} alt="Certificate" className="max-h-52 mx-auto rounded-lg object-contain" />
                    ) : (
                      <div className="p-4 space-y-2">
                        <FileText className="w-8 h-8 text-indigo-600 mx-auto" />
                        <p className="font-semibold text-slate-800">{selectedCert.documentFileName || 'certificate.pdf'}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-xs">No Document Proof Attached</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      The candidate has entered credential metadata but has not yet uploaded a document proof file. Verification cannot be approved without proof.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCert(null)}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {selectedCert.status !== 'Verified' && selectedCert.documentUrl && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenActionModal(selectedCert, 'verify')}
                    className="bg-emerald-600 hover:bg-emerald-500"
                  >
                    Verify
                  </Button>
                )}
                {selectedCert.status !== 'Rejected' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenActionModal(selectedCert, 'reject')}
                    className="text-rose-600 hover:bg-rose-50"
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
