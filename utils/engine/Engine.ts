import { Move } from "chess.js";
import { BoardSquare } from "../../types/chess/Board";
import { PieceValues } from "../constants/Chess";

export const getEngineMove = async (fen: string, engineDepth: number) => {
    const move: Move = await fetch(`/api/engine/get_move`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ fen, engineDepth })
    })
    .then(res => res.json())
    .then(data => data.move)
    .catch(err => console.log(err));
    return move;
}

export const flipTurn = (turn: string) => turn === "w" ? "b" : "w";

export const countMaterial = (board: (BoardSquare | null)[][]): { wMaterial: number, bMaterial: number } => {
    let wMaterial = 0;
    let bMaterial = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.color == 'w')
                wMaterial += PieceValues[piece.type];
            else if (piece && piece.color == 'b')
                bMaterial += PieceValues[piece.type];
        }
    }
    return { wMaterial, bMaterial };
}