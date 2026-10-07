import type { PaletteMode } from '@mui/material';
import { darken, lighten } from '@mui/material/styles';
import type { ApplicationStatus } from '../types/application';

/**
 * Status hues come from a validated categorical palette (checked for colour-vision
 * deficiency separation in pipeline order). Each mode has its own step so marks
 * keep at least 3:1 contrast on the dark surface.
 */
const STATUS_COLORS: Record<ApplicationStatus, Record<PaletteMode, string>> = {
  Applied: { light: '#2a78d6', dark: '#3987e5' },
  Interview: { light: '#eda100', dark: '#c98500' },
  'Technical Round': { light: '#4a3aa7', dark: '#9085e9' },
  'HR Round': { light: '#e87ba4', dark: '#d55181' },
  Offer: { light: '#008300', dark: '#008300' },
  Rejected: { light: '#e34948', dark: '#e66767' },
  Withdrawn: { light: '#8a8985', dark: '#8f8e88' },
};

export const getStatusColor = (status: ApplicationStatus, mode: PaletteMode): string =>
  STATUS_COLORS[status][mode];

/** A darker/lighter step of the status hue that meets text contrast on its tinted chip. */
export const getStatusTextColor = (status: ApplicationStatus, mode: PaletteMode): string => {
  const color = getStatusColor(status, mode);
  return mode === 'light' ? darken(color, 0.42) : lighten(color, 0.45);
};

export const INTERVIEW_STAGES: ApplicationStatus[] = ['Interview', 'Technical Round', 'HR Round'];

/** Single-series chart colour and an ordinal ramp (darkest = first stage) for funnels. */
export const CHART_COLORS = {
  series: { light: '#2a78d6', dark: '#3987e5' },
  ordinal: {
    light: ['#1c5cab', '#2a78d6', '#5598e7', '#86b6ef'],
    dark: ['#86b6ef', '#5598e7', '#3987e5', '#256abf'],
  },
} as const;
