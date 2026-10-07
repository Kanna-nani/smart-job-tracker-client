import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';
import { mockApplications } from '../data/mockApplications';
import { mockInterviews } from '../data/mockInterviews';
import type { ApplicationInput, Interview, JobApplication } from '../types/application';
import { ApplicationsContext } from './applicationsContext';
import type { ApplicationsContextValue, NotifyOptions } from './applicationsContext';

interface ToastState {
  id: number;
  open: boolean;
  options: NotifyOptions;
}

const createId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 24)
    : `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 12)}`;

/** Local, in-memory store standing in for the API until the backend is connected. */
export default function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [interviews] = useState<Interview[]>(mockInterviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastState>({ id: 0, open: false, options: { message: '' } });

  const notify = useCallback((options: NotifyOptions) => {
    setToast((prev) => ({ id: prev.id + 1, open: true, options }));
  }, []);

  const addApplication = useCallback(
    (input: ApplicationInput) => {
      const now = new Date().toISOString();
      setApplications((prev) => [{ ...input, _id: createId(), createdAt: now, updatedAt: now }, ...prev]);
      notify({ message: `Added ${input.companyName} — ${input.jobTitle}` });
    },
    [notify],
  );

  const updateApplication = useCallback(
    (id: string, input: ApplicationInput) => {
      const now = new Date().toISOString();
      setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, ...input, updatedAt: now } : a)));
      notify({ message: `Updated ${input.companyName} — ${input.jobTitle}` });
    },
    [notify],
  );

  const deleteApplication = useCallback(
    (id: string) => {
      const index = applications.findIndex((a) => a._id === id);
      if (index === -1) return;
      const removed = applications[index];
      setApplications((prev) => prev.filter((a) => a._id !== id));
      notify({
        message: `Deleted ${removed.companyName} — ${removed.jobTitle}`,
        severity: 'info',
        actionLabel: 'Undo',
        onAction: () =>
          setApplications((prev) => {
            if (prev.some((a) => a._id === removed._id)) return prev;
            const next = [...prev];
            next.splice(Math.min(index, next.length), 0, removed);
            return next;
          }),
      });
    },
    [applications, notify],
  );

  const value = useMemo<ApplicationsContextValue>(
    () => ({
      applications,
      interviews,
      addApplication,
      updateApplication,
      deleteApplication,
      searchQuery,
      setSearchQuery,
      notify,
    }),
    [applications, interviews, addApplication, updateApplication, deleteApplication, searchQuery, notify],
  );

  const closeToast = (_event?: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const { options } = toast;

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast.id}
        open={toast.open}
        autoHideDuration={options.actionLabel ? 6000 : 4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={options.severity ?? 'success'}
          variant="filled"
          onClose={closeToast}
          action={
            options.actionLabel ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  options.onAction?.();
                  closeToast();
                }}
              >
                {options.actionLabel}
              </Button>
            ) : undefined
          }
          sx={{ width: '100%', alignItems: 'center', boxShadow: 4 }}
        >
          {options.message}
        </Alert>
      </Snackbar>
    </ApplicationsContext.Provider>
  );
}
