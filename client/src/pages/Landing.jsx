import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  School,
  GraduationCap,
  Plane,
  Compass,
  FileCheck
} from 'lucide-react';
import GhostFibers from '../components/reactbits/GhostFibers';
import ParticleText from '../components/reactbits/ParticleText';
import { SCHEME_DETAILS, GOV_LINKS } from '../utils/constants';
import { formatINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const Landing = () => {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [liveSchemes, setLiveSchemes] = useState([]);

  useEffect(() => {
    axiosClient.get('/api/scholarships')
      .then((res) => setLiveSchemes(res.data))
      .catch(() => {});
  }, []);

  const handleDemoClick = async () => {
    const res = await loginDemo();
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const schemeKeys = ['PRE_MATRIC', 'POST_MATRIC', 'TOP_CLASS', 'NFST', 'NOS'];

  return (
    <div className="relative w-full overflow-hidden bg-brand-dark">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        {/* GhostFibers WebGL Shader Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <GhostFibers
            lineColor="#1a1a2e"
            glowColor="#e94560"
            speed={0.15}
            layers={5}
            brightness={2.5}
            blueBoost={1.4}
            grain={0.05}
          />
        </div>

        {/* Hero Foreground Content at z-10 */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Central Ministry Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-surface/80 border border-brand-gold/40 text-brand-gold text-xs font-semibold backdrop-blur-md shadow-lg shadow-black/40">
            <ShieldCheck className="w-4 h-4 text-brand-emerald" />
            <span>Ministry of Tribal Affairs (MoTA) • Central Initiative</span>
          </div>

          {/* Primary Heading with ParticleText Canvas */}
          <div className="w-full h-32 sm:h-44 md:h-52 flex items-center justify-center">
            <ParticleText
              text="EkChhatra"
              color="#f5a623"
              highlightColor="#e94560"
              fontSize="clamp(3.5rem, 13vw, 8.5rem)"
              fontWeight={900}
              density={3.5}
            />
          </div>

          {/* Subtitle with ParticleText */}
          <div className="w-full h-16 sm:h-20 flex items-center justify-center -mt-2">
            <ParticleText
              text="One App. Every Scheme. Every Student."
              color="#ffffff"
              highlightColor="#10b981"
              fontSize="clamp(1.1rem, 3.8vw, 2.2rem)"
              fontWeight={700}
              density={2.5}
            />
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
            India's unified central scholarship gateway for Scheduled Tribe (ST) students. 
            Consolidating 5 major MoTA schemes — from school pre-matriculation to premier institutes and international Ph.D. fellowships.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-crimson to-brand-gold text-white font-extrabold text-sm shadow-xl shadow-rose-950/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Go to My Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-crimson to-brand-gold text-white font-extrabold text-sm shadow-xl shadow-rose-950/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>Register for Scholarship</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleDemoClick}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-brand-surface/90 hover:bg-slate-800 text-brand-gold border border-brand-gold/40 font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <span>1-Click Demo Login (Birsa Munda)</span>
                </button>
              </>
            )}

            <a
              href="#schemes"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-brand-border transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore 5 Schemes</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-2xl text-center border-brand-border/60">
              <div className="text-xl sm:text-2xl font-black text-brand-gold">₹4,820 Cr+</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Disbursed via Direct Benefit (DBT)</div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center border-brand-border/60">
              <div className="text-xl sm:text-2xl font-black text-brand-crimson">1,40,000+</div>
              <div className="text-[11px] text-slate-400 mt-0.5">ST Beneficiaries Reached</div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center border-brand-border/60">
              <div className="text-xl sm:text-2xl font-black text-brand-emerald">98.4%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">DigiLocker Verification Rate</div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center border-brand-border/60">
              <div className="text-xl sm:text-2xl font-black text-white">5 Schemes</div>
              <div className="text-[11px] text-slate-400 mt-0.5">One Unified Application</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-brand-border/60">
        <div className="text-center mb-12">
          <div className="w-full h-20 flex items-center justify-center">
            <ParticleText
              text="How It Works"
              color="#ffffff"
              highlightColor="#f5a623"
              fontSize="clamp(2rem, 6vw, 3.5rem)"
              fontWeight={800}
              density={2.5}
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto -mt-2">
            Eliminating paperwork and multiple portal visits with modern digital verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Aadhaar e-KYC Sign Up',
              desc: 'One-time registration using Aadhaar. Your identity and bank seeding are verified instantly.',
              icon: ShieldCheck,
              color: 'text-brand-gold'
            },
            {
              step: '02',
              title: 'Auto-Eligibility Check',
              desc: 'EkChhatra evaluates your academic year, marks, and income to show exact matching schemes.',
              icon: Compass,
              color: 'text-brand-crimson'
            },
            {
              step: '03',
              title: 'DigiLocker ST Wallet',
              desc: 'Store your ST Caste, Income, and Marksheets once. Reuse across any scholarship with 1-click.',
              icon: FileCheck,
              color: 'text-brand-emerald'
            },
            {
              step: '04',
              title: 'Direct DBT to Account',
              desc: 'Track Institute, District, and State approvals live. Receive funds directly via NPCI Aadhaar bridge.',
              icon: Award,
              color: 'text-cyan-400'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden group border-brand-border"
              >
                <div className="text-4xl font-black text-slate-800/70 absolute top-4 right-4 group-hover:text-brand-gold/20 transition-colors">
                  {item.step}
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-slate-800/80 border border-brand-border flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5 CENTRAL SCHEMES (Interactive 3D Flip Cards & Official Links) */}
      <section id="schemes" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-brand-border/60">
        <div className="text-center mb-12">
          <div className="w-full h-20 flex items-center justify-center">
            <ParticleText
              text="Our Schemes"
              color="#e94560"
              highlightColor="#f5a623"
              fontSize="clamp(2rem, 6vw, 3.5rem)"
              fontWeight={800}
              density={2.5}
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto -mt-2">
            5 centrally administered Ministry of Tribal Affairs (MoTA) scholarship schemes. 
            Hover over cards for benefits or click to apply directly on verified government gateways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemeKeys.map((code) => {
            const scheme = SCHEME_DETAILS[code];
            const liveSch = liveSchemes.find((s) => s.code === code);

            return (
              <div
                key={code}
                className="perspective-1000 group h-[360px]"
              >
                <div className="relative w-full h-full duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                  {/* FRONT OF CARD */}
                  <div className="absolute inset-0 w-full h-full backface-hidden glass-card p-6 rounded-3xl flex flex-col justify-between border border-brand-border bg-gradient-to-b from-brand-card to-brand-surface">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                          {scheme.tag}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{code}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white leading-snug mb-2">
                        {scheme.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                        {liveSch?.description || 'Government assistance for tribal students.'}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-brand-border/60 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Target Level:</span>
                        <strong className="text-white">{scheme.classRange}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Income Limit:</span>
                        <strong className="text-brand-emerald">{scheme.incomeCap}</strong>
                      </div>
                      <div className="text-[11px] text-brand-gold pt-1 flex items-center justify-between font-medium">
                        <span>Hover to view benefits</span>
                        <span>⇄</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK OF CARD (FLIP) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 glass-card p-6 rounded-3xl flex flex-col justify-between border border-brand-crimson/50 bg-gradient-to-b from-[#1c1228] to-[#121626]">
                    <div>
                      <div className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                        Benefit Package
                      </div>
                      <div className="p-3 rounded-2xl bg-brand-crimson/10 border border-brand-crimson/30 text-white text-xs font-semibold mb-3 leading-relaxed">
                        {scheme.benefits}
                      </div>

                      <div className="text-xs text-slate-300 space-y-1.5">
                        <div className="font-semibold text-white">Official Gateway:</div>
                        <div className="text-[11px] text-slate-400">{scheme.portalName}</div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <button
                        onClick={() => setSelectedScheme(liveSch || scheme)}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors border border-slate-700"
                      >
                        Learn More Criteria
                      </button>

                      <a
                        href={scheme.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-crimson to-brand-gold text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40 hover:brightness-110 transition-all"
                      >
                        <span>Apply on Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* IMPACT & SUCCESS STORIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-brand-border/60">
        <div className="text-center mb-12">
          <div className="w-full h-20 flex items-center justify-center">
            <ParticleText
              text="Impact Stories"
              color="#10b981"
              highlightColor="#f5a623"
              fontSize="clamp(2rem, 6vw, 3.5rem)"
              fontWeight={800}
              density={2.5}
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto -mt-2">
            Real tribal student voices empowered across 8 Indian states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Birsa Munda',
              role: 'B.Tech Student, NIT Jamshedpur',
              quote: 'Top Class Education covered my entire tuition fees and provided a ₹45,000 laptop grant. I could focus entirely on software engineering without worrying about family debt.',
              tag: 'Top Class Education',
              state: 'Jharkhand'
            },
            {
              name: 'Dr. Sunita Murmu',
              role: 'Ph.D. Scholar, IIT Delhi',
              quote: 'The NFST Fellowship ensured my monthly stipend of ₹35,000 reached my account consistently via DBT. It gave me the freedom to conduct high-end tribal ethnobotanical research.',
              tag: 'NFST Fellowship',
              state: 'Odisha'
            },
            {
              name: 'Rohan Meena',
              role: 'M.S. in Data Science, University of Edinburgh',
              quote: 'The National Overseas Scholarship (NOS) turned an impossible dream into reality. From London airfare to university fees, MoTA supported every step of my international degree.',
              tag: 'National Overseas Scholarship',
              state: 'Rajasthan'
            }
          ].map((t, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border-brand-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/30">
                  {t.tag}
                </span>
                <p className="text-xs text-slate-200 mt-4 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-brand-border/60">
                <div className="text-sm font-bold text-white">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.role}</div>
                <div className="text-[10px] text-brand-gold mt-0.5">{t.state}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LEARN MORE MODAL */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setSelectedScheme(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-brand-gold/20 text-brand-gold uppercase">
              {selectedScheme.code}
            </span>
            <h3 className="text-lg font-bold text-white mt-2 mb-3">
              {selectedScheme.name || selectedScheme.title}
            </h3>

            <div className="text-xs text-slate-300 space-y-3 mb-6">
              <div className="bg-brand-card p-3 rounded-xl border border-brand-border">
                <strong className="text-white block mb-1">Key Benefit Summary:</strong>
                <p className="text-brand-gold">{selectedScheme.benefit_summary || selectedScheme.benefits}</p>
              </div>

              <div>
                <strong className="text-white block mb-1">Eligible Education Levels:</strong>
                <p className="text-slate-400">
                  {Array.isArray(selectedScheme.education_levels)
                    ? selectedScheme.education_levels.join(', ')
                    : selectedScheme.classRange}
                </p>
              </div>

              <div>
                <strong className="text-white block mb-1">Required Documents:</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li>Valid Scheduled Tribe (ST) Caste Certificate</li>
                  <li>Family Annual Income Certificate</li>
                  <li>Previous Academic Marksheets</li>
                  <li>Aadhaar Seeded Bank Passbook</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedScheme(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-white"
              >
                Close
              </button>
              <Link
                to={`/apply?scheme=${selectedScheme.code}`}
                className="w-full py-2.5 rounded-xl bg-brand-crimson text-xs font-bold text-white text-center hover:bg-rose-600 shadow-lg shadow-rose-950/40"
              >
                Start EkChhatra Application
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
