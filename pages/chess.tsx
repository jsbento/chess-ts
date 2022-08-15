import type { NextPage } from "next";
import Board from "../components/board/Board";
import { useSelector } from "react-redux";
import { GameState } from "../types/chess/GameState";
import ResultCard from "../components/cards/ResultCard";
import MovesList from "../components/MovesList";

const Chess: NextPage = () => {
    const result = useSelector((state: GameState) => state.result);

    return (
        <div className="bg-slate-300 flex items-center justify-center">
            {result && <ResultCard result={result} />}
            <Board />
            <MovesList />
        </div>
    )
}

export default Chess;