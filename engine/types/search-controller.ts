export type SearchController = {
  nodes: number
  fh: number
  fhf: number
  depth: number
  time: number
  start: number
  stop: boolean
  best: number
  thinking: boolean
}

export const checkUp = ( searchController: SearchController ): void => {
  if( searchController.nodes % 2048 == 0 ) {
    if( Date.now() - searchController.start > searchController.time ) {
      searchController.stop = true
    }
  }
}