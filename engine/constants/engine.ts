export const PIECES: { [key: string]: number } = {
  EMPTY: 0,
  WP: 1,
  WN: 2,
  WB: 3,
  WR: 4,
  WQ: 5,
  WK: 6,
  BP: 7,
  BN: 8,
  BB: 9,
  BR: 10,
  BQ: 11,
  BK: 12,
}

export const BRD_SQ_NUM: number = 120

export const FILES: { [key: string]: number } = {
  FILE_A: 0,
  FILE_B: 1,
  FILE_C: 2,
  FILE_D: 3,
  FILE_E: 4,
  FILE_F: 5,
  FILE_G: 6,
  FILE_H: 7,
  FILE_NONE: 8,
}

export const RANKS: { [key: string]: number } = {
  RANK_1: 0,
  RANK_2: 1,
  RANK_3: 2,
  RANK_4: 3,
  RANK_5: 4,
  RANK_6: 5,
  RANK_7: 6,
  RANK_8: 7,
  RANK_NONE: 8,
}

export const COLORS: { [key: string]: number } = {
  WHITE: 0,
  BLACK: 1,
  BOTH: 2,
}

export const CASTLEBIT: { [key: string]: number } = {
  WKCA: 1,
  WQCA: 2,
  BKCA: 4,
  BQCA: 8,
}

export const SQUARES: { [key: string]: number } = {
  A1: 21,
  B1: 22,
  C1: 23,
  D1: 24,
  E1: 25,
  F1: 26,
  G1: 27,
  H1: 28,
  A8: 91,
  B8: 92,
  C8: 93,
  D8: 94,
  E8: 95,
  F8: 96,
  G8: 97,
  H8: 98,
  NO_SQ: 99,
  OFFBOARD: 100,
}

export const MAXGAMEMOVES: number = 2048
export const MAXPOSITIONMOVES: number = 256
export const MAXDEPTH: number = 64
export const INFINITE: number = 30000
export const MATE: number = 29000
export const PVENTRIES: number = 10000

export const FILES_BRD: number[] = new Array(BRD_SQ_NUM)
export const RANKS_BRD: number[] = new Array(BRD_SQ_NUM)

export const START_FEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export const PCE_CHAR: string = '.PNBRQKpnbrqk'
export const SIDE_CHAR: string = 'wb-'
export const RANK_CHAR: string = '12345678'
export const FILE_CHAR: string = 'abcdefgh'

export const FR2SQ = (f: number, r: number) => ( 21 + f ) + ( r * 10 )

export const PIECE_BIG: boolean[] = [ false, false, true, true, true, true, true, false, true, true, true, true, true ]
export const PIECE_MAJ: boolean[] = [ false, false, false, false, true, true, true, false, false, false, true, true, true ]
export const PIECE_MIN: boolean[] = [ false, false, true, true, false, false, false, false, true, true, false, false, false ]
export const PIECE_VAL: number[] = [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000 ]
export const PIECE_COL: number[] = [ COLORS.BOTH, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK ]

export const PIECE_PAWN: boolean[] = [ false, true, false, false, false, false, false, true, false, false, false, false, false ]
export const PIECE_KNIGHT: boolean[] = [ false, false, true, false, false, false, false, false, true, false, false, false, false ]
export const PIECE_KING: boolean[] = [ false, false, false, false, false, false, true, false, false, false, false, false, true ]
export const PIECE_ROOK_QUEEN: boolean[] = [ false, false, false, false, true, true, false, false, false, false, true, true, false ]
export const PIECE_BISHOP_QUEEN: boolean[] = [ false, false, false, true, false, true, false, false, false, true, false, true, false ]
export const PIECE_SLIDES: boolean[] = [ false, false, false, true, true, true, false, false, false, true, true, true, false ]

export const KNIGHT_DIRS: number[] = [ -8, -19, -21, -12, 8, 19, 21, 12 ]
export const ROOK_DIRS: number[] = [ -1, -10, 1, 10 ]
export const BISHOP_DIRS: number[] = [ -9, -11, 11, 9 ]
export const KING_DIRS: number[] = [ -1, -10, 1, 10, -9, -11, 11, 9 ]

export const DIR_NUM: number[] = [ 0, 0, 8, 4, 4, 8, 0, 0, 8, 4, 4, 8, 0 ]
export const PIECE_DIRS: number[][] = [ [], [], KNIGHT_DIRS, BISHOP_DIRS, ROOK_DIRS, KING_DIRS, [], [], KNIGHT_DIRS, BISHOP_DIRS, ROOK_DIRS, KING_DIRS, [] ]
export const LOOP_NON_SLIDE_PIECE: number[] = [ PIECES.WN, PIECES.WK, 0, PIECES.BN, PIECES.BK, 0 ]
export const LOOP_NON_SLIDE_PIECE_INDEX: number[] = [ 0, 3 ]
export const LOOP_SLIDE_PIECE: number[] = [ PIECES.WB, PIECES.WR, PIECES.WQ, 0, PIECES.BB, PIECES.BR, PIECES.BQ, 0 ]
export const LOOP_SLIDE_PIECE_INDEX: number[] = [ 0, 4 ]

export const PieceKeys = new Array(14 * 120)
export const CastleKeys = new Array(16)

export const Sq120ToSq64: number[] = new Array( BRD_SQ_NUM )
export const Sq64ToSq120: number[] = new Array( 64 )

export const Rand32 = (): number => {
  return ( Math.floor(( Math.random()*255 ) + 1 ) << 23 ) |
  ( Math.floor(( Math.random()*255 ) + 1 ) << 16 ) |
  ( Math.floor(( Math.random()*255 ) + 1 ) << 8 ) |
  Math.floor(( Math.random()*255 ) + 1 )
}

export const MIRROR64: number[] = [
  56, 57, 58, 59, 60, 61, 62, 63,
  48, 49, 50, 51, 52, 53, 54, 55,
  40, 41, 42, 43, 44, 45, 46, 47,
  32, 33, 34, 35, 36, 37, 38, 39,
  24, 25, 26, 27, 28, 29, 30, 31,
  16, 17, 18, 19, 20, 21, 22, 23,
  8, 9, 10, 11, 12, 13, 14, 15,
  0, 1, 2, 3, 4, 5, 6, 7,
]

export const Sq120 = ( sq64: number ): number => {
  return Sq120ToSq64[sq64]
}

export const Sq64 = ( sq120: number ): number => {
  return Sq64ToSq120[sq120]
}

export const PceIndex = ( pce: number, pceNum: number ): number => {
  return pce * 10 + pceNum
}

export const Mirror64 = ( sq: number ): number => {
  return MIRROR64[sq]
}

export const Kings: number[] = [ PIECES.WK, PIECES.BK ]
export const CastlePerm: number[] = [
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15,  7, 15, 15, 15,  3, 15, 15, 11, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
]

export const FromSq = ( move: number ): number => ( move & 0x7F )
export const ToSq = ( move: number ): number => (( move >> 7 ) & 0x7F )
export const Captured = ( move: number ): number => (( move >> 14 ) & 0xF )
export const Promoted = ( move: number ): number => (( move >> 20 ) & 0xF )

export const MFLAGEP = 0x40000
export const MFLAGPS = 0x80000
export const MFLAGCA = 0x1000000

export const MFLAGCAP = 0x7C000
export const MFLAGPROM = 0xF00000

export const NOMOVE = 0

export const SqOffBoard = ( sq: number ): boolean => {
  return FILES_BRD[sq] === SQUARES.OFFBOARD
}