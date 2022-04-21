import React, { useState } from "react"
import { db } from "../../../firebase.config"
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore"
export const HeartIcon = ({ post_id, user_id, like, getAllLikes }) => {
  const [isLike, setIsLike] = useState(like.check)
  const handleCreateLike = async () => {
    await addDoc(collection(db, "likes"), {
      post_id: post_id,
      user_id: user_id,
    })
  }
  const handleDeleteLike = async () => {
    await deleteDoc(doc(db, "likes", like.id))
  }
  const handleLike = () => {
    setIsLike(true)
    handleCreateLike()
    getAllLikes()
  }
  const handleUnlike = () => {
    setIsLike(false)
    handleDeleteLike()
    getAllLikes()
  }
  return (
    <>
      {!isLike ? (
        <svg
          aria-label="Like"
          class="_8-yf5 "
          onClick={() => handleLike()}
          color="#262626"
          fill="#262626"
          className="cursor-pointer"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
        </svg>
      ) : (
        <svg
          aria-label="Unlike"
          class="_8-yf5 "
          color="#ed4956"
          className="cursor-pointer"
          fill="#ed4956"
          onClick={() => handleUnlike()}
          height="24"
          role="img"
          viewBox="0 0 48 48"
          width="24"
        >
          <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
        </svg>
      )}
    </>
  )
}

export const BookMark = () => {
  return (
    <svg
      aria-label="Save"
      className="cursor-pointer"
      class="_8-yf5 "
      color="#262626"
      fill="#262626"
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
    >
      <polygon
        fill="none"
        points="20 21 12 13.44 4 21 4 3 20 3 20 21"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      ></polygon>
    </svg>
  )
}

export const Comment = ({ className, onClick }) => {
  return (
    <svg
      aria-label="Comment"
      class="_8-yf5 "
      color="#262626"
      fill="#262626"
      height="24"
      onClick={onClick}
      className={className}
      role="img"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z"
        fill="none"
        stroke="currentColor"
        stroke-linejoin="round"
        stroke-width="2"
      ></path>
    </svg>
  )
}
export const ProfileIcon = () => {
  return (
    <svg
      aria-label="Profile"
      class="_8-yf5 "
      color="#262626"
      fill="#262626"
      height="16"
      role="img"
      viewBox="0 0 24 24"
      width="16"
    >
      <circle
        cx="12.004"
        cy="12.004"
        fill="none"
        r="10.5"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="2"
      ></circle>
      <path
        d="M18.793 20.014a6.08 6.08 0 00-1.778-2.447 3.991 3.991 0 00-2.386-.791H9.38a3.994 3.994 0 00-2.386.791 6.09 6.09 0 00-1.779 2.447"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="2"
      ></path>
      <circle
        cx="12.006"
        cy="9.718"
        fill="none"
        r="4.109"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="2"
      ></circle>
    </svg>
  )
}

export const BookMarkSM = () => {
  return (
    <svg
      aria-label="Saved"
      class="_8-yf5 "
      color="#262626"
      fill="#262626"
      height="16"
      role="img"
      viewBox="0 0 24 24"
      width="16"
    >
      <polygon
        fill="none"
        points="20 21 12 13.44 4 21 4 3 20 3 20 21"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      ></polygon>
    </svg>
  )
}

export const MoreIcon = ({ onClick }) => {
  return (
    <svg
      style={{ cursor: "pointer" }}
      aria-label="More options"
      class="_8-yf5 "
      color="#262626"
      onClick={onClick}
      fill="#262626"
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
    >
      <circle cx="12" cy="12" r="1.5"></circle>
      <circle cx="6" cy="12" r="1.5"></circle>
      <circle cx="18" cy="12" r="1.5"></circle>
    </svg>
  )
}

export const CommentFace = () => {
  return (
    <svg
      aria-label="Emoji"
      class="_8-yf5 "
      color="#262626"
      fill="#262626"
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path>
    </svg>
  )
}
