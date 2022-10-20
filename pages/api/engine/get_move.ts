import { NextApiRequest, NextApiResponse } from "next";
import { Chess, ShortMove, Move } from "chess.js";
import * as PieceSquareValues from "../../../utils/constants/Engine";
import { EngineResponse } from "../../../types/api/Server";
import { BoardSquare } from "../../../types/chess/Board";
import { EvalTable } from "../../../types/engine/Evaluation";
import { getTables, initEGTable, initMGTable } from "../../../utils/constants/Engine";
import { flipTurn, countMaterial } from "../../../utils/engine/Engine";

export default function handler(req: NextApiRequest, res: NextApiResponse<EngineResponse>) {
    const { fen, engineDepth } = req.body;
    initMGTable();
    initEGTable();
    const tables = getTables();
    const move = findEngineMove(fen, tables, engineDepth);
    if (move) {
        res.status(200).json({ move });
    } else {
        res.status(400).json({ move: null, error: "No move found" });
    }
}

const findEngineMove = (fen: string, tables: {mgTable: EvalTable, egTable: EvalTable}, engineDepth: number): ShortMove | null => {
    const chess = new Chess(fen);
    const moves = chess.moves({ verbose: true });
    let bestMove: ShortMove | null = null;
    let bestScore = -Infinity;
    for (const move of moves) {
        chess.move(move);
        const score = negamax(chess.fen(), engineDepth, tables);
        chess.reset();
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}

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

const negamax = (fen: string, depth: number, tables: {mgTable: EvalTable, egTable: EvalTable}): number => {
    const chess = new Chess(fen);
    if (depth == 0) return evaluate(chess.board(), tables, chess.turn());
    let max = -Infinity;
    const moves = chess.moves({ verbose: true });
    for (const move of moves) {
        let factor = 1;

        chess.move(move);

        if (move.captured) factor += 0.1;
        if (move.promotion) factor += 0.2;
        if (chess.in_check()) factor += 0.3;
        if (chess.in_checkmate()) factor += 2;
        const score = -factor * negamax(chess.fen(), depth - 1, tables);
        
        chess.reset();
        max = Math.max(max, score);
    }
    return max;
}
