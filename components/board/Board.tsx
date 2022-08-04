import React, { useState, useEffect } from "react";
import { ShortMove } from "chess.js";
import { BoardProps } from "../../types/chess/Board";
import { chess, RANK_FILE_MAX } from "../../utils/constants/Chess";
import { indexToSquare } from "../../utils/pieces/PieceUtils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardSquare from "./BoardSquare";

const Board: React.FC<BoardProps> = ({ fen }) => {
    const [fenStr, setFEN] = useState(fen);
    const [charBoard, setCharBoard] = useState<string[]>([]);

    const handleMove = (from: number, to: number) => {
        const move: ShortMove = {from: indexToSquare(from), to: indexToSquare(to)} as ShortMove;
        if (chess.move(move)) {
            setFEN(chess.fen());
        }
    }

    const updateBoard = () => {
        if (chess.in_stalemate() || chess.game_over() || chess.insufficient_material() || chess.in_threefold_repetition() || chess.in_draw())
            chess.reset();
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
                    const p = piece === " " ? null : {type: piece, position: index};

                    return (
                        <BoardSquare color={bgColor} piece={p} position={index} handleMove={handleMove} />
                    );
                })}
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            {renderBoard()}
        </DndProvider>
    );
}

export default Board;