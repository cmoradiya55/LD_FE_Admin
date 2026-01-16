'use client';

import React from 'react';

import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldError,
  RegisterOptions,
} from 'react-hook-form';

import { AlertCircle, Calendar } from 'lucide-react';

interface DateInputProps {
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
  min?: string;
  max?: string;
}

const DateInput: React.FC<DateInputProps> = ({
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
  min,
  max,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {!hideLabel && (
        <label 
          htmlFor={name} 
          className={`block text-xs font-semibold flex items-center gap-1.5 ${
            disabled ? 'text-gray-500' : 'text-blue-700'
          }`}
        >
          {icon || <Calendar className="w-3.5 h-3.5" />}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <Controller
          name={name}
          control={control}
          rules={rules || (required ? { 
            required: `${label} is required`
          } : undefined)}
          render={({ field }: { field: ControllerRenderProps<Record<string, unknown>, string> }) => (
            <input
              {...field}
              value={field.value as string || ''}
              id={name}
              type="date"
              placeholder={placeholder}
              disabled={disabled}
              min={min}
              max={max}
              className={`w-full border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-gray-500 text-sm text-gray-900 ${
                disabled 
                  ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
                  : error 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                    : 'border-gray-200 bg-slate-50 focus:border-primary focus:ring-primary/20 focus:bg-white'
              } ${inputClassName}`}
            />
          )}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default DateInput;
