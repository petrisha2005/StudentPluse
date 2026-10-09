import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'violet' | 'amber' | 'slate' | 'rose';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'indigo', size = 'sm', className = '' }) => {
  const variantStyles = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    violet: 'bg-violet-50 text-violet-700 border-violet-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-semibold',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
