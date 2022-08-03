import React from "react";
import { Piece } from "../../types/chess/Piece";
import { getPieceImgUrl } from "../../utils/pieces/PieceUtils";

const Piece: React.FC<Piece> = ({ type, color }) => {
    return (
        <img className="w-100% h-100%" src={getPieceImgUrl(type, color)} />
    );
}

export default Piece;