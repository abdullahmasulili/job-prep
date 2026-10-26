'use client';
import Link from 'next/link';
import { getModules, profileLabel, languages } from '@/content/catalog';
import { moduleStatus, pathStats } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { PageHeader, ProgressBar } from './ui';
import { ModuleRow } from './path-view';
import { Onboarding } from './onboarding';
import { Icon } from './icons';

export function Dashboard() {
  const { profile } = useProgress();
  if (!profile) return <Onboarding />;
  const modules = getModules(profile);
  const stats = pathStats(modules, profile);
  const core = modules.filter((m) => !m.optional);
  const next = core.find((m) => !moduleStatus(m, profile.modules[m.id]).complete);
  const recent = profile.lastModule
    ? modules.find((m) => m.id === profile.lastModule && (!m.optional || profile.aiEnabled))
    : undefined;
  const continueModule =
    recent && !moduleStatus(recent, profile.modules[recent.id]).complete ? recent : next;
  const attemptCount = Object.values(profile.modules).reduce(
    (sum, m) => sum + m.attempts.length,
    0,
  );
  return (
    <>
      <PageHeader
        eyebrow="Your preparation, your pace"
        title={
          stats.percent === 100 ? 'Look how far you’ve come.' : 'Your next chapter starts here.'
        }
        description="A focused plan. A little practice. Progress you can see."
        action={
          <Link href="/onboarding" className="button secondary">
            Change path
          </Link>
        }
      />
      <section className="current-path panel">
        <div className="current-path-main">
          <span className="path-label">Your current path</span>
          <div className="current-path-title">
            <span className="role-icon">
              <Icon name={profile.role} size={29} />
            </span>
            <div>
              <h2>{profileLabel(profile)}</h2>
              <p>
                {languages.find((l) => l.id === profile.language)?.label} <span>·</span>{' '}
                {profile.aiEnabled ? 'AI extension included' : 'Core preparation'}
              </p>
            </div>
          </div>
          <div className="current-progress">
            <div>
              <span>{stats.completed} of 4 modules</span>
              <strong>{stats.percent}% complete</strong>
            </div>
            <ProgressBar value={stats.percent} label="Required path completion" />
          </div>
        </div>
        <div className="continue-block">
          <span className="small muted">
            {continueModule ? 'Your next step' : 'Core path complete'}
          </span>
          <h3>{continueModule?.title ?? 'Keep your skills fresh.'}</h3>
          <p className="muted small">
            {continueModule
              ? 'Prepare, practice, and reflect.'
              : 'Revisit a module or try the optional extension.'}
          </p>
          <Link
            className="button primary"
            href={continueModule ? `/practice/${continueModule.id}` : '/path'}
          >
            {continueModule ? 'Continue practice' : 'Review my path'}
            <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <div className="dashboard-layout">
        <section>
          <div className="section-heading">
            <h2>Your preparation roadmap</h2>
            <Link href="/path" className="text-link">
              View full path
            </Link>
          </div>
          <div className="panel module-list">
            {core.map((module, index) => (
              <ModuleRow key={module.id} module={module} index={index} compact />
            ))}
          </div>
        </section>
        <aside className="dashboard-aside">
          <div className="panel practice-snapshot">
            <p className="eyebrow">Every attempt counts</p>
            <h3>Your practice so far</h3>
            <div className="snapshot-stat">
              <strong>{attemptCount}</strong>
              <span>Saved quiz {attemptCount === 1 ? 'attempt' : 'attempts'}</span>
            </div>
            <div className="snapshot-stat">
              <strong>
                {stats.completed}
                <small> / 4</small>
              </strong>
              <span>Core modules complete</span>
            </div>
            <Link href="/progress" className="text-link">
              See your progress
            </Link>
          </div>
          <div className="study-tip">
            <Icon name="book" size={22} />
            <h3>Understand the “why.”</h3>
            <p>
              Every answer comes with an explanation. Spend a moment with the ones you miss before
              trying again.
            </p>
          </div>
        </aside>
      </div>
      <section className="optional-callout">
        <div className="optional-symbol">
          <Icon name="fullstack" size={25} />
        </div>
        <div>
          <span className="small muted">Optional extension</span>
          <h3>Bring AI into your workflow, thoughtfully.</h3>
          <p>
            Learn to plan, review, and verify AI-assisted work. Your core progress stays
            independent.
          </p>
        </div>
        <Link href={profile.aiEnabled ? '/practice/ai' : '/settings'} className="button secondary">
          {profile.aiEnabled ? 'Practice AI workflows' : 'Add AI preparation'}
        </Link>
      </section>
    </>
  );
}
