import { Chess } from "chess.js";

export const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export const RANK_FILE_MAX = 8;

export const chess = new Chess(DEFAULT_FEN);

export const getResult = () => {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? "black" : "white";
        return `Checkmate, ${winner} wins!`;
    } else if (chess.in_draw()) {
        let reason = "50-move rule";
        if (chess.in_stalemate()) {
            reason = "stalemate";
        } else if (chess.in_threefold_repetition()) {
            reason = "repetition";
        } else if (chess.insufficient_material()) {
            reason = "insufficient material";
        }
        return `Draw, ${reason}`;
    } else {
        return "The chess gods demand it...";
    }
}

export const PieceValues = {
    "p": 1,
    "n": 3,
    "b": 3,
    "r": 5,
    "q": 9,
    "k": 100
}
