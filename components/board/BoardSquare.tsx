import React, { useState, useEffect } from "react";
import Piece from "./Piece";
import Promotion from "./Promotion";
import { useDrop } from "react-dnd";
import { BoardSquareProps } from "../../types/components/Board";
import { gameState, handleMove } from "../../utils/constants/Chess";
import { indexToSquare } from "../../utils/pieces/PieceUtils";

const BoardSquare: React.FC<BoardSquareProps> = ({color, piece, position}) => {
    const [promotion, setPromotion] = useState<{from: string, to: string, color: string} | null>(null);

    const [, drop] = useDrop({
        accept: "piece",
        drop: (item: any) => {
            const [from] = item.id.split("_");
            handleMove(indexToSquare(parseInt(from)), indexToSquare(position));
        },
    });

    useEffect(() => {
        const subscribe = gameState.subscribe(({promotion}) => {
            promotion && promotion.to === indexToSquare(position) ? setPromotion(promotion) : setPromotion(null);
        })
        return () => subscribe.unsubscribe();
    }, [position]);

    return (
        <div key={position} ref={drop} className={`flex items-center justify-center ${color}`}>
            {promotion ? <Promotion promotion={promotion} /> : piece ? <Piece type={piece.type} position={piece.position} /> : null}
        </div>
    );
}

export default BoardSquare;