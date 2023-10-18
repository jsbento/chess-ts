import { BoardSquare } from "../../types/chess/Board"
import { PieceValues } from "../constants/Chess"

export const flipTurn = ( turn: string ) => turn === "w" ? "b" : "w"

export const countMaterial = ( board: ( BoardSquare | null )[][]): { wMaterial: number, bMaterial: number } => {
  let wMaterial = 0
  let bMaterial = 0
  for ( let i = 0; i < 8; i++ ) {
    for ( let j = 0; j < 8; j++ ) {
      const piece = board[i][j]
      if ( piece && piece.color == 'w' )
        wMaterial += PieceValues[piece.type]
      else if ( piece && piece.color == 'b' )
        bMaterial += PieceValues[piece.type]
    }
  }
  return { wMaterial, bMaterial }
}