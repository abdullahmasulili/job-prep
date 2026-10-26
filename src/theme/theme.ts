import { createTheme } from '@mui/material/styles';

export function createStudyTheme(mode: 'light' | 'dark') {
  const dark = mode === 'dark';
  const colors = dark
    ? {
        canvas: '#141820',
        surface: '#1c222d',
        ink: '#edf0f7',
        muted: '#a9b3c4',
        primary: '#9bb2ff',
        soft: '#263457',
        border: '#343f50',
        success: '#81d6b0',
        danger: '#ff9ca8',
        subtle: '#252d3b',
        code: '#151b25',
        onPrimary: '#131c37',
      }
    : {
        canvas: '#f6f7f9',
        surface: '#ffffff',
        ink: '#202733',
        muted: '#5e6878',
        primary: '#315be8',
        soft: '#edf1ff',
        border: '#e2e6ed',
        success: '#16704d',
        danger: '#b42c3b',
        subtle: '#f0f2f6',
        code: '#f1f3f8',
        onPrimary: '#ffffff',
      };
  const theme = createTheme({
    palette: {
      mode,
      primary: { main: colors.primary, contrastText: colors.onPrimary },
      background: { default: colors.canvas, paper: colors.surface },
      text: { primary: colors.ink, secondary: colors.muted },
      divider: colors.border,
      success: { main: colors.success },
      error: { main: colors.danger, contrastText: dark ? colors.onPrimary : '#ffffff' },
    },
    typography: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      h1: { fontFamily: 'Manrope, sans-serif', fontWeight: 700 },
      h2: { fontFamily: 'Manrope, sans-serif', fontWeight: 700 },
      h3: { fontFamily: 'Manrope, sans-serif', fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true, variant: 'outlined' },
        styleOverrides: {
          root: { minHeight: 44, padding: '10px 19px', fontSize: 13, lineHeight: 1.4, gap: 8 },
          outlined: { borderColor: colors.border },
        },
      },
      MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
      MuiPaper: {
        defaultProps: { elevation: 0, variant: 'outlined' },
        styleOverrides: { root: { borderRadius: 16, backgroundImage: 'none' } },
      },
      MuiDialog: {
        defaultProps: { fullWidth: true, maxWidth: 'sm' },
        styleOverrides: { paper: { borderRadius: 16 } },
      },
      MuiTextField: { defaultProps: { variant: 'outlined', fullWidth: true } },
      MuiCheckbox: { defaultProps: { size: 'small' } },
      MuiRadio: { defaultProps: { size: 'small' } },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 60,
            fontSize: 13,
            fontWeight: 600,
            textTransform: 'none',
            padding: '12px 8px',
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { height: 6, borderRadius: 10, backgroundColor: colors.border },
          bar: { borderRadius: 10, transition: 'transform 250ms' },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 5, fontSize: 11, height: 24 } } },
      MuiCssBaseline: {
        styleOverrides: {
          body: { fontSize: 15, lineHeight: 1.65 },
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              transition: 'none !important',
              animation: 'none !important',
            },
          },
        },
      },
    },
  });
  const variables = {
    '--canvas': colors.canvas,
    '--surface': colors.surface,
    '--ink': colors.ink,
    '--muted': colors.muted,
    '--primary': colors.primary,
    '--primary-soft': colors.soft,
    '--border': colors.border,
    '--success': colors.success,
    '--danger': colors.danger,
    '--subtle': colors.subtle,
    '--on-primary': colors.onPrimary,
    '--code-bg': colors.code,
  };
  return { theme, variables };
}
