import React, { useState, useEffect } from "react";
import { BoardProps } from "../../types/chess/Board";
import { chess, RANK_FILE_MAX } from "../../utils/constants/Chess";
import { RANKS, FILES } from "../../utils/constants/Board";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardSquare from "./BoardSquare";
import { useSelector } from "react-redux";
import { GameState } from "../../types/chess/GameState";

const Board: React.FC<BoardProps> = ({ fen }) => {
    const [fenStr, setFEN] = useState(fen);
    const [charBoard, setCharBoard] = useState<string[]>([]);

    const board = useSelector((state: GameState) => state.board);
    console.log(board);

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

    useEffect(() => updateBoard(), [board]);
    
    const renderBoard = () => {
        return (
            <div className="w-[600px] h-[600px] grid grid-cols-8 grid-rows-8">
                {charBoard.map((piece, index) => {
                    const rank = Math.floor(index / 8);
                    const file = index % 8;
                    const bgColor = (rank + file) % 2 === 0 ? "bg-brown-light" : "bg-brown";
                    const p = piece === " " ? null : {type: piece, position: index};

                    return (
                        <BoardSquare color={bgColor} piece={p} position={index} />
                    );
                })}
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="chess-board p-10 items-start justify-items-start">
                <div className="box-1 w-[50px] h-[600px] flex flex-col items-center justify-between">
                    {[...RANKS].reverse().map((rank, index) => <p key={index}>{rank}</p>)}
                </div>
                <div className="box-2 items-center justify-center">
                    {renderBoard()}
                </div>
                <div className="box-3 w-[50px] h-[50px]"></div>
                <div className="box-4 w-[600px] h-[50px] flex flex-row items-center justify-between">
                    {FILES.map((file, index) => <p key={index}>{file}</p>)}
                </div>
            </div>
        </DndProvider>
    );
}

export default Board;