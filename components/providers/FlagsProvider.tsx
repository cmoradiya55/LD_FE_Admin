"use client";

import React, { createContext, useContext, PropsWithChildren } from 'react';
import { flags as defaultFlags, type Flags } from '@/lib/flags';

type FlagsContextType = Flags;

const FlagsContext = createContext<FlagsContextType>(defaultFlags);

export function FlagsProvider({ children, value }: PropsWithChildren<{ value?: Partial<Flags> }>) {
  // Merge any overrides (e.g., from env) with defaults
  const merged: Flags = { ...defaultFlags, ...value } as Flags;
  return <FlagsContext.Provider value={merged}>{children}</FlagsContext.Provider>;
}

export function useFlags() {
  return useContext(FlagsContext);
}
