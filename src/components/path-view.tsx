'use client';
import Link from 'next/link';
import { getModules, profileLabel } from '@/content/catalog';
import { moduleStatus, pathStats } from '@/lib/progress';
import type { PrepModule } from '@/content/types';
import { useProgress } from './progress-provider';
import { Action, EmptyPath, PageHeader, ProgressBar, StatusTag } from './ui';
import { ListItemButton, Paper } from '@mui/material';
import { Icon } from './icons';

export function ModuleRow({
  module,
  index,
  compact = false,
}: {
  module: PrepModule;
  index: number;
  compact?: boolean;
}) {
  const { profile } = useProgress();
  if (!profile) return null;
  const status = moduleStatus(module, profile.modules[module.id]);
  return (
    <ListItemButton
      component={Link}
      href={`/practice/${module.id}`}
      className={`module-row ${compact ? 'compact' : ''}`}
    >
      <span className={`module-number ${status.complete ? 'done' : ''}`}>
        {status.complete ? <Icon name="check" size={21} /> : String(index + 1).padStart(2, '0')}
      </span>
      <div className="module-row-content">
        <div className="module-row-title">
          <h3>{module.title}</h3>
          <StatusTag complete={status.complete} started={status.started} />
        </div>
        <p className="muted">{compact ? module.subtitle : module.description}</p>
        <div className="module-meta">
          <span>
            <Icon name="clock" size={14} />
            {module.minutes} min estimate
          </span>
          <span>4 questions</span>
          {!compact && <span>{status.requirements} of 3 requirements</span>}
        </div>
      </div>
      <Icon name="arrow" size={20} />
    </ListItemButton>
  );
}
export function PathView() {
  const { profile } = useProgress();
  if (!profile) return <EmptyPath />;
  const modules = getModules(profile);
  const stats = pathStats(modules, profile);
  return (
    <>
      <PageHeader
        eyebrow="Your preparation path"
        title="One step closer, every session."
        description={`${profileLabel(profile)}. Follow the suggested order, or focus on the skills you need most.`}
      />
      <Paper className="path-summary panel">
        <div>
          <strong>
            {stats.completed} of {stats.total} modules
          </strong>
          <span className="muted small">Core preparation complete</span>
        </div>
        <ProgressBar value={stats.percent} label="Core preparation completion" />
        <strong className="percentage">{stats.percent}%</strong>
      </Paper>
      <Paper component="section" className="panel module-list" aria-label="Required modules">
        {modules
          .filter((m) => !m.optional)
          .map((module, index) => (
            <ModuleRow key={module.id} module={module} index={index} />
          ))}
      </Paper>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Go a little further</p>
          <h2>AI workflow extension</h2>
        </div>
        <span className="small muted">Separate from core progress</span>
      </div>
      {profile.aiEnabled ? (
        <Paper component="section" className="panel module-list">
          <ModuleRow module={modules.find((m) => m.id === 'ai')!} index={stats.total} />
        </Paper>
      ) : (
        <Paper component="section" className="panel optional-panel">
          <div className="optional-symbol">
            <Icon name="fullstack" size={26} />
          </div>
          <div>
            <h3>Work thoughtfully with AI tools.</h3>
            <p className="muted">
              Practice giving context, reviewing suggestions, and verifying changes. Add it when
              you’re ready.
            </p>
          </div>
          <Action href="/settings">Enable in Settings</Action>
        </Paper>
      )}
      <p className="field-note">
        Each module combines a preparation checklist, a multiple-choice assessment, and a
        self-reviewed exercise. All modules are available at any time.
      </p>
    </>
  );
}
