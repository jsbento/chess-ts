import { Piece, Promotion } from "../chess/Piece";

export type BoardSquareProps = {
    color: string;
    piece: Piece | null;
    position: number;
    movers: {
        handleMove: (from: string, to: string) => void;
        move: (from: string, to: string, promoteTo: undefined | "b" | "q" | "r" | "n") => void;
    }
}

export type PromotionProps = {
    promotion: Promotion;
    move: (from: string, to: string, promoteTo: undefined | "b" | "q" | "r" | "n") => void;
}