import { BoardSquare } from "./Board";

export type GameState = {
    board: (BoardSquare | null)[][] | null;
    gameStatus: boolean;
    turn: string;
    promotion: {from: string, to: string, color: string} | null;
    result: string | null;
}