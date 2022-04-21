import React, { useState } from "react"
import { auth } from "../../../../firebase.config"
import { signOut } from "firebase/auth"
import { logout } from "../../../util/auth"
import { useRouter } from "next/router"
import Link from "next/link"
import { getUserInfo } from "../../../util/auth"
import { ProfileIcon, BookMarkSM } from "../../../small_components/Icon"
import cookie from "js-cookie"
const Header = ({ setIsCreatePost }) => {
  const router = useRouter()
  const user = getUserInfo()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="layout-header">
      <div className="d-flex align-items-center">
        <span>Bài viết</span>
        <span className="ml-2 cursor-pointer">Hỏi đáp</span>
        <span className="ml-2 cursor-pointer">Thảo luận</span>
        <span
          onClick={() => setIsCreatePost(true)}
          className="ml-2 cursor-pointer"
        >
          Đăng bài
        </span>
      </div>
      <div className="d-flex align-items-center position-relative mr-5">
        <img
          width={36}
          height={36}
          className="mr-3 p-1 cursor-pointer"
          onClick={() => setIsOpen((preState) => !preState)}
          style={{
            borderRadius: "50%",
            border: "1px solid #d9d9d9",
          }}
          // className="post-image"
          alt="post-img"
          src={user?.avatar || "https://start-up.vn/upload/photos/avatar.jpg"}
        />
        {isOpen && (
          <div className="position-absolute profile">
            <div onClick={() => router.push("/profile")} className="item">
              <ProfileIcon />
              <p>Trang cá nhân</p>
            </div>
            <div className="item">
              <BookMarkSM />
              <p>Đã Lưu</p>
            </div>
            <div onClick={() => logout()} className="item mt-2">
              <p>Đăng xuất</p>
            </div>
          </div>
        )}
        {/* <button onClick={() => logout()} className="btn">
          Đăng xuất
        </button> */}
      </div>
    </div>
  )
}
export default Header
