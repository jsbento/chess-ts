import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Piece from "./Piece";
import Promotion from "./Promotion";
import { useDrop } from "react-dnd";
import { BoardSquareProps } from "../../types/components/Board";
import { indexToSquare } from "../../utils/pieces/PieceUtils";
import { GameState } from "../../types/chess/GameState";

const BoardSquare: React.FC<BoardSquareProps> = ({color, piece, position, movers}) => {
    const [promotion, setPromotion] = useState<{from: string, to: string, color: string} | null>(null);

    const pendingPromotion = useSelector((state: GameState) => state.promotion);

    const [, drop] = useDrop({
        accept: "piece",
        drop: (item: any) => {
            const [from] = item.id.split("_");
            movers.handleMove(indexToSquare(parseInt(from)), indexToSquare(position));
        },
    });

    useEffect(() => {
        promotion && promotion.to === indexToSquare(position) ? setPromotion(pendingPromotion) : setPromotion(null);
    }, [position]);

    return (
        <div key={position} ref={drop} className={`flex items-center justify-center ${color}`}>
            {promotion ? <Promotion promotion={promotion} move={movers.move} /> : piece ? <Piece type={piece.type} position={piece.position} /> : null}
        </div>
    );
}

export default BoardSquare;