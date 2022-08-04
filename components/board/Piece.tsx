import React from "react";
import { Piece } from "../../types/chess/Piece";
import { getPieceImg } from "../../utils/pieces/PieceUtils";
import { useDrag, DragSourceMonitor } from "react-dnd";
// https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_ts/02-drag-around/custom-drag-layer?from-embed=&file=/src/CustomDragLayer.tsx
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
            <img
                className="w-100% h-100% cursor-grab"
                src={getPieceImg(type)}
                style={{ opacity: isDragging ? 0 : 1, cursor: "grab" }}
            />
        </div>
    );
}

export default Piece;