import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import Piece from "./Piece";
import { BoardProps } from "../../types/chess/Board";
import { RANK_FILE_MAX } from "../../utils/constants/Chess";

const Board: React.FC<BoardProps> = ({ fen }) => {
    const chess = new Chess(fen);
    const [fenStr, setFEN] = useState(fen);
    const [charBoard, setCharBoard] = useState<string[]>([]);

    const updateBoard = () => {
        const board = chess.board();
        const cBoard: string[] = [];
        for (let rank = 0; rank < RANK_FILE_MAX; rank++) {
            for (let file = 0; file < RANK_FILE_MAX; file++) {
                const square = board[rank][file];
                if (square) {
                    if (square.color === "w") {
                        cBoard.push(square.type.toUpperCase());
                    } else {
                        cBoard.push(square.type);
                    }
                } else {
                    cBoard.push(" ");
                }
            }
        }
        setCharBoard(cBoard);
    }

    useEffect(() => updateBoard(), [fenStr])
    
    const renderBoard = () => {
        return (
            <div className="w-[600px] h-[600px] grid grid-cols-8 grid-rows-8 shadow-2xl m-10">
                {charBoard.map((piece, index) => {
                    const rank = Math.floor(index / 8);
                    const file = index % 8;
                    const bgColor = (rank + file) % 2 === 0 ? "bg-brown-light" : "bg-brown";
                    return (
                        <div key={index}
                            className={`items-center justify-center ${bgColor}`}
                        >
                            {piece !== " " && <Piece type={piece} />}
                        </div>
                    )
                })}
            </div>
        );
    }

    return renderBoard();
}

export default Board;