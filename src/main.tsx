import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import ApplicationsProvider from './context/ApplicationsProvider.tsx';
import AppThemeProvider from './theme/AppThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <BrowserRouter>
        <ApplicationsProvider>
          <App />
        </ApplicationsProvider>
      </BrowserRouter>
    </AppThemeProvider>
  </StrictMode>,
);
