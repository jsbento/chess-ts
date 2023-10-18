import { NextApiRequest, NextApiResponse } from "next"

export default function handler( req: NextApiRequest, res: NextApiResponse ) {
  const { fen, engineDepth } = req.body

  res.status( 200 ).json({
  fen,
  engineDepth,
  })
}
