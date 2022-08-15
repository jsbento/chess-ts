import React from "react";
import Image from "next/image";
import { Piece } from "../../types/chess/Piece";
import { getPieceImg } from "../../utils/pieces/PieceUtils";
import { useDrag, DragSourceMonitor } from "react-dnd";

const Piece: React.FC<Piece> = ({ type, position }) => {
    const [{ isDragging }, drag] = useDrag({
        type: "piece",
        item: { type, id: `${position}_${type}` },
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging()
        }),
    });

    return (
        <div className="w-100% h-100%" ref={drag}>
            <Image
                src={getPieceImg(type)}
                style={{ opacity: isDragging ? 0 : 1, cursor: "grab" }}
                alt={type}
                layout="intrinsic"
                width={75}
                height={75}
            />
        </div>
    );
}

export default Piece;