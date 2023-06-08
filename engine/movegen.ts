const MvvLvaValue = [ 0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600 ]
const MvvLvaScores = new Array( 14 * 14 )

const InitMvvLva = (): void => {
  let attacker: number, victim: number

  for( attacker = PIECES.wP; attacker <= PIECES.bK; ++attacker ) {
    for( victim = PIECES.wP; victim <= PIECES.bK; ++victim ) {
      MvvLvaScores[victim * 14 + attacker] = MvvLvaValue[victim] + 6 - ( MvvLvaValue[attacker] / 100 )
    }
  }
}

const moveExists = ( board: GameBoard, move: number ): boolean => {
  generateMoves( board )

  let index: number, moveFound: number = NOMOVE
  for( index = board.moveListStart[board.ply]; index < board.moveListStart[board.ply + 1]; ++index ) {
    moveFound = board.moveList[index]
    if( !makeMove( board, moveFound ) ) {
      continue
    }
    takeMove( board )
    if( move === moveFound ) {
      return true
    }
  }

  return false
}

const MOVE = ( from: number, to: number, captured: number, promoted: number, flag: number ): number => {
  return from | ( to << 7 ) | ( captured << 14 ) | ( promoted << 20 ) | flag
}

const addCaptureMove = ( board: GameBoard, move: number ): void => {
  board.moveList[board.moveListStart[board.ply + 1]] = move
  board.moveScores[board.moveListStart[board.ply + 1]++] = MvvLvaScores[Captured( move ) * 14 + board.pieces[FromSq( move )]] + 1000000
}

const addQuietMove = ( board: GameBoard, move: number ): void => {
  board.moveList[board.moveListStart[board.ply + 1]] = move
  board.moveScores[board.moveListStart[board.ply + 1]] = 0

  if( move === board.searchKillers[board.ply] ) {
    board.moveScores[board.moveListStart[board.ply + 1]] = 900000
  } else if( move === board.searchKillers[board.ply + MAXDEPTH] ) {
    board.moveScores[board.moveListStart[board.ply + 1]] = 800000
  } else {
    board.moveScores[board.moveListStart[board.ply + 1]] = board.searchHistory[board.pieces[FromSq( move )] * BRD_SQ_NUM + ToSq( move )]
  }

  board.moveListStart[board.ply + 1]++
}

const addEnPassantMove = ( board: GameBoard, move: number ): void => {
  board.moveList[board.moveListStart[board.ply + 1]] = move
  board.moveScores[board.moveListStart[board.ply + 1]++] = 105 + 1000000
}

const addWhitePawnCapMove = ( board: GameBoard, from: number, to: number, cap: number ): void => {
  if( RANKS_BRD[from] === RANKS.RANK_7 ) {
    addCaptureMove( board, MOVE( from, to, cap, PIECES.wQ, 0 ) )
    addCaptureMove( board, MOVE( from, to, cap, PIECES.wR, 0 ) )
    addCaptureMove( board, MOVE( from, to, cap, PIECES.wB, 0 ) )
    addCaptureMove( board, MOVE( from, to, cap, PIECES.wN, 0 ) )
  } else {
    addCaptureMove( board, MOVE( from, to, cap, PIECES.EMPTY, 0 ) )
  }
}

const addBlackPawnCapMove = ( board: GameBoard, from: number, to: number, cap: number ): void => {
  if( RANKS_BRD[from] === RANKS.RANK_2 ) {
    addCaptureMove( board, MOVE( from, to, cap, PIECES.bQ, 0 ) )
    addCaptureMove( board, MOVE( from, to, cap, PIECES.bR, 0 ) )
    addCaptureMove( board, MOVE( from, to, cap, PIECES.bB, 0 ) )
    addCaptureMove( board, MOVE( from, to, cap, PIECES.bN, 0 ) )
  } else {
    addCaptureMove( board, MOVE( from, to, cap, PIECES.EMPTY, 0 ) )
  }
}

