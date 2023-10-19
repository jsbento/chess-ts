import React, { ReactNode, useState, useEffect, useCallback } from 'react'
import { chess, getResult, RANK_FILE_MAX } from '../../utils/constants/Chess'
import { RANKS, FILES } from '../../utils/constants/Board'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../types/state/AppState'
import { GameState } from '../../types/state/GameState'
import * as Actions from '../../state/actions/GameState'
import BoardSquare from './BoardSquare'
import { ShortMove } from 'chess.js'
import { Promotion } from '../../types/chess/Piece'

const Board: React.FC<{children: ReactNode}> = ({ children }) => {
  const dispatch = useDispatch()

  const { board, promotion, moves, turn, gameStatus } = useSelector(( state: AppState ) => state.gameState )
  const { playerWhite, useAI } = useSelector(( state: AppState ) => state.settings )
  const [ charBoard, setCharBoard ] = useState<string[]>([])

  const _updatePromotion = useCallback(( promotion: Promotion | null ) => dispatch( Actions.setPromotion( promotion )), [ dispatch ])
  const _setState = useCallback(( newState: GameState ) => dispatch( Actions.setState( newState )), [ dispatch ])

  const handleMove = ( from: string, to: string ) => {
    const promotions = chess.moves({ verbose: true }).filter( move => move.promotion )
    if ( promotions.some( p => `${p.from}:${p.to}` === `${from}:${to}` )) {
      _updatePromotion({ from, to, color: promotions[0].color })
    }

    if ( !promotion ) move( from, to )
  }

  const move = ( from: string, to: string, promoteTo: undefined | 'b' | 'n' | 'r' | 'q' = undefined ) => {
    const move = { from, to } as ShortMove

    if ( promoteTo ) move.promotion = promoteTo

    const legalMove = chess.move( move )
    if ( legalMove ) {
      const gameStatus = chess.game_over()
      const update: GameState = {
        board: chess.board(),
        turn: chess.turn(),
        gameStatus,
        result: gameStatus ? getResult() : null,
        promotion: move.promotion ? null : promotion,
        moves: [ ...moves, legalMove.san ],
      }
      _setState( update )
    }
  }

  useEffect(() => {
    const getMove = async () => {
      if ( useAI && !gameStatus && ( playerWhite && turn === 'b' || !playerWhite && turn === 'w' )) {
        const randIdx = Math.floor( Math.random() * chess.moves().length )
        const engineMove = chess.moves({ verbose: true })[randIdx]
        move( engineMove.from, engineMove.to, engineMove.promotion )
        _setState({
          board: chess.board(),
          turn: chess.turn(),
          gameStatus: chess.game_over(),
          result: chess.game_over() ? getResult() : null,
          promotion: null,
          moves: [ ...moves, engineMove.san ],
        })
      }
    }
    getMove()
  }, [ turn, playerWhite ])

  useEffect(() => {
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
    if ( !playerWhite )
      setCharBoard( cBoard.reverse())
    else
      setCharBoard( cBoard )
  }, [ board, playerWhite ])

  const renderBoard = () => {
    return (
      <div className="w-[600px] h-[600px] grid grid-cols-8 grid-rows-8 border-black border-2">
        {charBoard.map(( piece, index ) => {
          const shiftedIndex = !playerWhite ? charBoard.length - 1 - index : index
          const rank = Math.floor( shiftedIndex / 8 )
          const file = shiftedIndex % 8
          const bgColor = ( rank + file ) % 2 === 0 ? 'bg-brown-light' : 'bg-brown'
          const p = piece === ' ' ? null : { type: piece, position: shiftedIndex }

          return (
            <BoardSquare key={shiftedIndex} color={bgColor} piece={p} position={shiftedIndex} movers={{ handleMove, move }} />
          )
        })}
      </div>
    )
  }

  const renderRanks = () => {
    let ranks_ordered: string[]
    if ( !playerWhite )
      ranks_ordered = RANKS
    else
      ranks_ordered = [ ...RANKS ].reverse()
    
    return ranks_ordered.map(( rank, index ) => <p key={index} className="h-[12.5%] center-text">{rank}</p> )
  }

  const renderFiles = () => {
    return FILES.map(( file, index ) => <p key={index} className="w-[12.5%] center-text">{file}</p> )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="chess-board p-10 items-start justify-items-start">
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
    </DndProvider>
  )
}

export default Board