import React from "react";
import { Chess } from "chess.js";
import Piece from "./Piece";
import { BoardProps, BoardSquare } from "../../types/chess/Board";

const Board: React.FC<BoardProps> = ({ fen }) => {
    const chess = new Chess(fen);
    
    const renderBoard = (board: BoardSquare[][]) => {
        return (
            <div className="w-[600px] h-[600px] grid grid-cols-8 grid-rows-8 shadow-2xl">
                {board.map((row, rank) => 
                    row.map((square, file) => {
                        const bgColor = (rank + file) % 2 === 0 ? "bg-brown-light" : "bg-brown";
                        return (
                            <div key={file+rank}
                                className={`items-center justify-center ${bgColor}`}
                            >
                                {square && <Piece type={square.type} color={square.color} />}
                            </div>
                        )
                    })
                )}
            </div>
        );
    }

    return (
        <div className="flex justify-center mt-10">
            {renderBoard(chess.board())}
        </div>
    );
}

export default Board;