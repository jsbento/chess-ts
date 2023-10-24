import { NextApiRequest, NextApiResponse } from 'next'
import { get } from '@coordinators/utils/rest'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  await get( `${process.env.API_HOST}/games`, req.query, {
    Authorization: `Bearer ${req.cookies['token'] || ''}`,
  })
  .then( r => r.json())
  .then( data => {
    if( data.message ) {
      res.status( 500 ).json({ error: data.message })
      return
    }

    res.status( 200 ).json( data )
  })
  .catch( e => {
    res.status( 500 ).json({ error: e.message })
  })
}