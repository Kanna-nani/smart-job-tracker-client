import { alpha, createTheme } from '@mui/material/styles';
import type { PaletteMode, Theme } from '@mui/material/styles';

const FONT_FAMILY = '"Inter", "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif';

const tokens = {
  light: {
    primary: '#2459d6',
    primaryContrast: '#ffffff',
    background: '#f6f7f9',
    paper: '#ffffff',
    subtle: '#f9fafb',
    textPrimary: '#101828',
    textSecondary: '#475467',
    divider: '#e4e7ec',
    success: '#1a7f37',
    error: '#c9302c',
    warning: '#b25e09',
    shadowColor: '16, 24, 40',
  },
  dark: {
    primary: '#79a6f6',
    primaryContrast: '#0b1220',
    background: '#0d1016',
    paper: '#151a23',
    subtle: '#1a202b',
    textPrimary: '#f2f4f7',
    textSecondary: '#a3acba',
    divider: '#262d3a',
    success: '#4ac26b',
    error: '#f47067',
    warning: '#e3b341',
    shadowColor: '0, 0, 0',
  },
} as const;

export function createAppTheme(mode: PaletteMode): Theme {
  const t = tokens[mode];
  const isLight = mode === 'light';
  const cardShadow = `0 1px 2px rgba(${t.shadowColor}, ${isLight ? 0.04 : 0.3}), 0 1px 3px rgba(${t.shadowColor}, ${isLight ? 0.06 : 0.25})`;
  const popoverShadow = `0 12px 32px -4px rgba(${t.shadowColor}, ${isLight ? 0.12 : 0.5}), 0 4px 8px -2px rgba(${t.shadowColor}, ${isLight ? 0.06 : 0.3})`;

  return createTheme({
    palette: {
      mode,
      primary: { main: t.primary, contrastText: t.primaryContrast },
      success: { main: t.success },
      error: { main: t.error },
      warning: { main: t.warning },
      background: { default: t.background, paper: t.paper },
      text: { primary: t.textPrimary, secondary: t.textSecondary },
      divider: t.divider,
      action: {
        hover: alpha(t.textPrimary, isLight ? 0.04 : 0.06),
        selected: alpha(t.primary, isLight ? 0.08 : 0.16),
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: FONT_FAMILY,
      h4: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
      h5: { fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.3 },
      h6: { fontSize: '1.0625rem', fontWeight: 650, letterSpacing: '-0.01em', lineHeight: 1.4 },
      subtitle1: { fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.45 },
      subtitle2: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.45 },
      body1: { fontSize: '0.9375rem', lineHeight: 1.55 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
      caption: { fontSize: '0.75rem', lineHeight: 1.45 },
      overline: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', lineHeight: 1.6 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            fontFeatureSettings: '"cv11", "ss01"',
          },
          '#root': { minHeight: '100vh' },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 14,
            border: `1px solid ${t.divider}`,
            boxShadow: cardShadow,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: { root: { padding: 20, '&:last-child': { paddingBottom: 20 } } },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 8, paddingInline: 14 },
          sizeLarge: { paddingBlock: 10, paddingInline: 20 },
          outlined: { borderColor: t.divider },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: t.paper,
            '&:hover:not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(t.textPrimary, 0.3),
            },
          },
          notchedOutline: { borderColor: t.divider },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottom: `1px solid ${t.divider}`, paddingTop: 14, paddingBottom: 14 },
          head: {
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: t.textSecondary,
            backgroundColor: t.subtle,
            paddingTop: 10,
            paddingBottom: 10,
            whiteSpace: 'nowrap',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: { '&:last-child td': { borderBottom: 0 } },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: { borderTop: `1px solid ${t.divider}` },
          toolbar: { minHeight: 56 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 6 },
          sizeSmall: { height: 24, fontSize: '0.75rem' },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ ownerState }) => ({
            borderRadius: ownerState.fullScreen ? 0 : 16,
            boxShadow: popoverShadow,
          }),
        },
      },
      MuiDialogTitle: {
        styleOverrides: { root: { padding: '20px 24px 8px' } },
      },
      MuiDialogActions: {
        styleOverrides: { root: { padding: '16px 24px 20px', gap: 4 } },
      },
      MuiDrawer: {
        styleOverrides: { paper: { backgroundImage: 'none' } },
      },
      MuiPopover: {
        styleOverrides: {
          paper: { border: `1px solid ${t.divider}`, boxShadow: popoverShadow, borderRadius: 12 },
        },
      },
      MuiMenuItem: {
        styleOverrides: { root: { borderRadius: 6, marginInline: 6, fontSize: '0.875rem' } },
      },
      MuiListItemButton: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiTooltip: {
        defaultProps: { arrow: true },
        styleOverrides: {
          tooltip: {
            fontSize: '0.75rem',
            fontWeight: 500,
            backgroundColor: isLight ? '#101828' : '#2b3342',
            padding: '6px 10px',
            borderRadius: 6,
          },
          arrow: { color: isLight ? '#101828' : '#2b3342' },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { height: 6, borderRadius: 999, backgroundColor: alpha(t.textPrimary, isLight ? 0.07 : 0.1) },
          bar: { borderRadius: 999 },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderColor: t.divider,
            paddingInline: 12,
          },
        },
      },
      MuiSwitch: {
        defaultProps: { color: 'primary' },
      },
      MuiAvatar: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
    },
  });
}
