import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import ParticleText from '../components/reactbits/ParticleText';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../utils/formatters';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.is_read;
    if (filter === 'READ') return n.is_read;
    return true;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Container with ParticleText */}
      <div className="text-center">
        <div className="w-full h-20 sm:h-24 flex items-center justify-center">
          <ParticleText
            text="Notifications"
            color="#f5a623"
            highlightColor="#10b981"
            fontSize="clamp(2rem, 6vw, 3rem)"
            fontWeight={900}
            density={2.5}
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto -mt-2">
          Real-time updates on scrutiny, DBT credits, and Ministry notifications.
        </p>
      </div>

      {/* Control Strip */}
      <div className="glass-card p-4 rounded-2xl border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['ALL', 'UNREAD', 'READ'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-brand-gold text-brand-dark'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f.toLowerCase()}
            </button>
          ))}
        </div>

        <button
          onClick={markAllAsRead}
          className="text-xs text-brand-gold hover:underline font-semibold flex items-center gap-1.5 self-start sm:self-center"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-brand-border text-center space-y-2 text-slate-400">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-white">No notifications in this filter</div>
            <div className="text-xs">You're all caught up with your scholarship updates!</div>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (!item.is_read) markAsRead(item.id);
                if (item.link) navigate(item.link);
              }}
              className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all ${
                item.is_read
                  ? 'border-brand-border/60 text-slate-300'
                  : 'bg-brand-crimson/10 border-brand-crimson/40 text-white shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.notif_type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.notif_type === 'warning'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {item.notif_type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : item.notif_type === 'warning' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      {!item.is_read && (
                        <span className="text-[9px] font-bold px-2 py-0.2 bg-brand-crimson text-white rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                  {formatDate(item.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
