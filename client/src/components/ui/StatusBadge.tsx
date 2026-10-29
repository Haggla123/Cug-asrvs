import React from 'react';

export type StatusVariant = 
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'neutral'
  | 'gold';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  icon?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'neutral',
  icon,
  className = ''
}) => {
  // Variant mapping to Academic Veritas tokens
  const variantStyles: Record<StatusVariant, string> = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    neutral: 'bg-surface-container text-on-surface-variant border-outline-variant/60',
    gold: 'bg-secondary-fixed/30 text-secondary border-secondary/40 font-bold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-label-sm font-label-sm font-medium ${variantStyles[variant]} ${className}`}>
      {icon && (
        <span className="material-symbols-outlined text-[14px]">
          {icon}
        </span>
      )}
      <span>{status}</span>
    </span>
  );
};
