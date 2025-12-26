'use client';

import React from 'react';

import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

import { AlertCircle } from 'lucide-react';

interface TextInputProps {
  name: string;
  // eslint-disable-next-line 
  // @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'number' | 'date';
  required?: boolean;
  error?: FieldError;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  hideLabel?: boolean;
  inputClassName?: string;
  rules?: RegisterOptions;
  onChange?: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  required = false,
  error,
  className = '',
  icon,
  disabled = false,
  hideLabel = false,
  inputClassName = 'px-4 py-3',
  rules,
  onChange,
}) => {
  return (
    <div className={hideLabel ? className : `space-y-2 ${className}`}>
      {!hideLabel && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-semibold flex items-center gap-2 ${
            disabled ? 'text-gray-500' : 'text-blue-700'
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
          required: `${label} is required`,
          ...(type === 'email' && {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address'
            }
          })
        } : undefined)}
        render={({ field }) => (
          <input
            {...field}
            onChange={(e) => {
              field.onChange(e);
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            value={(field.value as string) || ''}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-gray-400 text-gray-900 ${
              disabled 
                ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
                : error 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 bg-slate-50 focus:border-primary focus:ring-primary/20 focus:bg-white'
            } ${inputClassName}`}
          />
        )}
      />
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default TextInput;
