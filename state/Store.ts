import { configureStore, Store } from '@reduxjs/toolkit'
import { AppState, Action } from '../types/state/AppState'
import chessReducer from './reducers/GameState'
import settingsReducer from './reducers/SettingsState'
import { initialState } from './reducers/GameState'
import { initialSettings } from './reducers/SettingsState'

export const initialAppState: AppState = {
  gameState: initialState,
  settings: initialSettings,
}

export const store: Store<AppState, Action> & {
  dispatch: ( action: Action ) => Action;
} = configureStore({
  reducer: {
    gameState: chessReducer,
    settings: settingsReducer,
  },
})