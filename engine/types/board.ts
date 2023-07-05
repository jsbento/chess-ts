import { SearchController, checkUp } from "./search-controller"
import { MOVE } from "../utils/move"
import { initMvvLva } from "../utils/mvvLva"
import * as Constants from "../constants/engine"

export class EngineBoard {
  pieces: number[]
  side: number
  fiftyMove: number
  ply: number
  hisPly: number
  history: {
    posKey: number
    move: number
    fiftyMove: number
    enPas: number
    castlePerm: number
  }[]
  enPas: number
  castlePerm: number
  material: number[]
  pceNum: number[]
  pList: number[]
  posKey: number
  moveList: number[]
  moveScores: number[]
  moveListStart: number[]
  pvTable: {
    move: number
    posKey: number
  }[]
  pvArray: number[]
  searchHistory: number[]
  searchKillers: number[]
  mvvLvaScores: number[]

  constructor() {
    this.pieces = new Array<number>( Constants.BRD_SQ_NUM )
    this.side = Constants.COLORS.WHITE
    this.fiftyMove = 0
    this.hisPly = 0
    this.history = []
    this.ply = 0
    this.enPas = 0
    this.castlePerm = 0
    this.material = new Array<number>( 2 )
    this.pceNum = new Array<number>( 13 )
    this.pList = new Array<number>( 14 * 10 )
    this.posKey = 0
    this.moveList = new Array<number>( Constants.MAXDEPTH * Constants.MAXPOSITIONMOVES )
    this.moveScores = new Array<number>( Constants.MAXDEPTH * Constants.MAXPOSITIONMOVES )
    this.moveListStart = new Array<number>( Constants.MAXDEPTH )
    this.pvTable = new Array<{ move: number, posKey: number }>( Constants.PVENTRIES ).fill({ move: Constants.NOMOVE, posKey: 0 })
    this.pvArray = new Array<number>( Constants.MAXDEPTH )
    this.searchHistory = new Array<number>( 14 * Constants.BRD_SQ_NUM )
    this.searchKillers = new Array<number>( 3 * Constants.MAXDEPTH )
    this.mvvLvaScores = initMvvLva()
  }

