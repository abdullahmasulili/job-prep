import { emptyStore, profileId, type Store } from './progress';
import { languagesFor, roles, tiers } from '../content/catalog';
import type { ProfileConfig } from '../content/types';

export const STORAGE_KEY = 'jobprep.progress.v1';
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
export type ReadResult =
  | { status: 'ready'; state: Store }
  | { status: 'blocked'; message: string; raw: string }
  | { status: 'unavailable'; message: string };
export type WriteResult =
  | { status: 'saved' }
  | { status: 'cancelled' }
  | { status: 'blocked'; message: string; raw: string }
  | { status: 'unavailable' | 'conflict'; message: string };
export type LockPort = { request<T>(name: string, callback: () => T | Promise<T>): Promise<T> };
const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const integer = (v: unknown, min: number, max: number) =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
const booleans = (v: unknown) =>
  Array.isArray(v) && v.length <= 20 && v.every((x) => typeof x === 'boolean');
const answers = (v: unknown) =>
  record(v) && Object.entries(v).every(([key, value]) => key.length < 200 && integer(value, 0, 3));
const ids = (v: unknown) =>
  Array.isArray(v) &&
  v.length > 0 &&
  v.length <= 12 &&
  v.every((id) => typeof id === 'string' && id.length > 0 && id.length < 200) &&
  new Set(v).size === v.length;
const session = (v: unknown) =>
  record(v) &&
  ids(v.questionIds) &&
  record(v.choiceOrders) &&
  (v.questionIds as string[]).every((id) => {
    const order = (v.choiceOrders as Record<string, unknown>)[id];
    return (
      Array.isArray(order) &&
      order.length === 4 &&
      new Set(order).size === 4 &&
      order.every((i) => integer(i, 0, 3))
    );
  });
const drafts = (v: unknown) =>
  record(v) &&
  Object.keys(v).length <= 20 &&
  Object.entries(v).every(
    ([id, d]) =>
      id.length < 200 &&
      record(d) &&
      typeof d.response === 'string' &&
      d.response.length <= 30000 &&
      booleans(d.review),
  );
const attempt = (v: unknown) =>
  record(v) &&
  typeof v.id === 'string' &&
  (v.questionIds === undefined || ids(v.questionIds)) &&
  integer(v.version, 1, 10000) &&
  answers(v.answers) &&
  integer(v.score, 0, 100) &&
  typeof v.at === 'string' &&
  !Number.isNaN(Date.parse(v.at));
