'use client';
import { useMemo, type ReactNode } from 'react';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { createStudyTheme } from '@/theme/theme';
import { useProgress } from './progress-provider';

export function AppTheme({ children }: { children: ReactNode }) {
  const { state } = useProgress();
  const { theme, variables } = useMemo(() => createStudyTheme(state.theme), [state.theme]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <GlobalStyles styles={{ ':root': variables }} />
      {children}
    </ThemeProvider>
  );
}
