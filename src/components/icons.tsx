import type { CSSProperties } from 'react';
export type IconName =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'overview'
  | 'path'
  | 'progress'
  | 'settings'
  | 'check'
  | 'arrow'
  | 'chevron'
  | 'clock'
  | 'book'
  | 'shield'
  | 'sun'
  | 'moon'
  | 'close';
const paths: Record<IconName, React.ReactNode> = {
  frontend: (
    <>
      <rect x="3" y="4" width="18" height="15" rx="2" />
      <path d="M3 8h18M7 12l-2 2 2 2m10-4 2 2-2 2m-4-5-2 6" />
    </>
  ),
  backend: (
    <>
      <rect x="4" y="3" width="16" height="7" rx="2" />
      <rect x="4" y="14" width="16" height="7" rx="2" />
      <path d="M8 6.5h.01M8 17.5h.01M12 6.5h4m-4 11h4" />
    </>
  ),
  fullstack: (
    <>
      <path d="m12 3 10 5-10 5L2 8l10-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5" />
    </>
  ),
  overview: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  path: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="M6 7v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8m-3 3 3-3 3 3" />
    </>
  ),
  progress: (
    <>
      <path d="M4 3v17h17M8 15v-4m5 4V7m5 8V4" />
    </>
  ),
  settings: (
    <>
      <path d="M3 6h18M3 12h18M3 18h18" />
      <rect x="6" y="4" width="4" height="4" rx="1" />
      <rect x="14" y="10" width="4" height="4" rx="1" />
      <rect x="8" y="16" width="4" height="4" rx="1" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  book: (
    <>
      <path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  moon: <path d="M20 14a8.5 8.5 0 0 1-10-10A8.5 8.5 0 1 0 20 14Z" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
};
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {paths[name]}
    </svg>
  );
}
