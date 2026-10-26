import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyStore, enroll } from '../src/lib/progress';
import { STORAGE_KEY, readStore, writeStore, recoverStore } from '../src/lib/storage';
const config = {
  role: 'frontend' as const,
  tier: 'junior' as const,
  language: 'typescript' as const,
};
function memory(initial?: string) {
  const values = new Map(initial === undefined ? [] : [[STORAGE_KEY, initial]]);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
test('new storage and state roundtrip', async () => {
  const storage = memory();
  assert.equal(readStore(storage).status, 'ready');
  const state = enroll(emptyStore(), config, false);
  assert.equal(
    (await writeStore(storage, { ...state, revision: 1 }, 0, sharedLocks())).status,
    'saved',
  );
  const loaded = readStore(storage);
  assert.equal(loaded.status, 'ready');
  if (loaded.status === 'ready') assert.equal(loaded.state.activeId, 'frontend:junior:typescript');
});
test('invalid JSON, unknown schemas and malformed nested values are blocked without overwriting', async () => {
  for (const raw of [
    '{broken',
    JSON.stringify({ ...emptyStore(), schemaVersion: 2 }),
    JSON.stringify({ ...emptyStore(), activeId: 'missing' }),
    JSON.stringify({ ...emptyStore(), profiles: { bad: { role: 'frontend' } } }),
  ]) {
    const storage = memory(raw);
    assert.equal(readStore(storage).status, 'blocked');
    assert.equal((await writeStore(storage, emptyStore(), 0, sharedLocks())).status, 'blocked');
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
});
test('unavailable reads/writes and quota errors are explicit', async () => {
  const storage = {
    getItem() {
      throw new Error('denied');
    },
    setItem() {
      throw new Error('quota');
    },
  };
  assert.equal(readStore(storage).status, 'unavailable');
  assert.equal((await writeStore(storage, emptyStore(), 0, sharedLocks())).status, 'unavailable');
  assert.equal(
    (
      await writeStore(
        {
          getItem: () => null,
          setItem() {
            throw new Error('quota');
          },
        },
        emptyStore(),
        0,
        sharedLocks(),
      )
    ).status,
    'unavailable',
  );
});
test('stale revisions cannot overwrite another tab', async () => {
  const storage = memory(JSON.stringify({ ...emptyStore(), revision: 2 }));
  assert.equal(
    (await writeStore(storage, { ...emptyStore(), revision: 1 }, 0, sharedLocks())).status,
    'conflict',
  );
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)!).revision, 2);
});

test('recovery shares the save lock and refuses to erase newer data', async () => {
  const storage = memory('{broken');
  const locks = sharedLocks();
  const first = await recoverStore(storage, '{broken', locks);
  assert.equal(first.status, 'saved');
  const state = enroll(emptyStore(), config, false);
  const save = writeStore(storage, { ...state, revision: 1 }, 0, locks);
  const staleRecovery = recoverStore(storage, '{broken', locks);
  assert.equal((await save).status, 'saved');
  assert.equal((await staleRecovery).status, 'conflict');
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)!).activeId, 'frontend:junior:typescript');
});
test('missing lock support fails closed and cancelled saves do not modify storage', async () => {
  const storage = memory();
  assert.equal((await writeStore(storage, emptyStore(), 0)).status, 'unavailable');
  assert.equal(
    (await writeStore(storage, emptyStore(), 0, sharedLocks(), () => false)).status,
    'cancelled',
  );
  assert.equal(storage.getItem(STORAGE_KEY), null);
});

function sharedLocks() {
  let tail: Promise<unknown> = Promise.resolve();
  return {
    request<T>(_name: string, callback: () => T | Promise<T>): Promise<T> {
      const result = tail.then(callback);
      tail = result.then(
        () => undefined,
        () => undefined,
      );
      return result;
    },
  };
}
test('overlapping saves serialize the revision check and only one stale snapshot can commit', async () => {
  const locks = sharedLocks();
  let raw: string | null = null;
  let interrupt = true;
  let second: ReturnType<typeof writeStore> | undefined;
  const other = enroll(emptyStore(), { ...config, language: 'javascript' }, false);
  const storage = {
    getItem() {
      const captured = raw;
      if (interrupt) {
        interrupt = false;
        second = writeStore(storage, { ...other, revision: 1 }, 0, locks);
      }
      return captured;
    },
    setItem(_key: string, value: string) {
      raw = value;
    },
  };
  const first = await writeStore(
    storage,
    { ...enroll(emptyStore(), config, false), revision: 1 },
    0,
    locks,
  );
  const result = await second!;
  assert.deepEqual([first.status, result.status].sort(), ['conflict', 'saved']);
  assert.equal(Object.keys(JSON.parse(raw!).profiles).length, 1);
});
