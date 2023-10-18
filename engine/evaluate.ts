const PAWN_TABLE: number[] = [
  0, 0, 0, 0, 0, 0, 0, 0,
  10, 10, 0, -10, -10, 0, 10, 10,
  5, 0, 0, 5, 5, 0, 0, 5,
  0, 0, 10, 20, 20, 10, 0, 0,
  5, 5, 5, 10, 10, 5, 5, 5,
  10, 10, 10, 20, 20, 10, 10, 10,
  20, 20, 20, 30, 30, 20, 20, 20,
  0, 0, 0, 0, 0, 0, 0, 0
]

const KNIGHT_TABLE: number[] = [
  0, -10, 0, 0, 0, 0, -10, 0,
  0, 0, 0, 5, 5, 0, 0, 0,
  0, 0, 10, 10, 10, 10, 0, 0,
  0, 0, 10, 20, 20, 10, 5, 0,
  5, 10, 15, 20, 20, 15, 10, 5,
  5, 10, 10, 20, 20, 10, 10, 5,
  0, 0, 5, 10, 10, 5, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0
]

const BISHOP_TABLE: number[] = [
  0, 0, -10, 0, 0, -10, 0, 0,
  0, 0, 0, 10, 10, 0, 0, 0,
  0, 0, 10, 15, 15, 10, 0, 0,
  0, 10, 15, 20, 20, 15, 10, 0,
  0, 10, 15, 20, 20, 15, 10, 0,
  0, 0, 10, 15, 15, 10, 0, 0,
  0, 0, 0, 10, 10, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0
]

const ROOK_TABLE: number[] = [
  0, 0, 5, 10, 10, 5, 0, 0,
  0, 0, 5, 10, 10, 5, 0, 0,
  0, 0, 5, 10, 10, 5, 0, 0,
  0, 0, 5, 10, 10, 5, 0, 0,
  0, 0, 5, 10, 10, 5, 0, 0,
  0, 0, 5, 10, 10, 5, 0, 0,
  25, 25, 25, 25, 25, 25, 25, 25,
  0, 0, 5, 10, 10, 5, 0, 0
]

const BISHOP_PAIR: number = 40

const evaluate = ( board: GameBoard ): number => {
  let score = board.material[COLORS.WHITE] - board.material[COLORS.BLACK]
  let pce, sq, pceNum

  pce = PIECES.WP
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score += PAWN_TABLE[Sq64( sq )]
  }

  pce = PIECES.BP
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score -= PAWN_TABLE[Mirror64( Sq64( sq ) )]
  }

  pce = PIECES.WN
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score += KNIGHT_TABLE[Sq64( sq )]
  }

  pce = PIECES.BN
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score -= KNIGHT_TABLE[Mirror64( Sq64( sq ) )]
  }

  pce = PIECES.WB
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score += BISHOP_TABLE[Sq64( sq )]
  }

  pce = PIECES.BB
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score -= BISHOP_TABLE[Mirror64( Sq64( sq ) )]
  }

  pce = PIECES.WR
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score += ROOK_TABLE[Sq64( sq )]
  }

  pce = PIECES.BR
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score -= ROOK_TABLE[Mirror64( Sq64( sq ) )]
  }

  pce = PIECES.WQ
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score += ROOK_TABLE[Sq64( sq )]
  }

  pce = PIECES.BQ
  for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
    sq = board.pList[PceIndex( pce, pceNum )]
    score -= ROOK_TABLE[Mirror64( Sq64( sq ) )]
  }

  if( board.pceNum[PIECES.WB] >= 2 ) {
    score += BISHOP_PAIR
  }

  if( board.pceNum[PIECES.BB] >= 2 ) {
    score -= BISHOP_PAIR
  }

  if( board.side === COLORS.WHITE ) {
    return score
  } else {
    return -score
  }
}