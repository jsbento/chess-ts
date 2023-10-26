import React from 'react'
import Image from 'next/image'
import { PieceImageMap } from '../../utils/constants/PieceImages'
import { Promotion } from '../../types/chess/Piece'

interface PromotionSquareProps {
  promotion: Promotion
  move: ( from: string, to: string, promoteTo: undefined | 'b' | 'q' | 'r' | 'n' ) => void
}

const PromotionSquare: React.FC<PromotionSquareProps> = ({ promotion, move }) => {
  const promotionPieces: ( 'q' | 'b' | 'r' | 'n' )[] = [ 'q', 'r', 'b', 'n' ]

  return (
    <div className="grid grid-cols-2 grid-rows-2">
      {promotionPieces.map(( piece, idx ) => (
        <div className={`box-${idx+1}`} key={idx} onClick={() => move( promotion.from, promotion.to, piece )}>
          <Image
            style={{ cursor: 'pointer' }}
            src={PieceImageMap[promotion.color === 'w' ? piece.toUpperCase() : piece]}
            alt={promotion.color === 'w' ? piece.toUpperCase() : piece}
            layout="intrinsic"
            width={75}
            height={75}
          />
        </div>
      ))}
    </div>
  )
}

export default PromotionSquare