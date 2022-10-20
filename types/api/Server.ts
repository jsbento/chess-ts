import { ShortMove } from "chess.js";

export type EngineResponse = {
    move: ShortMove | null;
    error?: string;
}