const addWhitePawnQuietMove = ( board: GameBoard, from: number, to: number ): void => {
  if( RANKS_BRD[from] === RANKS.RANK_7 ) {
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.wQ, 0 ) )
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.wR, 0 ) )
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.wB, 0 ) )
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.wN, 0 ) )
  } else {
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.EMPTY, 0 ) )
  }
}

const addBlackPawnQuietMove = ( board: GameBoard, from: number, to: number ): void => {
  if( RANKS_BRD[from] === RANKS.RANK_2 ) {
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.bQ, 0 ) )
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.bR, 0 ) )
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.bB, 0 ) )
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.bN, 0 ) )
  } else {
    addQuietMove( board, MOVE( from, to, PIECES.EMPTY, PIECES.EMPTY, 0 ) )
  }
}

const generateMoves = ( board: GameBoard ): void => {
  board.moveListStart[board.ply + 1] = board.moveListStart[board.ply]

  let pceType: number, pceNum: number, sq: number, pceIndex: number, t_sq: number, dir: number, index: number, pce: number

  if( board.side === COLORS.WHITE ) {
    pceType = PIECES.wP
    for( pceNum = 0; pceNum < board.pceNum[pceType]; ++pceNum) {
      sq = board.pList[PceIndex( pceType, pceNum )]
      if( board.pieces[sq + 10] === PIECES.EMPTY ) {
        addWhitePawnQuietMove( board, sq, sq + 10 )
        if( RANKS_BRD[sq] === RANKS.RANK_2 && board.pieces[sq + 20] === PIECES.EMPTY ) {
          addQuietMove( board, MOVE( sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS ) )
        }
      }

      if( !SqOffBoard( sq + 9 ) && PIECE_COL[board.pieces[sq + 9]] === COLORS.BLACK ) {
        addWhitePawnCapMove( board, sq, sq + 9, board.pieces[sq + 9] )
      }

      if( !SqOffBoard( sq + 11 ) && PIECE_COL[board.pieces[sq + 11]] === COLORS.BLACK ) {
        addWhitePawnCapMove( board, sq, sq + 11, board.pieces[sq + 11] )
      }

      if( board.enPas !== SQUARES.NO_SQ ) {
        if( sq + 9 === board.enPas ) {
          addEnPassantMove( board, MOVE( sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) )
        }

        if( sq + 11 === board.enPas ) {
          addEnPassantMove( board, MOVE( sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) )
        }
      }
    }

    if( board.castlePerm & CASTLEBIT.WKCA ) {
      if( board.pieces[SQUARES.F1] === PIECES.EMPTY && board.pieces[SQUARES.G1] === PIECES.EMPTY ) {
        if( sqAttack( board, SQUARES.F1, COLORS.BLACK ) === false && sqAttack( board, SQUARES.E1, COLORS.BLACK ) === false ) {
          addQuietMove( board, MOVE( SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ) )
        }
      }
    }

    if( board.castlePerm & CASTLEBIT.WQCA ) {
      if( board.pieces[SQUARES.D1] === PIECES.EMPTY && board.pieces[SQUARES.C1] === PIECES.EMPTY && board.pieces[SQUARES.B1] === PIECES.EMPTY ) {
        if( sqAttack( board, SQUARES.D1, COLORS.BLACK ) === false && sqAttack( board, SQUARES.E1, COLORS.BLACK ) === false ) {
          addQuietMove( board, MOVE( SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ) )
        }
      }
    }
  } else {
    pceType = PIECES.bP
    for( pceNum = 0; pceNum < board.pceNum[pceType]; ++pceNum) {
      sq = board.pList[PceIndex( pceType, pceNum )]
      if( board.pieces[sq - 10] === PIECES.EMPTY ) {
        addBlackPawnQuietMove( board, sq, sq - 10 )
        if( RANKS_BRD[sq] === RANKS.RANK_7 && board.pieces[sq - 20] === PIECES.EMPTY ) {
          addQuietMove( board, MOVE( sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS ) )
        }
      }

      if( !SqOffBoard( sq - 9 ) && PIECE_COL[board.pieces[sq - 9]] === COLORS.WHITE ) {
        addBlackPawnCapMove( board, sq, sq - 9, board.pieces[sq - 9] )
      }

      if( !SqOffBoard( sq - 11 ) && PIECE_COL[board.pieces[sq - 11]] === COLORS.WHITE ) {
        addBlackPawnCapMove( board, sq, sq - 11, board.pieces[sq - 11] )
      }

      if( board.enPas !== SQUARES.NO_SQ ) {
        if( sq - 9 === board.enPas ) {
          addEnPassantMove( board, MOVE( sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) )
        }

        if( sq - 11 === board.enPas ) {
          addEnPassantMove( board, MOVE( sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) )
        }
      }
    }

    if( board.castlePerm & CASTLEBIT.BKCA ) {
      if( board.pieces[SQUARES.F8] === PIECES.EMPTY && board.pieces[SQUARES.G8] === PIECES.EMPTY ) {
        if( sqAttack( board, SQUARES.F8, COLORS.WHITE ) === false && sqAttack( board, SQUARES.E8, COLORS.WHITE ) === false ) {
          addQuietMove( board, MOVE( SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ) )
        }
      }
    }

    if( board.castlePerm & CASTLEBIT.BQCA ) {
      if( board.pieces[SQUARES.D8] === PIECES.EMPTY && board.pieces[SQUARES.C8] === PIECES.EMPTY && board.pieces[SQUARES.B8] === PIECES.EMPTY ) {
        if( sqAttack( board, SQUARES.D8, COLORS.WHITE ) === false && sqAttack( board, SQUARES.E8, COLORS.WHITE ) === false ) {
          addQuietMove( board, MOVE( SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ) )
        }
      }
    }
  }

  pceIndex = LOOP_NON_SLIDE_PIECE_INDEX[board.side]
  pce = LOOP_NON_SLIDE_PIECE[pceIndex++]

  while( pce !== 0 ) {
    for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
      sq = board.pList[PceIndex( pce, pceNum )]

      for( index = 0; index < DIR_NUM[pce]; ++index ) {
        dir = PIECE_DIRS[pce][index]
        t_sq = sq + dir

        if( SqOffBoard( t_sq ) === true ) {
          continue
        }

        if( board.pieces[t_sq] !== PIECES.EMPTY ) {
          if( PIECE_COL[board.pieces[t_sq]] !== board.side ) {
            addCaptureMove( board, MOVE( sq, t_sq, board.pieces[t_sq], PIECES.EMPTY, 0 ) )
          }
        } else {
          addQuietMove( board, MOVE( sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ) )
        }
      }
    }
    pce = LOOP_NON_SLIDE_PIECE[pceIndex++]
  }

  pceIndex = LOOP_SLIDE_PIECE_INDEX[board.side]
  pce = LOOP_SLIDE_PIECE[pceIndex++]

  while( pce !== 0 ) {
    for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
      sq = board.pList[PceIndex( pce, pceNum )]

      for( index = 0; index < DIR_NUM[pce]; ++index ) {
        dir = PIECE_DIRS[pce][index]
        t_sq = sq + dir

        while( SqOffBoard( t_sq ) === false ) {
          if( board.pieces[t_sq] !== PIECES.EMPTY ) {
            if( PIECE_COL[board.pieces[t_sq]] !== board.side ) {
              addCaptureMove( board, MOVE( sq, t_sq, board.pieces[t_sq], PIECES.EMPTY, 0 ) )
            }
            break
          }
          addQuietMove( board, MOVE( sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ) )
          t_sq += dir
        }
      }
    }
    pce = LOOP_SLIDE_PIECE[pceIndex++]
  }
}

