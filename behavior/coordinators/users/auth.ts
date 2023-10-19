import { Dispatch } from 'redux'
import { post } from '../utils/rest'
import { UserState } from '../../../types/state/users'
import * as Actions from '../../../state/actions/users'

export const signIn = ( data: { identifier: string, password: string }) => async ( dispatch: Dispatch ): Promise<{ user?: UserState, error?: string}> => {
  try {
    const user: UserState = await post( '/api/users/signin', data ).then( r => r.json())
    dispatch( Actions.setUser( user ))

    return {
      user,
    }
  } catch( e: any ) {
    return {
      error: e.message,
    }
  }
}

export const signUp = ( data: { username: string, email: string, password: string }) => async ( dispatch: Dispatch ): Promise<{ user?: UserState, error?: string}> => {
  try {
    const user: UserState = await post( '/api/users/signup', data ).then( r => r.json())
    dispatch( Actions.setUser( user ))

    return {
      user,
    }
  } catch( e: any ) {
    return {
      error: e.message,
    }
  }
}