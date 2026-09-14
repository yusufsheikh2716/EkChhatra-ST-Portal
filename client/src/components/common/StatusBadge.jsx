import React from 'react';
import { getStatusConfig } from '../../utils/formatters';

const StatusBadge = ({ status, className = '' }) => {
  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
