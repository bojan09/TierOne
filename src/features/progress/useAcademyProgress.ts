import { useContext } from 'react';
import { ProgressContext, type AcademyProgressValue } from './context';

export function useAcademyProgress(): AcademyProgressValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useAcademyProgress must be used within a <ProgressProvider>.');
  }
  return ctx;
}
