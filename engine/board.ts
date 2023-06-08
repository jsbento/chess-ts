interface GameBoard {
  pieces: any[],
  side: number,
  fiftyMove: number,
  hisPly: number,
  history: any[],
  ply: number,
  enPas: number,
  castlePerm: number,
  material: number[],
  pceNum: number[],
  pList: any[],
  posKey: number,
  moveList: number[],
  moveScores: number[],
  moveListStart: number[],
  pvTable: any[],
  pvArray: number[],
  searchHistory: any[],
  searchKillers: any[],
}

const newBoard = (): GameBoard => {
  return {
    pieces: new Array( BRD_SQ_NUM ),
    side: COLORS.WHITE,
    fiftyMove: 0,
    hisPly: 0,
    history: [],
    ply: 0,
    enPas: 0,
    castlePerm: 0,
    material: new Array( 2 ),
    pceNum: new Array( 13 ),
    pList: new Array( 14 * 10 ),
    posKey: 0,
    moveList: new Array( MAXDEPTH * MAXPOSITIONMOVES ),
    moveScores: new Array( MAXDEPTH * MAXPOSITIONMOVES ),
    moveListStart: new Array( MAXDEPTH ),
    pvTable: [],
    pvArray: new Array( MAXDEPTH ),
    searchHistory: new Array( 14 * BRD_SQ_NUM ),
    searchKillers: new Array( 3 * MAXDEPTH ),
  }
}

const checkBoard = ( board: GameBoard ): boolean => {
  const tPceNum: number[] = new Array( 13 ).fill( 0 )
  const tMaterial: number[] = new Array( 2 ).fill( 0 )
  let sq64: number, tPiece: number, t_PceNum: number, sq120: number, color: number, pcount: number

  for( tPiece = PIECES.WP; tPiece <= PIECES.BK; ++tPiece) {
    for( t_PceNum = 0; t_PceNum < board.pceNum[tPiece]; ++t_PceNum) {
      sq120 = board.pList[PceIndex( tPiece, t_PceNum )]
      if( board.pieces[sq120] !== tPiece ) {
        return false
      }
    }
  }

  for( sq64 = 0; sq64 < 64; ++sq64 ) {
    sq120 = Sq120( sq64 )
    tPiece = board.pieces[sq120]
    tPceNum[tPiece]++
    tMaterial[PIECE_COL[tPiece]] += PIECE_COL[tPiece]
  }

  for( tPiece = PIECES.WP; tPiece <= PIECES.BK; ++tPiece) {
    if( tPceNum[tPiece] !== board.pceNum[tPiece] ) {
      return false
    }
  }

  if( tMaterial[COLORS.WHITE] !== board.material[COLORS.WHITE] ||
      tMaterial[COLORS.BLACK] !== board.material[COLORS.BLACK] ) {
    return false
  }

  if( board.side !== COLORS.WHITE && board.side !== COLORS.BLACK ) {
    return false
  }

  if( generatePosKey( board ) !== board.posKey ) {
    return false
  }

  return true
}

const printBoard = ( board: GameBoard ): void => {
  let sq: number, file: number, rank: number, piece: number

  console.log( "\nGame Board:\n" )
  for( rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank-- ) {
    let line = `${rank + 1}  `
    for( file = FILES.FILE_A; file <= FILES.FILE_H; file++ ) {
      sq = FR2SQ( file, rank )
      piece = board.pieces[sq]
      line += ` ${PCE_CHAR[piece]}`
    }
    console.log( line )
  }
  console.log( "" )
  let line = "   "
  for( file = FILES.FILE_A; file <= FILES.FILE_H; file++ ) {
    line += ` ${file}`
  }
  console.log( line )
  console.log( `side:${SIDE_CHAR[board.side]} enPas:${board.enPas} castle:${board.castlePerm.toString( 2 )} ` +
    `key:${board.posKey.toString( 16 )}` )
  line = ""

  if( board.castlePerm & CASTLEBIT.WKCA ) line += 'K'
  if( board.castlePerm & CASTLEBIT.WQCA ) line += 'Q'
  if( board.castlePerm & CASTLEBIT.BKCA ) line += 'k'
  if( board.castlePerm & CASTLEBIT.BQCA ) line += 'q'
  console.log( `castle:${line}` )
  console.log( `key:${board.posKey.toString( 16 )}` )
}

const generatePosKey = ( board: GameBoard ): number => {
  let sq: number = 0, finalKey: number = 0, piece: number = PIECES.EMPTY

  for( sq = 0; sq < BRD_SQ_NUM; ++sq ) {
    piece = board.pieces[sq]
    if( piece !== PIECES.EMPTY && piece !== SQUARES.OFFBOARD ) {
      finalKey ^= PieceKeys[( piece * 120 ) + sq]
    }
  }

  if( board.side === COLORS.WHITE ) {
    finalKey ^= SideKey
  }

  if( board.enPas !== SQUARES.NO_SQ ) {
    finalKey ^= PieceKeys[board.enPas]
  }

  finalKey ^= CastleKeys[board.castlePerm]

  return finalKey
}

const updateListsMaterial = ( board: GameBoard ): void => {
  let piece, sq, index, color

  for( index = 0; index < 14 * 120; ++index ) {
    board.pList[index] = PIECES.EMPTY
  }

  for( index = 0; index < 2; ++index ) {
    board.material[index] = 0
  }

  for( index = 0; index < 13; ++index ) {
    board.pceNum[index] = 0
  }

  for( index = 0; index < 64; ++index ) {
    sq = Sq120( index )
    piece = board.pieces[sq]
    if( piece !== PIECES.EMPTY ) {
      color = PIECE_COL[piece]
      board.material[color] += PIECE_VAL[piece]
      board.pList[PceIndex( piece, board.pceNum[piece] )] = sq
      board.pceNum[piece]++
    }
  }
}

