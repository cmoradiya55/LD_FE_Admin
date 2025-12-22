'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';

import { AlertCircle, ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  options: SelectOption[];
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

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  control,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  error,
  className = '',
  icon,
  disabled = false,
  hideLabel = false,
  inputClassName = 'px-4 py-3',
  rules,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`space-y-2 ${className}`} ref={containerRef}>
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
      <div className="relative">
        <Controller
          name={name}
          control={control}
          rules={rules || (required ? { 
            required: `${label} is required`
          } : undefined)}
          render={({ field }) => {
            const selectedOption = options.find(
              (option) => String(option.value) === String(field.value ?? '')
            );

            const isDisabled = disabled;

            return (
              <>
                <button
                  type="button"
                  id={name}
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    setIsOpen((prev) => !prev);
                  }}
                  className={`w-full border rounded-lg bg-slate-50 text-sm transition-all duration-200 focus:outline-none focus:ring-2 text-left text-gray-900 cursor-pointer shadow-sm flex items-center justify-between ${
                    isDisabled
                      ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                      : error
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100'
                        : 'border-gray-200 bg-slate-50 focus:border-primary focus:ring-primary/20 focus:bg-white'
                  } ${inputClassName} pr-10`}
                >
                  <span
                    className={
                      selectedOption ? 'text-gray-900 truncate' : 'text-gray-400 truncate'
                    }
                  >
                    {selectedOption ? selectedOption.label : placeholder}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                </button>

                {isOpen && !isDisabled && (
                  <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-gray-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] overflow-hidden">
                    <div className="max-h-56 overflow-y-auto custom-scrollbar">
                      {options.length === 0 && (
                        <div className="px-4 py-3 text-xs text-gray-400">
                          No options available
                        </div>
                      )}
                      {options.map((option) => {
                        const isSelected =
                          String(option.value) === String(field.value ?? '');

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              field.onChange(option.value);
                              setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 text-xs sm:text-sm transition-colors text-left ${
                              isSelected
                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                : 'text-gray-700 hover:bg-primary/5'
                            }`}
                          >
                            <span className="truncate">{option.label}</span>
                            {isSelected && (
                              <span className="ml-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm flex items-center gap-2 mt-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SelectInput;
