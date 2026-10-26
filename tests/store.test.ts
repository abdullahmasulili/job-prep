import test from 'node:test';
import assert from 'node:assert/strict';
import { makeStore, workspaceActions } from '../src/lib/workspace-store';
import { emptyStore, enroll } from '../src/lib/progress';
import { readStore, STORAGE_KEY } from '../src/lib/storage';

test('Redux stores are isolated per provider rather than shared across requests', () => {
  const first = makeStore();
  const second = makeStore();
  const data = enroll(emptyStore(), { role: 'backend', tier: 'senior', language: 'go' }, true);
  first.dispatch(workspaceActions.dataReplaced(data));
  assert.equal(first.getState().workspace.data.activeId, 'backend:senior:go');
  assert.equal(second.getState().workspace.data.activeId, null);
});

test('existing local snapshots hydrate Redux without changing profile or progress shape', () => {
  const data = enroll(
    emptyStore(),
    { role: 'frontend', tier: 'mid', language: 'typescript' },
    true,
  );
  const loaded = readStore({
    getItem: (key) => (key === STORAGE_KEY ? JSON.stringify(data) : null),
    setItem() {},
  });
  assert.equal(loaded.status, 'ready');
  if (loaded.status !== 'ready') return;
  const store = makeStore();
  store.dispatch(workspaceActions.dataReplaced(loaded.state));
  store.dispatch(workspaceActions.runtimeChanged({ ready: true, saving: true }));
  assert.deepEqual(store.getState().workspace.data, data);
  assert.equal(store.getState().workspace.ready, true);
  store.dispatch(
    workspaceActions.runtimeChanged({
      saving: false,
      issue: { status: 'conflict', message: 'Another tab saved.' },
    }),
  );
  assert.equal(store.getState().workspace.issue?.status, 'conflict');
  assert.deepEqual(store.getState().workspace.data, data);
});
