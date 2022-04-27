import React, { useState } from "react"
import { auth } from "../../../../firebase.config"
import { signOut } from "firebase/auth"
import { logout } from "../../../util/auth"
import { useRouter } from "next/router"
import Link from "next/link"
import { getUserInfo } from "../../../util/auth"
import {
  ProfileIcon,
  BookMarkSM,
  CreatePostIcon,
} from "../../../small_components/Icon"
const Header = ({ setIsCreatePost }) => {
  const router = useRouter()
  const user = getUserInfo()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="layout-header">
      <div className="d-flex justify-content-between" style={{ width: 800 }}>
        <div className="d-flex align-items-center">
          <img
            onClick={() => router.push("/")}
            height={60}
            src="/images/save_pet.png"
            style={{ cursor: "pointer" }}
            alt="logo"
          />
        </div>
        <div className="d-flex align-items-center position-relative">
          <CreatePostIcon
            className="cursor-pointer"
            onClick={() => setIsCreatePost(true)}
          />
          {user && (
            <img
              width={36}
              height={36}
              className="p-1 ml-3 cursor-pointer"
              onClick={() => setIsOpen((preState) => !preState)}
              style={{
                borderRadius: "50%",
                border: "1px solid #d9d9d9",
              }}
              alt="post-img"
              src={user?.avatar}
            />
          )}

          {isOpen && (
            <div className="position-absolute profile">
              <div
                onClick={() => router.push(`/profile/${user.id}`)}
                className="item"
              >
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
    </div>
  )
}
export default Header