  reset(): void {
    let index: number = 0
    for( index = 0; index < Constants.BRD_SQ_NUM; index++ ) {
      this.pieces[index] = Constants.SQUARES.OFFBOARD
    }

    for( index = 0; index < 64; index++ ) {
      this.pieces[Constants.Sq120(index)] = Constants.PIECES.EMPTY
    }

    this.side = Constants.COLORS.BOTH
    this.enPas = Constants.SQUARES.NO_SQ
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

    Object.keys( Constants.PIECES ).forEach(( key: string ) => {
      for( let i = 0; i < this.pceNum[Constants.PIECES[key]]; i++ ) {
        sq120 = this.pList[Constants.PceIndex( Constants.PIECES[key], i )]
        if( this.pieces[sq120] !== Constants.PIECES[key] ) {
          return false
        }
      }
    })

    for( sq64 = 0; sq64 < 64; ++sq64 ) {
      sq120 = Constants.Sq64( sq64 )
      tPiece = this.pieces[sq120]
      tPceNum[tPiece]++
      tMaterial[Constants.PIECE_COL[tPiece]] += Constants.PIECE_VAL[tPiece]
    }

    Object.keys( Constants.PIECES ).forEach(( key: string ) => {
      if( tPceNum[Constants.PIECES[key]] !== this.pceNum[Constants.PIECES[key]] ) {
        return false
      }
    })

    if( tMaterial[Constants.COLORS.WHITE] !== this.material[Constants.COLORS.WHITE] || tMaterial[Constants.COLORS.BLACK] !== this.material[Constants.COLORS.BLACK] ) {
      return false
    }

    if( this.side !== Constants.COLORS.WHITE && this.side !== Constants.COLORS.BLACK ) {
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
    let piece: number = Constants.PIECES.EMPTY

    for( sq = 0; sq < Constants.BRD_SQ_NUM; sq++ ) {
      piece = this.pieces[sq]
      if( piece !== Constants.PIECES.EMPTY && piece !== Constants.SQUARES.OFFBOARD ) {
        finalKey ^= Constants.PieceKeys[( piece * 120 ) + sq]
      }
    }

    if( this.side === Constants.COLORS.WHITE ) {
      finalKey ^= SideKey
    }

    if( this.enPas !== Constants.SQUARES.NO_SQ ) {
      finalKey ^= Constants.PieceKeys[this.enPas]
    }

    finalKey ^= Constants.CastleKeys[this.castlePerm]

    return finalKey
  }

  hashPce( pce: number, sq: number ): void {
    this.posKey ^= Constants.PieceKeys[( pce * 120 ) + sq]
  }

  hashCastle(): void {
    this.posKey ^= Constants.CastleKeys[this.castlePerm]
  }

  hashSide(): void {
    this.posKey ^= this.side
  }

  hashEnPas(): void {
    this.posKey ^= Constants.PieceKeys[this.enPas]
  }

  printBoard(): void {
    let sq: number, piece: number
    console.log( "Game Board:\n" )
    Object.values( Constants.RANKS ).reverse().forEach(( rank: number ) => {
      let line: string = `${ rank + 1}  `
      Object.values( Constants.FILES ).forEach(( file: number ) => {
        sq = Constants.FR2SQ( file, rank )
        piece = this.pieces[sq]
        line += ` ${ Constants.PCE_CHAR[piece] } `
      })
      console.log( line )
    })
    console.log( "" )
    let line: string = "   "
    Object.values( Constants.FILES ).forEach(( file: number ) => {
      line += ` ${ file } `
    })
    console.log( line )
    console.log( `side:${ Constants.SIDE_CHAR[this.side] }` )
    console.log( `enPas:${ this.enPas }` )
    console.log( `key:${ this.posKey.toString( 16 ) }` )
    line = ""

    if( this.castlePerm & Constants.CASTLEBIT.WKCA ) line += "K"
    if( this.castlePerm & Constants.CASTLEBIT.WQCA ) line += "Q"
    if( this.castlePerm & Constants.CASTLEBIT.BKCA ) line += "k"
    if( this.castlePerm & Constants.CASTLEBIT.BQCA ) line += "q"
    console.log( `castle:${ line }` )
  }

  updateListsMaterial(): void {
    let piece: number, sq: number, index: number, color: number

    for( index = 0; index < 14 * 120; index++ ) {
      this.pList[index] = Constants.PIECES.EMPTY
    }
    for( index = 0; index < 2; index++ ) {
      this.material[index] = 0
    }
    for( index = 0; index < 13; index++ ) {
      this.pceNum[index] = 0
    }
    for( index = 0; index < 64; index++ ) {
      sq = Constants.Sq120( index )
      piece = this.pieces[sq]
      if( piece !== Constants.PIECES.EMPTY ) {
        color = Constants.PIECE_COL[piece]
        this.material[color] += Constants.PIECE_VAL[piece]
        this.pList[Constants.PceIndex( piece, this.pceNum[piece] )] = sq
        this.pceNum[piece]++
      }
    }
  }

  parseFen( fen: string ): void {
    this.reset()

    let rank: number = Constants.RANKS.RANK_8
    let file: number = Constants.FILES.FILE_A
    let piece: number = 0
    let count: number = 0
    let i: number = 0
    let sq64: number = 0
    let sq120: number = 0
    let fenCnt: number = 0

    while(( rank >= Constants.RANKS.RANK_1) && fenCnt < fen.length ) {
      count = 1
      switch( fen[fenCnt] ) {
        case "p": piece = Constants.PIECES.bP; break
        case "r": piece = Constants.PIECES.bR; break
        case "n": piece = Constants.PIECES.bN; break
        case "b": piece = Constants.PIECES.bB; break
        case "k": piece = Constants.PIECES.bK; break
        case "q": piece = Constants.PIECES.bQ; break
        case "P": piece = Constants.PIECES.wP; break
        case "R": piece = Constants.PIECES.wR; break
        case "N": piece = Constants.PIECES.wN; break
        case "B": piece = Constants.PIECES.wB; break
        case "K": piece = Constants.PIECES.wK; break
        case "Q": piece = Constants.PIECES.wQ; break

        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
          piece = Constants.PIECES.EMPTY
          count = parseInt( fen[fenCnt], 10 )
          break
        
        case "/":
        case " ":
          rank--
          file = Constants.FILES.FILE_A
          fenCnt++
          continue
        default:
          console.log( "FEN error" )
          return
      }

      for( i = 0; i < count; i++ ) {
        sq120 = Constants.FR2SQ( file, rank )
        this.pieces[sq120] = piece
        file++
      }
      fenCnt++
    }

    this.side = ( fen[fenCnt] === "w" ) ? Constants.COLORS.WHITE : Constants.COLORS.BLACK
    fenCnt += 2

    for( i = 0; i < 4; i++ ) {
      if( fen[fenCnt] === " " ) {
        break
      }
      switch( fen[fenCnt] ) {
        case "K": this.castlePerm |= Constants.CASTLEBIT.WKCA; break
        case "Q": this.castlePerm |= Constants.CASTLEBIT.WQCA; break
        case "k": this.castlePerm |= Constants.CASTLEBIT.BKCA; break
        case "q": this.castlePerm |= Constants.CASTLEBIT.BQCA; break
        default: break
      }
      fenCnt++
    }
    fenCnt++

    if( fen[fenCnt] !== "-" ) {
      file = fen[fenCnt].charCodeAt( 0 ) - "a".charCodeAt( 0 )
      rank = fen[fenCnt + 1].charCodeAt( 0 ) - "1".charCodeAt( 0 )
      this.enPas = Constants.FR2SQ( file, rank )
    }

    this.posKey = this.generatePosKey()
    this.updateListsMaterial()
  }

  sqAttacked( sq: number, side: number ): boolean {
    let pce: number, t_sq: number, index: number

    if( side === Constants.COLORS.WHITE ) {
      if( this.pieces[sq - 11] === Constants.PIECES.wP || this.pieces[sq - 9] === Constants.PIECES.wP ) {
        return true
      }
    } else {
      if( this.pieces[sq + 11] === Constants.PIECES.bP || this.pieces[sq + 9] === Constants.PIECES.bP ) {
        return true
      }
    }

    Constants.KNIGHT_DIRS.forEach(( dir: number ) => {
      pce = this.pieces[sq + dir]
      if( pce !== Constants.SQUARES.OFFBOARD && Constants.PIECE_COL[pce] === side && Constants.PIECE_KNIGHT[pce] ) {
        return true
      }
    })

    Constants.ROOK_DIRS.forEach(( dir: number ) => {
      t_sq = sq + dir
      pce = this.pieces[t_sq]
      while( pce !== Constants.SQUARES.OFFBOARD ) {
        if( pce !== Constants.PIECES.EMPTY ) {
          if( Constants.PIECE_ROOK_QUEEN[pce] && Constants.PIECE_COL[pce] === side ) {
            return true
          }
          break
        }
        t_sq += dir
        pce = this.pieces[t_sq]
      }
    })

    Constants.BISHOP_DIRS.forEach(( dir: number ) => {
      t_sq = sq + dir
      pce = this.pieces[t_sq]
      while( pce !== Constants.SQUARES.OFFBOARD ) {
        if( pce !== Constants.PIECES.EMPTY ) {
          if( Constants.PIECE_BISHOP_QUEEN[pce] && Constants.PIECE_COL[pce] === side ) {
            return true
          }
          break
        }
        t_sq += dir
        pce = this.pieces[t_sq]
      }
    })

    Constants.KING_DIRS.forEach(( dir: number ) => {
      pce = this.pieces[sq + dir]
      if( pce !== Constants.SQUARES.OFFBOARD && Constants.PIECE_COL[pce] === side && Constants.PIECE_KING[pce] ) {
        return true
      }
    })

    return false
  }

  evaluate(): number {
    let score: number = this.material[Constants.COLORS.WHITE] - this.material[Constants.COLORS.BLACK]
    let pce: number, sq: number, pceNum: number

    pce = Constants.PIECES.WP
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score += PAWN_TABLE[Constants.Sq64( sq )]
    }

    pce = Constants.PIECES.BP
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score -= PAWN_TABLE[Constants.Mirror64( Constants.Sq64( sq ))]
    }

