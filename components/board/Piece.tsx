import React from 'react'
import Image from 'next/image'
import { useDrag, DragSourceMonitor, DragPreviewImage } from 'react-dnd'
import { useSelector } from 'react-redux'
import { AppState } from '../../types/state/AppState'
import { Piece } from '../../types/chess/Piece'
import { PieceImageMap } from '../../utils/constants/PieceImages'
import { indexToSquare } from '../../utils/pieces/PieceUtils'

const Piece: React.FC<Piece> = ({ type, position }) => {
  const promotion = useSelector(( state: AppState ) => state.gameState.promotion )

  const [{ isDragging }, drag, preview ] = useDrag({
    type: 'piece',
    item: { type, id: `${position}_${type}` },
    collect: ( monitor: DragSourceMonitor ) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div className="flex w-100% h-100% justify-center" ref={drag}>
      <DragPreviewImage connect={preview} src={PieceImageMap[type]} />
      <Image
        src={PieceImageMap[type]}
        style={{ opacity: isDragging || ( promotion && promotion.from === indexToSquare( position )) ? 0 : 1, cursor: 'grab' }}
        alt={type}
        layout="intrinsic"
        width={75}
        height={75}
      />
    </div>
  )
}

export default Piece