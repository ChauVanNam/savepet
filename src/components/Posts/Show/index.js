import React, { useState, useEffect, useRef } from "react"
import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { useRouter } from "next/router"
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  orderBy,
  deleteDoc,
} from "firebase/firestore"
import Slider from "react-slick"
import { HeartIcon, Dot, BookMark } from "../../../small_components/Icon"
import CommentField from "../Comment"
import { db } from "../../../../firebase.config"
import { getUserInfo } from "../../../util/auth"
import Loader from "react-loader-spinner"

const PostShow = () => {
  const router = useRouter()
  const [post, setPost] = useState()
  const ref = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const [likes, setLikes] = useState({})
  const user = getUserInfo()
  const commentcolectionRef = collection(db, "comments")
  const [comments, setComments] = useState([])
  const getAllComments = async () => {
    const q = query(
      collection(db, "comments"),
      where("post_id", "==", router?.query?.id || ""),
      orderBy("createdAt", "asc")
    )

    const data = await getDocs(q)
    if (data) {
      let comments = []
      data.docs.map((doc, index) => {
        comments.push({ ...doc.data(), id: doc.id })
      })
      setComments(comments)
    }
  }

  const handleDeleteComment = async (id) => {
    try {
      await deleteDoc(doc(db, "comments", id))
      getAllComments()
    } catch (error) {
      console.log(error)
    }
  }

  const getAllLikes = async () => {
    try {
      const q = query(
        collection(db, "likes"),
        where("post_id", "==", router?.query?.id || "")
      )
      const dataLike = await getDocs(q)
      if (dataLike) {
        let likes = []
        dataLike.docs.map((doc, index) => {
          likes.push({ ...doc.data(), id: doc.id })
          console.log(user.id)
          if (doc.data().user_id == user.id) {
            setIsLike({
              check: true,
              id: doc.id,
              count: dataLike.docs.length,
            })
          }
        })
        setLikes(likes)
      }
    } catch (error) {}
  }

  const getAllBookmarks = async () => {
    try {
      const q = query(
        collection(db, "bookmarks"),
        where("post_id", "==", router?.query?.id || "")
      )
      const dataBookmark = await getDocs(q)
      dataBookmark.docs.map((doc, index) => {
        if (
          doc.data().user_id == user.id &&
          doc.data().post_id === router?.query?.id
        ) {
          setIsBookmark({
            check: true,
            id: doc.id,
          })
        }
      })
      setLikes(likes)
    } catch (error) {}
  }
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
          zIndex: 1000,
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
          zIndex: 1000,
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
  const [isLike, setIsLike] = useState(false)
  const [isBookmark, setIsBookmark] = useState({})
  const getPost = async () => {
    try {
      setIsLoading(true)
      const docRef = doc(db, "posts", router.query.id)
      const data = await getDoc(docRef)
      setPost({ ...data.data(), id: data.id })
      const q = query(
        collection(db, "likes"),
        where("post_id", "==", router?.query?.id || "")
      )
      const dataLike = await getDocs(q)
      if (dataLike) {
        let likes = []
        dataLike.docs.map((doc, index) => {
          likes.push({ ...doc.data(), id: doc.id })
          if (doc.data().user_id == user.id) {
            setIsLike({
              check: true,
              id: doc.id,
              count: dataLike.docs.length,
            })
          }
        })
        setLikes(likes)
      }
      const bookmark = query(
        collection(db, "bookmarks"),
        where("post_id", "==", router?.query?.id || "")
      )
      const dataBookmark = await getDocs(bookmark)
      dataBookmark.docs.map((doc, index) => {
        if (
          doc.data().user_id == user.id &&
          doc.data().post_id === router?.query?.id
        ) {
          setIsBookmark({
            check: true,
            id: doc.id,
          })
        }
      })
      getAllComments()
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPost()
  }, [router.query.id])

  return (
    <div className="w-100">
      {isLoading ? (
        <div className={`text-center mt-5`}>
          <Loader type="MutatingDots" color="#EE392A" height={80} width={80} />
        </div>
      ) : (
        <div className="mt-3">
          <div className="post-container" style={{ width: 614 }}>
            <div className="p-2 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <img
                  width={36}
                  height={36}
                  className="mr-3 p-1"
                  onClick={() => router.push(`/profile/${post?.user?.id}`)}
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
                <p className="m-0 fo-14 font-weight-bold">
                  {post?.user?.fullName || ""}
                </p>
              </div>
            </div>
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
            <div className="post-container--info">
              <p className="post-title mb-0">{post?.title}</p>
              <p
                className="post-description-detail mb-0"
                dangerouslySetInnerHTML={{
                  __html: post?.description || ``,
                }}
              ></p>{" "}
              <p className="post-description font-weight-bold mt-2 text-danger mb-0">
                Số điện thoại: {post?.phone}
              </p>
              <p className="post-description font-weight-bold text-danger mb-0">
                Địa chỉ: {post?.address}
              </p>
              <div className="d-flex justify-content-between my-1">
                <div>
                  <HeartIcon
                    like={isLike}
                    post_id={router?.query?.id}
                    user_id={user?.id}
                    getAllLikes={getAllLikes}
                  />
                  {/* <Comment
              onClick={() => {
                setIsOpenDetail(true)
                setDetaiData(post)
                setCommentsDetail(getPostComment(post.id))
              }}
              className="ml-3 cursor-pointer"
            /> */}
                </div>
                <BookMark
                  saved={isBookmark}
                  post={post}
                  user_id={user?.id}
                  getAllBookmarks={getAllBookmarks}
                />
              </div>
              {isLike?.count > 0 && (
                <div className="fo-14 mt-2">{isLike?.count} likes</div>
              )}
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
              {/* {getPostComment(post.id).length > 0 && (
          <p
            onClick={() => {
              setIsOpenDetail(true)
              setDetaiData(post)
              setCommentsDetail(getPostComment(post.id))
            }}
            className="fo-14 mb-0 cursor-pointer"
          >
            Xem tất cả {getPostComment(post.id).length} bình luận
          </p>
        )} */}
            </div>
            {/* <CommentField
        getAllComments={getAllComments}
        post_id={post.id}
        user={user}
      /> */}
          </div>
        </div>
      )}
    </div>
  )
}
export default PostShow
