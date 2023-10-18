import { BoardSquare } from "../../types/chess/Board"
import { GameState } from "../../types/state/GameState"
import { Promotion } from "../../types/chess/Piece"

export const setBoard = ( payload: ( BoardSquare | null )[][] | null ) => ({ type: "SET_BOARD", payload })

export const setGameStatus = ( payload: boolean ) => ({ type: "SET_GAME_STATUS", payload })

export const setTurn = ( payload: string ) => ({ type: "SET_TURN", payload })

export const setPromotion = ( payload: Promotion | null ) => ({ type: "SET_PROMOTION", payload })

export const setResult = ( payload: string | null ) => ({ type: "SET_RESULT", payload })

export const setState = ( payload: GameState ) => ({ type: "SET_STATE", payload })

export const setMoves = ( payload: string ) => ({ type: "SET_MOVES", payload })