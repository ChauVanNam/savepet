import React, { useEffect, useRef, useState } from "react"
import { auth } from "../../../../firebase.config"
import { signOut } from "firebase/auth"
import { logout } from "../../../util/auth"
import { useRouter } from "next/router"
import Link from "next/link"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getUserInfo } from "../../../util/auth"
import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { db } from "../../../../firebase.config"
import {
  ProfileIcon,
  BookMarkSM,
  CreatePostIcon,
} from "../../../small_components/Icon"
const Header = ({ setIsCreatePost }) => {
  const router = useRouter()
  const user = getUserInfo()
  const [isOpen, setIsOpen] = useState(false)
  const [searchUser, setSearchUser] = useState([])
  const searchRef = collection(db, "users")
  const ref = useRef()
  const hanlde = () => {
    setIsFocus(false)
  }
  useOnClickOutside(ref, hanlde)

  const handleSearch = async (value) => {
    const q = query(searchRef, where("fullName", ">=", value))
    let arr = []
    try {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        arr.push(doc.data())
      })
      setSearchUser(arr)
    } catch (error) {
      console.log(error)
    }
  }

  const dropdownRef = useRef()

  useOnClickOutside(dropdownRef, () => {
    setIsOpen(false)
  })

  const [isFocus, setIsFocus] = useState(false)
  return (
    <div className="layout-header">
      <div
        className="d-flex justify-content-between w-100"
        style={{ maxWidth: 975 }}
      >
        <div className="d-flex align-items-center">
          <img
            onClick={() => router.push("/")}
            height={60}
            src="/images/save_pet.png"
            style={{ cursor: "pointer" }}
            alt="logo"
          />
          <form>
            <div className="position-relative">
              <input
                style={{ width: 500 }}
                placeholder="Tìm kiếm"
                className="form-control"
                onFocus={() => setIsFocus(true)}
                // onBlur={() => setIsFocus(false)}
                onChange={(e) => {
                  handleSearch(e.target.value || "")
                }}
              />
              {searchUser.length > 0 && isFocus && (
                <div ref={ref} className="search-result">
                  {searchUser.map((user, index) => {
                    if (index < 5) {
                      return (
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/profile/${user.id}`)
                          }}
                          // style={{ borderBottom: "1px solid #d9d9d9" }}
                          className="py-1 cursor-pointer search-item"
                        >
                          <img
                            height={30}
                            width={30}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                            src={
                              user?.avatar ||
                              "https://start-up.vn/upload/photos/avatar.jpg"
                            }
                          />
                          <span className="ml-2 fo-14">{user?.fullName}</span>
                        </div>
                      )
                    }
                  })}
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="d-flex align-items-center position-relative">
          <CreatePostIcon
            className="cursor-pointer"
            onClick={() => setIsCreatePost(true)}
          />
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
            src={user?.avatar || "https://start-up.vn/upload/photos/avatar.jpg"}
          />

          {isOpen && (
            <div ref={dropdownRef} className="position-absolute profile">
              <div
                onClick={() => router.push(`/profile/${user.id}`)}
                className="item"
              >
                <ProfileIcon />
                <p>Trang cá nhân</p>
              </div>
              <div
                onClick={() =>
                  router.push({
                    pathname: `/profile/${user.id}`,
                    query: {
                      saved: 1,
                    },
                  })
                }
                className="item"
              >
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
