import React, { ReactNode, useState, useEffect, useCallback, useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useSelector, useDispatch } from 'react-redux'
import { ShortMove } from 'chess.js'
import { chess, getResult, RANK_FILE_MAX } from '../../utils/constants/Chess'
import { RANKS, FILES } from '../../utils/constants/Board'
import * as Actions from '../../state/actions/GameState'
import BoardSquare from './BoardSquare'
import { AppState, GameState } from '../../types/state'
import { Promotion } from '../../types/chess/Piece'
import { evalPosition, searchPosition } from '@coordinators/chess/chess'

interface BoardProps {
  children: ReactNode
}

const Board: React.FC<BoardProps> = ({ children }) => {
  const dispatch = useDispatch()

  const {
    gameState: {
      board,
      promotion,
      moves,
      turn,
      gameStatus,
      fen,
    },
    settingsState: {
      useAI,
      playerWhite,
      engineDepth,
      moveTime,
    },
  } = useSelector(( state: AppState ) =>  ({ gameState: state.gameState, settingsState: state.settings }))

  const [ positionScore, setPositionScore ] = useState<number>( 0 )

  const charBoard = useMemo(() => {
    const cBoard: string[] = []
    for ( let rank = 0; rank < RANK_FILE_MAX; rank++ ) {
      for ( let file = 0; file < RANK_FILE_MAX; file++ ) {
        const square = board[rank][file]
        if ( square ) {
          if ( square.color === 'w' ) {
            cBoard.push( square.type.toUpperCase())
          } else {
            cBoard.push( square.type )
          }
        } else {
          cBoard.push( ' ' )
        }
      }
    }
    return !playerWhite ? cBoard.reverse() : cBoard
  }, [ board, playerWhite ])

  const _updatePromotion = useCallback(( promotion: Promotion | null ) => dispatch( Actions.setPromotion( promotion )), [ dispatch ])
  const _setState = useCallback(( newState: GameState ) => dispatch( Actions.setState( newState )), [ dispatch ])

  useEffect(() => {
    const getPosScore = async () => {
      const { score, error } = await evalPosition( fen )
      if( !error ) {
        setPositionScore( score )
      }
    }
    getPosScore()
  }, [ fen ])

  useEffect(() => {
    const getMove = async () => {
      if ( useAI && !gameStatus && ( playerWhite && turn === 'b' || !playerWhite && turn === 'w' )) {
        const randIdx = Math.floor( Math.random() * chess.moves().length )
        const engineMove = chess.moves({ verbose: true })[randIdx]

        const { move: mv, error } = await searchPosition({ fen, depth: engineDepth, moveTime })
        if( error ) {
          console.log( 'Error getting move: ', error )
          return
        }

        const from = mv.slice( 0, 2 )
        const to = mv.slice( 2, 4 )
        const promotion = mv.length === 5 ? mv.slice( 4, 5 ) : undefined

        move( from, to, promotion as undefined | 'b' | 'n' | 'r' | 'q' )
        _setState({
          board: chess.board(),
          turn: chess.turn(),
          gameStatus: chess.game_over(),
          result: chess.game_over() ? getResult() : null,
          promotion: null,
          moves: [ ...moves, chess.history({ verbose: true }).at(-1)!.san ],
          fen: chess.fen(),
        })
      }
    }
    getMove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ turn, playerWhite ])

  const handleMove = ( from: string, to: string ) => {
    const promotions = chess.moves({ verbose: true }).filter( move => move.promotion )
    if ( promotions.some( p => `${p.from}:${p.to}` === `${from}:${to}` )) {
      _updatePromotion({ from, to, color: promotions[0].color })
    }

    if ( !promotion ) {
      move( from, to )
    }
  }

  const move = ( from: string, to: string, promoteTo: undefined | 'b' | 'n' | 'r' | 'q' = undefined ) => {
    const move = { from, to } as ShortMove

    if ( promoteTo ) {
      move.promotion = promoteTo
    }

    const legalMove = chess.move( move )
    if ( legalMove ) {
      const gameStatus = chess.game_over()
      _setState({
        board: chess.board(),
        turn: chess.turn(),
        gameStatus,
        result: gameStatus ? getResult() : null,
        promotion: move.promotion ? null : promotion,
        moves: [ ...moves, legalMove.san ],
        fen: chess.fen(),
      })
    }
  }

  const renderBoard = () => {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="w-[600px] h-[600px] grid grid-cols-8 grid-rows-8 border-black border-2">
          { charBoard.map(( piece, index ) => {
            const shiftedIndex = !playerWhite ? charBoard.length - 1 - index : index
            const rank = Math.floor( shiftedIndex / 8 )
            const file = shiftedIndex % 8
            const bgColor = ( rank + file ) % 2 === 0 ? 'bg-brown-light' : 'bg-brown'
            const p = piece === ' ' ? null : { type: piece, position: shiftedIndex }

            return (
              <BoardSquare
                key={shiftedIndex}
                color={bgColor}
                piece={p}
                position={shiftedIndex}
                movers={{
                  handleMove,
                  move,
                }}
              />
            )
          }) }
        </div>
      </DndProvider>
    )
  }

  const renderRanks = () => {
    const ranksOrdered = !playerWhite ? RANKS : [ ...RANKS ].reverse()
    
    return ranksOrdered.map(( rank, index ) => <p key={index} className="h-[12.5%] center-text">{rank}</p> )
  }

  const renderFiles = () => {
    return FILES.map(( file, index ) => <p key={index} className="w-[12.5%] center-text">{file}</p> )
  }

  const formatPosScore = ( score: number ) => {
    switch( turn ) {
      case 'w':
        return playerWhite ? score : -score
      case 'b':
        return playerWhite ? -score : score
      default:
        return score
    }
  }

  const score = useMemo(() => formatPosScore( positionScore ) / 100.0, [ positionScore, turn, playerWhite ])

  return (
    <div className="chess-board p-10 items-start justify-items-start">
      <p>Position Score: { score }</p>
      <div className="box-1 w-[50px] h-[600px] flex flex-col items-center mt-2 mr-3">
        {renderRanks()}
      </div>
      <div className="box-2 items-center justify-center relative">
        {renderBoard()}
        {children}
      </div>
      <div className="box-3 w-[50px] h-[50px]"></div>
      <div className="box-4 w-[600px] h-[50px] flex flex-row items-center">
        {renderFiles()}
      </div>
    </div>
  )
}

export default Board