import React, { useEffect, useCallback } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import Logo from './Logo'
import { AppState } from '../../types/state'
import { clearUser } from '../../state/actions/users'

const NavBar: React.FC = () => {
  const dispatch = useDispatch()

  const userState = useSelector(( state: AppState ) => state.user )

  const signOut = useCallback(() => dispatch( clearUser()), [ dispatch ])

  useEffect(() => {
    const {
      user,
      token,
    } = userState

    if( user && token && !Cookies.get( 'token' )) {
      Cookies.set( 'token', token )
    }
  }, [ userState ])

  const onLogout = () => {
    signOut()
    Cookies.remove( 'token' )
    Router.push( '/' )
  }

  return (
    <div className="sticky w-screen h-[10vh]">
      <ul className="flex justify-end px-8 py-3 gap-12 items-center bg-gray-100 text-black border-b-2 border-black h-[10vh]">
        <li className="mr-auto">
          <Logo />
        </li>
        <li className="hover:scale-105 font-bold text-lg">
          <Link href="/chess">Play</Link>
        </li>
        <li className="hover:scale-105 font-bold text-lg">
          <Link href="/about">About</Link>
        </li>
        { userState.user ? (
          <>
            <li className="hover:scale-105 font-bold text-lg">
              <Link href="/users/profile">Profile</Link>
            </li>
            <li className="hover:scale-105 font-bold text-lg">
              <button
                onClick={() => onLogout()}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li className="hover:scale-105 font-bold text-lg">
            <Link href="/login">Login</Link>
          </li>
        ) }
      </ul>
    </div>
  )
}

export default NavBar