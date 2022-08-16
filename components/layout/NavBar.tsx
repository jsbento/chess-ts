import React from "react";
import Logo from "./Logo";

const NavBar: React.FC = () => {
    return (
        <>
            <ul className="flex justify-end px-8 py-3 gap-12 items-center bg-slate-400 text-black">
                <li className="mr-auto">
                    <Logo />
                </li>
                <li className="hover:scale-105 font-bold text-lg">
                    <a href="/chess">Play</a>
                </li>
                <li className="hover:scale-105 font-bold text-lg">
                    <a href="/about">About</a>
                </li>
            </ul>
        </>
    );
}

export default NavBar;