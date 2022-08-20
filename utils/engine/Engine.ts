import { Move } from "chess.js";

export const getEngineMove = async (fen: string) => {
    const move: Move = await fetch(`/api/engine/get_move`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ fen })
    })
    .then(res => res.json())
    .then(data => data.move)
    .catch(err => console.log(err));
    return move;
}