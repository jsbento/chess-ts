import { BoardSquare } from "./Board";
import { Promotion } from "./Piece";

export type GameState = {
    board: (BoardSquare | null)[][];
    gameStatus: boolean;
    turn: string;
    promotion: Promotion | null;
    result: string | null;
    moves: string[];
}

export const ActionTypes = {
    SET_BOARD: "SET_BOARD",
    SET_GAME_STATUS: "SET_GAME_STATUS",
    SET_TURN: "SET_TURN",
    SET_PROMOTION: "SET_PROMOTION",
    SET_RESULT: "SET_RESULT",
    SET_STATE: "SET_STATE",
    SET_MOVES: "SET_MOVES",
}

export type Action = {
    type: string;
    payload: any;
}