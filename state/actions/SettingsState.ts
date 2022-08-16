import { SettingsState } from "../../types/state/SettingsState";

export const setSettings = (payload: SettingsState) => ({ type: "SET_SETTINGS", payload });

export const setPlayerWhite = (payload: boolean) => ({ type: "SET_PLAYER_WHITE", payload });