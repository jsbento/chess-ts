import { Action } from '../../types/state/AppState'
import { UserState, UserActions } from '../../types/state/users'

export const initialUserState: UserState = {
  user: null,
  token: null,
}

const userReducer = ( state = initialUserState, action: Action ) => {
  switch( action.type ) {
    case UserActions.SET_USER:
      return {
        ...state,
        ...action.payload,
      }
    case UserActions.CLEAR_USER:
      return {
        ...state,
        ...initialUserState,
      }
    default:
      return state
  }
}

export default userReducer