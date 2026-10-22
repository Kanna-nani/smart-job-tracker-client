import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import ApplicationsProvider from './context/ApplicationsProvider.tsx';
import AppThemeProvider from './theme/AppThemeProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ApplicationsProvider>
          <App />
        </ApplicationsProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </AppThemeProvider>
  </StrictMode>,
);
