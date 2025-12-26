'use client';

import React from 'react';

import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

import { AlertCircle, Phone } from 'lucide-react';

interface MobileInputProps {
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
}

const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
];

const MobileInput: React.FC<MobileInputProps> = ({
  name,
  control,
  label,
  placeholder = '90990 XXXXX',
  required = false,
  error,
  className = '',
  icon,
  disabled = false,
  hideLabel = false,
  inputClassName = 'px-4 py-3',
  rules,
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
          {icon || <Phone className="w-4 h-4 text-blue-600" />}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex">
        <div className="px-1.5 lg:px-4 border border-r-0 border-blue-200 bg-blue-100 rounded-l-xl text-blue-700">
          <Controller
            name={`${name}CountryCode`}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={(field.value as string) || '+91'}
                disabled
                className="py-2 cursor-not-allowed text-gray-900 bg-transparent focus:outline-none"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        <Controller
          name={name}
          control={control}
          rules={rules || (required ? { 
            required: `${label} is required`,
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Please enter a valid 10-digit mobile number'
            },
            minLength: {
              value: 10,
              message: 'Mobile number must be 10 digits'
            },
            maxLength: {
              value: 10,
              message: 'Mobile number must be 10 digits'
            }
          } : undefined)}
          render={({ field }) => (
            <input
              {...field}
              value={(field.value as string) || ''}
              id={name}
              type="tel"
              placeholder={placeholder || 'Enter 10-digit mobile number'}
              maxLength={10}
              disabled={disabled}
              onKeyDown={(e) => {
                if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].includes(e.keyCode) ||
                  (e.keyCode === 65 && e.ctrlKey === true) ||
                  (e.keyCode === 67 && e.ctrlKey === true) ||
                  (e.keyCode === 86 && e.ctrlKey === true) ||
                  (e.keyCode === 88 && e.ctrlKey === true)) {
                  return;
                }
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, '');
                if (target.value.length > 10) {
                  target.value = target.value.substring(0, 10);
                }
                field.onChange(target.value);
              }}
              className={`flex-1 border rounded-r-xl transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-gray-500 text-gray-900 ${
                disabled 
                  ? 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed' 
                  : error 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                    : 'border-gray-200 bg-slate-50 focus:border-primary focus:ring-primary/20 focus:bg-white'
              } ${inputClassName}`}
            />
          )}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1.5 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default MobileInput;
