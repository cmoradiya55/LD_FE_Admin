'use client';

import React from 'react';

import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

import { AlertCircle } from 'lucide-react';

interface TextAreaProps {
  name: string;
  // eslint-disable-next-line 
  // @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  hideLabel?: boolean;
  inputClassName?: string;
  rules?: RegisterOptions;
  rows?: number;
  maxLength?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  control,
  label,
  placeholder,
  required = false,
  error,
  className = '',
  icon,
  disabled = false,
  hideLabel = false,
  inputClassName = 'px-3 py-2',
  rules,
  rows = 4,
  maxLength,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {!hideLabel && (
        <label 
          htmlFor={name} 
          className={`text-xs font-semibold flex items-center gap-1.5 ${
            disabled ? 'text-gray-500' : 'text-slate-700'
          }`}
        >
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules || (required ? { 
          required: `${label} is required`
        } : undefined)}
        render={({ field }) => (
          <textarea
            {...field}
            value={field.value as string || ''}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={`w-full border-2 rounded-md transition-all duration-200 focus:outline-none placeholder:text-slate-400 text-sm text-slate-800 resize-y ${
              disabled 
                ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed' 
                : error 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-100' 
                  : 'border-slate-200 bg-slate-50/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:bg-white'
            } ${inputClassName}`}
          />
        )}
      />
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default TextArea;
