import React from 'react';
import { AlertTriangle, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConflictModal = ({ isOpen, onClose, conflictData, onConfirmOverride }) => {
  const navigate = useNavigate();
  if (!isOpen || !conflictData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-brand-surface border border-rose-500/40 rounded-2xl p-6 shadow-2xl shadow-rose-950/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Central Scheme Conflict</h3>
            <span className="text-xs text-rose-400 font-medium">Dual Benefit Prevention Rule</span>
          </div>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-xs text-slate-200 leading-relaxed mb-4">
          <p className="font-semibold text-rose-300 mb-1">
            Active Application Found:
          </p>
          <p className="mb-2">
            You currently hold an active application for <strong className="text-white">{conflictData.existing_scheme_name || 'Central Scheme'}</strong> (ID: <code className="text-brand-gold">{conflictData.existing_application_id}</code>) at stage <strong className="text-white">{conflictData.status?.replace('_', ' ')}</strong>.
          </p>
          <p className="text-slate-400 text-[11px]">
            Under Ministry of Tribal Affairs (MoTA) regulations, a student can draw central government scholarship from only one scheme at a time for the same academic session.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              navigate('/dashboard');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors border border-slate-700"
          >
            Track Current Application
          </button>

          {conflictData.can_proceed_override && (
            <button
              onClick={onConfirmOverride}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-crimson hover:bg-rose-600 text-xs font-semibold text-white transition-colors shadow-lg shadow-rose-600/30"
            >
              Proceed (Replace / Override)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
