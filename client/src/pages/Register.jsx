import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  Building, 
  Award, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import GhostFibers from '../components/reactbits/GhostFibers';
import ParticleText from '../components/reactbits/ParticleText';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: 'Male',
    aadhaar_number: '',
    state: 'Jharkhand',
    district: '',
    // Step 2: Academic
    education_level: 'Undergraduate',
    institution_name: '',
    institution_code: '',
    current_year: '1st Year',
    percentage: 75.0,
    // Step 3: Category & Income
    st_certificate_no: '',
    is_pvtg: false,
    family_income: 180000,
    is_bpl: false,
    has_disability: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSimulateAadhaarVerify = async () => {
    if (!formData.aadhaar_number || formData.aadhaar_number.length < 12) {
      toast.error('Please enter a valid 12-digit Aadhaar number first');
      return;
    }
    setVerifyingAadhaar(true);
    try {
      const res = await axiosClient.post('/api/verify/aadhaar', {
        aadhaar_number: formData.aadhaar_number
      });
      if (res.data.success) {
        setAadhaarVerified(true);
        toast.success('UIDAI e-KYC Identity & Bank Seeding Authenticated!');
      }
    } catch (err) {
      toast.error('Aadhaar verification failed');
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.aadhaar_number) {
        toast.error('Please fill all required personal fields');
        return;
      }
    }
    if (step === 2) {
      if (!formData.institution_name) {
        toast.error('Please enter your school or college name');
        return;
      }
    }
    setStep((prev) => Math.min(3, prev + 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      percentage: Number(formData.percentage) || 0,
      family_income: Number(formData.family_income) || 0
    };

    const res = await register(payload);
    setSubmitting(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* GhostFibers Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GhostFibers
          lineColor="#1a1a2e"
          glowColor="#0f3460"
          speed={0.12}
          layers={4}
          brightness={2.0}
          grain={0.04}
        />
      </div>

      {/* Registration Card at z-10 */}
      <div className="relative z-10 w-full max-w-xl glass-card p-6 sm:p-8 rounded-3xl border border-brand-border shadow-2xl backdrop-blur-2xl my-6">
        <div className="w-full h-20 flex items-center justify-center -mb-2">
          <ParticleText
            text="Join EkChhatra"
            color="#f5a623"
            highlightColor="#10b981"
            fontSize="clamp(1.8rem, 6vw, 2.5rem)"
            fontWeight={800}
            density={2.5}
          />
        </div>

        <p className="text-center text-xs text-slate-400 mb-6">
          Single Registration • 5 Ministry of Tribal Affairs Schemes
        </p>

        {/* 3-Step Animated Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className={step >= 1 ? 'text-brand-gold' : 'text-slate-500'}>1. Personal</span>
            <span className={step >= 2 ? 'text-brand-gold' : 'text-slate-500'}>2. Academic</span>
            <span className={step >= 3 ? 'text-brand-gold' : 'text-slate-500'}>3. ST Category & Income</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-crimson via-brand-gold to-brand-emerald transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : handleNext}>
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name (as on Aadhaar) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Birsa Munda"
                    className="w-full bg-brand-dark/70 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@example.com"
                      className="w-full bg-brand-dark/70 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-brand-dark/70 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Aadhaar Number with simulated e-KYC */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    12-Digit Aadhaar Number *
                  </label>
                  <span className="text-[10px] text-brand-emerald flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Only last 4 digits saved in DB (Privacy Preserved)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={14}
                    name="aadhaar_number"
                    value={formData.aadhaar_number}
                    onChange={handleChange}
                    placeholder="XXXX XXXX 4821"
                    className="flex-1 bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                  <button
                    type="button"
                    onClick={handleSimulateAadhaarVerify}
                    disabled={verifyingAadhaar || aadhaarVerified}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      aadhaarVerified
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-brand-card hover:bg-slate-700 text-brand-gold border-brand-border'
                    }`}
                  >
                    {verifyingAadhaar ? (
                      <span>Checking...</span>
                    ) : aadhaarVerified ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>e-KYC Verified</span>
                      </>
                    ) : (
                      <span>Verify e-KYC</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Home State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  >
                    {['Jharkhand', 'Odisha', 'Madhya Pradesh', 'Chhattisgarh', 'Rajasthan', 'Gujarat', 'Assam', 'Maharashtra'].map((st) => (
                      <option key={st} value={st} className="bg-brand-surface">{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Ranchi"
                    className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Education Level</label>
                <select
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                >
                  <option value="Class 9" className="bg-brand-surface">Class 9 (Pre-Matric)</option>
                  <option value="Class 10" className="bg-brand-surface">Class 10 (Pre-Matric)</option>
                  <option value="Class 11" className="bg-brand-surface">Class 11 (Post-Matric)</option>
                  <option value="Class 12" className="bg-brand-surface">Class 12 (Post-Matric)</option>
                  <option value="Undergraduate" className="bg-brand-surface">Undergraduate (B.Tech, MBBS, B.Sc, BA, etc.)</option>
                  <option value="Postgraduate" className="bg-brand-surface">Postgraduate (M.Tech, MBA, M.Sc, MA, etc.)</option>
                  <option value="PhD" className="bg-brand-surface">Ph.D. / Research Fellowship (NFST)</option>
                  <option value="Overseas" className="bg-brand-surface">Overseas Masters / Ph.D. (NOS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Institution Name *</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    name="institution_name"
                    value={formData.institution_name}
                    onChange={handleChange}
                    placeholder="e.g. National Institute of Technology (NIT) Jamshedpur"
                    className="w-full bg-brand-dark/70 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Institution Code (AISHE/UDISE)</label>
                  <input
                    type="text"
                    name="institution_code"
                    value={formData.institution_code}
                    onChange={handleChange}
                    placeholder="e.g. NITJSR-083"
                    className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Qualifying Score (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleChange}
                    placeholder="78.5"
                    className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ST Category & Income */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ST Caste Certificate Number
                </label>
                <div className="relative">
                  <FileCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="st_certificate_no"
                    value={formData.st_certificate_no}
                    onChange={handleChange}
                    placeholder="e.g. ST/JH/2024/88124"
                    className="w-full bg-brand-dark/70 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  name="family_income"
                  value={formData.family_income}
                  onChange={handleChange}
                  placeholder="180000"
                  className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Must be supported by Tehsildar / Revenue Authority income certificate.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-dark/50 border border-brand-border space-y-3 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_pvtg"
                    checked={formData.is_pvtg}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-crimson focus:ring-brand-gold bg-slate-800 border-slate-700"
                  />
                  <div>
                    <span className="font-semibold text-white">Particularly Vulnerable Tribal Group (PVTG)</span>
                    <p className="text-[10px] text-slate-400">Special priority and income threshold relaxation applies.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_bpl"
                    checked={formData.is_bpl}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-crimson focus:ring-brand-gold bg-slate-800 border-slate-700"
                  />
                  <span className="text-white">BPL Card Holder (Below Poverty Line)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_disability"
                    checked={formData.has_disability}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand-crimson focus:ring-brand-gold bg-slate-800 border-slate-700"
                  />
                  <span className="text-white">Person with Benchmark Disability (PwD)</span>
                </label>
              </div>
            </div>
          )}

          {/* Nav Controls */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-brand-border/60">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((p) => p - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-crimson to-brand-gold hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-rose-950/40 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span>Registering...</span>
              ) : step === 3 ? (
                <>
                  <span>Complete & Auto Login</span>
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-brand-gold font-semibold hover:underline">
            Sign In to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
