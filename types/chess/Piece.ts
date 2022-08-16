import { StaticImageData } from "next/image";

export type Piece = {
    type: string;
    position: number;
}

export type Square = {
    piece: Piece | null;
    rank: number;
    file: number;
}

export type PieceMapType = {
    [key: string]: string;
}

export type Promotion = {
    from: string;
    to: string;
    color: string;
}