const resetBoard = ( board: GameBoard ): void => {
  let index = 0

  for( index = 0; index < BRD_SQ_NUM; ++index ) {
    board.pieces[index] = SQUARES.OFFBOARD
  }

  for( index = 0; index < 64; ++index ) {
    board.pieces[Sq120( index )] = PIECES.EMPTY
  }

  board.side = COLORS.BOTH
  board.enPas = SQUARES.NO_SQ
  board.fiftyMove = 0
  board.ply = 0
  board.hisPly = 0
  board.castlePerm = 0
  board.posKey = 0
  board.moveListStart[board.ply] = 0
}

const parseFen = ( board: GameBoard, fen: string ): void => {
  resetBoard( board )

  let rank: number = RANKS.RANK_8
  let file: number = FILES.FILE_A
  let piece: number = 0
  let count: number = 0
  let i: number = 0
  let sq120: number = 0
  let fenCnt: number = 0

  while(( rank >= RANKS.RANK_1 ) && fenCnt < fen.length ) {
    count = 1
    switch( fen[fenCnt] ) {
      case 'p': piece = PIECES.bP; break
      case 'r': piece = PIECES.bR; break
      case 'n': piece = PIECES.bN; break
      case 'b': piece = PIECES.bB; break
      case 'k': piece = PIECES.bK; break
      case 'q': piece = PIECES.bQ; break
      case 'P': piece = PIECES.wP; break
      case 'R': piece = PIECES.wR; break
      case 'N': piece = PIECES.wN; break
      case 'B': piece = PIECES.wB; break
      case 'K': piece = PIECES.wK; break
      case 'Q': piece = PIECES.wQ; break

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
        piece = PIECES.EMPTY
        count = parseInt( fen[fenCnt], 10 )
        break
      
      case '/':
      case ' ':
        rank--
        file = FILES.FILE_A
        fenCnt++
        continue
      default:
        console.log( "FEN error" )
        return
    }

    for( i = 0; i < count; i++ ) {
      sq120 = FR2SQ( file, rank )
      board.pieces[sq120] = piece
      file++
    }
    fenCnt++
  }

  board.side = ( fen[fenCnt] === 'w' ) ? COLORS.WHITE : COLORS.BLACK
  fenCnt += 2

  for( i = 0; i < 4; i++ ) {
    if( fen[fenCnt] === ' ' ) {
      break
    }
    switch( fen[fenCnt] ) {
      case 'K': board.castlePerm |= CASTLEBIT.WKCA; break
      case 'Q': board.castlePerm |= CASTLEBIT.WQCA; break
      case 'k': board.castlePerm |= CASTLEBIT.BKCA; break
      case 'q': board.castlePerm |= CASTLEBIT.BQCA; break
      default: break
    }
    fenCnt++
  }
  fenCnt++

  if( fen[fenCnt] !== '-' ) {
    file = fen[fenCnt].charCodeAt( 0 ) - 'a'.charCodeAt( 0 )
    rank = fen[fenCnt + 1].charCodeAt( 0 ) - '1'.charCodeAt( 0 )
    console.log( `fen[fenCnt]:${fen[fenCnt]}, File:${file}, Rank:${rank}` )
    board.enPas = FR2SQ( file, rank )
  }

  board.posKey = generatePosKey( board )
  updateListsMaterial( board )
}

const sqAttack = ( board: GameBoard, sq: number, side: number ): boolean => {
  let pce, t_sq, index

  if( side === COLORS.WHITE ) {
    if( board.pieces[sq - 11] === PIECES.wP || board.pieces[sq - 9] === PIECES.wP ) {
      return true
    }
  } else {
    if( board.pieces[sq + 11] === PIECES.bP || board.pieces[sq + 9] === PIECES.bP ) {
      return true
    }
  }

  for( index = 0; index < 8; ++index ) {
    pce = board.pieces[sq + KNIGHT_DIRS[index]]
    if( pce !== SQUARES.OFFBOARD && PIECE_COL[pce] === side && PIECE_KNIGHT[pce] === true ) {
      return true
    }
  }

  for( index = 0; index < 4; ++index ) {
    const dir = ROOK_DIRS[index]
    t_sq = sq + dir
    pce = board.pieces[t_sq]
    while( pce !== SQUARES.OFFBOARD ) {
      if( pce !== PIECES.EMPTY ) {
        if( PIECE_ROOK_QUEEN[pce] === true && PIECE_COL[pce] === side ) {
          return true
        }
        break
      }
      t_sq += dir
      pce = board.pieces[t_sq]
    }
  }

  for( index = 0; index < 4; ++index ) {
    const dir = BISHOP_DIRS[index]
    t_sq = sq + dir
    pce = board.pieces[t_sq]
    while( pce !== SQUARES.OFFBOARD ) {
      if( pce !== PIECES.EMPTY ) {
        if( PIECE_BISHOP_QUEEN[pce] === true && PIECE_COL[pce] === side ) {
          return true
        }
        break
      }
      t_sq += dir
      pce = board.pieces[t_sq]
    }
  }

  for( index = 0; index < 8; ++index ) {
    pce = board.pieces[sq + KING_DIRS[index]]
    if( pce !== SQUARES.OFFBOARD && PIECE_COL[pce] === side && PIECE_KING[pce] === true ) {
      return true
    }
  }

  return false
}