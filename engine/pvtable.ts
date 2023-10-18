const getPvLine = ( board: GameBoard, depth: number ): number => {
  let move = probePvTable( board )
  let count = 0

  while( move != NOMOVE && count < depth ) {
    if( moveExists( board, move )) {
      makeMove( board, move )
      board.pvArray[count++] = move
    } else {
      break
    }
    move = probePvTable( board )
  }

  while( board.ply > 0 ) {
    takeMove( board )
  }

  return count
}

const probePvTable = ( board: GameBoard ): number => {
  const index = board.posKey % PVENTRIES

  if( board.pvTable[index].posKey == board.posKey ) {
    return board.pvTable[index].move
  }

  return NOMOVE
}

const storePvMove = ( board: GameBoard, move: number ): void => {
  const index = board.posKey % PVENTRIES
  board.pvTable[index].posKey = board.posKey
  board.pvTable[index].move = move
}