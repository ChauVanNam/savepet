import React, { useRef, useState } from "react"
import Modal from "react-modal"
import { customStyles, customActionStyles } from "./styles.js"
import { db } from "../../../../firebase.config.js"
import { MoreIcon } from "../../../small_components/Icon/index.js"
import useOnClickOutside from "../../../hooks/useOnClickOutside"
import {
  doc,
  deleteDoc,
  where,
  query,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore"
import { getUserInfo } from "../../../util/auth.js"
import { Field, Formik } from "formik"
import Slider from "react-slick"
import {
  Dot,
  HeartIcon,
  BookMark,
  Comment,
} from "../../../small_components/Icon/index.js"
import CreatePost from "../../CreatePost/index.js"
import CommentField from "../Comment"
import { useRouter } from "next/router"

const PostDetailModal = ({
  post,
  isOpen,
  setIsOpen,
  handleRefreshData,
  comments,
  getAllComments,
  checkIsSaved,
  checkIsLiked,
  getAllLikes,
  getAllBookmarks,
}) => {
  const [isActionOpen, setIsActionOpen] = useState(false)
  const [isOpenModalEdit, setIsOpenModalEdit] = useState()
  const ref = useRef()
  const [isEdit, setIsEdit] = useState(false)
  const router = useRouter()

  const handleDeleteBookmark = async (id) => {
    const q = query(collection(db, "bookmarks"), where("post_id", "==", id))
    const batch = writeBatch(db)
    try {
      const data = await getDocs(q)
      data.forEach(async (doc1) => {
        await deleteDoc(doc(db, "bookmarks", doc1.id))
      })
    } catch (error) {
      console.log(error)
    }
    // db.collection("bookmarks")
    //   .where("post_id", "==", id)
    //   .get()
    //   .then(function (querySnapshot) {
    //     // Once we get the results, begin a batch
    //     var batch = db.batch()
    //     querySnapshot.forEach(function (doc) {
    //       // For each doc, add a delete operation to the batch
    //       batch.delete(doc.ref)
    //     })
    //     // Commit the batch
    //     return batch.commit()
    //   })
    //   .then(function () {
    //     // Delete completed!
    //     // ...
    //   })
  }

  const deletePost = async (id) => {
    // let bookmark = checkIsSaved(id)
    try {
      await deleteDoc(doc(db, "posts", id))
      // const data = await getDocs(q)
      // data.forEach((doc) => {
      //   handleDeleteBookmark(doc.id)
      // })
      // handleDeleteBookmark(bookmark)

      handleRefreshData()
      setIsOpen(false)
    } catch (error) {}
  }

  const user = getUserInfo()
  useOnClickOutside(ref, () => {
    setIsOpen(false)
  })
  function PrevArrow(props) {
    const { className, style, onClick } = props
    return (
      <img
        className={className}
        style={{
          ...style,
          display: "block",
          height: 24,
          width: 24,
          left: 16,
          zIndex: 10000,
        }}
        onClick={onClick}
        src="/images/modal/left-arrow-ic.svg"
        alt=""
      />
    )
  }

  function NextArrow(props) {
    const { className, style, onClick } = props
    return (
      <img
        src="/images/modal/right-arrow-ic.svg"
        className={className}
        style={{
          ...style,
          display: "block",
          height: 24,
          width: 24,
          right: 16,
          zIndex: 10000,
        }}
        onClick={onClick}
        alt="next_arrow"
      />
    )
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: function (i) {
      return (
        <a>
          <Dot />
        </a>
      )
    },
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dotsClass: "slick-dots slick-thumb",
  }
  const handleDeleteComment = async (id) => {
    try {
      await deleteDoc(doc(db, "comments", id))
      getAllComments()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      {isEdit && (
        <CreatePost
          isCreatePost={isOpenModalEdit}
          setIsCreatePost={setIsOpenModalEdit}
          isEdit={isEdit}
          handleRefreshData={() => {
            setIsOpenModalEdit(false)
            handleRefreshData()
            setIsActionOpen(false)
          }}
          post={post}
        />
      )}

      <Formik enableReinitialize initialValues={{ comment: "" }}>
        <Modal isOpen={isOpen} style={customStyles}>
          <div
            ref={ref}
            style={{ overflow: "scroll" }}
            className="mod-scroll position-relative h-100"
          >
            <div className="position-relative">
              <Slider {...settings}>
                {post?.images.length > 0 &&
                  post.images.map((image) => (
                    <div className="post-image-container">
                      <img
                        className="post-image"
                        alt="post-img"
                        src={image.url}
                      />
                    </div>
                  ))}
              </Slider>
              <img
                style={{ top: 10, right: 10 }}
                className="position-absolute cursor-pointer"
                onClick={() => {
                  setIsOpen(false)
                  setIsActionOpen(false)
                }}
                src="/images/modal/close-icon.svg"
              />
            </div>
            <div style={{ borderBottom: "1px solid #d9d9d9" }}>
              <div className="p-2 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    width={36}
                    height={36}
                    onClick={() => router.push(`/profile/${post?.user?.id}`)}
                    className="mr-2 p-1"
                    style={{
                      borderRadius: "50%",
                      border: "1px solid #d9d9d9",
                      cursor: "pointer",
                    }}
                    alt="post-img"
                    src={
                      post?.user?.avatar ||
                      "https://start-up.vn/upload/photos/avatar.jpg"
                    }
                  />
                  <p className="m-0 fo-14 text-dark font-weight-bold">
                    {post?.user?.fullName || ""}
                  </p>
                </div>
                <div className="position-relative">
                  <MoreIcon
                    onClick={() => setIsActionOpen((prevState) => !prevState)}
                  />
                  {isActionOpen && (
                    <>
                      {user.id === post.user_id && (
                        <div className="position-absolute post-action">
                          <div className="item">
                            <p
                              onClick={() => {
                                deletePost(post.id)
                                handleDeleteBookmark(post.id)
                              }}
                              className="text-danger"
                            >
                              Xoá
                            </p>
                          </div>
                          <div
                            onClick={() => {
                              setIsOpenModalEdit(true)
                              setIsOpen(false)
                              setIsEdit(true)
                              setIsActionOpen(false)
                            }}
                            className="item"
                          >
                            <p>Chỉnh sửa</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="p-2">
                <p className="post-title mb-0">{post?.title}</p>
                <div
                  className="post-description-detail mb-0"
                  dangerouslySetInnerHTML={{ __html: post?.description || `` }}
                ></div>
                <p className="post-description mb-0">
                  Số điện thoại: {post?.phone}
                </p>
                <p className="post-description">Địa chỉ: {post?.address}</p>
              </div>
            </div>
            {/* <div className="d-flex p-2">
              <div className="mr-2">
                <HeartIcon
                  like={checkIsLiked(post.id)}
                  post_id={post.id}
                  user_id={user.id}
                  getAllLikes={getAllLikes}
                />
              </div>
              <BookMark
                saved={checkIsSaved(post.id)}
                post={post}
                user_id={user.id}
                getAllBookmarks={getAllBookmarks}
              />
            </div> */}
            <div className="p-2 mb-4">
              {comments?.length > 0 &&
                comments.map((comment) => (
                  <div className="mt-2" key={comment.id}>
                    <div className="d-flex">
                      <img
                        width={24}
                        height={24}
                        onClick={() =>
                          router.push(`/profile/${comment?.user?.id}`)
                        }
                        className="mr-2 p-1"
                        style={{
                          borderRadius: "50%",
                          border: "1px solid #d9d9d9",
                          cursor: "pointer",
                        }}
                        alt="post-img"
                        src={
                          comment.user.avatar ||
                          "https://start-up.vn/upload/photos/avatar.jpg"
                        }
                      />{" "}
                      <div>
                        <div className="d-flex align-items-center">
                          <p
                            style={{ lineHeight: "20px" }}
                            className="fo-14 mb-0 font-weight-bold text-dark mr-2"
                          >
                            {`${comment.user.fullName}`}
                          </p>{" "}
                          {user?.id === comment?.user?.id && (
                            <span
                              onClick={() => handleDeleteComment(comment?.id)}
                              style={{
                                fontSize: 12,
                                color: "#8c8c8c",
                                cursor: "pointer",
                              }}
                              className="font-weight-bold"
                            >
                              xoá
                            </span>
                          )}
                        </div>
                        <span
                          style={{ lineHeight: "16px" }}
                          className="fo-12 text-dark"
                        >
                          {comment.comment}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div
              style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
              }}
            >
              {post && (
                <CommentField
                  getAllComments={getAllComments}
                  post_id={post.id}
                  user={user}
                />
              )}
            </div>
          </div>
        </Modal>
      </Formik>
    </>
  )
}
export default PostDetailModal
