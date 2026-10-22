import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';
// import { mockApplications } from '../data/mockApplications';
import { mockInterviews } from '../data/mockInterviews';
import type { ApplicationInput, Interview, JobApplication } from '../types/application';
import { ApplicationsContext } from './applicationsContext';
import type { ApplicationsContextValue, NotifyOptions } from './applicationsContext';
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { getApplications,createApplication, updateApplication as updateApplicationApi,deleteApplication as deleteApplicationApi, } from '../services/applicationApi';

interface ToastState {
  id: number;
  open: boolean;
  options: NotifyOptions;
}

export default function ApplicationsProvider({ children }: { children: ReactNode }) {
  // const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const {
  data,
  isLoading,
  isError,
} = useQuery({
  queryKey: ['applications'],
  queryFn: getApplications,
});

  const [interviews] = useState<Interview[]>(mockInterviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastState>({ id: 0, open: false, options: { message: '' } });
  const notify = useCallback((options: NotifyOptions) => {
    setToast((prev) => ({ id: prev.id + 1, open: true, options }));
  }, []);

  const queryClient = useQueryClient();

const createMutation = useMutation({
  mutationFn: createApplication,
  onSuccess: () =>{
    queryClient.invalidateQueries({
      queryKey:['applications'],
    });
    notify({message:'Application created successfully',
      severity:'success',

    });
  },
  onError:(error)=>{
      console.error('failed to create application:',error)
      notify({
        message:'Failed to create application. Please try again.',
        severity:'error', 
      })
  }
  
})

const updateMutation = useMutation({
  mutationFn:({
    id,
    application,
  }:{
    id:string;
    application: ApplicationInput;
  })=> updateApplicationApi(id,application),

 onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ['applications'],
    });

    notify({
      message: 'Application updated successfully',
      severity: 'success',
    });
  },
    onError: (error) => {
    console.error('Failed to update application:', error);

    notify({
      message: 'Failed to update application. Please try again.',
      severity: 'error',
    });
  },
});
const applications: JobApplication[] = data?.data ?? [];

const deleteMutation =useMutation({
  mutationFn:(id:string)=> deleteApplicationApi(id),
  onSuccess :async ()=>{
    await queryClient.invalidateQueries({
      queryKey:['applications'],
    });
    notify({
      message:'Application deleted successfully',
      severity:'success',
    });
  },
   onError: (error) => {
    console.error('Failed to delete application:', error);

    notify({
      message: 'Failed to delete application. Please try again.',
      severity: 'error',
    });
  },
  
})
  const addApplication = useCallback(
    (input: ApplicationInput) =>{
      createMutation.mutate(input);
    },
    [createMutation],
  )

 const updateApplication = useCallback(
  (id: string, input: ApplicationInput) => {
    updateMutation.mutate({
      id,
      application: input,
    });
  },
  [updateMutation]
 );

 const deleteApplication = useCallback(
  (id: string) => {
    deleteMutation.mutate(id);

  },[deleteMutation]
 )
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
      isLoading,
      isError,
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
