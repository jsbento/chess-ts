import { GameState } from "./GameState"
import { SettingsState } from "./SettingsState"

export type AppState = {
  gameState: GameState;
  settings: SettingsState;
}

export const ActionTypes = {
  SET_BOARD: "SET_BOARD",
  SET_GAME_STATUS: "SET_GAME_STATUS",
  SET_TURN: "SET_TURN",
  SET_PROMOTION: "SET_PROMOTION",
  SET_RESULT: "SET_RESULT",
  SET_STATE: "SET_STATE",
  SET_MOVES: "SET_MOVES",
  SET_SETTINGS: "SET_SETTINGS",
  SET_PLAYER_WHITE: "SET_PLAYER_WHITE",
}

export type Action = {
  type: string;
  payload: any;
}