export type Piece = {
    color: string;
    type: string;
}

export type Square = {
    piece: Piece | null;
    rank: number;
    file: number;
}

export type PieceMapType = {
    [key: string]: {
        [key: string]: string;
    }
}