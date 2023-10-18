import React from "react"
import { useSelector } from "react-redux"
import { AppState } from "../types/state/AppState"
import { chess } from "../utils/constants/Chess"

const MovesList: React.FC = () => {
  const moves = useSelector(( state: AppState ) => state.gameState.moves )

  const makeRows = () => {
    const rows = []
    let movesNum = 1
    for ( let i = 0; i < moves.length; i += 2 ) {
      rows.push({ movesNum, wMove: moves[i], bMove: moves[i + 1] || null })
      movesNum++
    }

    return (
      <tbody className="w-[100%]">
        {rows.map(( row, index ) => (
          <tr className="w-[100%] font-semibold" key={index}>
            <td className="text-center">{row.movesNum}</td>
            <td>{row.wMove}</td>
            <td>{row.bMove || ""}</td>
          </tr>
        ))}
      </tbody>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-[250px] h-[450px] overflow-auto border border-black bg-gray-50 rounded-lg">
        <table className="w-full border-collapse">
          <thead className="w-[100%] text-left sticky top-0 bg-gray-300">
            <tr>
              <th className="w-1/6 sticky top-0 z-[1] p-1"></th>
              <th className="w-1/3 sticky top-0 z-[1] p-1">White</th>
              <th className="w-1/3 sticky top-0 z-[1] p-1">Black</th>
            </tr>
          </thead>
          {makeRows()}
        </table>
      </div>
      <div className="mt-3">
        <a className="font-semibold bg-gray-300 rounded-md w-fit px-3 py-1 text-center"
          download="fen.txt"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent( chess.fen())}`}
        >
          Download FEN
        </a>
      </div>
    </div>
  )
}

export default MovesList