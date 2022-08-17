export type SettingsState = {
    playerWhite: boolean;
    useAI: boolean;
}

export const ActionTypes = {
    SET_SETTINGS: "SET_SETTINGS",
    SET_PLAYER_WHITE: "SET_PLAYER_WHITE",
    SET_USE_AI: "SET_USE_AI",
}