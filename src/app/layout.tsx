import type { Metadata } from 'next';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import './globals.css';
import { ProgressProvider } from '@/components/progress-provider';
import { Shell } from '@/components/shell';
import { AppTheme } from '@/components/app-theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
export const metadata: Metadata = {
  title: 'Jobprep | Your next role. A clearer path.',
  description:
    'Role-specific developer job preparation with guided practice, technical assessments, interview preparation and browser-local progress.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ProgressProvider>
            <AppTheme>
              <Shell>{children}</Shell>
            </AppTheme>
          </ProgressProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
