import { Piece } from "../../types/chess/Piece"

export const isFriendly = (p1: Piece, p2: Piece) => {
    return p1.color === p2.color;
}

export const calcVisibleSquares = (piece: Piece) => {
    const { type } = piece;
    switch (type) {
        case "p": case "P":
            calcPawnVisibleSquares(piece);
            break;
        case "k": case "K":
            calcKingVisibleSquares(piece);
            break;
        case "q": case "Q":
            calcQueenVisibleSquares(piece);
            break;
        case "r": case "R":
            calcRookVisibleSquares(piece);
            break;
        case "b": case "B":
            calcBishopVisibleSquares(piece);
            break;
        case "n": case "N":
            calcKnightVisibleSquares(piece);
            break;
        default:
            break;
    }

}

const calcPawnVisibleSquares = ({ color, rank, file }: Piece) => {
}

const calcKnightVisibleSquares = ({ color, rank, file }: Piece) => {
}

const calcBishopVisibleSquares = ({ color, rank, file }: Piece) => {
}

const calcRookVisibleSquares = ({ color, rank, file }: Piece) => {
}

const calcQueenVisibleSquares = ({ color, rank, file }: Piece) => {
}

const calcKingVisibleSquares = ({ color, rank, file }: Piece) => {
}