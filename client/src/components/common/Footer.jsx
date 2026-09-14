import React from 'react';
import { ExternalLink, ShieldCheck, Heart, Award } from 'lucide-react';
import { GOV_LINKS } from '../../utils/constants';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0d14] border-t border-brand-border/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-border/60">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-crimson to-brand-gold p-0.5 shadow-md">
                <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center font-black text-brand-gold text-base">
                  एक
                </div>
              </div>
              <span className="text-lg font-extrabold text-white">EkChhatra</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              One Unified Central Gateway for Scheduled Tribe (ST) Students. 
              Empowering tribal students from school to international doctoral research by bridging 5 Ministry of Tribal Affairs schemes into one intuitive portal.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Benefit Transfer (DBT) Ready</span>
            </div>
          </div>

          {/* Central Ministry Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Ministry & Portals
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={GOV_LINKS.MOTA.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>Ministry of Tribal Affairs</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
              <li>
                <a
                  href={GOV_LINKS.NSP.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>National Scholarship Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
              <li>
                <a
                  href={GOV_LINKS.NFST.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>Canara Bank SFMP (NFST)</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
              <li>
                <a
                  href={GOV_LINKS.NOS.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>National Overseas Portal (NOS)</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
            </ul>
          </div>

          {/* Verification Ecosystem */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Digital Verification
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={GOV_LINKS.DIGILOCKER.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>DigiLocker Verification</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
              <li>
                <a
                  href={GOV_LINKS.UIDAI.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>UIDAI Aadhaar Seeding</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
              <li>
                <a
                  href={GOV_LINKS.APAAR.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>APAAR / ABC Student ID</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
              <li>
                <a
                  href={GOV_LINKS.AISHE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>AISHE College Registry</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Bodies */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Academic Authorities
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={GOV_LINKS.UDISE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>UDISE+ School Registry</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
              <li>
                <a
                  href={GOV_LINKS.UGC.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>UGC Recognition</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold" />
                </a>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Toll-Free ST Helpline:
                <div className="font-semibold text-white mt-0.5">1800-11-2001</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer and Notice */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} EkChhatra. Designed for Scheduled Tribe Students of India.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Prototype Note: UIDAI e-KYC & State ST Registry verification queries are simulated for demonstration.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
