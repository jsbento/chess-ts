import { Action } from '../../types/state/AppState'
import { GameState, GameActions } from '../../types/state/GameState'
import { chess } from '../../utils/constants/Chess'

export const initialState: GameState = {
  board: chess.board(),
  gameStatus: false,
  result: null,
  turn: 'w',
  promotion: null,
  moves: [],
  fen: chess.fen(),
}

const chessReducer = ( state = initialState, action: Action ): GameState => {
  switch ( action.type ) {
    case GameActions.SET_BOARD:
      return { ...state, board: action.payload }
    case GameActions.SET_GAME_STATUS:
      return { ...state, gameStatus: action.payload }
    case GameActions.SET_TURN:
      return { ...state, turn: action.payload }
    case GameActions.SET_PROMOTION:
      return { ...state, promotion: action.payload }
    case GameActions.SET_RESULT:
      return { ...state , result: action.payload }
    case GameActions.SET_STATE:
      return { ...state, ...action.payload }
    case GameActions.SET_MOVES:
      return { ...state, moves: [ ...state.moves, action.payload ]}
    case GameActions.SET_FEN:
      return { ...state, fen: action.payload }
    default:
      return state
  }
}

export default chessReducer