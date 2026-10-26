'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileLabel, profileDetails, REVIEWED_ON } from '@/content/catalog';
import { resetProfile, unenroll, updateProfile } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { Action, ConfirmDialog, PageHeader } from './ui';
import { Alert, Checkbox, Paper, Radio } from '@mui/material';
import { Icon } from './icons';

export function SettingsView() {
  const { state, profile, change, locked } = useProgress();
  const router = useRouter();
  const [notice, setNotice] = useState('');
  return (
    <>
      <PageHeader
        eyebrow="Make this workspace yours"
        title="Your preparation settings."
        description="Manage your path, optional practice, and local progress."
      />
      {notice && (
        <Alert severity="success" role="status" sx={{ mb: 3 }}>
          {notice}
        </Alert>
      )}
      <Paper component="section" className="panel settings-section">
        <div className="settings-section-heading">
          <Icon name="path" />
          <h2>Current path</h2>
        </div>
        {profile ? (
          <>
            <div className="settings-row">
              <div>
                <strong>{profileLabel(profile)}</strong>
                <p className="muted">{profileDetails(profile)}</p>
              </div>
              <Action href="/onboarding">Change path</Action>
            </div>
            <label className="settings-check">
              <Checkbox
                checked={profile.aiEnabled}
                disabled={locked}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  if (
                    change((s) =>
                      updateProfile(s, s.activeId!, (p) => ({ ...p, aiEnabled: enabled })),
                    )
                  )
                    setNotice(
                      enabled
                        ? 'AI workflow preparation enabled.'
                        : 'AI workflow preparation disabled. Existing work is preserved.',
                    );
                }}
              />
              <span>
                <strong>Include AI workflow preparation</strong>
                <span>Optional, with separate progress. Turning it off preserves your work.</span>
              </span>
            </label>
          </>
        ) : (
          <div className="settings-row">
            <p className="muted">You are not enrolled in a path.</p>
            <Action href="/onboarding" variant="contained">
              Choose my path
            </Action>
          </div>
        )}
      </Paper>
      <Paper component="section" className="panel settings-section">
        <div className="settings-section-heading">
          <Icon name="sun" />
          <h2>Appearance</h2>
        </div>
        <fieldset className="theme-options" disabled={locked}>
          <legend>Choose a comfortable reading theme</legend>
          {(['light', 'dark'] as const).map((theme) => (
            <label
              key={theme}
              className={`theme-choice ${state.theme === theme ? 'selected' : ''}`}
            >
              <Radio
                disabled={locked}
                name="theme"
                value={theme}
                checked={state.theme === theme}
                onChange={() => change((s) => ({ ...s, theme }))}
              />
              <Icon name={theme === 'light' ? 'sun' : 'moon'} />
              {theme === 'light' ? 'Light' : 'Dark'}
            </label>
          ))}
        </fieldset>
      </Paper>
      <Paper component="section" className="panel settings-section">
        <div className="settings-section-heading">
          <Icon name="shield" />
          <h2>Your data stays here</h2>
        </div>
        <p className="muted">
          Choices, drafts, and results are saved in this browser. They do not sync across devices.
          Clearing your browser’s site data removes saved progress. No account or AI service is
          required.
        </p>
        <p className="small muted">
          Curriculum references reviewed {REVIEWED_ON}. Questions are bundled with the app and
          reviewed when it is updated. Preparation follows published competency and engineering
          guidance; employers may assess candidates differently.
        </p>
      </Paper>
      {profile && (
        <Paper component="section" className="panel settings-section danger-section">
          <h2>Manage enrollment</h2>
          <div className="settings-row">
            <div>
              <strong>Reset this path</strong>
              <p className="muted">
                Clear its checklists, drafts, quiz results, and optional AI progress. Keep your
                enrollment.
              </p>
            </div>
            <ConfirmDialog
              trigger="Reset path"
              title="Reset this path?"
              confirmLabel="Reset path"
              danger
              onConfirm={() => {
                if (change((s) => resetProfile(s, s.activeId!)))
                  setNotice('Path progress reset. Your enrollment is unchanged.');
              }}
            >
              <p>
                Reset all preparation work for{' '}
                <strong>
                  {profileLabel(profile)} · {profileDetails(profile)}
                </strong>
                ?
              </p>
              <p>
                Its drafts, checklists, quiz history and AI progress will be erased. Other saved
                paths are unaffected.
              </p>
            </ConfirmDialog>
          </div>
          <div className="settings-row">
            <div>
              <strong>Unenroll from this path</strong>
              <p className="muted">
                Leave the path and keep its saved work. Enroll again later to resume.
              </p>
            </div>
            <ConfirmDialog
              trigger="Unenroll"
              title="Unenroll from this path?"
              confirmLabel="Unenroll"
              onConfirm={() => {
                if (change(unenroll)) router.push('/onboarding');
              }}
            >
              <p>
                Leave <strong>{profileLabel(profile)}</strong>? Your drafts and results stay saved
                in this browser. Re-enrolling in the same role, tier, language, and mobile stack
                resumes them.
              </p>
            </ConfirmDialog>
          </div>
        </Paper>
      )}
    </>
  );
}
