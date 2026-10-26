'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { roles, tiers, languages, languagesFor, profileDetails } from '@/content/catalog';
import { mobileStackFor } from '@/content/mobile';
import type { Role, Tier, Language, MobileStack } from '@/content/types';
import { enroll } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { Icon } from './icons';
import { Checkbox, Paper, Radio, Step, StepLabel, Stepper } from '@mui/material';
import { Action } from './ui';
import { MobileStackChoices } from './mobile-stack-choices';

const stages = ['Your role', 'Experience', 'Technical focus', 'Your plan'];
export function Onboarding() {
  const { state, profile, locked, change } = useProgress();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [mobileIncluded, setMobileIncluded] = useState(false);
  const [mobileStack, setMobileStack] = useState<MobileStack | null>(null);
  const [ai, setAi] = useState(false);
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const choices = useRef<HTMLFieldSetElement>(null);
  function showError(message: string, selector = 'input') {
    setError(message);
    choices.current?.querySelector<HTMLInputElement>(selector)?.focus();
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
    if (
      step === 2 &&
      (role === 'mobile' || (role === 'fullstack' && mobileIncluded)) &&
      !mobileStack
    ) {
      showError('Choose a mobile stack to continue.', 'input[name="mobile-stack"]');
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
    role === 'mobile' ? 'Choose your mobile stack.' : 'Choose your technical language.',
    'A path that fits your goals.',
  ];
  const descriptions = [
    'Choose the work you want to do. We’ll shape the preparation around it.',
    'Prepare for the responsibility you’re targeting, wherever you are today.',
    role === 'mobile'
      ? 'Choose a cross-platform stack or native Android or iOS development.'
      : 'Practice with code and scenarios in the language you want to interview in.',
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
                          setMobileStack(null);
                          setMobileIncluded(false);
                          if (r.id === 'mobile') setLanguage(null);
                          if (language && !languagesFor(r.id).some((l) => l.id === language))
                            setLanguage(null);
                        }}
                      />
                      <span className="role-choice-top">
                        <span className="role-icon">
                          <Icon name={r.id === 'mobile' ? 'frontend' : r.id} size={26} />
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
                  {role === 'fullstack' && (
                    <label className={`ai-option ${mobileIncluded ? 'selected' : ''}`}>
                      <Checkbox
                        disabled={locked}
                        checked={mobileIncluded}
                        onChange={(e) => {
                          setMobileIncluded(e.target.checked);
                          setError('');
                          if (!e.target.checked) setMobileStack(null);
                        }}
                      />
                      <span>
                        <strong>Include mobile development</strong>
                        <span>
                          Add a required mobile module alongside your web and backend preparation.
                        </span>
                      </span>
                    </label>
                  )}
                  {(role === 'mobile' || (role === 'fullstack' && mobileIncluded)) && (
                    <MobileStackChoices
                      value={mobileStack}
                      disabled={locked}
                      onChange={(stack) => {
                        setMobileStack(stack);
                        setError('');
                        if (role === 'mobile') setLanguage(mobileStackFor(stack).languages[0]);
                      }}
                    />
                  )}
                  {role === 'mobile' && mobileStack && (
                    <p className="field-note">
                      Choose your interview language. Your stack’s default is selected below.
                    </p>
                  )}
                  {(role !== 'mobile' || mobileStack) && (
                    <>
                      <div className="language-choices">
                        {languagesFor(role, mobileStack ?? undefined).map((l) => (
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
                              <span className="choice-description">
                                {role === 'mobile' && l.id === 'java'
                                  ? 'Native Android applications'
                                  : l.description}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
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
                    {mobileStack && (
                      <div>
                        <span className="muted small">Mobile stack</span>
                        <strong>{mobileStackFor(mobileStack).label}</strong>
                        {role === 'fullstack' && (
                          <span className="muted small">
                            5 core modules · Mobile code in{' '}
                            {
                              languages.find(
                                (l) => l.id === mobileStackFor(mobileStack).languages[0],
                              )!.label
                            }
                          </span>
                        )}
                      </div>
                    )}
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
                    change((s) =>
                      enroll(
                        s,
                        { role, tier, language, ...(mobileStack ? { mobileStack } : {}) },
                        ai,
                      ),
                    )
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
              ...(role === 'fullstack' && mobileIncluded
                ? [['Mobile development', 'Connect a mobile client to your backend.']]
                : []),
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
                {roles.find((r) => r.id === p.role)?.label} · {profileDetails(p)}
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
