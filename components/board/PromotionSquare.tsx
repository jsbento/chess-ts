import React from "react";
import Image from "next/image";
import { PromotionProps } from "../../types/components/Board";
import { getPieceImg } from "../../utils/pieces/PieceUtils";

const PromotionSquare: React.FC<PromotionProps> = ({promotion, move}) => {
    const promotionPieces: ('q' | 'b' | 'r' | 'n')[] = ['q', 'r', 'b', 'n'];

    return (
        <div className="grid grid-cols-2 grid-rows-2">
            {promotionPieces.map((piece, idx) => (
                <div className={`box-${idx+1}`} key={idx} onClick={() => move(promotion.from, promotion.to, piece)}>
                    <Image className="cursor-pointer" src={getPieceImg(promotion.color === "w" ? piece.toUpperCase() : piece)}/>
                </div>
            ))}
        </div>
    );
}

export default PromotionSquare;