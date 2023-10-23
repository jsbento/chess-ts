import { NextApiRequest, NextApiResponse } from 'next'
import { post } from '@coordinators/utils/rest'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  const {
    identifier,
    password,
  } = req.body

  await post( `${process.env.API_HOST}/users/signin`, {
    identifier,
    password,
  })
  .then( r => r.json())
  .then( data => {
    if( data.message ) {
      res.status( 500 ).json({ error: data.message })
      return
    }

    res.status( 200 ).json( data )
  })
  .catch( e => res.status( 500 ).json({ error: e.message }))
}