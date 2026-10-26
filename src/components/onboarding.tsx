'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { roles, tiers, languagesFor } from '@/content/catalog';
import type { Role, Tier, Language } from '@/content/types';
import { enroll } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { Icon } from './icons';
import { Checkbox, Paper, Radio, Step, StepLabel, Stepper } from '@mui/material';
import { Action } from './ui';

const stages = ['Your role', 'Experience', 'Language', 'Your plan'];
export function Onboarding() {
  const { state, profile, locked, change } = useProgress();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [ai, setAi] = useState(false);
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const choices = useRef<HTMLFieldSetElement>(null);
  function showError(message: string) {
    setError(message);
    choices.current?.querySelector('input')?.focus();
  }
  function advance() {
    if (step === 0 && !role) {
      showError('Choose a role to continue.');
      return;
    }
    if (step === 1 && !tier) {
      showError('Choose an experience level to continue.');
      return;
    }
    if (step === 2 && !language) {
      showError('Choose a language to continue.');
      return;
    }
    setError('');
    setStep(step + 1);
    heading.current?.focus();
  }
  const titles = [
    'What’s your next role?',
    'Where are you headed?',
    'Choose your technical language.',
    'A path that fits your goals.',
  ];
  const descriptions = [
    'Choose the work you want to do. We’ll shape the preparation around it.',
    'Prepare for the responsibility you’re targeting, wherever you are today.',
    'Practice with code and scenarios in the language you want to interview in.',
    'Review your choices and decide whether to add AI workflow practice.',
  ];
  return (
    <div className="onboarding">
      <header className="onboarding-intro">
        <p className="eyebrow">A little direction goes a long way</p>
        <h1>
          Your next role.
          <br />
          <span>A clearer path.</span>
        </h1>
        <p>
          From your first aptitude question to your final interview.
          <br className="desktop-break" /> Prepare with a plan, one step at a time.
        </p>
      </header>
      <div className="enrollment-layout">
        <Paper
          component="section"
          className="enrollment-panel panel"
          aria-label="Build your preparation path"
        >
          <Stepper
            alternativeLabel
            activeStep={step}
            className="enrollment-stepper"
            aria-label="Enrollment steps"
          >
            {stages.map((stage, i) => (
              <Step key={stage} completed={i < step}>
                <StepLabel>{stage}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className="enrollment-body">
            <p className="step-label">Step {step + 1} of 4</p>
            <h2 ref={heading} tabIndex={-1}>
              {titles[step]}
            </h2>
            <p className="muted">{descriptions[step]}</p>
            <fieldset
              ref={choices}
              className="choice-fieldset"
              disabled={locked}
              aria-invalid={!!error}
              aria-describedby={error ? 'enrollment-error' : undefined}
            >
              <legend className="sr-only">{stages[step]}</legend>
              {step === 0 && (
                <div className="role-choices">
                  {roles.map((r) => (
                    <label
                      className={`choice-card role-choice ${role === r.id ? 'selected' : ''}`}
                      key={r.id}
                    >
                      <Radio
                        className="choice-radio"
                        disabled={locked}
                        name="role"
                        value={r.id}
                        checked={role === r.id}
                        onChange={() => {
                          setRole(r.id);
                          setError('');
                          if (language && !languagesFor(r.id).some((l) => l.id === language))
                            setLanguage(null);
                        }}
                      />
                      <span className="role-choice-top">
                        <span className="role-icon">
                          <Icon name={r.id} size={26} />
                        </span>
                      </span>
                      <strong>{r.label}</strong>
                      <span className="choice-description">{r.description}</span>
                      <span className="choice-skills">{r.skills}</span>
                    </label>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="tier-choices">
                  {tiers.map((t, i) => (
                    <label
                      className={`choice-card tier-choice ${tier === t.id ? 'selected' : ''}`}
                      key={t.id}
                    >
                      <Radio
                        className="choice-radio"
                        disabled={locked}
                        name="tier"
                        checked={tier === t.id}
                        onChange={() => {
                          setTier(t.id);
                          setError('');
                        }}
                      />
                      <span className="level-bars" aria-hidden="true">
                        {[0, 1, 2].map((n) => (
                          <i key={n} className={n <= i ? 'filled' : ''} />
                        ))}
                      </span>
                      <span>
                        <strong>{t.label}</strong>
                        <span className="choice-description">{t.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {step === 2 && role && (
                <>
                  <div className="language-choices">
                    {languagesFor(role).map((l) => (
                      <label
                        className={`choice-card language-choice ${language === l.id ? 'selected' : ''}`}
                        key={l.id}
                      >
                        <Radio
                          className="choice-radio"
                          disabled={locked}
                          name="language"
                          checked={language === l.id}
                          onChange={() => {
                            setLanguage(l.id);
                            setError('');
                          }}
                        />
                        <span className="language-mark" aria-hidden="true">
                          {l.short}
                        </span>
                        <span>
                          <strong>{l.label}</strong>
                          <span className="choice-description">{l.description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {role === 'fullstack' && (
                    <p className="field-note">
                      This is your primary backend language. Browser scenarios use
                      JavaScript/TypeScript, HTML, and CSS.
                    </p>
                  )}
                </>
              )}
              {step === 3 && (
                <>
                  <div className="plan-summary">
                    <div>
                      <span className="muted small">Target role</span>
                      <strong>{roles.find((r) => r.id === role)?.title}</strong>
                    </div>
                    <div>
                      <span className="muted small">Experience</span>
                      <strong>{tiers.find((t) => t.id === tier)?.label}</strong>
                    </div>
                    <div>
                      <span className="muted small">Technical language</span>
                      <strong>{languagesFor(role!).find((l) => l.id === language)?.label}</strong>
                    </div>
                  </div>
                  <label className={`ai-option ${ai ? 'selected' : ''}`}>
                    <Checkbox
                      disabled={locked}
                      checked={ai}
                      onChange={(e) => setAi(e.target.checked)}
                    />
                    <span>
                      <strong>Include AI workflow preparation</strong>
                      <span>
                        Practice planning, reviewing generated code, and verifying changes.
                        Optional, with separate progress.
                      </span>
                    </span>
                  </label>
                  <p className="local-data-note">
                    <Icon name="shield" size={18} />
                    <span>
                      Progress saves in this browser. No sign-in needed. Clearing site data removes
                      your saved work.
                    </span>
                  </p>
                </>
              )}
            </fieldset>
            {error && (
              <p className="form-error" role="alert" id="enrollment-error">
                {error}
              </p>
            )}
          </div>
          <div className="enrollment-actions">
            <span>
              {step === 0 ? (
                'A plan built around your goals'
              ) : (
                <Action
                  variant="text"
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep(step - 1);
                  }}
                >
                  Back
                </Action>
              )}
            </span>
            {step < 3 ? (
              <Action variant="contained" onClick={advance} disabled={locked}>
                Continue <Icon name="arrow" size={17} />
              </Action>
            ) : (
              <Action
                variant="contained"
                disabled={locked}
                onClick={() => {
                  if (
                    role &&
                    tier &&
                    language &&
                    change((s) => enroll(s, { role, tier, language }, ai))
                  )
                    router.push('/');
                }}
              >
                Build my path <Icon name="arrow" size={17} />
              </Action>
            )}
          </div>
        </Paper>
        <aside className="path-preview">
          <p className="eyebrow">Your preparation, in order</p>
          <h3>More than a question bank.</h3>
          <p className="muted">
            A guided path from knowing the basics to explaining your decisions.
          </p>
          <ol className="preview-trail">
            {[
              ['Aptitude & reasoning', 'Think through problems clearly.'],
              ['Role & language fundamentals', 'Know the concepts behind the code.'],
              ['Practical engineering', 'Work through real-world scenarios.'],
              ['Interview preparation', 'Tell the story of your work.'],
            ].map(([title, body], i) => (
              <li key={title}>
                <span className="trail-node">{i + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="preview-bottom">
            <span className="preview-label">Built for your level</span>
            <p>
              Junior, mid-level, or senior.
              <br />
              Different responsibilities. Different preparation.
            </p>
          </div>
        </aside>
      </div>
      {Object.keys(state.profiles).length > 0 && (
        <section className="saved-paths">
          <h3>{profile ? 'Your saved paths' : 'Pick up where you left off'}</h3>
          <div className="saved-path-list">
            {Object.entries(state.profiles).map(([id, p]) => (
              <Action
                key={id}
                disabled={locked}
                onClick={() => {
                  if (change((s) => ({ ...s, activeId: id }))) router.push('/');
                }}
              >
                {tiers.find((t) => t.id === p.tier)?.label}{' '}
                {roles.find((r) => r.id === p.role)?.label} ·{' '}
                {languagesFor(p.role).find((l) => l.id === p.language)?.label}
              </Action>
            ))}
          </div>
        </section>
      )}
      <div className="onboarding-footnote">
        <Icon name="shield" size={16} />
        <span>No account. No pressure. Your progress stays with you, in this browser.</span>
      </div>
    </div>
  );
}
