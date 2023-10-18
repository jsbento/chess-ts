import { Square, PieceType } from "chess.js"

export type BoardSquare = {
  type: PieceType;
  square: Square;
  color: "b" | "w";
} | null;