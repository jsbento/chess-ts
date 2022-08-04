import React from "react";
import Piece from "./Piece";
import { useDrop } from "react-dnd";
import { BoardSquareProps } from "../../types/components/Board";

const BoardSquare: React.FC<BoardSquareProps> = ({color, piece, position, handleMove}) => {
    const [, drop] = useDrop({
        accept: "piece",
        drop: (item: any) => {
            const [from] = item.id.split("_");
            handleMove(parseInt(from), position);
        },
    });

    return (
        <div key={position} ref={drop} className={`flex items-center justify-center ${color}`}>
            {piece && <Piece type={piece.type} position={piece.position}/>}
        </div>
    );
}

export default BoardSquare;