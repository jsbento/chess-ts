import { post } from '../utils/rest'

export const evalPosition = async ( fen: string ): Promise<{ score: number, error?: string }> => {
  return await post( '/api/chess/eval', { fen })
  .then( r => r.json())
  .then( data => {
    const {
      error,
    } = data || {}

    if( error ) {
      return {
        error,
      }
    } else {
      return data
    }
  })
  .catch( e => ({ error: e.message }))
}

export const searchPosition = async ({
  fen,
  depth,
  moveTime,
} : {
  fen: string,
  depth: number,
  moveTime: number,
}): Promise<{ move: string, error?: string }> => {
  return await post( '/api/chess/search', { fen, depth, moveTime })
  .then( r => r.json())
  .then( data => {
    const {
      error,
    } = data || {}

    if( error ) {
      return {
        error,
      }
    } else {
      return data
    }
  })
  .catch( e => ({ error: e.message }))
}