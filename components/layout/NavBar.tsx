import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import Logo from './Logo'
import { AppState } from '../../types/state'

const NavBar: React.FC = () => {
  const user = useSelector(( state: AppState ) => state.user.user )

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
        { user ? (
          <li className="hover:scale-105 font-bold text-lg">
            <Link href="/profile">Profile</Link>
          </li>
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