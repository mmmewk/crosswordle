import { configureStore } from '@reduxjs/toolkit';
import crosswordReducer from './slices/crosswordSlice';
import wordleReducer from './slices/wordleSlice';
import settingsReducer from './slices/settingsSlice';
import statsReducer from './slices/statsSlice';
import navigationReducer from './slices/navigationSlice';
import storage from 'redux-persist-indexeddb-storage';
import { combineReducers } from 'redux';
import { createMigrate, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import { migrations } from './migrations';

const reducers = combineReducers({
  crossword: crosswordReducer,
  wordle: wordleReducer,
  settings: settingsReducer,
  stats: statsReducer,
  navigation: navigationReducer,
});

const persistConfig = {
  key: 'root',
  storage: storage('crosswordleDB'),
  blacklist: ['navigation'],
  version: 1,
  migrate: createMigrate(migrations, { debug: process.env.NODE_ENV !== 'production' }),
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
