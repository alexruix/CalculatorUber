/**
 * UI Constants for Manejate
 * ─────────────────────────────────────────────────────────────
 * Thresholds, opacity values, and other shared UI settings.
 */

export const EFFICIENCY_THRESHOLDS = {
  EXCELLENT: 180,
  GOOD: 120,
} as const;

export const PRODUCTIVITY_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 50,
} as const;

export const MIN_TRIPS_FOR_EXTREMES = 3;

// Color contrast ratios WCAG AA compliant
export const TEXT_OPACITY = {
  PRIMARY: 'text-white',           // 21:1 ratio
  SECONDARY: 'text-white/80',      // 12:1 ratio
  TERTIARY: 'text-white/60',       // 7.2:1 ratio
  DISABLED: 'text-white/70',       // Accessible contrast for secondary/disabled text
} as const;
