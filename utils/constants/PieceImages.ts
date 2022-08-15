import { PieceMapType } from "../../types/chess/Piece";
import wKing from "../../public/Chess_klt45.svg";
import wQueen from "../../public/Chess_qlt45.svg";
import wRook from "../../public/Chess_rlt45.svg";
import wBishop from "../../public/Chess_blt45.svg";
import wKnight from "../../public/Chess_nlt45.svg";
import wPawn from "../../public/Chess_plt45.svg";
import bKing from "../../public/Chess_kdt45.svg";
import bQueen from "../../public/Chess_qdt45.svg";
import bRook from "../../public/Chess_rdt45.svg";
import bBishop from "../../public/Chess_bdt45.svg";
import bKnight from "../../public/Chess_ndt45.svg";
import bPawn from "../../public/Chess_pdt45.svg";

export const PieceImageMap: PieceMapType = {
    "K": wKing,
    "Q": wQueen,
    "R": wRook,
    "B": wBishop,
    "N": wKnight,
    "P": wPawn,
    "k": bKing,
    "q": bQueen,
    "r": bRook,
    "b": bBishop,
    "n": bKnight,
    "p": bPawn
}