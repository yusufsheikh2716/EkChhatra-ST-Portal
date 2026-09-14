import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Compass, 
  Award,
  IndianRupee,
  Filter
} from 'lucide-react';
import ParticleText from '../components/reactbits/ParticleText';
import axiosClient from '../api/axiosClient';
import { formatINR } from '../utils/formatters';

const SCHEME_COLORS = ['#3b82f6', '#10b981', '#f5a623', '#8b5cf6', '#e94560'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/api/analytics')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const overview = data?.overview;
  const schemeDist = data?.scheme_distribution || [];
  const stateStats = data?.state_wise_stats || [];
  const monthlyData = data?.monthly_disbursements || [];
  const unreached = data?.unreached_metric;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Container with ParticleText */}
      <div className="text-center">
        <div className="w-full h-20 sm:h-24 flex items-center justify-center">
          <ParticleText
            text="Analytics & Impact"
            color="#f5a623"
            highlightColor="#10b981"
            fontSize="clamp(2rem, 6vw, 3rem)"
            fontWeight={900}
            density={2.5}
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto -mt-2">
          Tracking national scholarship disbursements, tribal reach, and district penetration.
        </p>
      </div>

      {/* TOP KPI STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-5 rounded-2xl border-brand-border">
          <span className="text-xs text-slate-400 block mb-1">Total Central Outlay</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-gold">
            {formatINR(overview?.total_disbursed_amount || 4826500000)}
          </div>
          <span className="text-[10px] text-brand-emerald font-semibold mt-1 block">Direct DBT to Students</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border-brand-border">
          <span className="text-xs text-slate-400 block mb-1">Total ST Students Enrolled</span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {(overview?.total_students_enrolled || 134200).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-cyan-400 font-semibold mt-1 block">Across 28 States & UTs</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border-brand-border">
          <span className="text-xs text-slate-400 block mb-1">DigiLocker Success Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-emerald">
            {overview?.verification_success_rate || 98.4}%
          </div>
          <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Instant Digital Verifications</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border-brand-border">
          <span className="text-xs text-slate-400 block mb-1">PVTG Students Covered</span>
          <div className="text-2xl sm:text-3xl font-black text-brand-crimson">
            {(unreached?.pvtg_students_supported || 18450).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-brand-gold font-semibold mt-1 block">Particularly Vulnerable Groups</span>
        </div>
      </div>

      {/* CHARTS ROW 1: SCHEME DISTRIBUTION & MONTHLY DISBURSEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme Distribution Donut Chart */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-brand-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Scholarship Scheme Allocation</h3>
              <p className="text-xs text-slate-400">Distribution of beneficiaries across 5 central schemes</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
              FY 2024-25
            </span>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={schemeDist}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {schemeDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SCHEME_COLORS[index % SCHEME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${Number(val).toLocaleString('en-IN')} Beneficiaries`, 'Count']}
                  contentStyle={{ background: '#161926', borderColor: '#2a2f47', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: '#cbd5e1', fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Disbursement Area Chart */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-brand-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Monthly DBT Disbursement Trend</h3>
              <p className="text-xs text-slate-400">Total funds credited directly to student bank accounts (₹ in Lakhs)</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
              PFMS / NPCI
            </span>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="disbursedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5a623" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f47" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')} Lakhs`, 'Amount Disbursed']}
                  contentStyle={{ background: '#161926', borderColor: '#2a2f47', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="amount_lakhs" stroke="#f5a623" strokeWidth={2.5} fillOpacity={1} fill="url(#disbursedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2: STATE-WISE BENEFICIARIES BAR CHART */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">State-Wise ST Beneficiaries & Financial Outlay</h3>
            <p className="text-xs text-slate-400">Comparing top tribal states in scholarship distribution</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-3 h-3 rounded-full bg-brand-crimson inline-block" />
            <span>Beneficiaries</span>
          </div>
        </div>

        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateStats} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f47" vertical={false} />
              <XAxis dataKey="state" stroke="#94a3b8" fontSize={11} angle={-15} textAnchor="end" />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                formatter={(val, name) => [
                  name === 'beneficiaries' ? `${Number(val).toLocaleString('en-IN')} Students` : `₹${val} Cr`,
                  name === 'beneficiaries' ? 'Beneficiaries' : 'Amount (Cr)'
                ]}
                contentStyle={{ background: '#161926', borderColor: '#2a2f47', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="beneficiaries" fill="#e94560" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* UNREACHED TRIBAL STUDENTS OUTREACH METRIC */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-gold/40 bg-gradient-to-br from-brand-surface to-amber-950/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Unreached ST Student Saturation Mission</h3>
              <p className="text-xs text-slate-300">Ministry target: 100% saturation in remote forest & tribal blocks</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-brand-gold">{unreached?.coverage_percentage || 53.7}%</div>
            <div className="text-[11px] text-slate-400">Saturation Achieved</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-brand-border">
          <div
            className="h-full bg-gradient-to-r from-brand-crimson via-brand-gold to-brand-emerald rounded-full"
            style={{ width: `${unreached?.coverage_percentage || 53.7}%` }}
          />
        </div>

        {/* High-priority remote district table */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            High-Priority Remote Tribal Districts Tracking
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {(unreached?.high_priority_districts || []).map((dist, i) => (
              <div key={i} className="p-3 rounded-xl bg-brand-dark/70 border border-brand-border text-xs space-y-1">
                <div className="font-bold text-white">{dist.district}</div>
                <div className="text-[11px] text-slate-400">{dist.state}</div>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-brand-gold">ST Pop: {dist.st_population_pct}%</span>
                  <span className="text-brand-emerald font-semibold">{dist.coverage} Reach</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
