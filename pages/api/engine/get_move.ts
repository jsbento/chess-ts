import { NextApiRequest, NextApiResponse } from "next";
import { Chess, ShortMove } from "chess.js";
import { PieceValues } from "../../../utils/constants/Chess";
import * as PieceSquareValues from "../../../utils/constants/Engine";
import { EngineResponse } from "../../../types/api/Server";
import { BoardSquare } from "../../../types/chess/Board";
import { Evaluation } from "../../../types/engine/Evaluation";

export default function handler(req: NextApiRequest, res: NextApiResponse<EngineResponse>) {
    const { fen } = req.body;
    const move = minimax(fen, 4);
    res.status(200).json({ move });
}

// https://www.chessprogramming.org/PeSTO%27s_Evaluation_Function
const evaluate = (board: (BoardSquare | null)[][]): Evaluation => {

    return { wScore: 0, bScore: 0 };
}


// For each move, evalute position and return the highest scoring move
const minimax = (fen: string, depth: number): ShortMove => {
    return { from: "a2", to: "a3" };
}
