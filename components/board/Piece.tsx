import React from "react";
import { Piece } from "../../types/chess/Piece";
import { getPieceImg } from "../../utils/pieces/PieceUtils";

const Piece: React.FC<Piece> = ({ type }) => {
    return (
        <img className="w-100% h-100%" src={getPieceImg(type)} />
    );
}

export default Piece;