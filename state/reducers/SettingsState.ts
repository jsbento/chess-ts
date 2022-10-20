import { Action } from "../../types/state/AppState";
import { SettingsState } from "../../types/state/SettingsState";

export const initialSettings: SettingsState = {
    playerWhite: true,
    useAI: false,
    engineDepth: 2,
}

const settingsReducer = (settings = initialSettings, action: Action) => {
    switch (action.type) {
        case "SET_PLAYER_WHITE":
            return setPlayerWhiteReducer(settings, action);
        case "SET_SETTINGS":
            return setSettingsReducer(settings, action);
        case "SET_USE_AI":
            return setUseAIReducer(settings, action);
        case "SET_ENGINE_DEPTH":
            return setEngineDepthReducer(settings, action);
        default:
            return settings;
    }
}

const setPlayerWhiteReducer = (settings: SettingsState, action: Action) => ({...settings, playerWhite: action.payload});
const setSettingsReducer = (settings: SettingsState, action: Action) => ({...settings, ...action.payload});
const setUseAIReducer = (settings: SettingsState, action: Action) => ({...settings, useAI: action.payload});
const setEngineDepthReducer = (settings: SettingsState, action: Action) => ({...settings, engineDepth: action.payload});

export default settingsReducer;