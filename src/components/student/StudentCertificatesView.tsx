import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink, 
  Upload, 
  FileText, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  Tag, 
  Info,
  Copy,
  Check,
  AlertCircle,
  FileCheck2,
  X,
  ArrowLeft,
  FileQuestion
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { StudentCertification, CertificateVerificationStatus, StudentProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface StudentCertificatesViewProps {
  onNavigateTab: (tabId: string) => void;
}

const COMMON_ISSUERS = [
  'AWS (Amazon Web Services)',
  'Coursera',
  'Google Cloud / Google',
  'Microsoft Learn / Azure',
  'NPTEL / Swayam',
  'Meta',
  'IBM',
  'Stanford Online',
  'HackerRank',
  'Oracle',
  'Linux Foundation',
  'Cisco Networking Academy',
  'AICTE Virtual Internship'
];

const SKILL_CATEGORIES = [
  'Cloud Computing',
  'AI & Machine Learning',
  'Frontend & UI Engineering',
  'Backend & Microservices',
  'Full Stack Development',
  'Data Science & Analytics',
  'DevOps & Infrastructure',
  'Cybersecurity & Networking',
  'Database Management',
  'Mobile App Development'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];

export const StudentCertificatesView: React.FC<StudentCertificatesViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const student = user as StudentProfile;
  const { showToast } = useToast();

  const [certificates, setCertificates] = useState<StudentCertification[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | CertificateVerificationStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCertForView, setSelectedCertForView] = useState<StudentCertification | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    credentialUrl: string;
    skillCategory: string;
    skillName: string;
    documentFileName: string;
    documentUrl: string;
  }>({
    title: '',
    issuer: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    skillCategory: 'Cloud Computing',
    skillName: '',
    documentFileName: '',
    documentUrl: ''
  });

  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Load certificates for current student
  const loadCertificates = () => {
    if (student?.id) {
      const list = StorageService.getCertificates(student.id);
      setCertificates(list);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [student?.id]);

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const matchesStatus技巧 = statusFilter === 'All' || c.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q || 
        c.title.toLowerCase().includes(q) || 
        c.issuer.toLowerCase().includes(q) || 
        (c.credentialId && c.credentialId.toLowerCase().includes(q)) ||
        (c.skillName && c.skillName.toLowerCase().includes(q)) ||
        (c.skillCategory && c.skillCategory.toLowerCase().includes(q));
      
      return matchesStatus技巧 && matchesSearch;
    });
  }, [certificates, statusFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    const verified = certificates.filter(c => c.status === 'Verified').length;
    const pending = certificates.filter(c => c.status === 'Pending Verification').length;
    const notSubmitted = certificates.filter(c => c.status === 'Not Submitted' || (!c.status && !c.documentFileName)).length;
    const rejected = certificates.filter(c => c.status === 'Rejected').length;
    return { total: certificates.length, verified, pending, notSubmitted, rejected };
  }, [certificates]);

  // File Upload Handler (PDF / Image) with format & size validation
  const handleFileUpload = (file: File) => {
    if (!file || file.size === 0) {
      showToast('error', 'Invalid File', 'The selected file is empty.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'File Too Large', 'Maximum file upload size is 10MB.');
      return;
    }

    const fileNameLower = file.name.toLowerCase();
    const isAllowed = ALLOWED_EXTENSIONS.some(ext => fileNameLower.endsWith(ext));
    if (!isAllowed) {
      showToast('error', 'Unsupported File Type', 'Please upload a PDF or image file (.pdf, .png, .jpg, .jpeg, .webp).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        documentFileName: file.name,
        documentUrl: reader.result as string
      }));
      showToast('success', 'Document Attached', `${file.name} attached. Status will be Pending Verification once submitted.`);
    };
    reader.readAsDataURL(file);
  };

  // Save Certificate
  const handleSaveCertificate地理 = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.issuer.trim() || !formData.issueDate || !formData.credentialId.trim()) {
      showToast('error', 'Missing Required Fields', 'Please enter Certificate Title, Issuing Organization, Issue Date, and Credential ID.');
      return;
    }

    const hasDoc = Boolean(formData.documentFileName && formData.documentUrl);
    const initialStatus: CertificateVerificationStatus = hasDoc ? 'Pending Verification' : 'Not Submitted';

    const newCert = StorageService.addCertificate({
      studentId: student.id,
      studentName: student.fullName !== 'Not provided' ? student.fullName : 'Student Candidate',
      studentEmail: student.email,
      studentCollege: student.collegeName !== 'Not provided' ? student.collegeName : undefined,
      title: formData.title.trim(),
      issuer: formData.issuer.trim(),
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate.trim() || undefined,
      credentialId: formData.credentialId.trim(),
      credentialUrl: formData.credentialUrl.trim() || undefined,
      skillCategory: formData.skillCategory,
      skillName: formData.skillName.trim() || formData.title.trim(),
      documentFileName: formData.documentFileName || undefined,
      documentUrl: formData.documentUrl || undefined,
      status: initialStatus,
      verifiedAt: undefined,
      verifiedBy: undefined,
      verificationNote: hasDoc 
        ? 'Certificate document uploaded. Queued for National Credential Verification Cell audit.' 
        : 'Certificate metadata registered without document upload. Upload a certificate file to submit for verification.'
    });

    loadCertificates();
    setIsAddModalOpen(false);
    
    // Reset Form
    setFormData({
      title: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      skillCategory: 'Cloud Computing',
      skillName: '',
      documentFileName: '',
      documentUrl: ''
    });

    if (hasDoc) {
      showToast('success', 'Certificate Submitted for Review', `"${newCert.title}" is now Pending Verification. An authorized verifier will review the document.`);
    } else {
      showToast('info', 'Certificate Saved as Draft', `"${newCert.title}" saved. Upload a document file whenever you want to submit it for verification.`);
    }
  };

  // Delete Certificate
  const handleDeleteCertificate = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove the certificate "${title}"?`)) {
      StorageService.deleteCertificate(id);
      loadCertificates();
      if (selectedCertForView?.id === id) {
        setSelectedCertForView(null);
      }
      showToast('info', 'Certificate Removed', `Certificate has been removed from your portal.`);
    }
  };

  const handleCopyId = (idText: string) => {
    navigator.clipboard.writeText(idText);
    setCopiedId(idText);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('info', 'Copied to Clipboard', `Credential ID copied.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateTab('dashboard')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <span className="text-xs text-slate-500 font-medium">Student Portal &bull; Certifications</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Credentials & Accreditations
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Certificate Verification Module
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Upload, track, and submit industry certifications from AWS, Google, NPTEL, Coursera, and universities for review by the National Credential Verification Cell.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              id="btn-add-certificate"
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-sm cursor-pointer"
            >
              Add Certificate
            </Button>
          </div>
        </div>

        {/* Verification Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 block">Total Records</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{counts.total}</span>
          </div>

          <div className="bg-emerald-950/40 rounded-xl p-3 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-300">Verified</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">{counts.verified}</span>
          </div>

          <div className="bg-amber-950/40 rounded-xl p-3 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-300">Pending Review</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">{counts.pending}</span>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300">Not Submitted</span>
              <FileQuestion className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-xl font-bold text-slate-300 mt-0.5 block">{counts.notSubmitted}</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Verified', 'Pending Verification', 'Not Submitted', 'Rejected'] as const).map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {tab}
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab === 'All' ? counts.total :
                   tab === 'Verified' ? counts.verified :
                   tab === 'Pending Verification' ? counts.pending :
                   tab === 'Not Submitted' ? counts.notSubmitted : counts.rejected}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search credentials, issuers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {filteredCertificates.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              {certificates.length === 0 ? 'No certificates added yet' : 'No matching certificates found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {certificates.length === 0 
                ? 'Upload your certificates from Coursera, AWS, NPTEL, Google, or your university to submit them for official review and unlock verified badges.'
                : 'Try adjusting your search query or filter tab to view other certificates.'}
            </p>
          </div>
          {certificates.length === 0 && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2"
            >
              Add Your First Certificate
            </Button>
          )}
        </div>
      ) : (
        /* Certificate Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCertificates.map((cert) => {
            const isVerified = cert.status === 'Verified';
            const isPending = cert.status === 'Pending Verification';
            const isNotSubmitted述 = cert.status === 'Not Submitted' || (!cert.status && !cert.documentFileName);
            const isRejected = cert.status === 'Rejected';

            return (
              <div 
                key={cert.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top status bar accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  isVerified ? 'bg-emerald-500' : isPending ? 'bg-amber-400' : isNotSubmitted述 ? 'bg-slate-300' : 'bg-rose-500'
                }`} />

                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                        {cert.issuer.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-500 truncate">{cert.issuer}</p>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {cert.title}
                        </h4>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending Review
                        </span>
                      )}
                      {isNotSubmitted述 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <FileQuestion className="w-3 h-3 text-slate-500" />
                          Not Submitted
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details block */}
                  <div className="bg-slate-50/80 rounded-lg p-2.5 space-y-1.5 text-xs text-slate-600 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> Issued:
                      </span>
                      <span className="font-semibold text-slate-800">{cert.issueDate}</span>
                    </div>

                    {cert.credentialId && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Credential ID:</span>
                        <div className="flex items-center gap-1">
                          <code className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">
                            {cert.credentialId}
                          </code>
                          <button
                            onClick={() => handleCopyId(cert.credentialId!)}
                            title="Copy Credential ID"
                            className="text-slate-400 hover:text-slate-700"
                          >
                            {copiedId === cert.credentialId ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {cert.skillCategory && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-slate-400" /> Skill Domain:
                        </span>
                        <span className="font-medium text-indigo-700">{cert.skillCategory}</span>
                      </div>
                    )}
                  </div>

                  {/* Verification Note (if any) */}
                  {cert.verificationNote && (
                    <p className="text-[11px] text-slate-500 italic bg-white border border-slate-100 rounded-md p-2 line-clamp-2">
                      "{cert.verificationNote}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedCertForView(cert)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Inspect
                    </button>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Open Credential Web Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteCertificate(cert.id, cert.title)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Certificate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD CERTIFICATE MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Add Certificate</h3>
                  <p className="text-xs text-slate-500">Provide official credential details for verification</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveCertificate地理} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* Certificate Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Certificate Name / Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="e.g. AWS Certified Solutions Architect - Associate"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Issuing Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issuing Organization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    list="issuers-list"
                    placeholder="e.g. AWS, Coursera, NPTEL"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
                    required
                  />
                  <datalist id="issuers-list">
                    {COMMON_ISSUERS.map((iss) => (
                      <option key={iss} value={iss} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Skill Domain / Category
                  </label>
                  <select
                    value={formData.skillCategory}
                    onChange={(e) => setFormData({ ...formData, skillCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
                  >
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issue Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Credential ID & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Credential ID <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. AWS-SAA-984210"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Credential URL (Optional)
                  </label>
                  <Input
                    placeholder="https://coursera.org/verify/..."
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  />
                </div>
              </div>

              {/* Associated Skill Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Skill to Link in Profile (Optional)
                </label>
                <Input
                  placeholder="e.g. Cloud Computing, Python, React.js, Docker"
                  value={formData.skillName}
                  onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  When verified by National Credential Verification Cell, this skill will receive a verified credential badge.
                </p>
              </div>

              {/* Document Upload Area */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Certificate Document (PDF / Image)
                </label>
                
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                    isDraggingFile ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  {formData.documentFileName ? (
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {formData.documentFileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, documentFileName: '', documentUrl: '' })}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-medium text-slate-700">
                        Drag & drop your certificate file here, or{' '}
                        <label className="text-indigo-600 font-bold hover:underline cursor-pointer">
                          browse files
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </p>
                      <p className="text-[10px] text-slate-400">Supported: PDF, PNG, JPG, JPEG, WEBP (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Notice */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-normal">
                  {formData.documentFileName 
                    ? 'With a document attached, this certificate will be submitted for verification audit by the National Credential Verification Cell.' 
                    : 'Without an attached document, this certificate will be saved with "Not Submitted" status until you upload a document file.'}
                </p>
              </div>

              {/* Footer CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  {formData.documentFileName ? 'Submit for Review' : 'Save Certificate'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INSPECT CERTIFICATE DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedCertForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header with Back button */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedCertForView(null)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors mr-1"
                  title="Back to list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {selectedCertForView.issuer.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{selectedCertForView.title}</h3>
                  <p className="text-xs text-slate-500">{selectedCertForView.issuer}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCertForView(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* Verification Status Card */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                selectedCertForView.status === 'Verified'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : selectedCertForView.status === 'Rejected'
                  ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                  : selectedCertForView.status === 'Not Submitted'
                  ? 'bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-2.5">
                  {selectedCertForView.status === 'Verified' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : selectedCertForView.status === 'Rejected' ? (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  ) : selectedCertForView.status === 'Not Submitted' ? (
                    <FileQuestion className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                  <div>
                    <h4 className="font-bold text-xs">
                      {selectedCertForView.status || 'Not Submitted'}
                    </h4>
                    <p className="text-[11px] opacity-80">
                      {selectedCertForView.status === 'Verified'
                        ? `Verified on ${selectedCertForView.verifiedAt ? new Date(selectedCertForView.verifiedAt).toLocaleDateString() : 'Active'}`
                        : selectedCertForView.status === 'Rejected'
                        ? 'Verification rejected by reviewer'
                        : selectedCertForView.status === 'Not Submitted'
                        ? 'No certificate document file uploaded'
                        : 'Awaiting administrative verification audit'}
                    </p>
                  </div>
                </div>

                {selectedCertForView.verifiedBy && (
                  <Badge variant="neutral" size="sm">
                    {selectedCertForView.verifiedBy}
                  </Badge>
                )}
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Issue Date</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedCertForView.issueDate}</span>
                </div>

                {selectedCertForView.expiryDate && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Expiry Date</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{selectedCertForView.expiryDate}</span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Credential ID</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <code className="font-mono text-xs font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {selectedCertForView.credentialId || 'N/A'}
                    </code>
                    {selectedCertForView.credentialId && (
                      <button
                        onClick={() => handleCopyId(selectedCertForView.credentialId!)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy ID"
                      >
                        {copiedId === selectedCertForView.credentialId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Skill Category</span>
                  <span className="font-semibold text-indigo-700 mt-0.5 block">{selectedCertForView.skillCategory || 'General'}</span>
                </div>
              </div>

              {/* Verification Audit Note */}
              {selectedCertForView.verificationNote && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Verification Audit Notes:
                  </span>
                  <p className="text-xs text-slate-700">
                    "{selectedCertForView.verificationNote}"
                  </p>
                </div>
              )}

              {/* Document Preview / Attachment */}
              {selectedCertForView.documentUrl ? (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Uploaded Document Preview
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900/5 p-2 text-center">
                    {selectedCertForView.documentUrl.startsWith('data:image') ? (
                      <img 
                        src={selectedCertForView.documentUrl} 
                        alt="Certificate Preview" 
                        className="max-h-56 mx-auto rounded-lg object-contain shadow-xs"
                      />
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <FileText className="w-10 h-10 text-indigo-600 mx-auto" />
                        <p className="font-semibold text-slate-800 text-xs">
                          {selectedCertForView.documentFileName || 'Certificate_Document.pdf'}
                        </p>
                        <a
                          href={selectedCertForView.documentUrl}
                          download={selectedCertForView.documentFileName || 'certificate.pdf'}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700 transition-colors"
                        >
                          Download Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    No certificate document file has been uploaded for this credential. Upload a file to submit it for verification review.
                  </p>
                </div>
              )}

              {/* External URL */}
              {selectedCertForView.credentialUrl && (
                <div className="pt-2">
                  <a
                    href={selectedCertForView.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Verify on Official Issuer Website
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                onClick={() => setSelectedCertForView(null)}
              >
                Back to Certificates List
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
