export const ActionTypes = {
    SET_BOARD: "SET_BOARD",
    SET_GAME_STATUS: "SET_GAME_STATUS",
    SET_TURN: "SET_TURN",
    SET_PROMOTION: "SET_PROMOTION",
    SET_RESULT: "SET_RESULT",
}

export type Action = {
    type: string;
    payload: any;
}