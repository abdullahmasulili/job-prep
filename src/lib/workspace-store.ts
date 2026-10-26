import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { emptyStore, type Store } from './progress';

export type StorageIssue = {
  status: 'blocked' | 'unavailable' | 'conflict';
  message: string;
} | null;
type WorkspaceState = { data: Store; ready: boolean; saving: boolean; issue: StorageIssue };
const initialState = (): WorkspaceState => ({
  data: emptyStore(),
  ready: false,
  saving: false,
  issue: null,
});
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    dataReplaced(state, action: PayloadAction<Store>) {
      state.data = action.payload;
    },
    runtimeChanged(state, action: PayloadAction<Partial<Omit<WorkspaceState, 'data'>>>) {
      Object.assign(state, action.payload);
    },
  },
});
export const workspaceActions = workspaceSlice.actions;
export function makeStore() {
  return configureStore({ reducer: { workspace: workspaceSlice.reducer } });
}
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
