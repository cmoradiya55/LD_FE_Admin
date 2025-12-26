'use client';

import React from 'react';

import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

import { AlertCircle } from 'lucide-react';

interface RadioOption {
  value: string | number;
  label: string;
}

interface RadioInputProps {
  name: string;
  // eslint-disable-next-line 
  // @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  options: RadioOption[];
  required?: boolean;
  error?: FieldError;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  hideLabel?: boolean;
  rules?: RegisterOptions;
  orientation?: 'horizontal' | 'vertical';
}

const RadioInput: React.FC<RadioInputProps> = ({
  name,
  control,
  label,
  options,
  required = false,
  error,
  className = '',
  icon,
  disabled = false,
  hideLabel = false,
  rules,
  orientation = 'vertical',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {!hideLabel && (
        <label 
          className={`block text-sm font-semibold flex items-center gap-2 ${
            disabled ? 'text-gray-500' : 'text-teal-700'
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
          <div className={`flex ${orientation === 'horizontal' ? 'flex-row gap-6' : 'flex-col gap-3'}`}>
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 cursor-pointer ${
                  disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={disabled}
                  className={`w-4 h-4 text-teal-600 border-2 ${
                    error 
                      ? 'border-red-300 focus:ring-red-100' 
                      : 'border-teal-300 focus:ring-teal-100'
                  } focus:ring-2 focus:ring-offset-0 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100`}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      />
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-2 mt-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default RadioInput;
