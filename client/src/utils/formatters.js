/**
 * Utility functions for Indian currency, date, and status formatting
 */

// Formats a number to Indian Currency string: e.g. 180000 -> "₹1,80,000"
export const formatINR = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const num = Number(val);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

// Formats ISO or timestamp to DD/MM/YYYY
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

// Returns badge color classes for 7-stage application workflow
export const getStatusConfig = (status) => {
  switch (status) {
    case 'Submitted':
      return {
        label: 'Submitted',
        bg: 'bg-blue-500/15',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        step: 1
      };
    case 'Institute_Verified':
      return {
        label: 'Institute Verified',
        bg: 'bg-cyan-500/15',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        step: 2
      };
    case 'District_Verified':
      return {
        label: 'District Verified',
        bg: 'bg-purple-500/15',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        step: 3
      };
    case 'State_Verified':
      return {
        label: 'State Verified',
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        step: 4
      };
    case 'Sanctioned':
      return {
        label: 'Sanctioned',
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        step: 5
      };
    case 'Disbursed':
      return {
        label: 'DBT Disbursed',
        bg: 'bg-emerald-500/25',
        text: 'text-emerald-300',
        border: 'border-emerald-500/50',
        step: 6
      };
    case 'Rejected':
      return {
        label: 'Action Required / Rejected',
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        step: 0
      };
    default:
      return {
        label: status || 'Pending',
        bg: 'bg-slate-500/15',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        step: 1
      };
  }
};
