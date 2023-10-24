import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../../types/state'
import { loadGames } from '@coordinators/games/games'
import { Game } from '../../types/games/game'

const Profile: NextPage = () => {
  const user = useSelector(( state: AppState ) => state.user.user)

  const [ games, setGames ] = useState<Game[]>([])

  useEffect(() => {
    if( !user ) {
      return
    }

    const _loadGames = async () => {
      const games = await loadGames({
        playerId: user.id,
        limit: 10,
        offset: 0,
      })

      setGames( games )
    }

    _loadGames()
  }, [ user ])

  const renderUserInfo = () => {
    return (
      <div className='flex flex-col'>
        <h2 className='font-bold text-xl p-3 mb-3'>
          Hi { user?.username }!
        </h2>
      </div>
    )
  }

  const renderGames = () => {
    return (
      <div className='flex flex-col'>
        <h2 className='font-bold text-xl p-3 mb-3'>
          Your game history
        </h2>
        <table>
          <thead>
            <tr>
              <th>Result</th>
              <th>Time</th>
              <th>Moves</th>
            </tr>
          </thead>
          <tbody>
            { games.map( game => (
              <tr key={game.id}>
                <td>
                  {game.result}
                </td>
                <td>
                  {game.date}
                </td>
                <td>
                  {game.history.slice(0, 5).join(', ')}...
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-row h-[75%] p-2 justify-between'>
      <div className='w-[35%] border-2 rounded-lg ml-[3%]'>
        { renderUserInfo() }
      </div>
      <div className='w-[55%] border-2 rounded-lg mr-[3%]'>
        { renderGames() }
      </div>
    </div>
  )
}

export default Profile