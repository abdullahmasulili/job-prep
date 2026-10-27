'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getModule, getModules, profileLabel, REVIEWED_ON } from '@/content/catalog';
import type { PrepModule } from '@/content/types';
import { currentModule, moduleStatus, updateProfile, exerciseList } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { Action, EmptyPath, ProgressBar } from './ui';
import { Alert, Checkbox, Paper, Tab, Tabs } from '@mui/material';
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
      <Paper className="empty-state panel">
        <h1>Module not found</h1>
        <p>This module isn’t part of your preparation path. Choose one from your roadmap.</p>
        <Action href="/path" variant="contained">
          Return to my path
        </Action>
      </Paper>
    );
  if (content.optional && !profile.aiEnabled)
    return (
      <Paper className="empty-state panel">
        <h1>Add AI workflow preparation</h1>
        <p>
          This optional extension is currently disabled. Enable it to practice; any previous work is
          preserved.
        </p>
        <Action href="/settings" variant="contained">
          Enable in Settings
        </Action>
      </Paper>
    );
  return <PracticeWorkspace key={`${state.activeId}:${moduleId}`} module={content} />;
}
function PracticeWorkspace({ module }: { module: PrepModule }) {
  const { state, profile, change, changeModule, locked } = useProgress();
  const [tab, setTab] = useState(0);
  const tabRefs = useRef<(HTMLElement | null)[]>([]);
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
          <span>
            {module.questions.length} questions in bank · {exerciseList(module).length}{' '}
            self-reviewed exercises
          </span>
        </div>
      </header>
      {profile.modules[module.id] && profile.modules[module.id].version !== module.version && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This module has new questions. Earlier results and written drafts are kept. Complete a
          fresh assessment and review two exercises for the updated module.
        </Alert>
      )}
      {status.complete && (
        <div className="practice-complete" role="status">
          <Icon name="check" size={22} />
          <div>
            <h3>Module complete</h3>
            <p>You’ve prepared, passed the quiz, and reviewed two exercises.</p>
          </div>
          <Action href={next ? `/practice/${next.id}` : '/progress'}>
            {next ? 'Next module' : 'View my progress'}
          </Action>
        </div>
      )}
      <div className="practice-layout">
        <Paper component="section" className="practice-panel panel">
          <Tabs
            value={tab}
            onChange={(_, value: number) => setTab(value)}
            selectionFollowsFocus
            className="practice-tabs"
            aria-label="Practice activities"
          >
            {tabs.map((title, i) => (
              <Tab
                key={title}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`tab-${i}`}
                aria-controls={`panel-${i}`}
                label={title}
                value={i}
              />
            ))}
          </Tabs>
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
                          <Checkbox
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
                    <Action
                      variant="contained"
                      type="button"
                      onClick={() => {
                        setTab(1);
                        tabRefs.current[1]?.focus();
                      }}
                    >
                      Start assessment <Icon name="arrow" size={17} />
                    </Action>
                  </div>
                </div>
              ) : i === 1 ? (
                <Quiz module={module} progress={progress} />
              ) : (
                <Exercise module={module} progress={progress} active={tab === i} />
              )}
            </div>
          ))}
        </Paper>
        <Paper component="aside" className="practice-sidebar panel">
          <h3>To complete this module</h3>
          <ul className="completion-requirements">
            {[
              ['Preparation checklist complete', status.preparation],
              ['Assessment passed (75%+)', status.quiz],
              [
                `${status.reviewedExercises}/${status.requiredExercises} exercises written & self-reviewed`,
                status.exercise,
              ],
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
        </Paper>
      </div>
    </>
  );
}
