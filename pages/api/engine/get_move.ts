import { NextApiRequest, NextApiResponse } from "next";
import { EngineResponse } from "../../../types/api/Server";
import { chess } from "../../../utils/constants/Chess";

export default function handler(req: NextApiRequest, res: NextApiResponse<EngineResponse>) {
    const possibleMoves = chess.moves({verbose: true});
    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    res.status(200).json({ move });
}