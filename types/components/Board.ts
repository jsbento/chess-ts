import { Piece } from "../chess/Piece";

export type BoardSquareProps = {
    color: string;
    piece: Piece | null;
    position: number;
    handleMove: (from: number, to: number) => void;
}