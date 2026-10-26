'use client';
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import { Icon } from './icons';

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span style={{ transform: `scaleX(${value / 100})` }} />
    </div>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </header>
  );
}
export function EmptyPath() {
  return (
    <div className="empty-state panel">
      <span className="empty-icon">
        <Icon name="path" size={32} />
      </span>
      <h1>A plan for your next role.</h1>
      <p>Choose your role, experience level, and language to put your preparation in order.</p>
      <Link href="/onboarding" className="button primary">
        Choose my path <Icon name="arrow" />
      </Link>
      <p className="small muted">Your progress stays in this browser.</p>
    </div>
  );
}
export function ConfirmDialog({
  trigger,
  title,
  children,
  confirmLabel,
  onConfirm,
  danger = false,
}: {
  trigger: string;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  danger?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  function close() {
    dialog.current?.close();
    opener.current?.focus();
  }
  return (
    <>
      <button
        ref={opener}
        type="button"
        className={`button ${danger ? 'danger-outline' : 'secondary'}`}
        onClick={() => {
          dialog.current?.showModal();
          cancel.current?.focus();
        }}
      >
        {trigger}
      </button>
      <dialog
        ref={dialog}
        className="confirm-dialog"
        aria-labelledby={id}
        onClose={() => opener.current?.focus()}
      >
        <div className="dialog-content">
          <h2 id={id}>{title}</h2>
          <div className="muted">{children}</div>
          <div className="dialog-actions">
            <button ref={cancel} type="button" className="button secondary" onClick={close}>
              Cancel
            </button>
            <button
              type="button"
              className={`button ${danger ? 'danger' : 'primary'}`}
              onClick={() => {
                onConfirm();
                close();
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
export function StatusTag({ complete, started }: { complete: boolean; started: boolean }) {
  return (
    <span className={`status-tag ${complete ? 'complete' : started ? 'in-progress' : ''}`}>
      {complete ? (
        <>
          <Icon name="check" size={13} /> Complete
        </>
      ) : started ? (
        'In progress'
      ) : (
        'Not started'
      )}
    </span>
  );
}
