import { Action } from '../../types/state/AppState'
import { SettingsState, SettingsActions } from '../../types/state/SettingsState'

export const initialSettings: SettingsState = {
  playerWhite: true,
  useAI: false,
  engineDepth: 2,
  moveTime: 0,
}

const settingsReducer = ( settings = initialSettings, action: Action ) => {
  switch ( action.type ) {
    case SettingsActions.SET_PLAYER_WHITE:
      return { ...settings, playerWhite: action.payload }
    case SettingsActions.SET_SETTINGS:
      return { ...action.payload }
    case SettingsActions.SET_USE_AI:
      return { ...settings, useAI: action.payload }
    case SettingsActions.SET_ENGINE_DEPTH:
      return { ...settings, engineDepth: action.payload }
    case SettingsActions.SET_MOVE_TIME:
      return { ...settings, moveTime: action.payload }
    default:
      return settings
  }
}

export default settingsReducer