const generateCaptures = ( board: GameBoard ): void => {
  board.moveListStart[board.ply + 1] = board.moveListStart[board.ply]

  let pceType: number, pceNum: number, sq: number, pceIndex: number, t_sq: number, dir: number, index: number, pce: number

  if( board.side === COLORS.WHITE ) {
    pceType = PIECES.wP
    for( pceNum = 0; pceNum < board.pceNum[pceType]; ++pceNum) {
      sq = board.pList[PceIndex( pceType, pceNum )]

      if( !SqOffBoard( sq + 9 ) && PIECE_COL[board.pieces[sq + 9]] === COLORS.BLACK ) {
        addWhitePawnCapMove( board, sq, sq + 9, board.pieces[sq + 9] )
      }

      if( !SqOffBoard( sq + 11 ) && PIECE_COL[board.pieces[sq + 11]] === COLORS.BLACK ) {
        addWhitePawnCapMove( board, sq, sq + 11, board.pieces[sq + 11] )
      }

      if( board.enPas !== SQUARES.NO_SQ ) {
        if( sq + 9 === board.enPas ) {
          addEnPassantMove( board, MOVE( sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) )
        }

        if( sq + 11 === board.enPas ) {
          addEnPassantMove( board, MOVE( sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) )
        }
      }
    }
  } else {
    pceType = PIECES.bP
    for( pceNum = 0; pceNum < board.pceNum[pceType]; ++pceNum) {
      sq = board.pList[PceIndex( pceType, pceNum )]
      if( !SqOffBoard( sq - 9 ) && PIECE_COL[board.pieces[sq - 9]] === COLORS.WHITE ) {
        addBlackPawnCapMove( board, sq, sq - 9, board.pieces[sq - 9] )
      }

      if( !SqOffBoard( sq - 11 ) && PIECE_COL[board.pieces[sq - 11]] === COLORS.WHITE ) {
        addBlackPawnCapMove( board, sq, sq - 11, board.pieces[sq - 11] )
      }

      if( board.enPas !== SQUARES.NO_SQ ) {
        if( sq - 9 === board.enPas ) {
          addEnPassantMove( board, MOVE( sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) )
        }

        if( sq - 11 === board.enPas ) {
          addEnPassantMove( board, MOVE( sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) )
        }
      }
    }
  }

  pceIndex = LOOP_NON_SLIDE_PIECE_INDEX[board.side]
  pce = LOOP_NON_SLIDE_PIECE[pceIndex++]

  while( pce !== 0 ) {
    for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
      sq = board.pList[PceIndex( pce, pceNum )]

      for( index = 0; index < DIR_NUM[pce]; ++index ) {
        dir = PIECE_DIRS[pce][index]
        t_sq = sq + dir

        if( SqOffBoard( t_sq ) === true ) {
          continue
        }

        if( board.pieces[t_sq] !== PIECES.EMPTY ) {
          if( PIECE_COL[board.pieces[t_sq]] !== board.side ) {
            addCaptureMove( board, MOVE( sq, t_sq, board.pieces[t_sq], PIECES.EMPTY, 0 ) )
          }
        }
      }
    }
    pce = LOOP_NON_SLIDE_PIECE[pceIndex++]
  }

  pceIndex = LOOP_SLIDE_PIECE_INDEX[board.side]
  pce = LOOP_SLIDE_PIECE[pceIndex++]

  while( pce !== 0 ) {
    for( pceNum = 0; pceNum < board.pceNum[pce]; ++pceNum ) {
      sq = board.pList[PceIndex( pce, pceNum )]

      for( index = 0; index < DIR_NUM[pce]; ++index ) {
        dir = PIECE_DIRS[pce][index]
        t_sq = sq + dir

        while( SqOffBoard( t_sq ) === false ) {
          if( board.pieces[t_sq] !== PIECES.EMPTY ) {
            if( PIECE_COL[board.pieces[t_sq]] !== board.side ) {
              addCaptureMove( board, MOVE( sq, t_sq, board.pieces[t_sq], PIECES.EMPTY, 0 ) )
            }
            break
          }
          t_sq += dir
        }
      }
    }
    pce = LOOP_SLIDE_PIECE[pceIndex++]
  }
}