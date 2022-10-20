import { EvalTable } from "../../types/engine/Evaluation"

export const MG_PAWN_VALUES = [
    [ 0,    0,   0,   0,   0,   0,  0,   0],
    [ 98, 134,  61,  95,  68, 126, 34, -11],
    [ -6,   7,  26,  31,  65,  56, 25, -20],
    [-14,  13,   6,  21,  23,  12, 17, -23],
    [-27,  -2,  -5,  12,  17,   6, 10, -25],
    [-26,  -4,  -4, -10,   3,   3, 33, -12],
    [-35,  -1, -20, -23, -15,  24, 38, -22],
    [  0,   0,   0,   0,   0,   0,  0,   0]
]

export const EG_PAWN_VALUES = [
    [  0,   0,   0,   0,   0,   0,   0,   0],
    [178, 173, 158, 134, 147, 132, 165, 187],
    [ 94, 100,  85,  67,  56,  53,  82,  84],
    [ 32,  24,  13,   5,  -2,   4,  17,  17],
    [ 13,   9,  -3,  -7,  -7,  -8,   3,  -1],
    [  4,   7,  -6,   1,   0,  -5,  -1,  -8],
    [ 13,   8,   8,  10,  13,   0,   2,  -7],
    [  0,   0,   0,   0,   0,   0,   0,   0]
]

export const MG_KNIGHT_VALUES = [
    [-167, -89, -34, -49,  61, -97, -15, -107],
    [ -73, -41,  72,  36,  23,  62,   7,  -17],
    [ -47,  60,  37,  65,  84, 129,  73,   44],
    [  -9,  17,  19,  53,  37,  69,  18,   22],
    [ -13,   4,  16,  13,  28,  19,  21,   -8],
    [ -23,  -9,  12,  10,  19,  17,  25,  -16],
    [ -29, -53, -12,  -3,  -1,  18, -14,  -19],
    [-105, -21, -58, -33, -17, -28, -19,  -23]
]

export const EG_KNIGHT_VALUES = [
    [-58, -38, -13, -28, -31, -27, -63, -99],
    [-25,  -8, -25,  -2,  -9, -25, -24, -52],
    [-24, -20,  10,   9,  -1,  -9, -19, -41],
    [-17,   3,  22,  22,  22,  11,   8, -18],
    [-18,  -6,  16,  25,  16,  17,   4, -18],
    [-23,  -3,  -1,  15,  10,  -3, -20, -22],
    [-42, -20, -10,  -5,  -2, -20, -23, -44],
    [-29, -51, -23, -15, -22, -18, -50, -64]
]

export const MG_BISHOP_VALUES = [
    [-29,   4, -82, -37, -25, -42,   7,  -8],
    [-26,  16, -18, -13,  30,  59,  18, -47],
    [-16,  37,  43,  40,  35,  50,  37,  -2],
    [ -4,   5,  19,  50,  37,  37,   7,  -2],
    [ -6,  13,  13,  26,  34,  12,  10,   4],
    [  0,  15,  15,  15,  14,  27,  18,  10],
    [  4,  15,  16,   0,   7,  21,  33,   1],
    [-33,  -3, -14, -21, -13, -12, -39, -21]
]

export const EG_BISHOP_VALUES = [
    [-14, -21, -11,  -8, -7,  -9, -17, -24],
    [ -8,  -4,   7, -12, -3, -13,  -4, -14],
    [  2,  -8,   0,  -1, -2,   6,   0,   4],
    [ -3,   9,  12,   9, 14,  10,   3,   2],
    [ -6,   3,  13,  19,  7,  10,  -3,  -9],
    [-12,  -3,   8,  10, 13,   3,  -7, -15],
    [-14, -18,  -7,  -1,  4,  -9, -15, -27],
    [-23,  -9, -23,  -5, -9, -16,  -5, -17]
]

