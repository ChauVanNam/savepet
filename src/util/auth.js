import cookie from "js-cookie";
import { auth } from "../../firebase.config";
import { signOut } from "firebase/auth";
import Router from "next/router";

const isBrowser = typeof window !== `undefined`;
export const isLoggedIn = () => {
  if (!isBrowser) return false;
  let token = cookie.get("token");
  if (token) return true;
  return false;
};

export const logout = async () => {
  try {
    await signOut(auth);
    Router.push("/login");
    cookie.remove("token");
  } catch (error) {
    console.error(error);
  }
};
