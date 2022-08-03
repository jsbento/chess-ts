import type { NextPage } from "next";
import Board from "../components/board/Board";
import { DEFAULT_FEN } from "../utils/constants/Chess";

const Chess: NextPage = () => {
    return (
        <div className="bg-slate-300 h-max flex justify-center">
            <Board fen={DEFAULT_FEN}/>
        </div>
    )
}

export default Chess;