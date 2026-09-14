import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, UserCheck, ShieldCheck } from 'lucide-react';
import { getStatusConfig, formatDate } from '../../utils/formatters';

const STAGES = [
  { key: 'Submitted', label: 'Submitted', role: 'Student e-Sign' },
  { key: 'Institute_Verified', label: 'Institute Verification', role: 'College Nodal Officer' },
  { key: 'District_Verified', label: 'District Scrutiny', role: 'District Welfare Officer (DWO)' },
  { key: 'State_Verified', label: 'State Approval', role: 'State Tribal Welfare Directorate' },
  { key: 'Sanctioned', label: 'Ministry Sanction', role: 'MoTA Financial Advisor' },
  { key: 'Disbursed', label: 'DBT Payment', role: 'PFMS / NPCI Aadhaar Bridge' },
];

const StatusStepper = ({ currentStatus, statusHistory = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const currentConfig = getStatusConfig(currentStatus);
  const currentStep = currentConfig.step;
  const isRejected = currentStatus === 'Rejected';

  // Map history by status key
  const historyMap = {};
  (statusHistory || []).forEach((item) => {
    historyMap[item.status] = item;
  });

  return (
    <div className="w-full bg-brand-surface/60 border border-brand-border rounded-xl p-4 sm:p-5 backdrop-blur-md">
      {/* Top status banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-brand-border/60">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current Verification Stage
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base sm:text-lg font-bold text-white">
              {currentConfig.label}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${currentConfig.bg} ${currentConfig.text} border ${currentConfig.border}`}>
              Step {currentStep} of 6
            </span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-brand-crimson hover:text-white transition-colors bg-brand-crimson/10 px-3 py-1.5 rounded-lg border border-brand-crimson/20"
        >
          <span>{expanded ? 'Hide Audit Log' : 'View Audit Log'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Responsive Horizontal Stepper */}
      <div className="relative">
        <div className="hidden md:grid grid-cols-6 gap-2 relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0">
            <div
              className={`h-full transition-all duration-700 ${isRejected ? 'bg-rose-500' : 'bg-gradient-to-r from-brand-crimson via-brand-gold to-brand-emerald'}`}
              style={{
                width: isRejected ? '100%' : `${Math.min(100, Math.max(0, ((currentStep - 1) / 5) * 100))}%`
              }}
            />
          </div>

          {STAGES.map((stage, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep || (stepNum === 6 && currentStep === 6);
            const isCurrent = stepNum === currentStep && !isRejected;
            const hasHistory = historyMap[stage.key];

            return (
              <div key={stage.key} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? 'bg-brand-emerald text-brand-dark shadow-lg shadow-emerald-500/20 ring-4 ring-brand-emerald/20'
                      : isCurrent
                      ? 'bg-brand-gold text-brand-dark shadow-lg shadow-amber-500/30 ring-4 ring-brand-gold/30 animate-pulse'
                      : isRejected && stepNum === currentStep
                      ? 'bg-rose-500 text-white ring-4 ring-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>

                <div className="mt-2 text-xs font-semibold text-slate-200">
                  {stage.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {stage.role}
                </div>
                {hasHistory && (
                  <div className="text-[10px] text-brand-emerald mt-1 font-mono">
                    {hasHistory.timestamp.split(' ')[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Stepper (< md) */}
        <div className="md:hidden space-y-3">
          {STAGES.map((stage, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep || (stepNum === 6 && currentStep === 6);
            const isCurrent = stepNum === currentStep && !isRejected;
            const hasHistory = historyMap[stage.key];

            return (
              <div
                key={stage.key}
                className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors ${
                  isCurrent ? 'bg-brand-gold/10 border border-brand-gold/20' : 'bg-slate-800/40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[10px] mt-0.5 ${
                    isCompleted
                      ? 'bg-brand-emerald text-white'
                      : isCurrent
                      ? 'bg-brand-gold text-brand-dark'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{stage.label}</span>
                    {hasHistory && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {hasHistory.timestamp.split(' ')[0]}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{stage.role}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Audit Log Details */}
      {expanded && (
        <div className="mt-6 pt-4 border-t border-brand-border space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-emerald" />
            Verification Audit Trail
          </div>

          {(statusHistory || []).length === 0 ? (
            <div className="text-xs text-slate-400 italic">No historical transitions recorded yet.</div>
          ) : (
            <div className="space-y-2.5">
              {(statusHistory || []).map((log, i) => (
                <div
                  key={i}
                  className="bg-brand-card/80 border border-brand-border/80 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-brand-gold">{log.status.replace('_', ' ')}</span>
                      {log.verified_by && (
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {log.verified_by}
                        </span>
                      )}
                    </div>
                    {log.remarks && (
                      <p className="text-slate-300 text-[11px] leading-relaxed">{log.remarks}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap self-start sm:self-center">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusStepper;
