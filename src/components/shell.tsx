'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useProgress } from './progress-provider';
import { Icon, type IconName } from './icons';
import { ConfirmDialog } from './ui';
import { Action } from './ui';
import {
  Alert,
  AppBar,
  CircularProgress,
  IconButton,
  List,
  ListItemButton,
  Paper,
} from '@mui/material';
import { profileLabel, languages } from '@/content/catalog';

const navigation: { href: string; name: string; icon: IconName }[] = [
  { href: '/', name: 'Overview', icon: 'overview' },
  { href: '/path', name: 'My path', icon: 'path' },
  { href: '/progress', name: 'My progress', icon: 'progress' },
  { href: '/settings', name: 'Settings', icon: 'settings' },
];
export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state, profile, ready, saving, issue, reload, recover, retry, change } = useProgress();
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Paper component="aside" className="sidebar" square>
        <Link href="/" className="brand" aria-label="Jobprep home">
          <span className="brand-mark">
            <Icon name="book" size={22} />
          </span>
          jobprep<span className="brand-period">.</span>
        </Link>
        <p className="nav-caption">Your workspace</p>
        <List component="nav" disablePadding aria-label="Main navigation">
          {navigation.map((item) => (
            <ListItemButton
              component={Link}
              key={item.href}
              href={item.href}
              className={`nav-link ${(item.href === '/' ? pathname === '/' || pathname === '/onboarding' : pathname.startsWith(item.href) || (item.href === '/path' && pathname.startsWith('/practice'))) ? 'active' : ''}`}
              aria-current={
                pathname === item.href ||
                (item.href === '/path' && pathname.startsWith('/practice'))
                  ? 'page'
                  : undefined
              }
            >
              <Icon name={item.icon} />
              <span>{item.name}</span>
            </ListItemButton>
          ))}
        </List>
        <div className="sidebar-bottom">
          <div className="study-note">
            <Icon name="book" size={21} />
            <p>
              Small steps.
              <br />
              <strong>Real preparation.</strong>
            </p>
            <span>Build confidence through practice, at your own pace.</span>
          </div>
          <div className="local-person">
            <span className="person-avatar">Y</span>
            <div>
              <strong>Your workspace</strong>
              <span>Saved in this browser</span>
            </div>
            <IconButton
              className="icon-button"
              aria-label={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} theme`}
              onClick={() =>
                change((s) => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))
              }
            >
              <Icon name={state.theme === 'light' ? 'moon' : 'sun'} />
            </IconButton>
          </div>
        </div>
      </Paper>
      <div className="workspace">
        <AppBar
          component="header"
          position="static"
          color="inherit"
          elevation={0}
          className="topbar"
          sx={{ borderRadius: 0, flexDirection: 'row' }}
        >
          <span className="breadcrumb">
            Workspace <span>/</span>{' '}
            {pathname.startsWith('/practice')
              ? 'Practice'
              : pathname === '/onboarding' || (!profile && pathname === '/')
                ? 'Build your path'
                : (navigation.find((n) => n.href === pathname)?.name ?? 'Preparation')}
          </span>
          <div className="topbar-right">
            <span className="save-status">
              <Icon name={issue ? 'clock' : 'shield'} size={15} />
              {!ready
                ? 'Loading progress'
                : issue
                  ? 'Check storage status'
                  : saving
                    ? 'Saving on this device'
                    : 'Saved on this device'}
            </span>
            <Link href="/onboarding" className="topbar-link">
              {profile ? 'Change path' : 'Choose a path'}
            </Link>
          </div>
        </AppBar>
        <main id="main" className="main-content" tabIndex={-1}>
          {issue && (
            <Alert
              severity={issue.status === 'unavailable' ? 'warning' : 'error'}
              className={`storage-banner ${issue.status === 'unavailable' ? 'warning' : ''}`}
              role="alert"
            >
              <div>
                <strong>
                  {issue.status === 'conflict'
                    ? 'Another tab has newer progress'
                    : issue.status === 'blocked'
                      ? 'Your saved data needs attention'
                      : 'Progress is not saved'}
                </strong>
                <p>{issue.message}</p>
              </div>
              {issue.status === 'conflict' ? (
                <Action onClick={reload}>Load latest progress</Action>
              ) : issue.status === 'blocked' ? (
                <ConfirmDialog
                  trigger="Reset local data"
                  title="Reset all local data?"
                  confirmLabel="Reset local data"
                  onConfirm={recover}
                  danger
                >
                  <p>
                    This removes all saved paths, responses, and results in this browser. The
                    unreadable data will be replaced with a fresh workspace.
                  </p>
                </ConfirmDialog>
              ) : (
                <Action onClick={retry}>Retry saving</Action>
              )}
            </Alert>
          )}
          {!ready ? (
            <div className="loading-state" role="status">
              <CircularProgress size={18} aria-label="Loading progress" />
              Loading your workspace…
            </div>
          ) : (
            children
          )}
          {ready && (
            <footer className="workspace-footer">
              <span>Made for your next chapter.</span>
              <span>
                {profile
                  ? `${profileLabel(profile)} · ${languages.find((l) => l.id === profile.language)?.label}`
                  : 'Your pace. Your path.'}
              </span>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}
