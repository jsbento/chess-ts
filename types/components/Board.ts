import { Piece } from "../chess/Piece";

export type BoardSquareProps = {
    color: string;
    piece: Piece | null;
    position: number;
}

export type PromotionProps = {
    promotion: {
        from: string;
        to: string;
        color: string;
    }
}