export const MG_ROOK_VALUES = [
    [ 32,  42,  32,  51, 63,  9,  31,  43],
    [ 27,  32,  58,  62, 80, 67,  26,  44],
    [ -5,  19,  26,  36, 17, 45,  61,  16],
    [-24, -11,   7,  26, 24, 35,  -8, -20],
    [-36, -26, -12,  -1,  9, -7,   6, -23],
    [-45, -25, -16, -17,  3,  0,  -5, -33],
    [-44, -16, -20,  -9, -1, 11,  -6, -71],
    [-19, -13,   1,  17, 16,  7, -37, -26],
]

export const EG_ROOK_VALUES = [
    [13, 10, 18, 15, 12,  12,   8,   5],
    [11, 13, 13, 11, -3,   3,   8,   3],
    [ 7,  7,  7,  5,  4,  -3,  -5,  -3],
    [ 4,  3, 13,  1,  2,   1,  -1,   2],
    [ 3,  5,  8,  4, -5,  -6,  -8, -11],
    [-4,  0, -5, -1, -7, -12,  -8, -16],
    [-6, -6,  0,  2, -9,  -9, -11,  -3],
    [-9,  2,  3, -1, -5, -13,   4, -20]
]

export const MG_QUEEN_VALUES = [
    [-28,   0,  29,  12,  59,  44,  43,  45],
    [-24, -39,  -5,   1, -16,  57,  28,  54],
    [-13, -17,   7,   8,  29,  56,  47,  57],
    [-27, -27, -16, -16,  -1,  17,  -2,   1],
    [ -9, -26,  -9, -10,  -2,  -4,   3,  -3],
    [-14,   2, -11,  -2,  -5,   2,  14,   5],
    [-35,  -8,  11,   2,   8,  15,  -3,   1],
    [ -1, -18,  -9,  10, -15, -25, -31, -50]
]

export const EG_QUEEN_VALUES = [
    [ -9,  22,  22,  27,  27,  19,  10,  20],
    [-17,  20,  32,  41,  58,  25,  30,   0],
    [-20,   6,   9,  49,  47,  35,  19,   9],
    [  3,  22,  24,  45,  57,  40,  57,  36],
    [-18,  28,  19,  47,  31,  34,  39,  23],
    [-16, -27,  15,   6,   9,  17,  10,   5],
    [-22, -23, -30, -16, -16, -23, -36, -32],
    [-33, -28, -22, -43,  -5, -32, -20, -41]
]

export const MG_KING_VALUES = [
    [-65,  23,  16, -15, -56, -34,   2,  13],
    [ 29,  -1, -20,  -7,  -8,  -4, -38, -29],
    [ -9,  24,   2, -16, -20,   6,  22, -22],
    [-17, -20, -12, -27, -30, -25, -14, -36],
    [-49,  -1, -27, -39, -46, -44, -33, -51],
    [-14, -14, -22, -46, -44, -30, -15, -27],
    [  1,   7,  -8, -64, -43, -16,   9,   8],
    [-15,  36,  12, -54,   8, -28,  24,  14]
]

export const EG_KING_VALUES = [
    [-74, -35, -18, -18, -11,  15,   4, -17],
    [-12,  17,  14,  17,  17,  38,  23,  11],
    [ 10,  17,  23,  15,  20,  45,  44,  13],
    [ -8,  22,  24,  27,  26,  33,  26,   3],
    [-18,  -4,  21,  24,  27,  23,   9, -11],
    [-19,  -3,  11,  21,  23,  16,   7,  -9],
    [-27, -11,   4,  13,  14,   4,  -5, -17],
    [-53, -34, -21, -11, -28, -14, -24, -43]
]

export const MG_PESTO_TABLE: {[key: string]: number[][]} = {
    'p': MG_PAWN_VALUES,
    'n': MG_KNIGHT_VALUES,
    'b': MG_BISHOP_VALUES,
    'r': MG_ROOK_VALUES,
    'q': MG_QUEEN_VALUES,
    'k': MG_KING_VALUES
}

export const EG_PESTO_TABLE: {[key: string]: number[][]} = {
    'p': EG_PAWN_VALUES,
    'n': EG_KNIGHT_VALUES,
    'b': EG_BISHOP_VALUES,
    'r': EG_ROOK_VALUES,
    'q': EG_QUEEN_VALUES,
    'k': EG_KING_VALUES
}

