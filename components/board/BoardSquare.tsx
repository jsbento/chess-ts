import React from 'react'
import { useSelector } from 'react-redux'
import Piece from './Piece'
import { useDrop } from 'react-dnd'
import { indexToSquare } from '../../utils/pieces/PieceUtils'
import PromotionSquare from './PromotionSquare'
import { AppState } from '../../types/state/AppState'
import { Piece as PieceType } from '../../types/chess/Piece'

interface BoardSquareProps {
  color: string
  piece: PieceType | null
  position: number
  movers: {
    handleMove: ( from: string, to: string ) => void
    move: ( from: string, to: string, promoteTo: undefined | 'b' | 'q' | 'r' | 'n' ) => void
  }
}

const BoardSquare: React.FC<BoardSquareProps> = ({ color, piece, position, movers }) => {
  const promotion = useSelector(( state: AppState ) => state.gameState.promotion )

  const [ , drop ] = useDrop({
    accept: 'piece',
    drop: ( item: any ) => {
      const [ from ] = item.id.split( '_' )
      movers.handleMove( indexToSquare( parseInt( from )), indexToSquare( position ))
    },
  })

  return (
    <div key={position} ref={drop} className={`flex items-center justify-center ${color}`}>
      { promotion && promotion.to === indexToSquare( position ) ?
        <PromotionSquare
          promotion={promotion}
          move={movers.move}
        /> : piece ?
        <Piece
          type={piece.type}
          position={piece.position}
        /> :
        null
      }
    </div>
  )
}

export default BoardSquare