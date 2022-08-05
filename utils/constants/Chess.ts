import { Chess, ShortMove } from "chess.js";
import { BehaviorSubject } from "rxjs";
import { GameState } from "../../types/chess/GameState";

export const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export const RANK_FILE_MAX = 8;

export const chess = new Chess(DEFAULT_FEN);

const initialGameState = {
    board: chess.board(),
    gameStatus: false,
    promotion: null,
    turn: "w",
    result: null
}

export const gameState = new BehaviorSubject<GameState>(initialGameState);

export const initGame = () => {
    const savedGame = localStorage.getItem("game");
    if (savedGame) {
        chess.load(savedGame);
    }
    updateGame(null);
}

export const resetGame = () => {
    chess.reset();
    updateGame(null);
}

export const updateGame = (promotion: {from: string, to: string, color: string} | null) => {
    const gameStatus = chess.game_over();

    const update = {
        board: chess.board(),
        gameStatus,
        promotion,
        turn: chess.turn(),
        result: gameStatus ? getResult() : null,
    }

    localStorage.setItem("game", chess.fen());

    gameState.next(update);
}

export const getResult = () => {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? "black" : "white";
        return `Checkmate, ${winner} wins!`;
    } else if (chess.in_draw()) {
        let reason = "50-move rule";
        if (chess.in_stalemate()) {
            reason = "stalemate";
        } else if (chess.in_threefold_repetition()) {
            reason = "repetition";
        } else if (chess.insufficient_material()) {
            reason = "insufficient material";
        }
        return `Draw, ${reason}`;
    } else {
        return "The chess gods demand it...";
    }
}

export const handleMove = (from: string, to: string) => {
    const promotions = chess.moves({ verbose: true }).filter(move => move.promotion);
    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const promotion = { from, to, color: promotions[0].color};
        updateGame(promotion);
    }

    const { promotion } = gameState.getValue();
    if (!promotion) move(from, to, undefined);
}

export const move = (from: string, to: string, promotion: undefined | "b" | "n" | "q" | "r") => {
    let move = { from, to } as ShortMove;
    if (promotion) {
        move.promotion = promotion;
    }

    console.log( move );
    const legalMove = chess.move(move);
    console.log( legalMove );
    if (legalMove) {
        updateGame(null);
    }
}
