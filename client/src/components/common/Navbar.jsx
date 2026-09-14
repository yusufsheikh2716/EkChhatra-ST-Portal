import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const { user, logout, loginDemo } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleDemoClick = async () => {
    const res = await loginDemo();
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-purple/80 backdrop-blur-xl border-b border-brand-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-crimson via-brand-gold to-brand-emerald p-0.5 shadow-lg shadow-rose-950/40 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-brand-dark rounded-[14px] flex items-center justify-center">
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-crimson">
                एक
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-brand-gold transition-colors">
                EkChhatra
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/30">
                MoTA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 tracking-wide hidden sm:block">
              Unified ST Scholarship Portal
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive('/') ? 'text-brand-gold bg-brand-card border border-brand-gold/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Home
          </Link>

          {user && (
            <>
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/dashboard') ? 'text-brand-gold bg-brand-card border border-brand-gold/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/apply"
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/apply') ? 'text-brand-gold bg-brand-card border border-brand-gold/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Apply
              </Link>
              <Link
                to="/documents"
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/documents') ? 'text-brand-gold bg-brand-card border border-brand-gold/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Documents
              </Link>
            </>
          )}

          <Link
            to="/analytics"
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive('/analytics') ? 'text-brand-gold bg-brand-card border border-brand-gold/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Analytics & Impact
          </Link>

          <Link
            to="/chat"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive('/chat') ? 'text-brand-gold bg-brand-card border border-brand-gold/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
            <span>JAGO AI</span>
          </Link>
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2.5 rounded-xl bg-brand-card border border-brand-border text-slate-300 hover:text-white transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-crimson text-[10px] font-extrabold text-white flex items-center justify-center ring-2 ring-brand-purple animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-brand-crimson/20 text-brand-crimson px-2 py-0.5 rounded-full border border-brand-crimson/30">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-brand-gold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2.5">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.is_read) markAsRead(n.id);
                            if (n.link) navigate(n.link);
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.is_read
                              ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                              : 'bg-brand-crimson/10 border-brand-crimson/30 text-white font-medium shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-white">{n.title}</span>
                            {!n.is_read && (
                              <span className="w-2 h-2 rounded-full bg-brand-crimson mt-1 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-brand-border text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-semibold text-brand-crimson hover:text-white transition-colors"
                    >
                      View All Notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-all"
              >
                <img
                  src={user.profile_picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-gold"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white truncate max-w-[110px]">{user.name}</div>
                  <div className="text-[10px] text-brand-gold font-mono uppercase tracking-wider">ST Student</div>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="p-3 border-b border-brand-border/70 mb-2">
                    <div className="text-xs font-bold text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Aadhaar: XXXX-XXXX-{user.aadhaar_last4}</span>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-brand-gold" />
                    <span>My ST Profile</span>
                  </Link>
                  <Link
                    to="/documents"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <FileText className="w-4 h-4 text-brand-crimson" />
                    <span>Document Wallet</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDemoClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-gold/15 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-dark transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Student</span>
              </button>

              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-crimson to-brand-gold hover:brightness-110 transition-all shadow-lg shadow-rose-950/40"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-brand-card border border-brand-border text-slate-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-surface border-b border-brand-border px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Apply for Schemes
              </Link>
              <Link
                to="/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Document Wallet
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                My Profile
              </Link>
            </>
          )}
          <Link
            to="/analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Analytics & Impact
          </Link>
          <Link
            to="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-brand-gold hover:bg-slate-800"
          >
            JAGO Assistant
          </Link>

          {!user && (
            <div className="pt-3 border-t border-brand-border flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDemoClick();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-gold text-brand-dark"
              >
                1-Click Demo Login (Birsa Munda)
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
