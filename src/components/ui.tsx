'use client';
import Link from 'next/link';
import { useId, useRef, useState, type ReactNode } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Typography,
  type ButtonProps,
} from '@mui/material';
import { Icon } from './icons';

export function Action({
  href,
  variant = 'outlined',
  color,
  className = '',
  ...props
}: ButtonProps) {
  const shared: ButtonProps = {
    ...props,
    variant,
    color: color ?? (variant === 'contained' ? 'primary' : 'inherit'),
    className: `button action ${className}`,
  };
  return href ? (
    <Button component={Link} href={href} {...shared} onClick={props.onClick} />
  ) : (
    <Button {...shared} onClick={props.onClick} />
  );
}
export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <LinearProgress
      variant="determinate"
      value={value}
      aria-label={label}
      className="progress-track"
    />
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
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(27px, 2.5vw, 36px)',
            letterSpacing: '-.03em',
          }}
        >
          {title}
        </Typography>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </header>
  );
}
export function EmptyPath() {
  return (
    <Paper className="empty-state panel">
      <span className="empty-icon">
        <Icon name="path" size={32} />
      </span>
      <h1>A plan for your next role.</h1>
      <p>Choose your role, experience level, and language to put your preparation in order.</p>
      <Action href="/onboarding" variant="contained">
        Choose my path <Icon name="arrow" />
      </Action>
      <p className="small muted">Your progress stays in this browser.</p>
    </Paper>
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
  const [open, setOpen] = useState(false);
  const cancel = useRef<HTMLButtonElement>(null);
  const id = useId();
  return (
    <>
      <Action color={danger ? 'error' : 'inherit'} onClick={() => setOpen(true)}>
        {trigger}
      </Action>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby={id}
        slotProps={{ transition: { onEntered: () => cancel.current?.focus() } }}
      >
        <DialogTitle id={id} sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700 }}>
          {title}
        </DialogTitle>
        <DialogContent sx={{ color: 'text.secondary', '& p + p': { mt: 1.5 } }}>
          {children}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Action ref={cancel} autoFocus disabled={!open} onClick={() => setOpen(false)}>
            Cancel
          </Action>
          <Action
            variant="contained"
            disabled={!open}
            color={danger ? 'error' : 'primary'}
            onClick={() => {
              if (!open) return;
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Action>
        </DialogActions>
      </Dialog>
    </>
  );
}
export function StatusTag({ complete, started }: { complete: boolean; started: boolean }) {
  return (
    <Chip
      size="small"
      variant={complete || started ? 'filled' : 'outlined'}
      color={complete ? 'success' : started ? 'primary' : 'default'}
      label={complete ? 'Complete' : started ? 'In progress' : 'Not started'}
      icon={complete ? <Icon name="check" size={13} /> : undefined}
    />
  );
}
