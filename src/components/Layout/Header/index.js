import React from "react";
import { auth } from "../../../../firebase.config";
import { signOut } from "firebase/auth";
import { logout } from "../../../util/auth";
import { useRouter } from "next/router";
import cookie from "js-cookie";
const Header = () => {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => logout()} className="btn">
        Đăng xuất
      </button>
    </div>
  );
};
export default Header;
