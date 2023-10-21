import React from 'react'
import Footer from './Footer'
import NavBar from './NavBar'

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="flex flex-col h-[100vh]">
      <NavBar />
        <div className="flex h-[80vh] items-center">
          {children}
        </div>
      <Footer />
    </div>
  )
}

export default Layout