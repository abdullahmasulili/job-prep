'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Provider, useSelector, useStore } from 'react-redux';
import {
  makeStore,
  workspaceActions,
  type AppStore,
  type RootState,
  type StorageIssue,
} from '@/lib/workspace-store';
import {
  emptyStore,
  currentModule,
  updateProfile,
  type Store,
  type Profile,
  type ModuleProgress,
} from '@/lib/progress';
import { readStore, writeStore, recoverStore, STORAGE_KEY } from '@/lib/storage';
import type { PrepModule } from '@/content/types';

type Issue = StorageIssue;
type ProgressContext = {
  state: Store;
  profile: Profile | undefined;
  ready: boolean;
  saving: boolean;
  issue: Issue;
  locked: boolean;
  change: (transform: (state: Store) => Store) => boolean;
  changeModule: (
    module: PrepModule,
    transform: (progress: ModuleProgress) => ModuleProgress,
  ) => void;
  reload: () => void;
  recover: () => void;
  retry: () => void;
};
const Context = createContext<ProgressContext | null>(null);
const useAppStore = useStore.withTypes<AppStore>();
const isLocked = (issue: Issue) => issue?.status === 'blocked' || issue?.status === 'conflict';

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  return (
    <Provider store={store}>
      <ProgressController>{children}</ProgressController>
    </Provider>
  );
}
function ProgressController({ children }: { children: ReactNode }) {
  const store = useAppStore();
  const { data: state, ready, saving, issue } = useSelector((s: RootState) => s.workspace);
  const setState = useCallback(
    (data: Store) => {
      store.dispatch(workspaceActions.dataReplaced(data));
    },
    [store],
  );
  const setReady = useCallback(
    (ready: boolean) => {
      store.dispatch(workspaceActions.runtimeChanged({ ready }));
    },
    [store],
  );
  const setSaving = useCallback(
    (saving: boolean) => {
      store.dispatch(workspaceActions.runtimeChanged({ saving }));
    },
    [store],
  );
  const revisionRef = useRef(0);
  const generation = useRef(0);
  const pending = useRef(0);
  const dirty = useRef(false);
  const blockedRaw = useRef<string | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const showIssue = useCallback(
    (value: Issue) => {
      store.dispatch(workspaceActions.runtimeChanged({ issue: value }));
    },
    [store],
  );
  const load = useCallback(() => {
    generation.current++;
    pending.current = 0;
    setSaving(false);
    try {
      const result = readStore(window.localStorage);
      blockedRaw.current = result.status === 'blocked' ? result.raw : null;
      if (result.status === 'ready') {
        revisionRef.current = result.state.revision;
        dirty.current = false;
        setState(result.state);
        showIssue(null);
      } else showIssue(result);
    } catch {
      showIssue({
        status: 'unavailable',
        message: 'Browser storage is unavailable. Your work will stay in this session only.',
      });
    }
    setReady(true);
  }, [showIssue, setReady, setSaving, setState]);

  useEffect(() => {
    queueMicrotask(load);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null)
        showIssue({
          status: 'conflict',
          message:
            'Progress changed in another tab. Any unsaved edits remain in this tab. Loading the latest progress replaces them.',
        });
    };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (pending.current > 0 || dirty.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [load, showIssue]);
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  const enqueue = useCallback(
    (operation: (stillCurrent: () => boolean) => Promise<void>) => {
      const token = generation.current;
      pending.current++;
      setSaving(true);
      const stillCurrent = () => token === generation.current;
      queue.current = queue.current
        .then(async () => {
          if (stillCurrent()) await operation(stillCurrent);
        })
        .catch(() => {
          if (stillCurrent())
            showIssue({
              status: 'unavailable',
              message:
                'Changes remain in this session, but could not be saved. Retry saving before reloading.',
            });
        })
        .finally(() => {
          if (stillCurrent()) {
            pending.current--;
            setSaving(pending.current > 0);
          }
        });
    },
    [showIssue, setSaving],
  );

  const change = useCallback(
    (transform: (state: Store) => Store) => {
      if (!store.getState().workspace.ready || isLocked(store.getState().workspace.issue))
        return false;
      const snapshot = transform(store.getState().workspace.data);
      dirty.current = true;
      setState(snapshot);
      enqueue(async (stillCurrent) => {
        if (isLocked(store.getState().workspace.issue)) return;
        const candidate = { ...snapshot, revision: revisionRef.current + 1 };
        const result = await writeStore(
          window.localStorage,
          candidate,
          revisionRef.current,
          navigator.locks,
          () => stillCurrent() && !isLocked(store.getState().workspace.issue),
        );
        if (!stillCurrent() || result.status === 'cancelled') return;
        if (result.status === 'saved') {
          revisionRef.current = candidate.revision;
          setState({ ...store.getState().workspace.data, revision: candidate.revision });
          if (pending.current === 1) dirty.current = false;
          showIssue(null);
        } else {
          if (result.status === 'blocked') blockedRaw.current = result.raw;
          showIssue(result);
        }
      });
      return true;
    },
    [enqueue, showIssue, store, setState],
  );
  const changeModule = useCallback(
    (module: PrepModule, transform: (progress: ModuleProgress) => ModuleProgress) => {
      change((s) =>
        s.activeId
          ? updateProfile(s, s.activeId, (p) => ({
              ...p,
              lastModule: module.id,
              modules: {
                ...p.modules,
                [module.id]: transform(currentModule(module, p.modules[module.id])),
              },
            }))
          : s,
      );
    },
    [change],
  );
  const recover = useCallback(() => {
    const expectedRaw = blockedRaw.current;
    if (expectedRaw === null) return;
    generation.current++;
    pending.current = 0;
    enqueue(async (stillCurrent) => {
      const result = await recoverStore(
        window.localStorage,
        expectedRaw,
        navigator.locks,
        stillCurrent,
      );
      if (!stillCurrent() || result.status === 'cancelled') return;
      if (result.status === 'saved') {
        const fresh = emptyStore();
        revisionRef.current = 0;
        dirty.current = false;
        blockedRaw.current = null;
        setState(fresh);
        showIssue(null);
      } else showIssue(result);
    });
  }, [enqueue, showIssue, setState]);
  const retry = useCallback(() => {
    change((s) => s);
  }, [change]);
  return (
    <Context.Provider
      value={{
        state,
        profile: state.activeId ? state.profiles[state.activeId] : undefined,
        ready,
        saving,
        issue,
        locked: isLocked(issue),
        change,
        changeModule,
        reload: load,
        recover,
        retry,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useProgress() {
  const context = useContext(Context);
  if (!context) throw new Error('ProgressProvider is required');
  return context;
}
