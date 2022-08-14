import React from "react";
import { PromotionProps } from "../../types/components/Board";
import { getPieceImg } from "../../utils/pieces/PieceUtils";

const Promotion: React.FC<PromotionProps> = ({promotion: {from, to, color}, move}) => {
    const promotionPieces: ('q' | 'b' | 'r' | 'n')[] = ['q', 'r', 'b', 'n'];

    return (
        <div className="grid grid-cols-2 grid-rows-2">
            {promotionPieces.map((piece, idx) => (
                <div className={`box-${idx+1}`} key={idx} onClick={() => move(from, to, piece)}>
                    <img className="cursor-pointer" src={getPieceImg(color === "w" ? piece.toUpperCase() : piece)}/>
                </div>
            ))}
        </div>
    );
}

export default Promotion;