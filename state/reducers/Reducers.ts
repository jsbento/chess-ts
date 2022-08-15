import { GameState } from "../../types/chess/GameState";
import { Action, ActionTypes } from "../../types/chess/GameState";
import { chess } from "../../utils/constants/Chess";

export const initialState: GameState = {
    board: chess.board(),
    gameStatus: false,
    result: null,
    turn: "w",
    promotion: null,
};

const chessReducer = (state = initialState, action: Action): GameState => {
    switch (action.type) {
        case ActionTypes.SET_BOARD:
            return boardReducer(state, action);
        case ActionTypes.SET_GAME_STATUS:
            return gameStatusReducer(state, action);
        case ActionTypes.SET_TURN:
            return turnReducer(state, action);
        case ActionTypes.SET_PROMOTION:
            return promotionReducer(state, action);
        case ActionTypes.SET_RESULT:
            return resultReducer(state, action);
        case ActionTypes.SET_STATE:
            return stateReducer(state, action);
        default:
            return state;
    }
}

const boardReducer = (state: GameState, action: Action): GameState => ({...state, board: action.payload});
const gameStatusReducer = (state: GameState, action: Action): GameState => ({...state, gameStatus: action.payload});
const resultReducer = (state: GameState, action: Action): GameState => ({...state, result: action.payload});
const turnReducer = (state: GameState, action: Action): GameState => ({...state, turn: action.payload});
const promotionReducer = (state: GameState, action: Action): GameState => ({...state, promotion: action.payload});
const stateReducer = (state: GameState, action: Action): GameState => ({...state, ...action.payload});

export default chessReducer;