const clearPiece = ( board: GameBoard, sq: number ): void => {
  const piece = board.pieces[sq]
  const color = PIECE_COL[piece]
  let t_PceNum = -1

  HashPce( board, piece, sq )
  board.pieces[sq] = PIECES.EMPTY
  board.material[color] -= PIECE_VAL[piece]

  for( let index = 0; index < board.pceNum[piece]; ++index ) {
    if( board.pList[PceIndex( piece, index )] === sq ) {
      t_PceNum = index
      break
    }
  }

  board.pceNum[piece]--
  board.pList[PceIndex( piece, t_PceNum )] = board.pList[PceIndex( piece, board.pceNum[piece] )]
}

const addPiece = ( board: GameBoard, sq: number, piece: number ): void => {
  const color = PIECE_COL[piece]

  HashPce( board, piece, sq )
  board.pieces[sq] = piece
  board.material[color] += PIECE_VAL[piece]
  board.pList[PceIndex( piece, board.pceNum[piece] )] = sq
  board.pceNum[piece]++
}

const movePiece = ( board: GameBoard, from: number, to: number ): void => {
  let index = 0
  const piece = board.pieces[from]

  HashPce( board, piece, from )
  board.pieces[from] = PIECES.EMPTY

  HashPce( board, piece, to )
  board.pieces[to] = piece

  for( index = 0; index < board.pceNum[piece]; ++index ) {
    if( board.pList[PceIndex( piece, index )] === from ) {
      board.pList[PceIndex( piece, index )] = to
      break
    }
  }
}

const makeMove = ( board: GameBoard, move: number ): boolean => {
  const from = FromSq( move )
  const to = ToSq( move )
  const side = board.side

  board.history[board.hisPly].posKey = board.posKey

  if(( move & MFLAGEP ) != 0 ) {
    if( side === COLORS.WHITE ) {
      clearPiece( board, to - 10 )
    } else {
      clearPiece( board, to + 10 )
    }
  } else if(( move & MFLAGCA ) != 0 ) {
    switch( to ) {
      case SQUARES.C1:
        movePiece( board, SQUARES.A1, SQUARES.D1 )
        break
      case SQUARES.C8:
        movePiece( board, SQUARES.A8, SQUARES.D8 )
        break
      case SQUARES.G1:
        movePiece( board, SQUARES.H1, SQUARES.F1 )
        break
      case SQUARES.G8:
        movePiece( board, SQUARES.H8, SQUARES.F8 )
        break
      default:
        break
    }
  }

  if( board.enPas !== SQUARES.NO_SQ ) {
    HashEnPas( board )
  }
  HashCastle( board )

  board.history[board.hisPly].move = move
  board.history[board.hisPly].fiftyMove = board.fiftyMove
  board.history[board.hisPly].enPas = board.enPas
  board.history[board.hisPly].castlePerm = board.castlePerm

  board.castlePerm &= CastlePerm[from]
  board.castlePerm &= CastlePerm[to]
  board.enPas = SQUARES.NO_SQ

  HashCastle( board )

  const captured = Captured( move )
  board.fiftyMove++

  if( captured !== PIECES.EMPTY ) {
    clearPiece( board, to )
    board.fiftyMove = 0
  }

  board.hisPly++
  board.ply++

  if( PIECE_PAWN[board.pieces[from]] === true ) {
    board.fiftyMove = 0
    if(( move & MFLAGPS ) != 0 ) {
      if( side === COLORS.WHITE ) {
        board.enPas = from + 10
      } else {
        board.enPas = from - 10
      }
      HashEnPas( board )
    }
  }

  movePiece( board, from, to )

  const promoted = Promoted( move )
  if( promoted !== PIECES.EMPTY ) {
    clearPiece( board, to )
    addPiece( board, to, promoted )
  }

  board.side ^= 1
  HashSide( board )

  if( sqAttack( board, board.pList[PceIndex( PIECES.WK, 0 )], board.side ) === true ) {
    takeMove( board )
    return false
  }

  return true
}

const takeMove = ( board: GameBoard ) => {
  board.hisPly--
  board.ply--

  const move = board.history[board.hisPly].move
  const from = FromSq( move )
  const to = ToSq( move )

  if( board.enPas !== SQUARES.NO_SQ ) {
    HashEnPas( board )
  }

  board.castlePerm = board.history[board.hisPly].castlePerm
  board.fiftyMove = board.history[board.hisPly].fiftyMove
  board.enPas = board.history[board.hisPly].enPas

  if( board.enPas !== SQUARES.NO_SQ ) {
    HashEnPas( board )
  }

  HashCastle( board )

  board.side ^= 1
  HashSide( board )

  if(( MFLAGEP & move ) != 0 ) {
    if( board.side === COLORS.WHITE ) {
      addPiece( board, to - 10, PIECES.bP )
    } else {
      addPiece( board, to + 10, PIECES.wP )
    }
  } else if(( MFLAGCA & move ) != 0 ) {
    switch( to ) {
      case SQUARES.C1:
        movePiece( board, SQUARES.D1, SQUARES.A1 )
        break
      case SQUARES.C8:
        movePiece( board, SQUARES.D8, SQUARES.A8 )
        break
      case SQUARES.G1:
        movePiece( board, SQUARES.F1, SQUARES.H1 )
        break
      case SQUARES.G8:
        movePiece( board, SQUARES.F8, SQUARES.H8 )
        break
      default:
        break
    }
  }

  movePiece( board, to, from )

  const captured = Captured( move )
  if( captured !== PIECES.EMPTY ) {
    addPiece( board, to, captured )
  }

  if( Promoted( move ) !== PIECES.EMPTY ) {
    clearPiece( board, from )
    addPiece( board, from, ( PIECE_COL[Promoted( move )] === COLORS.WHITE ? PIECES.wP : PIECES.bP ))
  }
}