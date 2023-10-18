import React from "react"
import Image from "next/image"
import Link from "next/link"

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <a className="flex items-center">
        <Image src="/Chess_klt60.png" alt="Chess Logo" width={75} height={75} />
        <p className="font-bold text-xl">Chess-TS</p>
      </a>
    </Link>
  )
}

export default Logo