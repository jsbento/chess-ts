import { GameState } from "../../types/chess/GameState";
import { Action, ActionTypes } from "../actions/ActionTypes";
import { chess } from "../../utils/constants/Chess";

const initialState: GameState = {
    board: chess.board(),
    gameStatus: false,
    result: null,
    turn: "w",
    promotion: null,
};

const chessReducer = (state = initialState, action: Action): GameState => {
    if (action.type === ActionTypes.SET_GAME_STATUS) {
        return {
            ...state,
            gameStatus: action.payload,
        };
    } else if (action.type === ActionTypes.SET_BOARD) {
        return {
            ...state,
            board: action.payload,
        };
    } else if (action.type === ActionTypes.SET_RESULT) {
        return {
            ...state,
            result: action.payload,
        };
    } else if (action.type === ActionTypes.SET_TURN) {
        return {
            ...state,
            turn: action.payload,
        };
    } else if (action.type === ActionTypes.SET_PROMOTION) {
        return {
            ...state,
            promotion: action.payload,
        };
    }
    return state;
}

export default chessReducer;