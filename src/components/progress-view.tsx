'use client';
import Link from 'next/link';
import { getModules, profileLabel } from '@/content/catalog';
import { moduleStatus, pathStats, attemptScore } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { Action, EmptyPath, PageHeader, ProgressBar, StatusTag } from './ui';
import { Paper } from '@mui/material';
import { Icon } from './icons';

export function ProgressView() {
  const { profile } = useProgress();
  if (!profile) return <EmptyPath />;
  const modules = getModules(profile);
  const stats = pathStats(modules, profile);
  const history = modules
    .flatMap((m) =>
      (profile.modules[m.id]?.attempts ?? []).map((a) => ({
        ...a,
        score: a.version === m.version ? attemptScore(m, a) : a.score,
        module: m,
      })),
    )
    .sort((a, b) => b.at.localeCompare(a.at));
  return (
    <>
      <PageHeader
        eyebrow="See how far you’ve come"
        title="Progress, one step at a time."
        description={`${profileLabel(profile)}. Your activity and results, without a made-up readiness score.`}
      />
      <div className="progress-overview">
        <Paper component="section" className="panel core-progress">
          <div className="progress-heading">
            <span>Core preparation</span>
            <strong>{stats.percent}%</strong>
          </div>
          <ProgressBar value={stats.percent} label="Core modules complete" />
          <p className="muted">{stats.completed} of 4 required modules complete</p>
        </Paper>
        <Paper component="section" className="panel ai-progress">
          <Icon name="fullstack" size={22} />
          <div>
            <strong>AI workflow extension</strong>
            <p className="muted">
              {stats.aiCompleted
                ? 'Complete'
                : profile.aiEnabled
                  ? 'Available to practice'
                  : 'Not enabled'}
            </p>
            <span className="small muted">Tracked separately from your core path.</span>
          </div>
        </Paper>
      </div>
      <div className="section-heading">
        <h2>Module breakdown</h2>
        <span className="small muted">Preparation · Quiz · Self-review</span>
      </div>
      <Paper component="section" className="panel breakdown-list">
        {modules
          .filter((m) => !m.optional || profile.aiEnabled)
          .map((m) => {
            const p = profile.modules[m.id];
            const s = moduleStatus(m, p);
            const best = attemptScore(m, p?.best);
            return (
              <div className="breakdown-row" key={m.id}>
                <div>
                  <Link href={`/practice/${m.id}`} className="breakdown-title">
                    {m.title}
                  </Link>
                  <div className="requirement-list">
                    {[
                      ['Preparation', s.preparation],
                      ['Quiz passed', s.quiz],
                      ['Self-review', s.exercise],
                    ].map(([label, done]) => (
                      <span key={String(label)} className={done ? 'met' : ''}>
                        <Icon name={done ? 'check' : 'clock'} size={14} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="breakdown-result">
                  <StatusTag complete={s.complete} started={s.started} />
                  <span className="small muted">
                    {best === null ? 'No quiz result yet' : `Best quiz: ${best}%`}
                  </span>
                </div>
              </div>
            );
          })}
      </Paper>
      <div className="section-heading">
        <h2>Quiz attempt history</h2>
        <span className="small muted">Most recent 20 per module retained</span>
      </div>
      <Paper component="section" className="panel history-panel">
        {history.length === 0 ? (
          <div className="history-empty">
            <Icon name="progress" size={28} />
            <h3>Your first attempt starts the story.</h3>
            <p className="muted">Complete a quiz to see your answers and results here.</p>
            <Action href="/path">Choose a module</Action>
          </div>
        ) : (
          <ol className="attempt-list">
            {history.map((a) => (
              <li key={a.id}>
                <span
                  className={`attempt-score ${a.score !== null && a.score >= 75 ? 'passed' : ''}`}
                >
                  {a.score === null ? '—' : `${a.score}%`}
                </span>
                <div>
                  <strong>{a.module.title}</strong>
                  <span>
                    {new Date(a.at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}{' '}
                    ·{' '}
                    {a.version === a.module.version
                      ? a.score === null
                        ? 'Incompatible attempt'
                        : a.score >= 75
                          ? 'Passed'
                          : 'Keep practicing'
                      : 'Earlier content version'}
                  </span>
                </div>
                <Link href={`/practice/${a.module.id}`} className="text-link">
                  Review module
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Paper>
      <p className="field-note">
        Quizzes are objectively scored. Written exercises are self-reviewed, and completion records
        preparation activity rather than verified professional competence.
      </p>
    </>
  );
}
