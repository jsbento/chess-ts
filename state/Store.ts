import { configureStore, Store } from '@reduxjs/toolkit'
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

export const store: Store<AppState, Action> & {
  dispatch: ( action: Action ) => Action;
} = configureStore({
  reducer: {
    gameState: chessReducer,
    settings: settingsReducer,
    user: userReducer,
  },
  devTools: true,
})