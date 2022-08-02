export type Piece = {
    color: string;
    type: string;
    rank: number;
    file: number;
    visibleSquares: Square[];
    imgUrl: string;
}

export type Square = {
    piece: Piece | null;
    rank: number;
    file: number;
}