import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import recordingsReducer from '../features/recordings/recordingsSlice';
import { authApi } from '../features/auth/authApi';
import { recordingsApi } from '../features/recordings/recordingsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recordings: recordingsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [recordingsApi.reducerPath]: recordingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      recordingsApi.middleware
    ),
});

setupListeners(store.dispatch);