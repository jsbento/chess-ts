import { Action } from "../../types/state/AppState"
import { GameState, ActionTypes } from "../../types/state/GameState"
import { chess } from "../../utils/constants/Chess"

export const initialState: GameState = {
  board: chess.board(),
  gameStatus: false,
  result: null,
  turn: "w",
  promotion: null,
  moves: [],
}

const chessReducer = ( state = initialState, action: Action ): GameState => {
  switch ( action.type ) {
    case ActionTypes.SET_BOARD:
      return boardReducer( state, action )
    case ActionTypes.SET_GAME_STATUS:
      return gameStatusReducer( state, action )
    case ActionTypes.SET_TURN:
      return turnReducer( state, action )
    case ActionTypes.SET_PROMOTION:
      return promotionReducer( state, action )
    case ActionTypes.SET_RESULT:
      return resultReducer( state, action )
    case ActionTypes.SET_STATE:
      return stateReducer( state, action )
    case ActionTypes.SET_MOVES:
      return movesReducer( state, action )
    default:
      return state
  }
}

const boardReducer = ( state: GameState, action: Action ): GameState => ({ ...state, board: action.payload })
const gameStatusReducer = ( state: GameState, action: Action ): GameState => ({ ...state, gameStatus: action.payload })
const resultReducer = ( state: GameState, action: Action ): GameState => ({ ...state, result: action.payload })
const turnReducer = ( state: GameState, action: Action ): GameState => ({ ...state, turn: action.payload })
const promotionReducer = ( state: GameState, action: Action ): GameState => ({ ...state, promotion: action.payload })
const stateReducer = ( state: GameState, action: Action ): GameState => ({ ...state, ...action.payload })
const movesReducer = ( state: GameState, action: Action ): GameState => ({ ...state, moves: [ ...state.moves, action.payload ]})

export default chessReducer