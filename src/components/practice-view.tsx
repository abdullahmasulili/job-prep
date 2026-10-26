'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getModule, getModules, profileLabel, REVIEWED_ON } from '@/content/catalog';
import type { PrepModule } from '@/content/types';
import { currentModule, moduleStatus, updateProfile } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { EmptyPath, ProgressBar } from './ui';
import { Quiz } from './quiz';
import { Exercise } from './exercise';
import { Icon } from './icons';

const tabs = ['Preparation', 'Assessment', 'Exercise'];
export function PracticeView({ moduleId }: { moduleId: string }) {
  const { profile, state } = useProgress();
  if (!profile) return <EmptyPath />;
  const content = getModule(profile, moduleId);
  if (!content)
    return (
      <div className="empty-state panel">
        <h1>Module not found</h1>
        <p>This module isn’t part of your preparation path. Choose one from your roadmap.</p>
        <Link href="/path" className="button primary">
          Return to my path
        </Link>
      </div>
    );
  if (content.optional && !profile.aiEnabled)
    return (
      <div className="empty-state panel">
        <h1>Add AI workflow preparation</h1>
        <p>
          This optional extension is currently disabled. Enable it to practice; any previous work is
          preserved.
        </p>
        <Link href="/settings" className="button primary">
          Enable in Settings
        </Link>
      </div>
    );
  return <PracticeWorkspace key={`${state.activeId}:${moduleId}`} module={content} />;
}
function PracticeWorkspace({ module }: { module: PrepModule }) {
  const { state, profile, change, changeModule, locked } = useProgress();
  const [tab, setTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = module.id;
  const activeId = state.activeId;
  useEffect(() => {
    if (activeId)
      change((s) =>
        updateProfile(s, activeId, (p) => (p.lastModule === id ? p : { ...p, lastModule: id })),
      );
  }, [activeId, id, change]);
  if (!profile) return null;
  const progress = currentModule(module, profile.modules[module.id]);
  const status = moduleStatus(module, progress);
  const modules = getModules(profile);
  const index = modules.findIndex((m) => m.id === id);
  const next = modules.slice(index + 1).find((m) => !m.optional || profile.aiEnabled);
  return (
    <>
      <header className="practice-header">
        <Link href="/path" className="back-link">
          <Icon name="arrow" size={15} /> Back to my path
        </Link>
        <p className="eyebrow">
          {module.optional ? 'Optional extension' : `Module ${index + 1} of 4`} · {module.subtitle}
        </p>
        <h1>{module.title}</h1>
        <p>{module.description}</p>
        <div className="practice-meta">
          <span>
            <Icon name="clock" size={14} />
            {module.minutes} min estimate
          </span>
          <span>{profileLabel(profile)}</span>
          <span>4 questions · 1 self-reviewed exercise</span>
        </div>
      </header>
      {status.complete && (
        <div className="practice-complete" role="status">
          <Icon name="check" size={22} />
          <div>
            <h3>Module complete</h3>
            <p>You’ve prepared, passed the quiz, and reviewed your response.</p>
          </div>
          <Link href={next ? `/practice/${next.id}` : '/progress'} className="button secondary">
            {next ? 'Next module' : 'View my progress'}
          </Link>
        </div>
      )}
      <div className="practice-layout">
        <section className="practice-panel panel">
          <div className="practice-tabs" role="tablist" aria-label="Practice activities">
            {tabs.map((title, i) => (
              <button
                key={title}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                className={`practice-tab ${tab === i ? 'active' : ''}`}
                type="button"
                role="tab"
                id={`tab-${i}`}
                aria-controls={`panel-${i}`}
                aria-selected={tab === i}
                tabIndex={tab === i ? 0 : -1}
                onClick={() => setTab(i)}
                onKeyDown={(e) => {
                  let target: number | undefined;
                  if (e.key === 'ArrowRight') target = (i + 1) % tabs.length;
                  if (e.key === 'ArrowLeft') target = (i + tabs.length - 1) % tabs.length;
                  if (e.key === 'Home') target = 0;
                  if (e.key === 'End') target = tabs.length - 1;
                  if (target !== undefined) {
                    e.preventDefault();
                    setTab(target);
                    tabRefs.current[target]?.focus();
                  }
                }}
              >
                <span aria-hidden="true">{i + 1}</span>
                {title}
              </button>
            ))}
          </div>
          {tabs.map((_, i) => (
            <div
              key={i}
              id={`panel-${i}`}
              role="tabpanel"
              aria-labelledby={`tab-${i}`}
              hidden={tab !== i}
              tabIndex={0}
            >
              {i === 0 ? (
                <div className="practice-body">
                  <h2>Prepare with a purpose.</h2>
                  <p>
                    Work through each step and check it when you can explain the idea in your own
                    words.
                  </p>
                  <ol className="lesson-steps">
                    {module.steps.map((step, stepIndex) => (
                      <li
                        key={step.title}
                        className={`lesson-step ${progress.prep[stepIndex] ? 'checked' : ''}`}
                      >
                        <label className="lesson-check">
                          <input
                            type="checkbox"
                            checked={progress.prep[stepIndex] ?? false}
                            disabled={locked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              changeModule(module, (p) => ({
                                ...p,
                                prep: module.steps.map((_, j) =>
                                  j === stepIndex ? checked : !!p.prep[j],
                                ),
                              }));
                            }}
                          />
                          <span>
                            <h3>{step.title}</h3>
                            <p>{step.body}</p>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ol>
                  <div className="reading-sources">
                    <strong>Read further</strong>
                    <ul>
                      {module.sources.map((source) => (
                        <li key={source.url}>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            {source.label}
                            <span className="sr-only"> (opens a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="small muted">
                      References reviewed {REVIEWED_ON}. Original practice content; hiring processes
                      vary by employer.
                    </p>
                  </div>
                  <div className="practice-next">
                    <button
                      className="button primary"
                      type="button"
                      onClick={() => {
                        setTab(1);
                        tabRefs.current[1]?.focus();
                      }}
                    >
                      Start assessment <Icon name="arrow" size={17} />
                    </button>
                  </div>
                </div>
              ) : i === 1 ? (
                <Quiz module={module} progress={progress} />
              ) : (
                <Exercise module={module} progress={progress} active={tab === i} />
              )}
            </div>
          ))}
        </section>
        <aside className="practice-sidebar panel">
          <h3>To complete this module</h3>
          <ul className="completion-requirements">
            {[
              ['Preparation checklist complete', status.preparation],
              ['Assessment passed (75%+)', status.quiz],
              ['Response written & self-reviewed', status.exercise],
            ].map(([label, done]) => (
              <li className={done ? 'met' : ''} key={String(label)}>
                <Icon name={done ? 'check' : 'clock'} size={15} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <ProgressBar
            value={Math.round((status.requirements / 3) * 100)}
            label="Module requirements complete"
          />
          <p className="field-note">
            {status.requirements} of 3 requirements met.
            <br />
            Your response is self-reviewed. Passing the quiz does not verify an implementation.
          </p>
        </aside>
      </div>
    </>
  );
}
