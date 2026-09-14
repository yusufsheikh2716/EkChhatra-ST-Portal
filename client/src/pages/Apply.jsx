import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Camera, 
  Upload, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import ParticleText from '../components/reactbits/ParticleText';
import ConflictModal from '../components/common/ConflictModal';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const STEPS = [
  'Scheme Selection',
  'Student Demographics',
  'Academic Verification',
  'Document Attachment',
  'Review & Submit'
];

const Apply = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedSchemeCode = searchParams.get('scheme');

  const [currentStep, setCurrentStep] = useState(1);
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [userDocs, setUserDocs] = useState([]);
  const [selectedDocIds, setSelectedDocIds] = useState([]);
  const [conflictData, setConflictData] = useState(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    course_name: 'B.Tech Computer Science & Engineering',
    academic_year: '2024-2025',
    annual_tuition_fee: 125000,
    hostel_fee: 36000,
    bank_account_no: '3819201948291',
    ifsc_code: 'SBIN0001234',
    bank_name: 'State Bank of India',
    declaration_accepted: true
  });

  // OCR modal state
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    // Fetch schemes
    axiosClient.get('/api/scholarships')
      .then((res) => {
        setSchemes(res.data || []);
        if (preselectedSchemeCode) {
          const match = res.data.find((s) => s.code === preselectedSchemeCode);
          if (match) setSelectedSchemeId(match.id);
        } else if (res.data.length > 0) {
          setSelectedSchemeId(res.data[0].id);
        }
      })
      .catch(() => {});

    // Fetch user documents in wallet
    if (user) {
      axiosClient.get('/api/documents')
        .then((res) => {
          setUserDocs(res.data || []);
          // Auto select verified docs
          const verified = (res.data || []).filter((d) => d.is_verified).map((d) => d.id);
          setSelectedDocIds(verified);
        })
        .catch(() => {});
    }
  }, [user, preselectedSchemeCode]);

  const handleSchemeSelect = async (id) => {
    setSelectedSchemeId(id);
    // Pre-check conflict
    try {
      const res = await axiosClient.post('/api/applications/check-conflict', null, {
        params: { scholarship_id: id }
      });
      if (res.data.has_conflict) {
        setConflictData(res.data);
        setShowConflictModal(true);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleDocToggle = (docId) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleOCRScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await axiosClient.post('/api/verify/ocr', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success(`Scanned: ${res.data.document_type} authenticated!`);
      } else {
        toast('OCR scanned with fallback. Details noted.');
      }
    } catch (err) {
      toast.error('OCR service fallback applied.');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!formData.declaration_accepted) {
      toast.error('Please accept the declaration before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        scholarship_id: selectedSchemeId,
        form_data: formData,
        selected_documents: selectedDocIds
      };

      const res = await axiosClient.post('/api/applications', payload);
      setSubmissionSuccess(res.data);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      toast.success('Scholarship Application Submitted Successfully!');
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictData({
          message: err.response.data.detail,
          can_proceed_override: true
        });
        setShowConflictModal(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId);

  // Success Screen
  if (submissionSuccess) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-brand-emerald/40 max-w-lg w-full text-center space-y-6 animate-fade-in shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-brand-emerald/20 border border-brand-emerald/40 flex items-center justify-center text-brand-emerald mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider">
              Application ID Generated
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono text-brand-gold">
              {submissionSuccess.application_id}
            </h2>
            <p className="text-xs text-slate-300 mt-2">
              Your application for <strong className="text-white">{selectedScheme?.name}</strong> has been forwarded to the Institute Nodal Officer for first-level verification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-dark/60 border border-brand-border text-left text-xs space-y-1.5 text-slate-300">
            <div><strong className="text-white">Applicant:</strong> {user?.name}</div>
            <div><strong className="text-white">Aadhaar Linked:</strong> XXXX-XXXX-{user?.aadhaar_last4}</div>
            <div><strong className="text-white">Status:</strong> Submitted (Step 1 of 6)</div>
            <div><strong className="text-white">Timestamp:</strong> {new Date().toLocaleString('en-IN')}</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-crimson to-brand-gold text-white font-bold text-xs shadow-lg shadow-rose-950/40"
            >
              Go to Tracker on Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header Container with ParticleText Heading */}
      <div className="text-center">
        <div className="w-full h-20 sm:h-24 flex items-center justify-center">
          <ParticleText
            text="Apply for Scholarship"
            color="#f5a623"
            highlightColor="#e94560"
            fontSize="clamp(2rem, 6vw, 3rem)"
            fontWeight={900}
            density={2.5}
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto -mt-2">
          5-step unified application with automated conflict prevention and instant document reuse.
        </p>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="glass-card p-4 rounded-2xl border-brand-border">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {STEPS.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-brand-emerald text-brand-dark'
                      : isCurrent
                      ? 'bg-brand-gold text-brand-dark ring-4 ring-brand-gold/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </div>
                <span className={`text-xs font-semibold whitespace-nowrap ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                  {s}
                </span>
                {idx < STEPS.length - 1 && <span className="text-slate-600 text-xs hidden sm:inline">→</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: SCHEME SELECTION */}
      {currentStep === 1 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-white mb-2">Step 1: Select MoTA Scholarship Scheme</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => handleSchemeSelect(scheme.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedSchemeId === scheme.id
                    ? 'bg-brand-crimson/15 border-brand-crimson ring-2 ring-brand-crimson/30 shadow-lg'
                    : 'bg-slate-900/50 border-brand-border hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold font-mono text-brand-gold uppercase">{scheme.code}</span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Deadline: {scheme.application_deadline || 'Open'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{scheme.name}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {scheme.description}
                </p>
                <div className="text-[11px] font-semibold text-brand-emerald">
                  {scheme.benefit_summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: DEMOGRAPHICS (Pre-filled from Profile) */}
      {currentStep === 2 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Step 2: Verify Demographics & Identity</h3>
            <span className="text-xs text-brand-emerald flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              UIDAI e-KYC Linked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60">
              <span className="text-slate-400 block mb-1">Student Full Name:</span>
              <strong className="text-white text-sm">{user?.name}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60">
              <span className="text-slate-400 block mb-1">Masked Aadhaar Number:</span>
              <strong className="text-brand-gold font-mono text-sm">XXXX-XXXX-{user?.aadhaar_last4}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60">
              <span className="text-slate-400 block mb-1">ST Caste Certificate No:</span>
              <strong className="text-white font-mono text-sm">{user?.st_certificate_no || 'ST/JH/2024/99124'}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60">
              <span className="text-slate-400 block mb-1">Annual Family Income:</span>
              <strong className="text-brand-emerald text-sm">₹{(user?.family_income || 180000).toLocaleString('en-IN')}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60">
              <span className="text-slate-400 block mb-1">Domicile State:</span>
              <strong className="text-white text-sm">{user?.state || 'Jharkhand'}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60">
              <span className="text-slate-400 block mb-1">PVTG Priority Status:</span>
              <strong className="text-white text-sm">{user?.is_pvtg ? 'Yes (Concessions Applied)' : 'General ST'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: ACADEMIC DETAILS */}
      {currentStep === 3 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4 animate-fade-in">
          <h3 className="text-base font-bold text-white mb-2">Step 3: Academic Course & Fee Structure</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enrolled Course *</label>
              <input
                type="text"
                value={formData.course_name}
                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Annual Tuition Fee (₹) *</label>
                <input
                  type="number"
                  value={formData.annual_tuition_fee}
                  onChange={(e) => setFormData({ ...formData, annual_tuition_fee: Number(e.target.value) })}
                  className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel / Living Expenses (₹)</label>
                <input
                  type="number"
                  value={formData.hostel_fee}
                  onChange={(e) => setFormData({ ...formData, hostel_fee: Number(e.target.value) })}
                  className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Aadhaar-Seeded Bank Account</label>
                <input
                  type="text"
                  value={formData.bank_account_no}
                  onChange={(e) => setFormData({ ...formData, bank_account_no: e.target.value })}
                  className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bank IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc_code}
                  onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
                  className="w-full bg-brand-dark/70 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: DOCUMENT ATTACHMENT (From Wallet + OCR Option) */}
      {currentStep === 4 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">Step 4: Attach Documents from ST Wallet</h3>
              <p className="text-xs text-slate-400">Select verified documents already uploaded to your EkChhatra wallet.</p>
            </div>

            {/* OCR Document Scanner (Phase 2 feature) */}
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-gold/15 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-dark text-xs font-bold transition-all shadow-sm">
              <Camera className="w-4 h-4" />
              <span>{ocrLoading ? 'Scanning...' : 'Scan New Doc (AI OCR)'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleOCRScan}
                disabled={ocrLoading}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3">
            {userDocs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-brand-border text-center text-xs text-slate-400">
                No documents in wallet. You can continue and upload documents anytime in the Documents section.
              </div>
            ) : (
              userDocs.map((doc) => {
                const isSelected = selectedDocIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleDocToggle(doc.id)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-brand-emerald/10 border-brand-emerald/40 text-white'
                        : 'bg-slate-900/40 border-brand-border/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${isSelected ? 'bg-brand-emerald text-brand-dark border-brand-emerald' : 'border-slate-600'}`}>
                        {isSelected && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{doc.file_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">{doc.doc_type?.replace('_', ' ')}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.is_verified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {doc.is_verified ? 'Verified DigiLocker' : 'Uploaded'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & FINAL SUBMIT */}
      {currentStep === 5 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-brand-border space-y-6 animate-fade-in">
          <h3 className="text-base font-bold text-white mb-2">Step 5: Final Review & Digital Declaration</h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border space-y-2">
              <div className="text-xs font-bold text-brand-gold uppercase">Selected Scheme</div>
              <div className="text-base font-bold text-white">{selectedScheme?.name}</div>
              <div className="text-xs text-brand-emerald">{selectedScheme?.benefit_summary}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60 space-y-1">
                <span className="text-slate-400 block">Student Name:</span>
                <strong className="text-white">{user?.name}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60 space-y-1">
                <span className="text-slate-400 block">Aadhaar e-KYC:</span>
                <strong className="text-brand-gold font-mono">XXXX-XXXX-{user?.aadhaar_last4}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60 space-y-1">
                <span className="text-slate-400 block">Course & Institute:</span>
                <strong className="text-white">{formData.course_name}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-brand-border/60 space-y-1">
                <span className="text-slate-400 block">Attached Documents:</span>
                <strong className="text-brand-emerald">{selectedDocIds.length} Certificates Attached</strong>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-2xl bg-brand-crimson/10 border border-brand-crimson/30 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.declaration_accepted}
                onChange={(e) => setFormData({ ...formData, declaration_accepted: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded text-brand-crimson focus:ring-brand-gold bg-slate-800 border-slate-700"
              />
              <span className="text-slate-200 text-[11px] leading-relaxed">
                I solemnly affirm that the information provided above is true and that I do not hold any simultaneous maintenance fellowship or central scholarship for this course year.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4 pt-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((p) => p - 1)}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((p) => p + 1)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-crimson to-brand-gold hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-rose-950/40 flex items-center gap-2 transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmitApplication}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-crimson to-brand-gold hover:brightness-110 text-white font-extrabold text-xs shadow-xl shadow-rose-950/50 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {submitting ? <span>Submitting to MoTA...</span> : <span>Submit Final Application</span>}
          </button>
        )}
      </div>

      {/* Scholarship Conflict Modal */}
      <ConflictModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        conflictData={conflictData}
        onConfirmOverride={() => {
          setShowConflictModal(false);
          toast.success('Conflict acknowledged. Override allowed for demonstration.');
        }}
      />
    </div>
  );
};

export default Apply;
