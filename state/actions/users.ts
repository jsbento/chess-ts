import { UserState } from '../../types/state/users'

export const setUser = ( payload: UserState ) => ({ type: 'SET_USER', payload })

export const clearUser = () => ({ type: 'CLEAR_USER' })