import type { NextPage } from 'next'
import Board from '../components/board/Board'
import { useSelector } from 'react-redux'
import { AppState } from '../types/state/AppState'
import ResultCard from '../components/cards/ResultCard'
import MovesList from '../components/MovesList'
import SettingsCard from '../components/cards/SettingsCard'

const Chess: NextPage = () => {
  const result = useSelector(( state: AppState ) => state.gameState.result )

  return (
    <div className="bg-white flex items-center justify-center">
      <SettingsCard />
      <Board>
        {result && <ResultCard result={result} />}
      </Board>
      <MovesList />
    </div>
  )
}

export default Chess