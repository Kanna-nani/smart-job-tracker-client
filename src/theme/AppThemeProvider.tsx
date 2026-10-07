import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { ColorModeContext } from './colorModeContext';
import { createAppTheme } from './theme';

const STORAGE_KEY = 'sjt-color-mode';

function readStoredMode(): PaletteMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PaletteMode>(readStoredMode);

  const setMode = useCallback((next: PaletteMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the preference just won't persist.
    }
  }, []);

  const contextValue = useMemo(
    () => ({ mode, setMode, toggleMode: () => setMode(mode === 'light' ? 'dark' : 'light') }),
    [mode, setMode],
  );
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
