import { createContext } from 'react';
import type { ApplicationInput, Interview, JobApplication } from '../types/application';

export interface NotifyOptions {
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

export interface ApplicationsContextValue {
  applications: JobApplication[];
  interviews: Interview[];
  addApplication: (input: ApplicationInput) => void;
  updateApplication: (id: string, input: ApplicationInput) => void;
  deleteApplication: (id: string) => void;
  /** Shared between the header search and the applications page filter. */
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notify: (options: NotifyOptions) => void;
}

export const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);
