import React, { useState } from 'react';
import { SavedResume } from '../../../types';
import { StorageService } from '../../../services/storage';
import { FileText, Copy, Trash2, Edit2, Check, X, Plus, Calendar, Sparkles } from 'lucide-react';

interface SavedResumesModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  activeResumeId: string;
  onSelectResume: (resume: SavedResume) => void;
  onCreateNew: () => void;
}

export const SavedResumesModal: React.FC<SavedResumesModalProps> = ({
  isOpen,
  onClose,
  studentId,
  activeResumeId,
  onSelectResume,
  onCreateNew,
}) => {
  const [resumes, setResumes] = useState<SavedResume[]>(() => StorageService.getSavedResumes(studentId));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  if (!isOpen) return null;

  const refreshList = () => {
    setResumes(StorageService.getSavedResumes(studentId));
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.duplicateSavedResume(id);
    refreshList();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this saved resume version?')) {
      StorageService.deleteSavedResume(id);
      refreshList();
    }
  };

  const startRenaming = (resume: SavedResume, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(resume.id);
    setRenameValue(resume.name);
  };

  const saveRenaming = (resume: SavedResume, e: React.MouseEvent) => {
    e.stopPropagation();
    if (renameValue.trim()) {
      StorageService.saveResume({
        ...resume,
        name: renameValue.trim(),
      });
      setEditingId(null);
      refreshList();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">My Saved Resumes</h3>
              <p className="text-xs text-slate-500">Manage, switch, or duplicate your tailored resume versions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">
            {resumes.length} {resumes.length === 1 ? 'Version' : 'Versions'} Saved
          </span>
          <button
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Version
          </button>
        </div>

        {/* List */}
        <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
          {resumes.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No saved resumes yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Generate or save your current resume configuration to store it in your student portfolio.
              </p>
            </div>
          ) : (
            resumes.map((resume) => {
              const isActive = resume.id === activeResumeId;
              const atsScore = resume.atsAnalysis?.overallScore;

              return (
                <div
                  key={resume.id}
                  onClick={() => {
                    onSelectResume(resume);
                    onClose();
                  }}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {editingId === resume.id ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="px-2 py-1 text-sm font-bold text-slate-900 border border-indigo-500 rounded bg-white focus:outline-hidden"
                            autoFocus
                          />
                          <button
                            onClick={(e) => saveRenaming(resume, e)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(null);
                            }}
                            className="p-1 text-slate-400 hover:bg-slate-200 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{resume.name}</h4>
                          {isActive && (
                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Role: {resume.targetRole}</span>
                        <span>•</span>
                        <span className="capitalize">Template: {resume.template.replace('-', ' ')}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(resume.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {atsScore && (
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          atsScore >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : atsScore >= 70
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          ATS {atsScore}
                        </div>
                      )}

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={(e) => startRenaming(resume, e)}
                          title="Rename"
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDuplicate(resume.id, e)}
                          title="Duplicate Version"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(resume.id, e)}
                          title="Delete"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
