import cookie from "js-cookie";
const isBrowser = typeof window !== `undefined`

export const isLoggedIn = () => {
  if (!isBrowser) return false;
  let token = cookie.get("token");
  if (token) return true;
  return false;
};
