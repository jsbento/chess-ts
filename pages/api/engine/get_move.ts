import { NextApiRequest, NextApiResponse } from "next";
import { EngineResponse } from "../../../types/api/Server";
import { EngineBoard } from "../../../engine/types/board";
import { SearchController } from "../../../engine/types/search-controller";
import { NOMOVE } from "../../../engine/constants/engine";

export default function handler( req: NextApiRequest, res: NextApiResponse<EngineResponse> ) {
  const { fen, engineDepth } = req.body

  const eBoard = new EngineBoard()
  eBoard.parseFen( fen )
  const sc: SearchController = {
    nodes: 0,
    fh: 0,
    fhf: 0,
    depth: engineDepth,
    time: 0,
    start: 0,
    stop: false,
    best: NOMOVE,
    thinking: false,
  }
  eBoard.searchPosition(sc)
  console.log( eBoard )
}
