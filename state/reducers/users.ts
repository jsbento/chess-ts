import { Action } from '../../types/state/AppState'
import { UserState } from '../../types/state/users'

export const initialUserState: UserState = {
  user: null,
  token: null,
}

const userReducer = ( state = initialUserState, action: Action ) => {
  switch( action.type ) {
    case 'SET_USER':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

export default userReducer