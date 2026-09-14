import React from 'react';
import { X, CheckCircle, ShieldCheck, Download, ExternalLink, FileText } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const DocumentPreviewModal = ({ isOpen, onClose, document }) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-brand-teal/30 border border-brand-teal/50 flex items-center justify-center text-brand-gold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-snug">{document.file_name}</h3>
            <span className="text-xs text-brand-crimson font-mono uppercase">{document.doc_type?.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Verification Status Card */}
        <div className={`p-4 rounded-xl mb-4 border ${document.is_verified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {document.is_verified ? (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Digitally Authenticated Certificate</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-amber-400" />
                <span>Uploaded — Pending Nodal Verification</span>
              </>
            )}
          </div>
          <div className="mt-2 text-xs space-y-1 text-slate-300">
            <div><strong className="text-white">Source:</strong> {document.source || 'Student Upload'}</div>
            {document.verified_by && <div><strong className="text-white">Verified By:</strong> {document.verified_by}</div>}
            {document.verified_date && <div><strong className="text-white">Verification Date:</strong> {document.verified_date}</div>}
            <div><strong className="text-white">Upload Date:</strong> {formatDate(document.uploaded_at)}</div>
          </div>
        </div>

        {/* Mock Preview container */}
        <div className="w-full h-44 bg-slate-900/90 rounded-xl border border-brand-border/60 flex flex-col items-center justify-center p-4 text-center overflow-hidden mb-5">
          {document.file_url?.includes('unsplash') ? (
            <img
              src={document.file_url}
              alt="Document preview"
              className="w-full h-full object-cover rounded-lg opacity-80"
            />
          ) : (
            <div className="space-y-2">
              <FileText className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">Digital Certificate Attached</p>
              <p className="text-[11px] text-slate-500 font-mono">{document.file_name}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors border border-slate-700"
          >
            Close
          </button>
          <a
            href={document.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-brand-crimson hover:bg-rose-600 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Original</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
