import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './slices/authSlice';
import rikshaReducer from './slices/rikshaSlice';
import bookingReducer from './slices/bookingSlice';
import uiReducer from './slices/uiSlice';

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  rikshas: rikshaReducer,
  bookings: bookingReducer,
  ui: uiReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export persistor
export const persistor = persistStore(store); 