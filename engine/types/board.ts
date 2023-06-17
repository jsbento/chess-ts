export class EngineBoard {
  brdSqNum: number
  maxDepth: number
  maxPositionMoves: number
  pieces: number[]
  side: number
  fiftyMove: number
  ply: number
  hisPly: number
  history: number[]
  enPas: number
  castlePerm: number
  material: number[]
  pceNum: number[]
  pList: number[]
  posKey: number
  moveList: number[]
  moveScores: number[]
  moveListStart: number[]
  pvTable: number[]
  pvArray: number[]
  searchHistory: number[]
  searchKillers: number[]

  constructor( brdSqNum: number, maxDepth: number, maxPositionMoves: number) {
    this.brdSqNum = brdSqNum
    this.maxDepth = maxDepth
    this.maxPositionMoves = maxPositionMoves
    this.pieces = new Array( this.brdSqNum )
    this.side = COLORS.WHITE
    this.fiftyMove = 0
    this.hisPly = 0
    this.history = []
    this.ply = 0
    this.enPas = 0
    this.castlePerm = 0
    this.material = new Array( 2 )
    this.pceNum = new Array( 13 )
    this.pList = new Array( 14 * 10 )
    this.posKey = 0
    this.moveList = new Array( this.maxDepth * this.maxPositionMoves )
    this.moveScores = new Array( this.maxDepth * this.maxPositionMoves )
    this.moveListStart = new Array( this.maxDepth )
    this.pvTable = []
    this.pvArray = new Array( this.maxDepth )
    this.searchHistory = new Array( 14 * this.brdSqNum )
    this.searchKillers = new Array( 3 * this.maxDepth )
  }

  reset(): void {
    let index: number = 0
    for( index = 0; index < this.brdSqNum; index++ ) {
      this.pieces[index] = SQUARES.OFFBOARD
    }

    for( index = 0; index < 64; index++ ) {
      this.pieces[Sq120(index)] = PIECES.EMPTY
    }

    this.side = COLORS.BOTH
    this.enPas = SQUARES.NO_SQ
    this.fiftyMove = 0
    this.ply = 0
    this.hisPly = 0
    this.castlePerm = 0
    this.posKey = 0
    this.moveListStart[this.ply] = 0
  }

  checkBoard(): boolean {
    const tPceNum: number[] = new Array( 13 ).fill( 0 )
    const tMaterial: number[] = new Array( 2 ).fill( 0 )
    let sq64: number, tPiece: number, t_PceNum: number, sq120: number, color: number, pcount: number

    Object.keys( PIECES ).forEach(( key: string ) => {
      for( let i = 0; i < this.pceNum[PIECES[key]]; i++ ) {
        sq120 = this.pList[PceIndex( PIECES[key], i )]
        if( this.pieces[sq120] !== PIECES[key] ) {
          return false
        }
      }
    })

    for( sq64 = 0; sq64 < 64; ++sq64 ) {
      sq120 = Sq64( sq64 )
      tPiece = this.pieces[sq120]
      tPceNum[tPiece]++
      tMaterial[PIECE_COL[tPiece]] += PIECE_VAL[tPiece]
    }

    Object.keys( PIECES ).forEach(( key: string ) => {
      if( tPceNum[PIECES[key]] !== this.pceNum[PIECES[key]] ) {
        return false
      }
    })

    if( tMaterial[COLORS.WHITE] !== this.material[COLORS.WHITE] || tMaterial[COLORS.BLACK] !== this.material[COLORS.BLACK] ) {
      return false
    }

    if( this.side !== COLORS.WHITE && this.side !== COLORS.BLACK ) {
      return false
    }

    if( this.generatePosKey() !== this.posKey ) {
      return false
    }

    return true
  }

  generatePosKey(): number {
    let sq: number = 0
    let finalKey: number = 0
    let piece: number = PIECES.EMPTY

    for( sq = 0; sq < this.brdSqNum; sq++ ) {
      piece = this.pieces[sq]
      if( piece !== PIECES.EMPTY && piece !== SQUARES.OFFBOARD ) {
        finalKey ^= PieceKeys[( piece * 120 ) + sq]
      }
    }

    if( this.side === COLORS.WHITE ) {
      finalKey ^= SideKey
    }

    if( this.enPas !== SQUARES.NO_SQ ) {
      finalKey ^= PieceKeys[this.enPas]
    }

    finalKey ^= CastleKeys[this.castlePerm]

    return finalKey
  }

  printBoard(): void {
    let sq: number, piece: number
    console.log( "Game Board:\n" )
    Object.values( RANKS ).reverse().forEach(( rank: number ) => {
      let line: string = `${ rank + 1}  `
      Object.values( FILES ).forEach(( file: number ) => {
        sq = FR2SQ( file, rank )
        piece = this.pieces[sq]
        line += ` ${ PCE_CHAR[piece] } `
      })
      console.log( line )
    })
    console.log( "" )
    let line: string = "   "
    Object.values( FILES ).forEach(( file: number ) => {
      line += ` ${ file } `
    })
    console.log( line )
    console.log( `side:${ SIDE_CHAR[this.side] }` )
    console.log( `enPas:${ this.enPas }` )
    console.log( `key:${ this.posKey.toString( 16 ) }` )
    line = ""

    if( this.castlePerm & CASTLEBIT.WKCA ) line += "K"
    if( this.castlePerm & CASTLEBIT.WQCA ) line += "Q"
    if( this.castlePerm & CASTLEBIT.BKCA ) line += "k"
    if( this.castlePerm & CASTLEBIT.BQCA ) line += "q"
    console.log( `castle:${ line }` )
  }

  updateListsMaterial(): void {
    let piece: number, sq: number, index: number, color: number

    for( index = 0; index < 14 * 120; index++ ) {
      this.pList[index] = PIECES.EMPTY
    }
    for( index = 0; index < 2; index++ ) {
      this.material[index] = 0
    }
    for( index = 0; index < 13; index++ ) {
      this.pceNum[index] = 0
    }
    for( index = 0; index < 64; index++ ) {
      sq = Sq120( index )
      piece = this.pieces[sq]
      if( piece !== PIECES.EMPTY ) {
        color = PIECE_COL[piece]
        this.material[color] += PIECE_VAL[piece]
        this.pList[PceIndex( piece, this.pceNum[piece] )] = sq
        this.pceNum[piece]++
      }
    }
  }

  parseFen( fen: string ): void {
    this.reset()

    let rank: number = RANKS.RANK_8
    let file: number = FILES.FILE_A
    let piece: number = 0
    let count: number = 0
    let i: number = 0
    let sq64: number = 0
    let sq120: number = 0
    let fenCnt: number = 0

    while(( rank >= RANKS.RANK_1) && fenCnt < fen.length ) {
      count = 1
      switch( fen[fenCnt] ) {
        case "p": piece = PIECES.bP; break
        case "r": piece = PIECES.bR; break
        case "n": piece = PIECES.bN; break
        case "b": piece = PIECES.bB; break
        case "k": piece = PIECES.bK; break
        case "q": piece = PIECES.bQ; break
        case "P": piece = PIECES.wP; break
        case "R": piece = PIECES.wR; break
        case "N": piece = PIECES.wN; break
        case "B": piece = PIECES.wB; break
        case "K": piece = PIECES.wK; break
        case "Q": piece = PIECES.wQ; break

        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
          piece = PIECES.EMPTY
          count = parseInt( fen[fenCnt], 10 )
          break
        
        case "/":
        case " ":
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
        this.pieces[sq120] = piece
        file++
      }
      fenCnt++
    }

    this.side = ( fen[fenCnt] === "w" ) ? COLORS.WHITE : COLORS.BLACK
    fenCnt += 2

    for( i = 0; i < 4; i++ ) {
      if( fen[fenCnt] === " " ) {
        break
      }
      switch( fen[fenCnt] ) {
        case "K": this.castlePerm |= CASTLEBIT.WKCA; break
        case "Q": this.castlePerm |= CASTLEBIT.WQCA; break
        case "k": this.castlePerm |= CASTLEBIT.BKCA; break
        case "q": this.castlePerm |= CASTLEBIT.BQCA; break
        default: break
      }
      fenCnt++
    }
    fenCnt++

    if( fen[fenCnt] !== "-" ) {
      file = fen[fenCnt].charCodeAt( 0 ) - "a".charCodeAt( 0 )
      rank = fen[fenCnt + 1].charCodeAt( 0 ) - "1".charCodeAt( 0 )
      this.enPas = FR2SQ( file, rank )
    }

    this.posKey = this.generatePosKey()
    this.updateListsMaterial()
  }

  sqAttacked( sq: number, side: number ): boolean {
    let pce: number, t_sq: number, index: number

    if( side === COLORS.WHITE ) {
      if( this.pieces[sq - 11] === PIECES.wP || this.pieces[sq - 9] === PIECES.wP ) {
        return true
      }
    } else {
      if( this.pieces[sq + 11] === PIECES.bP || this.pieces[sq + 9] === PIECES.bP ) {
        return true
      }
    }

    KNIGHT_DIRS.forEach(( dir: number ) => {
      pce = this.pieces[sq + dir]
      if( pce !== SQUARES.OFFBOARD && PIECE_COL[pce] === side && PIECE_KNIGHT[pce] ) {
        return true
      }
    })

    ROOK_DIRS.forEach(( dir: number ) => {
      t_sq = sq + dir
      pce = this.pieces[t_sq]
      while( pce !== SQUARES.OFFBOARD ) {
        if( pce !== PIECES.EMPTY ) {
          if( PIECE_ROOK_QUEEN[pce] && PIECE_COL[pce] === side ) {
            return true
          }
          break
        }
        t_sq += dir
        pce = this.pieces[t_sq]
      }
    })

    BISHOP_DIRS.forEach(( dir: number ) => {
      t_sq = sq + dir
      pce = this.pieces[t_sq]
      while( pce !== SQUARES.OFFBOARD ) {
        if( pce !== PIECES.EMPTY ) {
          if( PIECE_BISHOP_QUEEN[pce] && PIECE_COL[pce] === side ) {
            return true
          }
          break
        }
        t_sq += dir
        pce = this.pieces[t_sq]
      }
    })

    KING_DIRS.forEach(( dir: number ) => {
      pce = this.pieces[sq + dir]
      if( pce !== SQUARES.OFFBOARD && PIECE_COL[pce] === side && PIECE_KING[pce] ) {
        return true
      }
    })

    return false
  }

  evaluate(): number {
    let score: number = this.material[COLORS.WHITE] - this.material[COLORS.BLACK]
    let pce: number, sq: number, pceNum: number

    pce = PIECES.WP
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score += PAWN_TABLE[Sq64( sq )]
    }

    pce = PIECES.BP
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score -= PAWN_TABLE[Mirror64( Sq64( sq ) )]
    }

    pce = PIECES.WN
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score += KNIGHT_TABLE[Sq64( sq )]
    }

    pce = PIECES.BN
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score -= KNIGHT_TABLE[Mirror64( Sq64( sq ) )]
    }

    pce = PIECES.WB
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score += BISHOP_TABLE[Sq64( sq )]
    }

    pce = PIECES.BB
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score -= BISHOP_TABLE[Mirror64( Sq64( sq ) )]
    }

    pce = PIECES.WR
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score += ROOK_TABLE[Sq64( sq )]
    }

    pce = PIECES.BR
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score -= ROOK_TABLE[Mirror64( Sq64( sq ) )]
    }

    pce = PIECES.WQ
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score += ROOK_TABLE[Sq64( sq )]
    }

    pce = PIECES.BQ
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[PceIndex( pce, pceNum )]
      score -= ROOK_TABLE[Mirror64( Sq64( sq ) )]
    }

    if( this.pceNum[PIECES.WB] >= 2 ) {
      score += BISHOP_PAIR
    }

    if( this.pceNum[PIECES.BB] >= 2 ) {
      score -= BISHOP_PAIR
    }

    if( this.side === COLORS.WHITE ) {
      return score
    } else {
      return -score
    }
  }
}