import { useContext } from 'react';
import { ApplicationsContext } from '../context/applicationsContext';

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) throw new Error('useApplications must be used within ApplicationsProvider');
  return context;
}
