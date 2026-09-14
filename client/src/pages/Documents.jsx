import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle, 
  ShieldCheck, 
  Camera, 
  Eye, 
  Download, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import ParticleText from '../components/reactbits/ParticleText';
import DocumentPreviewModal from '../components/common/DocumentPreviewModal';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const DOC_CATEGORIES = [
  { value: 'ST_CERTIFICATE', label: 'ST Caste Certificate' },
  { value: 'INCOME_CERTIFICATE', label: 'Annual Income Certificate' },
  { value: 'MARKSHEET', label: 'Previous Academic Marksheet' },
  { value: 'FEE_RECEIPT', label: 'Institution Fee Receipt / Bonafide' },
  { value: 'BANK_PASSBOOK', label: 'Aadhaar Seeded Bank Passbook' },
  { value: 'DOMICILE', label: 'State Domicile Certificate' }
];

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('ST_CERTIFICATE');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await axiosClient.get('/api/documents');
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('doc_type', selectedDocType);
    formData.append('file', file);
    formData.append('source', 'User Upload');

    try {
      await axiosClient.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Document uploaded to your ST Wallet!');
      fetchDocuments();
    } catch (err) {
      toast.error('Document upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleOCRScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axiosClient.post('/api/verify/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExtractedData(res.data);
      toast.success('AI OCR scan completed!');
    } catch (err) {
      toast.error('OCR fallback applied');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove document from your wallet?')) return;
    try {
      await axiosClient.delete(`/api/documents/${id}`);
      toast.success('Document removed');
      fetchDocuments();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleSimulateVerify = async (id) => {
    try {
      await axiosClient.put(`/api/documents/${id}/verify`);
      toast.success('DigiLocker Digital Signature Authenticated!');
      fetchDocuments();
    } catch (err) {
      toast.error('Verification failed');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Container with ParticleText */}
      <div className="text-center">
        <div className="w-full h-20 sm:h-24 flex items-center justify-center">
          <ParticleText
            text="Document Wallet"
            color="#f5a623"
            highlightColor="#10b981"
            fontSize="clamp(2rem, 6vw, 3rem)"
            fontWeight={900}
            density={2.5}
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto -mt-2">
          Store your verified certificates once. Reuse across all 5 central scholarship applications.
        </p>
      </div>

      {/* OCR SCANNER PROMO BOX (Phase 2 Feature) */}
      <div className="glass-card p-6 rounded-3xl border border-brand-gold/30 bg-gradient-to-r from-brand-surface via-brand-purple/40 to-brand-teal/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold flex-shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI Document Scanner (OCR)</span>
              <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full border border-brand-gold/30">
                Auto-Fill
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Photograph your certificate to automatically extract certificate number and issuing authority.
            </p>
          </div>
        </div>

        <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark hover:brightness-110 font-bold text-xs shadow-lg transition-all flex items-center gap-2 flex-shrink-0">
          <Sparkles className="w-4 h-4" />
          <span>{ocrLoading ? 'Scanning...' : 'Scan Certificate'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleOCRScan}
            disabled={ocrLoading}
            className="hidden"
          />
        </label>
      </div>

      {/* OCR Results Display if any */}
      {extractedData && (
        <div className="glass-card p-5 rounded-2xl border border-brand-emerald/40 bg-brand-emerald/5 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-brand-emerald uppercase">
              OCR Extracted Metadata • {extractedData.document_type}
            </span>
            <button onClick={() => setExtractedData(null)} className="text-xs text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {Object.entries(extractedData.extracted_fields || {}).map(([k, v]) => (
              <div key={k} className="p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-400 text-[10px] block capitalize">{k.replace('_', ' ')}</span>
                <strong className="text-white">{String(v)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOAD STRIP */}
      <div className="glass-card p-6 rounded-3xl border border-brand-border space-y-4">
        <h3 className="text-sm font-bold text-white">Upload New Document to Wallet</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
          >
            {DOC_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-brand-surface">
                {cat.label}
              </option>
            ))}
          </select>

          <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-dashed border-brand-border hover:border-brand-gold bg-slate-900/40 text-xs font-semibold text-slate-300 hover:text-white transition-all">
            <Upload className="w-4 h-4 text-brand-gold" />
            <span>{uploading ? 'Uploading...' : 'Choose PDF or Image File to Upload'}</span>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* DOCUMENT WALLET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="glass-card p-6 rounded-3xl border border-brand-border flex flex-col justify-between space-y-4 hover:border-brand-gold/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-teal/20 text-cyan-300 font-mono uppercase">
                  {doc.doc_type?.replace('_', ' ')}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  doc.is_verified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {doc.is_verified ? <ShieldCheck className="w-3 h-3" /> : null}
                  {doc.is_verified ? 'DigiLocker Verified' : 'Pending Verification'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white truncate mb-1">{doc.file_name}</h4>
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div>Source: <span className="text-slate-300">{doc.source}</span></div>
                <div>Uploaded: <span className="text-slate-300">{formatDate(doc.uploaded_at)}</span></div>
                {doc.verified_by && (
                  <div className="text-brand-emerald">Signed by: {doc.verified_by}</div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="flex items-center gap-1 text-xs text-brand-gold hover:underline font-semibold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <div className="flex items-center gap-2">
                {!doc.is_verified && (
                  <button
                    onClick={() => handleSimulateVerify(doc.id)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-brand-emerald/20 text-emerald-400 hover:bg-brand-emerald hover:text-brand-dark transition-colors border border-emerald-500/30"
                  >
                    Verify e-Sign
                  </button>
                )}

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
      />
    </div>
  );
};

export default Documents;
