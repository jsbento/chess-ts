import React from "react"
import { FaGithub } from "react-icons/fa"

const Footer: React.FC = () => {
    return (
        <footer className="h-20 flex justify-center bg-slate-300">
            <div className="flex justify-center items-center">
                <p className="font-semibold mr-3">Chess-TS developed by Jacob Benton</p>
                <a href="https://github.com/jsbento/chess-ts">
                    <FaGithub className="h-6 w-6" />
                </a>
            </div>
        </footer>
    )
}

export default Footer