    pce = Constants.PIECES.WN
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score += KNIGHT_TABLE[Constants.Sq64( sq )]
    }

    pce = Constants.PIECES.BN
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score -= KNIGHT_TABLE[Constants.Mirror64( Constants.Sq64( sq ))]
    }

    pce = Constants.PIECES.WB
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score += BISHOP_TABLE[Constants.Sq64( sq )]
    }

    pce = Constants.PIECES.BB
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score -= BISHOP_TABLE[Constants.Mirror64( Constants.Sq64( sq ))]
    }

    pce = Constants.PIECES.WR
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score += ROOK_TABLE[Constants.Sq64( sq )]
    }

    pce = Constants.PIECES.BR
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score -= ROOK_TABLE[Constants.Mirror64( Constants.Sq64( sq ))]
    }

    pce = Constants.PIECES.WQ
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score += ROOK_TABLE[Constants.Sq64( sq )]
    }

    pce = Constants.PIECES.BQ
    for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
      sq = this.pList[Constants.PceIndex( pce, pceNum )]
      score -= ROOK_TABLE[Constants.Mirror64( Constants.Sq64( sq ))]
    }

    if( this.pceNum[Constants.PIECES.WB] >= 2 ) {
      score += BISHOP_PAIR
    }

    if( this.pceNum[Constants.PIECES.BB] >= 2 ) {
      score -= BISHOP_PAIR
    }

    if( this.side === Constants.COLORS.WHITE ) {
      return score
    } else {
      return -score
    }
  }

  clearPiece( sq: number ): void {
    const pce: number = this.pieces[sq]
    const color: number = Constants.PIECE_COL[pce]
    let tPceNum: number = -1

    this.hashPce( pce, sq)
    this.pieces[sq] = Constants.PIECES.EMPTY
    this.material[color] -= Constants.PIECE_VAL[pce]

    for( let i = 0; i < this.pceNum[pce]; i++ ) {
      if( this.pList[Constants.PceIndex( pce, i )] === sq ) {
        tPceNum = i
        break
      }
    }

    this.pceNum[pce]--
    this.pList[Constants.PceIndex( pce, tPceNum )] = this.pList[Constants.PceIndex( pce, this.pceNum[pce] )]
  }

  addPiece( pce: number, sq: number ): void {
    const color: number = Constants.PIECE_COL[pce]

    this.hashPce( pce, sq )
    this.pieces[sq] = pce
    this.material[color] += Constants.PIECE_VAL[pce]
    this.pList[Constants.PceIndex( pce, this.pceNum[pce] )] = sq
    this.pceNum[pce]++
  }

  movePiece( from: number, to: number ): void {
    const pce = this.pieces[from]
    this.hashPce( pce, from )
    this.pieces[from] = Constants.PIECES.EMPTY
    this.hashPce( pce, to )
    this.pieces[to] = pce

    for( let i = 0; i < this.pceNum[pce]; i++ ) {
      if( this.pList[Constants.PceIndex( pce, i )] === from ) {
        this.pList[Constants.PceIndex( pce, i )] = to
        break
      }
    }
  }

  makeMove( move: number ): boolean {
    const from: number = Constants.FromSq( move )
    const to: number = Constants.ToSq( move )
    const side: number = this.side

    this.history[this.hisPly].posKey = this.posKey

    if(( move & Constants.MFLAGEP ) !== 0 ) {
      if( side === Constants.COLORS.WHITE ) {
        this.clearPiece( to - 10 )
      } else {
        this.clearPiece( to + 10 )
      }
    } else if(( move & Constants.MFLAGCA ) != 0 ) {
      switch( to ) {
        case Constants.SQUARES.C1:
          this.movePiece( Constants.SQUARES.A1, Constants.SQUARES.D1 )
          break
          case Constants.SQUARES.C8:
            this.movePiece( Constants.SQUARES.A8, Constants.SQUARES.D8 )
            break
          case Constants.SQUARES.G1:
            this.movePiece( Constants.SQUARES.H1, Constants.SQUARES.F1 )
            break
          case Constants.SQUARES.G8:
            this.movePiece( Constants.SQUARES.H8, Constants.SQUARES.F8 )
            break
          default:
            break
      }
    }

    if( this.enPas !== Constants.SQUARES.NO_SQ ) {
      this.hashEnPas()
    }
    this.hashCastle()

    this.history[this.hisPly].move = move
    this.history[this.hisPly].fiftyMove = this.fiftyMove
    this.history[this.hisPly].enPas = this.enPas
    this.history[this.hisPly].castlePerm = this.castlePerm

    this.castlePerm &= Constants.CastlePerm[from]
    this.castlePerm &= Constants.CastlePerm[to]
    this.enPas = Constants.SQUARES.NO_SQ

    this.hashCastle()

    const captured: number = Constants.Captured( move )
    this.fiftyMove++

    if( captured !== Constants.PIECES.EMPTY ) {
      this.clearPiece( to )
      this.fiftyMove = 0
    }
    this.hisPly++
    this.ply++

    if( Constants.PIECE_PAWN[this.pieces[from]] === true ) {
      this.fiftyMove = 0
      if(( move & Constants.MFLAGPS ) !== 0 ) {
        if( side === Constants.COLORS.WHITE ) {
          this.enPas = from + 10
        } else {
          this.enPas = from - 10
        }
        this.hashEnPas()
      }
    }

    this.movePiece( from, to )
    
    const promoted: number = Constants.Promoted( move )
    if( promoted !== Constants.PIECES.EMPTY ) {
      this.clearPiece( to )
      this.addPiece( to, promoted )
    }

    this.side ^= 1
    this.hashSide()

    if( this.sqAttacked( this.pList[Constants.PceIndex( Constants.PIECES.WK, 0 )], this.side ) === true ) {
      this.takeMove()
      return false
    }

    return true
  }

  takeMove(): void {
    this.hisPly--
    this.ply--

    const move: number = this.history[this.hisPly].move
    const from: number = Constants.FromSq( move )
    const to: number = Constants.ToSq( move )

    if( this.enPas !== Constants.SQUARES.NO_SQ ) {
      this.hashEnPas()
    }

    this.castlePerm = this.history[this.hisPly].castlePerm
    this.fiftyMove = this.history[this.hisPly].fiftyMove
    this.enPas = this.history[this.hisPly].enPas

    if( this.enPas !== Constants.SQUARES.NO_SQ ) {
      this.hashEnPas()
    }

    this.hashCastle()

    this.side ^= 1
    this.hashSide()

    if(( Constants.MFLAGEP & move ) !== 0 ) {
      if( this.side === Constants.COLORS.WHITE ) {
        this.addPiece( Constants.PIECES.BP, to - 10 )
      } else {
        this.addPiece( Constants.PIECES.WP, to + 10 )
      }
    } else if(( Constants.MFLAGCA & move ) !== 0 ) {
      switch( to ) {
        case Constants.SQUARES.C1:
          this.movePiece( Constants.SQUARES.D1, Constants.SQUARES.A1 )
          break
        case Constants.SQUARES.C8:
          this.movePiece( Constants.SQUARES.D8, Constants.SQUARES.A8 )
          break
        case Constants.SQUARES.G1:
          this.movePiece( Constants.SQUARES.F1, Constants.SQUARES.H1 )
          break
        case Constants.SQUARES.G8:
          this.movePiece( Constants.SQUARES.F8, Constants.SQUARES.H8 )
          break
        default:
          break
      }
    }

    this.movePiece( from, to )
    const captured: number = Constants.Captured( move )
    if( captured !== Constants.PIECES.EMPTY ) {
      this.addPiece( captured, to )
    }
    const promoted: number = Constants.Promoted( move )
    if( promoted !== Constants.PIECES.EMPTY ) {
      this.clearPiece( from )
      this.addPiece(( Constants.PIECE_COL[promoted] === Constants.COLORS.WHITE ? Constants.PIECES.WP : Constants.PIECES.BP ), from )
    }
  }

  moveExists( move: number ): boolean {
    this.generateMoves()

    let index: number, moveFound: number = Constants.NOMOVE
    for( index = this.moveListStart[this.ply]; index < this.moveListStart[this.ply + 1]; index++ ) {
      moveFound = this.moveList[index]
      if( !this.makeMove( moveFound )) {
        continue
      }
      this.takeMove()
      if( move === moveFound ) {
        return true
      }
    }

    return false
  }

  addCaptureMove( move: number ): void {
    this.moveList[this.moveListStart[this.ply + 1]] = move
    this.moveScores[this.moveListStart[this.ply + 1]++] = this.mvvLvaScores[Constants.Captured( move ) * 14 + this.pieces[Constants.FromSq( move )]] + 1000000
  }

  addQuietMove( move: number ): void {
    this.moveList[this.moveListStart[this.ply + 1]] = 900000
    this.moveScores[this.moveListStart[this.ply + 1]] = 0

    if( move === this.searchKillers[this.ply] ) {
      this.moveScores[this.moveListStart[this.ply + 1]] = 900000
    } else if( move === this.searchKillers[this.ply + Constants.MAXDEPTH] ) {
      this.moveScores[this.moveListStart[this.ply + 1]] = 800000
    } else {
      this.moveScores[this.moveListStart[this.ply + 1]] = this.searchHistory[this.pieces[Constants.FromSq( move )] * Constants.BRD_SQ_NUM + Constants.ToSq( move )]
    }

    this.moveListStart[this.ply + 1]++
  }

  addEnPassantMove( move: number ): void {
    this.moveList[this.moveListStart[this.ply + 1]] = move
    this.moveScores[this.moveListStart[this.ply + 1]++] = 105 + 1000000
  }

  addWhitePawnCapMove( from: number, to: number, cap: number ): void {
    if( Constants.RANKS_BRD[from] === Constants.RANKS.RANK_7 ) {
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.WQ, Constants.MFLAGPROM ))
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.WR, Constants.MFLAGPROM ))
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.WB, Constants.MFLAGPROM ))
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.WN, Constants.MFLAGPROM ))
    } else {
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.EMPTY, 0 ))
    }
  }

  addBlackPawnCapMove( from: number, to: number, cap: number ): void {
    if( Constants.RANKS_BRD[from] === Constants.RANKS.RANK_2 ) {
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.BQ, Constants.MFLAGPROM ))
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.BR, Constants.MFLAGPROM ))
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.BB, Constants.MFLAGPROM ))
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.BN, Constants.MFLAGPROM ))
    } else {
      this.addCaptureMove( MOVE( from, to, cap, Constants.PIECES.EMPTY, 0 ))
    }
  }

  addWhitePawnQuietMove( from: number, to: number ): void {
    if( Constants.RANKS_BRD[from] === Constants.RANKS.RANK_7 ) {
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.WQ, Constants.MFLAGPROM ))
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.WR, Constants.MFLAGPROM ))
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.WB, Constants.MFLAGPROM ))
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.WN, Constants.MFLAGPROM ))
    } else {
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, 0 ))
    }
  }

  addBlackPawnQuietMove( from: number, to: number ): void {
    if( Constants.RANKS_BRD[from] === Constants.RANKS.RANK_2 ) {
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.BQ, Constants.MFLAGPROM ))
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.BR, Constants.MFLAGPROM ))
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.BB, Constants.MFLAGPROM ))
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.BN, Constants.MFLAGPROM ))
    } else {
      this.addQuietMove( MOVE( from, to, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, 0 ))
    }
  }

  generateMoves(): void {
    let pceType: number, pceNum: number, sq: number, pceIndex: number, t_sq: number, dir: number, index: number, pce: number
    this.moveListStart[this.ply + 1] = this.moveListStart[this.ply]

    if( this.side === Constants.COLORS.WHITE ) {
      pceType = Constants.PIECES.WP
      for( pceNum = 0; pceNum < this.pceNum[pceType]; pceNum++ ) {
        sq = this.pList[Constants.PceIndex( pceType, pceNum )]
        if( this.pieces[sq + 10] === Constants.PIECES.EMPTY ) {
          this.addWhitePawnQuietMove( sq, sq + 10 )
          if( Constants.RANKS_BRD[sq] === Constants.RANKS.RANK_2 && this.pieces[sq + 20] === Constants.PIECES.EMPTY ) {
            this.addQuietMove( MOVE( sq, sq + 20, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGPS ))
          }
        }

        if( !Constants.SqOffBoard( sq + 9 ) && Constants.PIECE_COL[this.pieces[sq + 9]] === Constants.COLORS.BLACK ) {
          this.addWhitePawnCapMove( sq, sq + 9, this.pieces[sq + 9] )
        }

        if( !Constants.SqOffBoard( sq + 11 ) && Constants.PIECE_COL[this.pieces[sq + 11]] === Constants.COLORS.BLACK ) {
          this.addWhitePawnCapMove( sq, sq + 11, this.pieces[sq + 11] )
        }

        if( this.enPas !== Constants.SQUARES.NO_SQ ) {
          if( sq + 9 === this.enPas ) {
            this.addEnPassantMove( MOVE( sq, sq + 9, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGEP ))
          }
          if( sq + 11 === this.enPas ) {
            this.addEnPassantMove( MOVE( sq, sq + 11, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGEP ))
          }
        }
      }

      if( this.castlePerm & Constants.CASTLEBIT.WKCA ) {
        if( this.pieces[Constants.SQUARES.F1] === Constants.PIECES.EMPTY && this.pieces[Constants.SQUARES.G1] === Constants.PIECES.EMPTY ) {
          if( !this.sqAttacked( Constants.SQUARES.F1, Constants.COLORS.BLACK ) && !this.sqAttacked(Constants.SQUARES.E1, Constants.COLORS.BLACK )) {
            this.addQuietMove( MOVE( Constants.SQUARES.E1, Constants.SQUARES.G1, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGCA ))
          }
        }
      }

      if( this.castlePerm & Constants.CASTLEBIT.WQCA ) {
        if( this.pieces[Constants.SQUARES.D1] === Constants.PIECES.EMPTY && this.pieces[Constants.SQUARES.C1] === Constants.PIECES.EMPTY && this.pieces[Constants.SQUARES.B1] === Constants.PIECES.EMPTY ) {
          if( !this.sqAttacked( Constants.SQUARES.D1, Constants.COLORS.BLACK ) && !this.sqAttacked( Constants.SQUARES.E1, Constants.COLORS.BLACK ) && !this.sqAttacked( Constants.SQUARES.B1, Constants.COLORS.BLACK )) {
            this.addQuietMove( MOVE( Constants.SQUARES.E1, Constants.SQUARES.C1, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGCA ))
          }
        }
      }
    } else {
      pceType = Constants.PIECES.bP
      for( pceNum = 0; pceNum < this.pceNum[pceType]; ++pceNum) {
        sq = this.pList[Constants.PceIndex( pceType, pceNum )]
        if( this.pieces[sq - 10] === Constants.PIECES.EMPTY ) {
          this.addBlackPawnQuietMove( sq, sq - 10 )
          if( Constants.RANKS_BRD[sq] === Constants.RANKS.RANK_7 && this.pieces[sq - 20] === Constants.PIECES.EMPTY ) {
            this.addQuietMove( MOVE( sq, sq - 20, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGPS ))
          }
        }

        if( !Constants.SqOffBoard( sq - 9 ) && Constants.PIECE_COL[this.pieces[sq - 9]] === Constants.COLORS.WHITE ) {
          this.addBlackPawnCapMove( sq, sq - 9, this.pieces[sq - 9] )
        }

        if( !Constants.SqOffBoard( sq - 11 ) && Constants.PIECE_COL[this.pieces[sq - 11]] === Constants.COLORS.WHITE ) {
          this.addBlackPawnCapMove( sq, sq - 11, this.pieces[sq - 11] )
        }

        if( this.enPas !== Constants.SQUARES.NO_SQ ) {
          if( sq - 9 === this.enPas ) {
            this.addEnPassantMove( MOVE( sq, sq - 9, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGEP ))
          }

          if( sq - 11 === this.enPas ) {
            this.addEnPassantMove( MOVE( sq, sq - 11, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGEP ))
          }
        }
      }

      if( this.castlePerm & Constants.CASTLEBIT.BKCA ) {
        if( this.pieces[Constants.SQUARES.F8] === Constants.PIECES.EMPTY && this.pieces[Constants.SQUARES.G8] === Constants.PIECES.EMPTY ) {
          if( !this.sqAttacked( Constants.SQUARES.F8, Constants.COLORS.WHITE ) && !this.sqAttacked( Constants.SQUARES.G8, Constants.COLORS.WHITE )) {
            this.addQuietMove( MOVE( Constants.SQUARES.E8, Constants.SQUARES.G8, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGCA ))
          }
        }
      }

      if( this.castlePerm & Constants.CASTLEBIT.BQCA ) {
        if( this.pieces[Constants.SQUARES.D8] === Constants.PIECES.EMPTY && this.pieces[Constants.SQUARES.C8] === Constants.PIECES.EMPTY && this.pieces[Constants.SQUARES.B8] === Constants.PIECES.EMPTY ) {
          if( !this.sqAttacked( Constants.SQUARES.D8, Constants.COLORS.WHITE ) && !this.sqAttacked( Constants.SQUARES.C8, Constants.COLORS.WHITE ) && !this.sqAttacked( Constants.SQUARES.B8, Constants.COLORS.WHITE )) {
            this.addQuietMove( MOVE( Constants.SQUARES.E8, Constants.SQUARES.C8, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGCA ))
          }
        }
      }
    }

    pceIndex = Constants.LOOP_NON_SLIDE_PIECE_INDEX[this.side]
    pce = Constants.LOOP_NON_SLIDE_PIECE[pceIndex++]

    while( pce !== 0 ) {
      for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
        sq = this.pList[Constants.PceIndex( pce, pceNum )]

        for( index = 0; index < Constants.DIR_NUM[pce]; index++ ) {
          dir = Constants.PIECE_DIRS[pce][index]
          t_sq = sq + dir

          if( Constants.SqOffBoard( t_sq )) {
            continue
          }

          if( this.pieces[t_sq] !== Constants.PIECES.EMPTY ) {
            if( Constants.PIECE_COL[this.pieces[t_sq]] !== this.side ) {
              this.addCaptureMove( MOVE( sq, t_sq, this.pieces[t_sq], Constants.PIECES.EMPTY, 0 ))
            }
          } else {
            this.addQuietMove( MOVE( sq, t_sq, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, 0 ))
          }
        }
      }
      pce = Constants.LOOP_NON_SLIDE_PIECE[pceIndex++]
    }

    pceIndex = Constants.LOOP_SLIDE_PIECE_INDEX[this.side]
    pce = Constants.LOOP_SLIDE_PIECE[pceIndex++]

    while( pce !== 0 ) {
      for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
        sq = this.pList[Constants.PceIndex( pce, pceNum )]

        for( index = 0; index < Constants.DIR_NUM[pce]; index++ ) {
          dir = Constants.PIECE_DIRS[pce][index]
          t_sq = sq + dir

          while( !Constants.SqOffBoard( t_sq )) {
            if( this.pieces[t_sq] !== Constants.PIECES.EMPTY ) {
              if( Constants.PIECE_COL[this.pieces[t_sq]] !== this.side ) {
                this.addCaptureMove( MOVE( sq, t_sq, this.pieces[t_sq], Constants.PIECES.EMPTY, 0 ))
              }
              break
            }
            this.addQuietMove( MOVE( sq, t_sq, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, 0 ))
            t_sq += dir
          }
        }
      }
      pce = Constants.LOOP_SLIDE_PIECE[pceIndex++]
    }
  }

  generateCaptures(): void {
    let pceType: number, pceNum: number, sq: number, pceIndex: number, t_sq: number, dir: number, index: number, pce: number
    this.moveListStart[this.ply + 1] = this.moveListStart[this.ply]

    if( this.side === Constants.COLORS.WHITE ) {
      pceType = Constants.PIECES.WP
      for( pceNum = 0; pceNum < this.pceNum[pceType]; pceNum++ ) {
        sq = this.pList[Constants.PceIndex( pceType, pceNum )]

        if( !Constants.SqOffBoard( sq + 9 ) && Constants.PIECE_COL[this.pieces[sq + 9]] === Constants.COLORS.BLACK ) {
          this.addWhitePawnCapMove( sq, sq + 9, this.pieces[sq + 9] )
        }

        if( !Constants.SqOffBoard( sq + 11 ) && Constants.PIECE_COL[this.pieces[sq + 11]] === Constants.COLORS.BLACK ) {
          this.addWhitePawnCapMove( sq, sq + 11, this.pieces[sq + 11] )
        }

        if( this.enPas !== Constants.SQUARES.NO_SQ ) {
          if( sq + 9 === this.enPas ) {
            this.addEnPassantMove( MOVE( sq, sq + 9, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGEP ))
          }
          if( sq + 11 === this.enPas ) {
            this.addEnPassantMove( MOVE( sq, sq + 11, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGEP ))
          }
        }
      }
    } else {
      pceType = Constants.PIECES.bP
      for( pceNum = 0; pceNum < this.pceNum[pceType]; ++pceNum) {
        sq = this.pList[Constants.PceIndex( pceType, pceNum )]

        if( !Constants.SqOffBoard( sq - 9 ) && Constants.PIECE_COL[this.pieces[sq - 9]] === Constants.COLORS.WHITE ) {
          this.addBlackPawnCapMove( sq, sq - 9, this.pieces[sq - 9] )
        }

        if( !Constants.SqOffBoard( sq - 11 ) && Constants.PIECE_COL[this.pieces[sq - 11]] === Constants.COLORS.WHITE ) {
          this.addBlackPawnCapMove( sq, sq - 11, this.pieces[sq - 11] )
        }

        if( this.enPas !== Constants.SQUARES.NO_SQ ) {
          if( sq - 9 === this.enPas ) {
            this.addEnPassantMove( MOVE( sq, sq - 9, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGEP ))
          }

          if( sq - 11 === this.enPas ) {
            this.addEnPassantMove( MOVE( sq, sq - 11, Constants.PIECES.EMPTY, Constants.PIECES.EMPTY, Constants.MFLAGEP ))
          }
        }
      }
    }

    pceIndex = Constants.LOOP_NON_SLIDE_PIECE_INDEX[this.side]
    pce = Constants.LOOP_NON_SLIDE_PIECE[pceIndex++]

    while( pce !== 0 ) {
      for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
        sq = this.pList[Constants.PceIndex( pce, pceNum )]

        for( index = 0; index < Constants.DIR_NUM[pce]; index++ ) {
          dir = Constants.PIECE_DIRS[pce][index]
          t_sq = sq + dir

          if( Constants.SqOffBoard( t_sq )) {
            continue
          }

          if( this.pieces[t_sq] !== Constants.PIECES.EMPTY ) {
            if( Constants.PIECE_COL[this.pieces[t_sq]] !== this.side ) {
              this.addCaptureMove( MOVE( sq, t_sq, this.pieces[t_sq], Constants.PIECES.EMPTY, 0 ))
            }
          }
        }
      }
      pce = Constants.LOOP_NON_SLIDE_PIECE[pceIndex++]
    }

    pceIndex = Constants.LOOP_SLIDE_PIECE_INDEX[this.side]
    pce = Constants.LOOP_SLIDE_PIECE[pceIndex++]

    while( pce !== 0 ) {
      for( pceNum = 0; pceNum < this.pceNum[pce]; pceNum++ ) {
        sq = this.pList[Constants.PceIndex( pce, pceNum )]

        for( index = 0; index < Constants.DIR_NUM[pce]; index++ ) {
          dir = Constants.PIECE_DIRS[pce][index]
          t_sq = sq + dir

          while( !Constants.SqOffBoard( t_sq )) {
            if( this.pieces[t_sq] !== Constants.PIECES.EMPTY ) {
              if( Constants.PIECE_COL[this.pieces[t_sq]] !== this.side ) {
                this.addCaptureMove( MOVE( sq, t_sq, this.pieces[t_sq], Constants.PIECES.EMPTY, 0 ))
              }
              break
            }
            t_sq += dir
          }
        }
      }
      pce = Constants.LOOP_SLIDE_PIECE[pceIndex++]
    }
  }

  probePvTable(): number {
    const idx = this.posKey % Constants.PVENTRIES

    if( this.pvTable[idx].posKey === this.posKey ) {
      return this.pvTable[idx].move
    }

    return Constants.NOMOVE
  }

  storePvMove( move: number ): void {
    const idx = this.posKey % Constants.PVENTRIES
    this.pvTable[idx].posKey = this.posKey
    this.pvTable[idx].move = move
  }

  getPvLine( depth: number ) {
    let move = this.probePvTable()
    let count = 0

    while( move != Constants.NOMOVE && count < depth ) {
      if( this.moveExists( move )) {
        this.makeMove( move )
        this.pvArray[count++] = move
      } else {
        break
      }
      move = this.probePvTable()
    }

    while( this.ply > 0 ) {
      this.takeMove()
    }

    return count
  }

  clearPvTable(): void {
    for( let i = 0; i < Constants.PVENTRIES; i++ ) {
      this.pvTable[i].move = Constants.NOMOVE
      this.pvTable[i].posKey = 0
    }
  }

  pickNextMove( moveNum: number ): void {
    let idx = 0, bestScore = -1, bestNum = moveNum

    for( idx = moveNum; idx < this.moveListStart[this.ply + 1]; idx++ ) {
      if( this.moveScores[idx] > bestScore ) {
        bestScore = this.moveScores[idx]
        bestNum = idx
      }
    }

    if( bestNum != moveNum ) {
      let temp = 0
      temp = this.moveScores[moveNum]
      this.moveScores[moveNum] = this.moveScores[bestNum]
      this.moveScores[bestNum] = temp

      temp = this.moveList[moveNum]
      this.moveList[moveNum] = this.moveScores[bestNum]
      this.moveList[bestNum] = temp
    }
  }

  isRepetition(): boolean {
    for( let i = this.hisPly - this.fiftyMove; i < this.hisPly - 1; i++ ) {
      if( this.posKey === this.history[i].posKey ) {
        return true
      }
    }

    return false
  }

  quiescence( searchController: SearchController, alpha: number, beta: number ): number {
    if(( searchController.nodes & 2047 ) == 0 ) {
      checkUp( searchController )
    }

    searchController.nodes++

    if(( this.isRepetition() || this.fiftyMove >= 100 ) && this.ply != 0 ) {
      return 0
    }

    if( this.ply > Constants.MAXDEPTH - 1 ) {
      return this.evaluate()
    }

    let score: number = this.evaluate()
    if( score >= beta ) {
      return beta
    }
    if( score > alpha ) {
      alpha = score
    }

    this.generateCaptures()

    let moveNum: number = 0, legal: number = 0
    let oldAlpha: number = alpha
    let bestMove: number = Constants.NOMOVE, move: number = Constants.NOMOVE

    for( moveNum = this.moveListStart[this.ply]; moveNum < this.moveListStart[this.ply + 1]; moveNum++ ) {
      this.pickNextMove( moveNum )
      move = this.moveList[moveNum]

      if( !this.makeMove( move )) {
        continue
      }

      legal++
      score = -this.quiescence( searchController, -beta, -alpha )
      this.takeMove()

      if( searchController.stop ) {
        return 0
      }

      if( score > alpha ) {
        if( score >= beta ) {
          if( legal === 1) {
            searchController.fhf++
          }
          searchController.fh++

          return beta
        }
        alpha = score
        bestMove = move
      }
    }

    if( alpha !== oldAlpha ) {
      this.storePvMove( bestMove )
    }

    return alpha
  }

  alphaBeta( searchController: SearchController, alpha: number, beta: number, depth: number ): number {
    if( depth <= 0 ) {
      return this.quiescence( searchController, alpha, beta )
    }

    if(( searchController.nodes & 2047 ) === 0 ) {
      checkUp( searchController )
    }
    searchController.nodes++

    if(( this.isRepetition() || this.fiftyMove >= 100 ) && this.ply !== 0 ) {
      return 0
    }

    if( this.ply > Constants.MAXDEPTH - 1 ) {
      return this.evaluate()
    }

    const inCheck = this.sqAttacked( this.pList[Constants.PceIndex( Constants.Kings[this.side], 0 )], this.side ^ 1 )
    if( inCheck ) {
      depth++
    }

    let score: number = -Constants.INFINITE

    this.generateMoves()

    let moveNum: number = 0, legal: number = 0
    let oldAlpha: number = alpha
    let bestMove: number = Constants.NOMOVE, move: number = Constants.NOMOVE

    let pvMove: number = this.probePvTable()
    if( pvMove !== Constants.NOMOVE ) {
      for( moveNum = this.moveListStart[this.ply]; moveNum < this.moveListStart[this.ply + 1]; moveNum++ ) {
        if( this.moveList[moveNum] === pvMove ) {
          this.moveScores[moveNum] = 2000000
          break
        }
      }
    }

    for( moveNum = this.moveListStart[this.ply]; moveNum < this.moveListStart[this.ply + 1]; moveNum++ ) {
      this.pickNextMove( moveNum )

      move = this.moveList[moveNum]

      if( !this.makeMove( move )) {
        continue
      }

      legal++
      score = -this.alphaBeta( searchController, -beta, -alpha, depth - 1 )
      this.takeMove()

      if( searchController.stop ) {
        return 0
      }

      if( score > alpha ) {
        if( score >= beta ) {
          if( legal == 1 ) {
            searchController.fhf++
          }
          searchController.fh++

          if(( move & Constants.MFLAGCAP ) === 0 ) {
            this.searchKillers[Constants.MAXDEPTH + this.ply] = this.searchKillers[this.ply]
            this.searchKillers[this.ply] = move
          }

          return beta
        }
        if(( move & Constants.MFLAGCAP ) === 0 ) {
          this.searchHistory[this.pieces[Constants.FromSq( move )] * Constants.BRD_SQ_NUM + Constants.ToSq( move )] += depth * depth
        }
        alpha = score
        bestMove = move
      }
    }

    if( legal === 0 ) {
      if( inCheck ) {
        return -Constants.MATE + this.ply
      } else {
        return 0
      }
    }

    if( alpha !== oldAlpha ) {
      this.storePvMove( bestMove )
    }

    return alpha
  }

  clearForSearch( searchController: SearchController ): void {
    for( let i = 0; i < 14 * Constants.BRD_SQ_NUM; i++ ) {
      this.searchHistory[i] = 0
    }

    for( let i = 0; i < 3 * Constants.MAXDEPTH; i++ ) {
      this.searchKillers[i] = 0
    }

    this.clearPvTable()
    this.ply = 0
    searchController.nodes = 0
    searchController.fh = 0
    searchController.fhf = 0
    searchController.start = Date.now()
    searchController.stop = false
  }

  searchPosition( searchController: SearchController ): void {
    let bestMove: number = Constants.NOMOVE, bestScore: number = -Constants.INFINITE
    let currentDepth: number = 0, pvNum: number = 0

    this.clearForSearch( searchController )

    for( currentDepth = 1; currentDepth <= searchController.depth; currentDepth++ ) {
      bestScore = this.alphaBeta( searchController, -Constants.INFINITE, Constants.INFINITE, currentDepth )

      if( searchController.stop ) {
        break
      }

      pvNum = this.getPvLine( currentDepth )
      bestMove = this.pvArray[0]
    }

    searchController.best = bestMove
    searchController.thinking = false
  }
}