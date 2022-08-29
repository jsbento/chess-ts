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

const countMaterial = (board: (BoardSquare | null)[][]): { wMaterial: number, bMaterial: number } => {
    let wMaterial = 0;
    let bMaterial = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.color == 'w')
                wMaterial += PieceValues[piece.type];
            else if (piece && piece.color == 'b')
                bMaterial += PieceValues[piece.type];
        }
    }
    return { wMaterial, bMaterial };
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
            const captureWeight = move.captured ? 0.1 : 0;
            let checkWeight = 0;
            const initialMaterial = countMaterial(chess.board());
            chess.move(move);
            const materialCount = countMaterial(chess.board());
            let materialWeight = 0;
            const wMaterialDiff = materialCount.wMaterial - initialMaterial.wMaterial;
            const bMaterialDiff = materialCount.bMaterial - initialMaterial.bMaterial;
            if (chess.turn() == 'w')
                materialWeight = (wMaterialDiff - bMaterialDiff)/(wMaterialDiff + bMaterialDiff);
            else
                materialWeight = (bMaterialDiff - wMaterialDiff)/(bMaterialDiff + wMaterialDiff);

            if (chess.in_check()) {
                checkWeight = 0.2;
            } else if (chess.in_checkmate()) {
                scoredMoves.push({ moveScore: -1000000, move: move });
            } else {
                scoredMoves.push({moveScore: (1 + checkWeight + captureWeight + materialWeight) * evaluate(chess.board(), tables, chess.turn()), move});
            }
            chess.reset();
        }
        const bestMoves = scoredMoves.filter(move => move.moveScore >= score);
        if (bestMoves.length > 0) {
            console.log('bestMoves', bestMoves[0], 'score', score);
            return bestMoves[0].move;
        } else {
            const randomIndex = Math.floor(Math.random() * scoredMoves.length);
            console.log('scoredMoves', scoredMoves[randomIndex], 'score', score);
            return scoredMoves[randomIndex].move;
        }
    }
}
