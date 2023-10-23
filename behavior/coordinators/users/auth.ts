import { Dispatch } from 'redux'
import { post } from '../utils/rest'
import { UserState } from '../../../types/state/users'
import { setUser } from '../../../state/actions/users'

export const signIn = ( data: { identifier: string, password: string }) => async ( dispatch: Dispatch ): Promise<{ user?: UserState, error?: string}> => {
  const resp: {
    user?: UserState,
    error?: string,
  } = await post( '/api/users/signin', data )
  .then( r => r.json())
  .then( data => {
    const {
      user,
      error,
    } = data || {}

    if( error ) {
      return {
        error,
      }
    } else {
      dispatch( setUser( user ))

      return {
        user,
      }
    }
  })
  .catch( e => ({ error: e.message }))

  return resp
}

export const signUp = ( data: { username: string, email: string, password: string }) => async ( dispatch: Dispatch ): Promise<{ user?: UserState, error?: string}> => {
  const resp: {
    user?: UserState,
    error?: string,
  } = await post( '/api/users/signup', data )
  .then( r => r.json())
  .then( data => {
    const {
      user,
      error,
    } = data || {}

    if( error ) {
      return {
        error,
      }
    } else {
      dispatch( setUser( user ))

      return {
        user,
      }
    }
  })
  .catch( e => ({ error: e.message }))

  return resp
}