import { PIECES } from "../constants/engine"

const MvvLvaValues = [ 0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600 ]

export const initMvvLva = (): number[] => {
  const mvvLvaArr: number[] = new Array(14 * 14)
  Object.values( PIECES ).forEach(( attacker: number ) => {
    Object.values( PIECES ).forEach(( victim: number ) => {
      mvvLvaArr[attacker * 14 + victim] = MvvLvaValues[victim] + 6 - ( MvvLvaValues[attacker] / 100 )
    })
  })

  return mvvLvaArr
}