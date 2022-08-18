import { NextApiRequest, NextApiResponse } from "next";
import { EngineResponse } from "../../../types/api/Server";

export default function handler(req: NextApiRequest, res: NextApiResponse<EngineResponse>) {
    const { possibleMoves } = req.body;
    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    res.status(200).json({ move });
}