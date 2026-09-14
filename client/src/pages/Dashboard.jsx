import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  PlusCircle,
  FolderOpen
} from 'lucide-react';
import ParticleText from '../components/reactbits/ParticleText';
import StatusStepper from '../components/common/StatusStepper';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { formatINR, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [eligibilityData, setEligibilityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [appsRes, eligRes] = await Promise.all([
          axiosClient.get('/api/applications'),
          axiosClient.get('/api/scholarships/eligible')
        ]);
        setApplications(appsRes.data || []);
        setEligibilityData(eligRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Compute metrics
  const totalApps = applications.length;
  const approvedApps = applications.filter((a) => ['Sanctioned', 'Disbursed'].includes(a.status)).length;
  const pendingApps = applications.filter((a) => !['Sanctioned', 'Disbursed', 'Rejected'].includes(a.status)).length;
  const totalReceived = applications.reduce((sum, a) => sum + (a.payment_amount || 0), 0);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome Banner with ParticleText Heading */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-border/80 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-2/3">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-emerald" />
              Verified ST Student Gateway
            </span>

            {/* ParticleText Header */}
            <div className="w-full h-24 sm:h-28 flex items-center justify-start">
              <ParticleText
                text={`Welcome, ${user?.name?.split(' ')[0] || 'Scholar'}`}
                color="#f5a623"
                highlightColor="#e94560"
                fontSize="clamp(2rem, 5vw, 3.2rem)"
                fontWeight={900}
                density={2.5}
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed -mt-2">
              Enrolled at <strong className="text-white">{user?.institution_name || 'Premier Institute'}</strong> • {user?.education_level} • Aadhaar <span className="font-mono text-brand-gold">XXXX-XXXX-{user?.aadhaar_last4}</span>
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 w-full md:w-auto">
            <Link
              to="/apply"
              className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-crimson to-brand-gold text-white text-xs font-bold shadow-lg shadow-rose-950/40 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Scholarship Application</span>
            </Link>

            <Link
              to="/documents"
              className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-brand-surface/90 hover:bg-slate-800 text-slate-200 border border-brand-border text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <FolderOpen className="w-4 h-4 text-brand-gold" />
              <span>ST Document Wallet</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 STAT METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-5 rounded-2xl border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Applications</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{totalApps}</div>
          <div className="text-[10px] text-slate-400 mt-1">Under Central MoTA Schemes</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Approved / Sanctioned</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-emerald">{approvedApps}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Ready for Financial Release</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">In Verification</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-gold">{pendingApps}</div>
          <div className="text-[10px] text-amber-400/80 mt-1">State / Institute Scrutiny</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">₹ DBT Received</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{formatINR(totalReceived)}</div>
          <div className="text-[10px] text-brand-emerald mt-1">Seeded Aadhaar Bank Account</div>
        </div>
      </div>

      {/* LIVE SCHEME ELIGIBILITY CHECKER */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Auto-Eligibility Checker (Live)</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                5 Central Schemes
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated against your income (₹{(user?.family_income || 0).toLocaleString('en-IN')}), academic score ({user?.percentage || 0}%), and course level ({user?.education_level}).
            </p>
          </div>

          <Link
            to="/apply"
            className="text-xs font-semibold text-brand-gold hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            <span>Apply to Eligible Schemes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eligibilityData.map((item, idx) => {
            const sch = item.scholarship;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  item.is_eligible
                    ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-slate-900/40 border-brand-border/60 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold font-mono text-slate-400">{sch.code}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        item.is_eligible
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {item.is_eligible ? '✅ Eligible' : '❌ Ineligible'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">{sch.name}</h3>

                  <div className="space-y-1.5 text-xs mb-4">
                    {item.reasons.map((r, i) => (
                      <p
                        key={i}
                        className={`text-[11px] leading-relaxed flex items-start gap-1.5 ${
                          r.includes('mismatch') || r.includes('exceeded') || r.includes('unmet')
                            ? 'text-rose-400'
                            : 'text-slate-300'
                        }`}
                      >
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                        <span>{r}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-brand-gold font-semibold">
                    Match: {item.match_score}%
                  </span>
                  {item.is_eligible ? (
                    <Link
                      to={`/apply?scheme=${sch.code}`}
                      className="text-xs font-bold text-white bg-brand-crimson hover:bg-rose-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Apply Now
                    </Link>
                  ) : (
                    <a
                      href={sch.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <span>Guidelines</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MY APPLICATIONS & 7-STAGE STATUS STEPPER TRACKER */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Application Status & Tracking</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live tracking through Institute, District, State, and Ministry Sanction levels.
            </p>
          </div>

          <Link
            to="/apply"
            className="text-xs font-semibold text-brand-crimson hover:text-white flex items-center gap-1"
          >
            <span>+ Apply Another Scheme</span>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-brand-border text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-crimson/10 border border-brand-crimson/30 flex items-center justify-center text-brand-gold mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">No Submitted Applications Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Select an eligible scheme and complete your 5-step application in under 3 minutes.
            </p>
            <Link
              to="/apply"
              className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-crimson to-brand-gold text-white font-bold text-xs"
            >
              Start Your Application
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border space-y-6"
              >
                {/* Application Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-gold px-2.5 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20">
                        {app.application_id}
                      </span>
                      <span className="text-xs text-slate-400">
                        Submitted on {formatDate(app.created_at)}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1.5">
                      {app.scholarship?.name || 'Central Scholarship Scheme'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    {app.payment_amount > 0 && (
                      <div className="text-right">
                        <div className="text-xs font-bold text-brand-emerald">
                          {formatINR(app.payment_amount)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {app.transaction_id ? `Txn: ${app.transaction_id}` : 'Sanctioned Amount'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 7-Stage Stepper for this application */}
                <StatusStepper currentStatus={app.status} statusHistory={app.status_history} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
