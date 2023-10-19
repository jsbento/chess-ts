import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
  const {
    username,
    email,
    password,
  } = req.body

  const resp = await fetch( `${process.env.API_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })
  .then( r => r.json())
  .catch( e => res.status( 500 ).json({ error: e }))

  res.status( 200 ).json( resp )
}