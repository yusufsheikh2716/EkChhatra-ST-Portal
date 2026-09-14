import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award, 
  Building, 
  FileText, 
  Edit3, 
  Save, 
  CheckCircle 
} from 'lucide-react';
import ParticleText from '../components/reactbits/ParticleText';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    gender: user?.gender || 'Male',
    state: user?.state || 'Jharkhand',
    district: user?.district || 'Ranchi',
    education_level: user?.education_level || 'Undergraduate',
    institution_name: user?.institution_name || '',
    institution_code: user?.institution_code || '',
    percentage: user?.percentage || 78.5,
    st_certificate_no: user?.st_certificate_no || '',
    is_pvtg: user?.is_pvtg || false,
    family_income: user?.family_income || 180000,
    profile_picture: user?.profile_picture || AVATARS[0]
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axiosClient.put('/api/auth/profile', formData);
      updateUser(res.data);
      setEditing(false);
      toast.success('ST Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header with ParticleText */}
      <div className="text-center">
        <div className="w-full h-20 sm:h-24 flex items-center justify-center">
          <ParticleText
            text="Student Profile"
            color="#f5a623"
            highlightColor="#10b981"
            fontSize="clamp(2rem, 6vw, 3rem)"
            fontWeight={900}
            density={2.5}
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto -mt-2">
          Manage your verified tribal identity, academic credentials, and income details.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border space-y-6">
        {/* Top Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-brand-border/60">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={formData.profile_picture}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-gold shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/30">
                  ST Beneficiary
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{user?.email}</div>
              <div className="text-xs text-brand-emerald font-mono mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Masked Aadhaar: XXXX-XXXX-{user?.aadhaar_last4}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-surface border border-brand-border hover:border-brand-gold text-white transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-brand-gold" />
            <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Avatar Selection (in edit mode) */}
        {editing && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-brand-border space-y-2">
            <span className="text-xs font-semibold text-slate-300">Choose Profile Avatar:</span>
            <div className="flex items-center gap-3">
              {AVATARS.map((av, idx) => (
                <img
                  key={idx}
                  src={av}
                  alt={`Avatar ${idx}`}
                  onClick={() => setFormData({ ...formData, profile_picture: av })}
                  className={`w-12 h-12 rounded-xl object-cover cursor-pointer transition-all ${
                    formData.profile_picture === av ? 'ring-2 ring-brand-gold scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Details Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Full Name</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-white disabled:opacity-75 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-white disabled:opacity-75 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Home State</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-white disabled:opacity-75 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">District</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-white disabled:opacity-75 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Institution Name</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.institution_name}
                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-white disabled:opacity-75 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Education Level</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.education_level}
                onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-white disabled:opacity-75 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">ST Certificate Number</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.st_certificate_no}
                onChange={(e) => setFormData({ ...formData, st_certificate_no: e.target.value })}
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-white font-mono disabled:opacity-75 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Annual Family Income (₹)</label>
              <input
                type="number"
                disabled={!editing}
                value={formData.family_income}
                onChange={(e) => setFormData({ ...formData, family_income: Number(e.target.value) })}
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-white font-mono disabled:opacity-75 focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {editing && (
            <div className="flex justify-end pt-4 border-t border-brand-border/60">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-crimson to-brand-gold text-white font-bold text-xs shadow-lg shadow-rose-950/40 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