export const MG_VALUE: {[key: string]: number} = {
    'p': 82,
    'n': 337,
    'b': 365,
    'r': 477,
    'q': 1025,
    'k': 0,
}

export const EG_VALUE: {[key: string]: number} = {
    'p': 94,
    'n': 281,
    'b': 297,
    'r': 512,
    'q': 936,
    'k': 0,
}

export const GAME_PHASE_INC: {[key: string]: number} = {
    'p': 0,
    'n': 1,
    'b': 1,
    'r': 2,
    'q': 4,
    'k': 0
}

let mgTable: EvalTable = {
    'p': Array.from(Array(8), () => Array(8).fill(0)),
    'n': Array.from(Array(8), () => Array(8).fill(0)),
    'b': Array.from(Array(8), () => Array(8).fill(0)),
    'r': Array.from(Array(8), () => Array(8).fill(0)),
    'q': Array.from(Array(8), () => Array(8).fill(0)),
    'k': Array.from(Array(8), () => Array(8).fill(0)),
    'P': Array.from(Array(8), () => Array(8).fill(0)),
    'N': Array.from(Array(8), () => Array(8).fill(0)),
    'B': Array.from(Array(8), () => Array(8).fill(0)),
    'R': Array.from(Array(8), () => Array(8).fill(0)),
    'Q': Array.from(Array(8), () => Array(8).fill(0)),
    'K': Array.from(Array(8), () => Array(8).fill(0))
}

let egTable: EvalTable = {
    'p': Array.from(Array(8), () => Array(8).fill(0)),
    'n': Array.from(Array(8), () => Array(8).fill(0)),
    'b': Array.from(Array(8), () => Array(8).fill(0)),
    'r': Array.from(Array(8), () => Array(8).fill(0)),
    'q': Array.from(Array(8), () => Array(8).fill(0)),
    'k': Array.from(Array(8), () => Array(8).fill(0)),
    'P': Array.from(Array(8), () => Array(8).fill(0)),
    'N': Array.from(Array(8), () => Array(8).fill(0)),
    'B': Array.from(Array(8), () => Array(8).fill(0)),
    'R': Array.from(Array(8), () => Array(8).fill(0)),
    'Q': Array.from(Array(8), () => Array(8).fill(0)),
    'K': Array.from(Array(8), () => Array(8).fill(0))
}

const fillTable = (piece: string, isWhite: boolean, fillMg: boolean) => {
    let pestoTable: number[][];
    if (isWhite) {
        if (fillMg)
            pestoTable = MG_PESTO_TABLE[piece.toLowerCase()];
        else
            pestoTable = EG_PESTO_TABLE[piece.toLowerCase()];
    } else {
        if (fillMg) {
            const values = MG_PESTO_TABLE[piece];
            pestoTable = [...values].reverse();
        } else {
            const values = EG_PESTO_TABLE[piece];
            pestoTable = [...values].reverse();
        }
    }
    
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            if (fillMg)
                mgTable[piece][rank][file] = MG_VALUE[isWhite ? piece.toLowerCase(): piece] + pestoTable[rank][file];
            else
                egTable[piece][rank][file] = EG_VALUE[isWhite ? piece.toLowerCase() : piece] + pestoTable[rank][file];
        }
    }
}

const pieceChars = ['p', 'b', 'n', 'r', 'q', 'k', 'P', 'B', 'N', 'R', 'Q', 'K']

export const initMGTable = () => {
    pieceChars.map(p => {
        switch(p == p.toUpperCase()) {
            case true: // White
                fillTable(p, true, true);
                break;
            case false: // Black
                fillTable(p, false, true);
                break;
        }
    });
}

export const initEGTable = () => {
    pieceChars.map(p => {
        switch(p == p.toUpperCase()) {
            case true: // White
                fillTable(p, true, false);
                break;
            case false: // Black
                fillTable(p, false, false);
                break;
        }
    });
}

export const getTables = (): {mgTable: EvalTable, egTable: EvalTable} => ({ mgTable, egTable });