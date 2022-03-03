import { configureStore } from '@reduxjs/toolkit';
import crosswordReducer from './slices/crosswordSlice';
import wordleReducer from './slices/wordleSlice';
import settingsReducer from './slices/settingsSlice';
import storage from 'redux-persist-indexeddb-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

const reducers = combineReducers({
  crossword: crosswordReducer,
  wordle: wordleReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage: storage('crosswordleDB'),
};

const persistedReducer = persistReducer(persistConfig, reducers);


export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