const moduleIds = ['aptitude', 'fundamentals', 'practical', 'interview', 'ai'];
function validStore(v: unknown): v is Store {
  if (
    !record(v) ||
    v.schemaVersion !== 1 ||
    !integer(v.revision, 0, Number.MAX_SAFE_INTEGER) ||
    !['light', 'dark'].includes(String(v.theme)) ||
    !record(v.profiles)
  )
    return false;
  for (const [id, p] of Object.entries(v.profiles)) {
    if (
      !record(p) ||
      !roles.some((r) => r.id === p.role) ||
      !tiers.some((t) => t.id === p.tier) ||
      typeof p.language !== 'string'
    )
      return false;
    const config = p as unknown as ProfileConfig;
    if (profileId(config) !== id || !languagesFor(config.role).some((l) => l.id === p.language))
      return false;
    if (
      typeof p.aiEnabled !== 'boolean' ||
      typeof p.enrolledAt !== 'string' ||
      Number.isNaN(Date.parse(p.enrolledAt)) ||
      !record(p.modules)
    )
      return false;
    if (p.lastModule !== undefined && !moduleIds.includes(String(p.lastModule))) return false;
    for (const [moduleId, m] of Object.entries(p.modules)) {
      if (
        !moduleIds.includes(moduleId) ||
        !record(m) ||
        !integer(m.version, 1, 10000) ||
        !booleans(m.prep) ||
        !booleans(m.review) ||
        typeof m.response !== 'string' ||
        m.response.length > 30000 ||
        !answers(m.answers) ||
        typeof m.submitted !== 'boolean' ||
        (m.session !== undefined && !session(m.session)) ||
        (m.round !== undefined && !integer(m.round, 0, Number.MAX_SAFE_INTEGER)) ||
        (m.seenAt !== undefined &&
          (!record(m.seenAt) ||
            Object.keys(m.seenAt).length > 500 ||
            !Object.values(m.seenAt).every((n) => integer(n, 0, Number.MAX_SAFE_INTEGER)))) ||
        (m.exerciseDrafts !== undefined && !drafts(m.exerciseDrafts))
      )
        return false;
      if (
        !Array.isArray(m.attempts) ||
        m.attempts.length > 20 ||
        !m.attempts.every(attempt) ||
        !(m.best === null || attempt(m.best))
      )
        return false;
    }
  }
  return (
    v.activeId === null || (typeof v.activeId === 'string' && Object.hasOwn(v.profiles, v.activeId))
  );
}
export function readStore(storage: StoragePort): ReadResult {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return {
      status: 'unavailable',
      message:
        'Browser storage is unavailable. You can practice, but changes may not survive a reload.',
    };
  }
  if (raw === null) return { status: 'ready', state: emptyStore() };
  try {
    const state: unknown = JSON.parse(raw);
    if (!validStore(state)) throw new Error('Incompatible data');
    return { status: 'ready', state };
  } catch {
    return {
      status: 'blocked',
      raw,
      message:
        'Saved progress is unreadable or belongs to another data version. It has been preserved. Reset local data explicitly to start again.',
    };
  }
}
function writeUnlocked(storage: StoragePort, state: Store, expectedRevision: number): WriteResult {
  const current = readStore(storage);
  if (current.status !== 'ready') return current;
  if (current.state.revision !== expectedRevision)
    return {
      status: 'conflict',
      message:
        'Progress changed in another tab. Load the latest saved progress before making more changes.',
    };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { status: 'saved' };
  } catch {
    return {
      status: 'unavailable',
      message:
        'Your latest changes could not be saved in this browser. They remain in this session; free storage or retry saving before reloading.',
    };
  }
}

const conflict = (): WriteResult => ({
  status: 'conflict',
  message:
    'Another tab saved newer progress. Your unsaved edits remain in this tab. Loading the latest progress replaces them.',
});
async function coordinated(
  locks: LockPort | undefined,
  operation: () => WriteResult,
): Promise<WriteResult> {
  if (!locks)
    return {
      status: 'unavailable',
      message:
        'Safe browser saving requires Web Locks in a secure context (HTTPS or localhost). This session remains usable, but progress is not persisted.',
    };
  try {
    return await locks.request(STORAGE_KEY, operation);
  } catch {
    return {
      status: 'unavailable',
      message:
        'The browser could not coordinate a safe save. Your edits remain in this session; retry saving before reloading.',
    };
  }
}
export function writeStore(
  storage: StoragePort,
  state: Store,
  expectedRevision: number,
  locks?: LockPort,
  stillCurrent = () => true,
): Promise<WriteResult> {
  return coordinated(locks, () =>
    stillCurrent() ? writeUnlocked(storage, state, expectedRevision) : { status: 'cancelled' },
  );
}
export function recoverStore(
  storage: StoragePort,
  expectedRaw: string,
  locks?: LockPort,
  stillCurrent = () => true,
): Promise<WriteResult> {
  return coordinated(locks, () => {
    if (!stillCurrent()) return { status: 'cancelled' };
    try {
      if (storage.getItem(STORAGE_KEY) !== expectedRaw) return conflict();
      storage.setItem(STORAGE_KEY, JSON.stringify(emptyStore()));
      return { status: 'saved' };
    } catch {
      return {
        status: 'unavailable',
        message:
          'Local data could not be reset. Existing data has not been intentionally replaced; retry in a browser with storage enabled.',
      };
    }
  });
}
