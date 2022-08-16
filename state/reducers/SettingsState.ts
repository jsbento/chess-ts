import { Action } from "../../types/state/AppState";
import { SettingsState } from "../../types/state/SettingsState";

export const initialSettings: SettingsState = {
    playerWhite: true,
}

const settingsReducer = (settings = initialSettings, action: Action) => {
    switch (action.type) {
        case "SET_PLAYER_WHITE":
            return setPlayerWhiteReducer(settings, action);
        case "SET_SETTINGS":
            return setSettingsReducer(settings, action);
        default:
            return settings;
    }
}

const setPlayerWhiteReducer = (settings: SettingsState, action: Action) => ({...settings, playerWhite: action.payload});
const setSettingsReducer = (settings: SettingsState, action: Action) => ({...settings, ...action.payload});

export default settingsReducer;