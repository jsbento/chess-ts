import type { NextPage } from "next";
import Board from "../components/board/Board";
import { DEFAULT_FEN } from "../utils/constants/Chess";

const Chess: NextPage = () => {
    return (
        <Board fen={DEFAULT_FEN}/>
    )
}

export default Chess;