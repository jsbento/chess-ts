import React from "react";
import Link from "next/link";
import Logo from "./Logo";

const NavBar: React.FC = () => {
    return (
        <>
            <ul className="flex justify-end px-8 py-3 gap-12 items-center bg-slate-400 text-black">
                <li className="mr-auto">
                    <Logo />
                </li>
                <li className="hover:scale-105 font-bold text-lg">
                    <Link href="/chess">Play</Link>
                </li>
                <li className="hover:scale-105 font-bold text-lg">
                    <Link href="/about">About</Link>
                </li>
            </ul>
        </>
    );
}

export default NavBar;