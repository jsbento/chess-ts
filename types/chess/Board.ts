import { Square, PieceType } from "chess.js";

export type BoardProps = {
    fen: string;
}

export type BoardSquare = {
    type: PieceType;
    square: Square;
    color: "b" | "w";
} | null;