import { BoardSquare } from "../../types/chess/Board";

export const setBoard = (payload: (BoardSquare | null)[][] | null) => ({ type: "SET_BOARD", payload });

export const setGameStatus = (payload: boolean) => ({ type: "SET_GAME_STATUS", payload });

export const setTurn = (payload: string) => ({ type: "SET_TURN", payload });

export const setPromotion = (payload: {from: string, to: string, color: string} | null) => ({ type: "SET_PROMOTION", payload });

export const setResult = (payload: string | null) => ({ type: "SET_RESULT", payload });