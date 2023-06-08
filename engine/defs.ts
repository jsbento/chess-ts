const PIECES: { [key: string]: number } = {
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

const BRD_SQ_NUM: number = 120

const FILES: { [key: string]: number } = {
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

const RANKS: { [key: string]: number } = {
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

const COLORS: { [key: string]: number } = {
  WHITE: 0,
  BLACK: 1,
  BOTH: 2,
}

const CASTLEBIT: { [key: string]: number } = {
  WKCA: 1,
  WQCA: 2,
  BKCA: 4,
  BQCA: 8,
}

const SQUARES: { [key: string]: number } = {
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

const MAXGAMEMOVES: number = 2048
const MAXPOSITIONMOVES: number = 256
const MAXDEPTH: number = 64
const INFINITE: number = 30000
const MATE: number = 29000
const PVENTRIES: number = 10000

const FILES_BRD: number[] = new Array(BRD_SQ_NUM)
const RANKS_BRD: number[] = new Array(BRD_SQ_NUM)

const START_FEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const PCE_CHAR: string = '.PNBRQKpnbrqk'
const SIDE_CHAR: string = 'wb-'
const RANK_CHAR: string = '12345678'
const FILE_CHAR: string = 'abcdefgh'

const FR2SQ = (f: number, r: number) => ( 21 + f ) + ( r * 10 )

const PIECE_BIG: boolean[] = [ false, false, true, true, true, true, true, false, true, true, true, true, true ]
const PIECE_MAJ: boolean[] = [ false, false, false, false, true, true, true, false, false, false, true, true, true ]
const PIECE_MIN: boolean[] = [ false, false, true, true, false, false, false, false, true, true, false, false, false ]
const PIECE_VAL: number[] = [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000 ]
const PIECE_COL: number[] = [ COLORS.BOTH, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK ]

const PIECE_PAWN: boolean[] = [ false, true, false, false, false, false, false, true, false, false, false, false, false ]
const PIECE_KNIGHT: boolean[] = [ false, false, true, false, false, false, false, false, true, false, false, false, false ]
const PIECE_KING: boolean[] = [ false, false, false, false, false, false, true, false, false, false, false, false, true ]
const PIECE_ROOK_QUEEN: boolean[] = [ false, false, false, false, true, true, false, false, false, false, true, true, false ]
const PIECE_BISHOP_QUEEN: boolean[] = [ false, false, false, true, false, true, false, false, false, true, false, true, false ]
const PIECE_SLIDES: boolean[] = [ false, false, false, true, true, true, false, false, false, true, true, true, false ]

const KNIGHT_DIRS: number[] = [ -8, -19, -21, -12, 8, 19, 21, 12 ]
const ROOK_DIRS: number[] = [ -1, -10, 1, 10 ]
const BISHOP_DIRS: number[] = [ -9, -11, 11, 9 ]
const KING_DIRS: number[] = [ -1, -10, 1, 10, -9, -11, 11, 9 ]

const DIR_NUM: number[] = [ 0, 0, 8, 4, 4, 8, 0, 0, 8, 4, 4, 8, 0 ]
const PIECE_DIRS: number[][] = [ [], [], KNIGHT_DIRS, BISHOP_DIRS, ROOK_DIRS, KING_DIRS, [], [], KNIGHT_DIRS, BISHOP_DIRS, ROOK_DIRS, KING_DIRS, [] ]
const LOOP_NON_SLIDE_PIECE: number[] = [ PIECES.WN, PIECES.WK, 0, PIECES.BN, PIECES.BK, 0 ]
const LOOP_NON_SLIDE_PIECE_INDEX: number[] = [ 0, 3 ]
const LOOP_SLIDE_PIECE: number[] = [ PIECES.WB, PIECES.WR, PIECES.WQ, 0, PIECES.BB, PIECES.BR, PIECES.BQ, 0 ]
const LOOP_SLIDE_PIECE_INDEX: number[] = [ 0, 4 ]

const PieceKeys = new Array(14 * 120)
let SideKey: number
const CastleKeys = new Array(16)

const Sq120ToSq64: number[] = new Array( BRD_SQ_NUM )
const Sq64ToSq120: number[] = new Array( 64 )

const Rand32 = (): number => {
  return ( Math.floor(( Math.random()*255 ) + 1 ) << 23 ) |
  ( Math.floor(( Math.random()*255 ) + 1 ) << 16 ) |
  ( Math.floor(( Math.random()*255 ) + 1 ) << 8 ) |
  Math.floor(( Math.random()*255 ) + 1 )
}

const MIRROR64: number[] = [
  56, 57, 58, 59, 60, 61, 62, 63,
  48, 49, 50, 51, 52, 53, 54, 55,
  40, 41, 42, 43, 44, 45, 46, 47,
  32, 33, 34, 35, 36, 37, 38, 39,
  24, 25, 26, 27, 28, 29, 30, 31,
  16, 17, 18, 19, 20, 21, 22, 23,
  8, 9, 10, 11, 12, 13, 14, 15,
  0, 1, 2, 3, 4, 5, 6, 7,
]

const Sq120 = ( sq64: number ): number => {
  return Sq120ToSq64[sq64]
}

const Sq64 = ( sq120: number ): number => {
  return Sq64ToSq120[sq120]
}

const PceIndex = ( pce: number, pceNum: number ): number => {
  return pce * 10 + pceNum
}

const Mirror64 = ( sq: number ): number => {
  return MIRROR64[sq]
}

const Kings: number[] = [ PIECES.WK, PIECES.BK ]
const CastlePerm: number[] = [
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

const FromSq = ( move: number ): number => ( move & 0x7F )
const ToSq = ( move: number ): number => (( move >> 7 ) & 0x7F )
const Captured = ( move: number ): number => (( move >> 14 ) & 0xF )
const Promoted = ( move: number ): number => (( move >> 20 ) & 0xF )

const MFLAGEP = 0x40000
const MFLAGPS = 0x80000
const MFLAGCA = 0x1000000

const MFLAGCAP = 0x7C000
const MFLAGPROM = 0xF00000

const NOMOVE = 0

const SqOffBoard = ( sq: number ): boolean => {
  return FILES_BRD[sq] === SQUARES.OFFBOARD
}

interface IGameBoard {
  posKey: number,
  castlePerm: number,
  enPas: number,
}

const GameBoard: IGameBoard = {} as IGameBoard

const HashPce = ( board: GameBoard, pce: number, sq: number ): void => {
  board.posKey ^= PieceKeys[(pce * 120) + sq]
}
const HashCastle = ( board: GameBoard ): void => {
  board.posKey ^= CastleKeys[GameBoard.castlePerm]
}
const HashSide = ( board: GameBoard ): void => {
  board.posKey ^= SideKey
}
const HashEnPas = ( board: GameBoard ): void => {
  board.posKey ^= PieceKeys[GameBoard.enPas]
}

interface IGameController {
  EngineSide: number,
  PlayerSide: number,
  GameOver: boolean,
}

const GameController: IGameController = {
  EngineSide: COLORS.BOTH,
  PlayerSide: COLORS.BOTH,
  GameOver: false,
}

interface IUserMove {
  from: number,
  to: number,
}

const UserMove: IUserMove = {
  from: SQUARES.NO_SQ,
  to: SQUARES.NO_SQ,
}