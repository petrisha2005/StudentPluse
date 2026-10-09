import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-xs">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full text-slate-900 bg-white border ${
              error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
            } rounded-xl ${
              icon ? 'pl-10' : 'px-3.5'
            } py-2.5 text-sm transition-colors duration-150 placeholder-slate-400 focus:outline-none focus:ring-2 ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
