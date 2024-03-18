import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GameState } from '../../types/state/GameState'
import { initialState } from '../../state/reducers/GameState'
import * as Actions from '../../state/actions/GameState'
import { chess } from '../../utils/constants/Chess'
import { AppState } from '../../types/state/AppState'
import { Game } from '../../types/games/game'

import { saveGame } from '@coordinators/games/games'

interface ResultCardProps {
  result: string
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const dispatch = useDispatch()

  const { user, moves }  = useSelector(( state: AppState ) => {
    return {
      user: state.user.user,
      moves: state.gameState.moves,
    }
  })

  const _setState = useCallback(( newState: GameState ) => dispatch( Actions.setState( newState )), [ dispatch ])

  const [ isSaving, setIsSaving ] = useState<boolean>( false )

  const onReset = () => {
    chess.reset()
    _setState( initialState )
  }

  const onSaveGame = async () => {
    setIsSaving( true )
    if( !user )  {
      setIsSaving( false )
      return
    }

    await saveGame({
      playerId: user.id,
      result,
      history: moves,
    })

    setIsSaving( false )
  }

  return (
    <>
      <div className = 'result-card'>
        <p className='font-bold mb-5'>
          {result}
        </p>
        <button className='font-semibold bg-gray-300 rounded-md w-fit px-3 text-center py-1 mb-5' onClick={() => onReset()}>
          Reset
        </button>
        <a className='font-semibold bg-gray-300 rounded-md w-fit px-3 text-center py-1'
          download='chess_pgn.txt'
          href={`data:text/plain;charset=utf-8,${encodeURIComponent( chess.pgn())}`}
        >
          Download PGN
        </a>
        { user && (
          <button
            className='font-semibold bg-gray-300 rounded-md w-fit px-3 text-center py-1 mt-5'
            onClick={onSaveGame}
            disabled={isSaving}
          >
            Save Game
          </button>
        ) }
      </div>
    </>
  )
}

export default ResultCard