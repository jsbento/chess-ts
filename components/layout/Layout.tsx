import React from "react"
import Footer from "./Footer"
import NavBar from "./NavBar"

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout