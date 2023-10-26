import { RANK_FILE_MAX } from '../constants/Chess'

export const indexToSquare = ( index: number ): string => {
  const file = index % 8
  const rank = Math.floor( index / 8 )
  return `${String.fromCharCode( file+97 )}${( RANK_FILE_MAX - rank )}`
}