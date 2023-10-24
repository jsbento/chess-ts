import { configureStore, Store } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import { AppState, Action } from '../types/state/AppState'
import chessReducer from './reducers/GameState'
import settingsReducer from './reducers/SettingsState'
import userReducer from './reducers/users'
import { initialState } from './reducers/GameState'
import { initialSettings } from './reducers/SettingsState'
import { initialUserState } from './reducers/users'

export const initialAppState: AppState = {
  gameState: initialState,
  settings: initialSettings,
  user: initialUserState,
}

const persistConfig = {
  key: 'root',
  storage,
}

const persistedUserReducer = persistReducer( persistConfig, userReducer )

export const store: Store<AppState, Action> & {
  dispatch: ( action: Action ) => Action;
} = configureStore({
  reducer: {
    gameState: chessReducer,
    settings: settingsReducer,
    user: persistedUserReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [ thunk ],
})

export const persistor = persistStore( store )