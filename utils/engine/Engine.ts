import { Move } from "chess.js";

export const getEngineMove = async () => {
    const move: Move = await fetch(`/api/engine/get_move`)
    .then(res => res.json())
    .then(data => data.move)
    .catch(err => console.log(err));
    return move;
}