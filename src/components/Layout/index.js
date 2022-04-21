import React, { useState, createContext } from "react"
import Header from "./Header"
import CreatePost from "../CreatePost"

export const LayoutContext = createContext()

const Layout = ({ children, setIsCreatePost, isCreatePost }) => {
  return (
    <div>
      <Header setIsCreatePost={setIsCreatePost} />
      <main className="main-layout">{children}</main>
    </div>
  )
}
export default Layout
