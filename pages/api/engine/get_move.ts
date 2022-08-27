import { NextApiRequest, NextApiResponse } from "next";
import { Chess, ShortMove, Move } from "chess.js";
import { PieceValues } from "../../../utils/constants/Chess";
import * as PieceSquareValues from "../../../utils/constants/Engine";
import { EngineResponse } from "../../../types/api/Server";
import { BoardSquare } from "../../../types/chess/Board";
import { EvalTable } from "../../../types/engine/Evaluation";
import { getTables, initEGTable, initMGTable } from "../../../utils/constants/Engine";

export default function handler(req: NextApiRequest, res: NextApiResponse<EngineResponse>) {
    const { fen } = req.body;
    initMGTable();
    initEGTable();
    const tables = getTables();
    const move = minimax(fen, 4, tables);
    res.status(200).json({ move: move! });
}

const flipTurn = (turn: string): string => turn == 'w' ? 'b' : 'w';

// https://www.chessprogramming.org/PeSTO%27s_Evaluation_Function
const evaluate = (board: (BoardSquare | null)[][], tables: {mgTable: EvalTable, egTable: EvalTable}, turn: string): number => {
    const { mgTable, egTable } = tables;
    const score: {[key: string]: any} = {
        'w': {
            mg: 0,
            eg: 0
        },
        'b': {
            mg: 0,
            eg: 0
        }
    }
    let gamePhase = 0;

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const piece = board[rank][file];
            if (piece) {
                const { type, color } = piece;
                score[color].mg += mgTable[color == 'w' ? type.toUpperCase() : type][rank][file];
                score[color].eg += egTable[color == 'w' ? type.toUpperCase() : type][rank][file];
                gamePhase += PieceSquareValues.GAME_PHASE_INC[type];
            }
        }
    }
    
    const mgScore = score[turn].mg - score[flipTurn(turn)].mg;
    const egScore = score[turn].eg - score[flipTurn(turn)].eg;
    let mgPhase = gamePhase;
    if (mgPhase > 24) mgPhase = 24;
    const egPhase = 24 - mgPhase;
    return (mgScore * mgPhase + egScore * egPhase) / 24;
}

// For each move, evalute position and return the highest scoring move
const minimax = (fen: string, depth: number, tables: {mgTable: EvalTable, egTable: EvalTable}): ShortMove | undefined => {
    if (depth == 0)
        return undefined;
    else {
        // Scores by checks/captures too
        const chess = new Chess(fen);
        const score = evaluate(chess.board(), tables, chess.turn());
        const moves = chess.moves({ verbose: true });
        const scoredMoves: {moveScore: number, move: ShortMove}[] = [];
        for (const move of moves) {
            chess.move(move);
            scoredMoves.push({moveScore: evaluate(chess.board(), tables, chess.turn()), move});
            chess.reset();
        }
        const bestMoves = scoredMoves.filter(move => move.moveScore >= Math.abs(score));
        if (bestMoves.length > 0) {
            const randomIndex = Math.floor(Math.random() * bestMoves.length);
            console.log('bestMoves', bestMoves[randomIndex], 'score', score);
            return bestMoves[randomIndex].move;
        } else {
            const randomIndex = Math.floor(Math.random() * scoredMoves.length);
            console.log('scoredMoves', scoredMoves[randomIndex], 'score', score);
            return scoredMoves[randomIndex].move;
        }
    }
}
