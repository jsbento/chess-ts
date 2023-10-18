type SearchController = {
  nodes: number
  fh: number
  fhf: number
  depth: number
  time: number
  start: number
  stop: boolean
  best: number
  thinking: boolean
}

const pickNextMove = ( board: GameBoard, moveNum: number ): void => {
  let index = 0, bestScore = -1, bestNum = moveNum

  for( index = moveNum; index < board.moveListStart[board.ply + 1]; index++ ) {
    if( board.moveScores[index] > bestScore ) {
      bestScore = board.moveScores[index]
      bestNum = index
    }
  }

  if( bestNum != moveNum ) {
    let temp = 0
    temp = board.moveScores[moveNum]
    board.moveScores[moveNum] = board.moveScores[bestNum]
    board.moveScores[bestNum] = temp

    temp = board.moveList[moveNum]
    board.moveList[moveNum] = board.moveList[bestNum]
    board.moveList[bestNum] = temp
  }
}

const clearPvTable = ( board: GameBoard ): void => {
  for( let i = 0; i < PVENTRIES; i++ ) {
    board.pvTable[i].move = NOMOVE
    board.pvTable[i].posKey = 0
  }
}

const checkUp = ( searchController: SearchController ): void => {
  if( searchController.nodes % 2048 == 0 ) {
    if( Date.now() - searchController.start > searchController.time ) {
      searchController.stop = true
    }
  }
}

const isRepetition = ( board: GameBoard ): boolean => {
  for( let i = board.hisPly - board.fiftyMove; i < board.hisPly - 1; i++ ) {
    if( board.posKey == board.history[i].posKey ) {
      return true
    }
  }

  return false
}

const quiescence = ( board: GameBoard, searchController: SearchController, alpha: number, beta: number ): number => {
  if(( searchController.nodes & 2047 ) == 0 ) {
    checkUp( searchController )
  }

  searchController.nodes++

  if(( isRepetition( board ) || board.fiftyMove >= 100 ) && board.ply != 0 ) {
    return 0
  }

  if( board.ply > MAXDEPTH - 1 ) {
    return evaluate( board )
  }

  let score = evaluate( board )

  if( score >= beta ) {
    return beta
  }
  if( score > alpha ) {
    alpha = score
  }

  generateCaptures( board )

  let moveNum = 0, legal = 0, oldAlpha = alpha, bestMove = NOMOVE, move = NOMOVE

  for( moveNum = board.moveListStart[board.ply]; moveNum < board.moveListStart[board.ply + 1]; moveNum++ ) {
    pickNextMove( board, moveNum )

    move = board.moveList[moveNum]

    if( !makeMove( board, move )) {
      continue
    }

    legal++
    score = -quiescence( board, searchController, -beta, -alpha )
    takeMove( board )

    if( searchController.stop == true ) {
      return 0
    }

    if( score > alpha ) {
      if( score >= beta ) {
        if( legal == 1 ) {
          searchController.fhf++
        }
        searchController.fh++
        return beta
      }
      alpha = score
      bestMove = move
    }
  }

  if( alpha != oldAlpha ) {
    storePvMove( board, bestMove )
  }

  return alpha
}

const alphaBeta = ( board: GameBoard, searchController: SearchController, alpha: number, beta: number, depth: number ): number => {
  if( depth <= 0 ) {
    return quiescence( board, searchController, alpha, beta )
  }

  if(( searchController.nodes & 2047 ) == 0 ) {
    checkUp( searchController )
  }

  searchController.nodes++

  if(( isRepetition( board ) || board.fiftyMove >= 100 ) && board.ply != 0 ) {
    return 0
  }

  if( board.ply > MAXDEPTH - 1 ) {
    return evaluate( board )
  }

  let inCheck = sqAttack( board, board.pList[PceIndex(Kings[board.side], 0)], board.side ^ 1 )
  if( inCheck == true ) {
    depth++
  }

  let score = -INFINITE

  generateMoves( board )

  let moveNum = 0, legal = 0, oldAlpha = alpha, bestMove = NOMOVE, move = NOMOVE

  let pvMove = probePvTable( board )
  if( pvMove != NOMOVE ) {
    for( moveNum = board.moveListStart[board.ply]; moveNum < board.moveListStart[board.ply + 1]; moveNum++ ) {
      if( board.moveList[moveNum] == pvMove ) {
        board.moveScores[moveNum] = 2000000
        break
      }
    }
  }

  for( moveNum = board.moveListStart[board.ply]; moveNum < board.moveListStart[board.ply + 1]; moveNum++ ) {
    pickNextMove( board, moveNum )

    move = board.moveList[moveNum]

    if( !makeMove( board, move )) {
      continue
    }

    legal++
    score = -alphaBeta( board, searchController, -beta, -alpha, depth - 1 )

    takeMove( board )

    if( searchController.stop ) {
      return 0
    }

    if( score > alpha ) {
      if( score >= beta ) {
        if( legal == 1 ) {
          searchController.fhf++
        }
        searchController.fh++

        if(( move & MFLAGCAP ) == 0 ) {
          board.searchKillers[MAXDEPTH + board.ply] = board.searchKillers[board.ply]
          board.searchKillers[board.ply] = move
        }

        return beta
      }
      if(( move & MFLAGCAP ) == 0 ) {
        board.searchHistory[board.pieces[FromSq(move)] * BRD_SQ_NUM + ToSq(move)] += depth * depth
      }
      alpha = score
      bestMove = move
    }
  }

  if( legal == 0 ) {
    if( inCheck ) {
      return -MATE + board.ply
    } else {
      return 0
    }
  }

  if( alpha != oldAlpha ) {
    storePvMove( board, bestMove )
  }

  return alpha
}

const clearForSearch = ( board: GameBoard, searchController: SearchController ): void => {
  for( let i = 0; i < 14 * BRD_SQ_NUM; i++ ) {
    board.searchHistory[i] = 0
  }

  for( let i = 0; i < 3 * MAXDEPTH; i++ ) {
    board.searchKillers[i] = 0
  }

  clearPvTable( board )
  board.ply = 0
  searchController.nodes = 0
  searchController.fh = 0
  searchController.fhf = 0
  searchController.start = Date.now()
  searchController.stop = false
}

const searchPosition = ( board: GameBoard, searchController: SearchController ): void => {
  let bestMove = NOMOVE, bestScore = -INFINITE, currentDepth = 0, pvNum = 0

  clearForSearch( board, searchController )

  for( currentDepth = 1; currentDepth <= searchController.depth; currentDepth++ ) {
    bestScore = alphaBeta( board, searchController, -INFINITE, INFINITE, currentDepth )

    if( searchController.stop == true ) {
      break
    }

    pvNum = getPvLine( board, currentDepth )
    bestMove = board.pvArray[0]
  }

  searchController.best = bestMove
  searchController.thinking = false
}