import React, { useState, useEffect, useCallback } from "react";
import { chess, getResult, RANK_FILE_MAX } from "../../utils/constants/Chess";
import { RANKS, FILES } from "../../utils/constants/Board";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector, useDispatch } from "react-redux";
import { GameState } from "../../types/chess/GameState";
import * as Actions from "../../state/actions/Actions";
import BoardSquare from "./BoardSquare";
import { ShortMove } from "chess.js";
import { Promotion } from "../../types/chess/Piece";

const Board: React.FC = () => {
    const dispatch = useDispatch();

    const { board, promotion, moves } = useSelector((state: GameState) => state);
    const [charBoard, setCharBoard] = useState<string[]>([]);

    const _updatePromotion = useCallback((promotion: Promotion | null) => dispatch(Actions.setPromotion(promotion)), [dispatch]);
    const _setState = useCallback((newState: GameState) => dispatch(Actions.setState(newState)), [dispatch]);

    const handleMove = (from: string, to: string) => {
        const promotions = chess.moves({ verbose: true }).filter(move => move.promotion);
        if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
            _updatePromotion({ from, to, color: promotions[0].color });
        }

        if (!promotion) move(from, to);
    }

    const move = (from: string, to: string, promoteTo: undefined | "b" | "n" | "r" | "q" = undefined) => {
        let move = { from, to } as ShortMove;

        if (promoteTo) move.promotion = promoteTo;

        const legalMove = chess.move(move);
        if (legalMove) {
            const gameStatus = chess.game_over();
            const update: GameState = {
                board: chess.board(),
                turn: chess.turn(),
                gameStatus,
                result: gameStatus ? getResult() : null,
                promotion: move.promotion ? null : promotion,
                moves: [...moves, legalMove.san],
            }
            _setState(update);
        }
    }

    const updateBoard = () => {
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

    useEffect(() => updateBoard(), [updateBoard, board]);

    const renderBoard = () => {
        return (
            <div className="w-[600px] h-[600px] grid grid-cols-8 grid-rows-8">
                {charBoard.map((piece, index) => {
                    const rank = Math.floor(index / 8);
                    const file = index % 8;
                    const bgColor = (rank + file) % 2 === 0 ? "bg-brown-light" : "bg-brown";
                    const p = piece === " " ? null : {type: piece, position: index};

                    return (
                        <BoardSquare key={index} color={bgColor} piece={p} position={index} movers={{handleMove, move}} />
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