import React from "react";
import { auth } from "../../../../firebase.config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <button onClick={logout} className="btn">
        Đăng xuất
      </button>
    </div>
  );
};
export default Header;
