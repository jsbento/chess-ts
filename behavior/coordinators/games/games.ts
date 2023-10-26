import { get } from '../utils/rest'
import { Game } from '../../../types/games/game'

export const loadGames = async ( params: {
  ids?: string[],
  playerId?: string,
  playerIds?: string[],
  result?: string,
  limit: number,
  offset: number,
} = {
  limit: 10,
  offset: 0,
}): Promise<Game[]> => {
  return await get( '/api/games', params )
  .then( r => r.json())
  .then( data => {
    const {
      error,
    } = data || {}

    if( error ) {
      return []
    } else {
      return data
    }
  })
  .catch( e => ({ error: e.message }))
}