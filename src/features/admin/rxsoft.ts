/**
 * RxSoft Module
 * Core RxSoft pharmacy admin features including catalog, people, operations, and accounting.
 */

// Re-export RxSoft features
export * from '@/features/rxsoft';

// Module metadata
export const rxsoftModuleId = 'rxsoft' as const;
export const rxsoftModuleName = 'Multi Admin';
export const rxsoftModuleDescription =
  'Pharmacy admin workspace with catalog, operations, and reporting';
