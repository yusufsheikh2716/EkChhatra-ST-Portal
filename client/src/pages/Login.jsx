import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import GhostFibers from '../components/reactbits/GhostFibers';
import ParticleText from '../components/reactbits/ParticleText';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const handleFillDemo = async () => {
    setEmail('demo@ekchhatra.in');
    setPassword('demo123');
    setSubmitting(true);
    const res = await loginDemo();
    setSubmitting(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-[88vh] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* GhostFibers WebGL Shader Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GhostFibers
          lineColor="#0f3460"
          glowColor="#e94560"
          speed={0.1}
          layers={3}
          brightness={1.8}
          blueBoost={1.2}
          grain={0.04}
        />
      </div>

      {/* Login Card at z-10 */}
      <div className="relative z-10 w-full max-w-md glass-card p-6 sm:p-8 rounded-3xl border border-brand-border shadow-2xl backdrop-blur-2xl">
        {/* ParticleText Header Container with explicit height */}
        <div className="w-full h-24 flex items-center justify-center -mb-2">
          <ParticleText
            text="Welcome Back"
            color="#f5a623"
            highlightColor="#e94560"
            fontSize="clamp(1.8rem, 6vw, 2.5rem)"
            fontWeight={800}
            density={2.5}
          />
        </div>

        <p className="text-center text-xs text-slate-400 mb-6 -mt-2">
          Access your Unified ST Scholarship Dashboard
        </p>

        {/* 1-Click Demo Fill Banner */}
        <button
          type="button"
          onClick={handleFillDemo}
          disabled={submitting}
          className="w-full mb-6 p-3 rounded-2xl bg-gradient-to-r from-brand-gold/15 to-amber-500/10 border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center justify-between text-xs font-bold shadow-md group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-gold group-hover:text-brand-dark transition-colors" />
            <span>Use Demo Account (Birsa Munda)</span>
          </div>
          <span className="text-[10px] font-mono opacity-80 group-hover:opacity-100">1-Click Auto-Fill →</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. demo@ekchhatra.in"
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-brand-crimson to-brand-gold hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to EkChhatra</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-brand-border/60 text-center text-xs text-slate-400">
          First time on EkChhatra?{' '}
          <Link to="/register" className="text-brand-gold font-semibold hover:underline">
            Register Student Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
