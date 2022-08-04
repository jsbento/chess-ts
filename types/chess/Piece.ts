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