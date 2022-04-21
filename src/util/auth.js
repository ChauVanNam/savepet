import cookie from "js-cookie"
import { auth } from "../../firebase.config"
import { signOut } from "firebase/auth"
import Router from "next/router"

const isBrowser = typeof window !== `undefined`
export const isLoggedIn = () => {
  if (!isBrowser) return false
  let token = cookie.get("token")
  if (token) return true
  return false
}

export const logout = async () => {
  try {
    await signOut(auth)
    Router.push("/login")
    cookie.remove("token")
    cookie.remove("user_info")
  } catch (error) {
    console.error(error)
  }
}

export const getUserInfo = () => {
  if (isBrowser) {
    if (typeof cookie.get("user_info") !== "undefined") {
      const user = cookie.get("user_info")
      return JSON.parse(user)
    }
  }
}
