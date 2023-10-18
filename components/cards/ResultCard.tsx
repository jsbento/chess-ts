import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { ResultCardProps } from "../../types/components/ResultCard"
import { GameState } from "../../types/state/GameState"
import { initialState } from "../../state/reducers/GameState"
import * as Actions from "../../state/actions/GameState"
import { chess } from "../../utils/constants/Chess"

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const dispatch = useDispatch()

  const _setState = useCallback(( newState: GameState ) => dispatch( Actions.setState( newState )), [ dispatch ])

  const onReset = () => {
    chess.reset()
    _setState( initialState )
  }

  return (
    <>
      <div className = "result-card">
        <p className="font-bold mb-5">
          {result}
        </p>
        <button className="font-semibold bg-slate-400 rounded-md w-fit px-3 text-center pb-1 mb-5" onClick={() => onReset()}>
          Reset
        </button>
        <a className="font-semibold bg-slate-400 rounded-md w-fit px-3 text-center pb-1"
          download="chess_pgn.txt"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent( chess.pgn())}`}
        >
          Download PGN
        </a>
      </div>
    </>
  )
}

export default ResultCard