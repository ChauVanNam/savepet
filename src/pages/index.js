import { useRouter } from "next/router"
import React, { useEffect, useState, useContext, useMemo } from "react"
import {
  collection,
  getDocs,
  query,
  doc,
  where,
  updateDoc,
  orderBy,
  addDoc,
  limit,
} from "firebase/firestore"
import Layout, { LayoutContext } from "../components/Layout"
import useGetPosts from "../hooks/useGetPosts"
import { isLoggedIn } from "../util/auth"
import { HeartIcon, BookMark, Comment, Dot } from "../small_components/Icon"
import Loader from "react-loader-spinner"
import { db } from "../../firebase.config"
import Slider from "react-slick"
import PostDetailModal from "../components/Posts/Detail"
import CreatePost from "../components/CreatePost"
import { getUserInfo } from "../util/auth"
import { MoreIcon } from "../small_components/Icon"
import { Formik } from "formik"
import CommentField from "../components/Posts/Comment"

export default function Home() {
  const router = useRouter()
  const user = getUserInfo()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login")
    }
  })

  const [posts, setPosts] = useState([])
  const [userData, setUserData] = useState({})
  const postColectionRef = collection(db, "posts")
  const likeColectionRef = collection(db, "likes")
  const followColectionRef = collection(db, "follow")
  const userColectionRef = collection(db, "users")
  const bookmarksColectionRef = collection(db, "bookmarks")
  const commentcolectionRef = collection(db, "comments")
  const [isOpenDetail, setIsOpenDetail] = useState(false)
  const [bookmarks, setBookmarks] = useState(false)
  const [detailData, setDetaiData] = useState()
  const [isCreatePost, setIsCreatePost] = useState(false)
  const [commentsDetail, setCommentsDetail] = useState([])
  const [comments, setComments] = useState([])
  const [isActionOpen, setIsActionOpen] = useState(false)
  const [allUser, setAllUser] = useState([])
  const [likes, setLikes] = useState([])

  const getUserInfomation = async (user_id, index, list) => {
    const q = query(collection(db, "users"), where("id", "==", user_id || ""))
    const querySnapshot = await getDocs(q)
    let _post = []
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        list.user = doc.data()
      })
    }
    _post.push(list)
    setPosts((prevState) => [...prevState, ...[list]])
  }

  const [getAlluserLoading, setGetAllUserLoading] = useState(false)
  const getAllUser = async () => {
    try {
      const data = await getDocs(userColectionRef)
      if (data) {
        let users = []
        data.docs.map((doc, index) => {
          users.push({ ...doc.data() })
        })
        setAllUser(users)
        setGetAllUserLoading(false)
      }
    } catch (error) {
      setGetAllUserLoading(false)
    }
  }

  const getUserInfoData = async () => {
    try {
      const q = query(collection(db, "users"), where("id", "==", user.id))
      const data = await getDocs(q)
      data.forEach((doc) => {
        setUserData({ ...doc.data(), document_id: doc.id })
      })
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

  const getAllPosts = async () => {
    const q = query(postColectionRef, orderBy("createdAt", "asc"))
    const data = await getDocs(q)
    if (data) {
      data.docs.map((doc, index) => {
        getUserInfomation(doc.data().user_id, index, {
          ...doc.data(),
          id: doc.id,
        })
      })
    }
  }

  const getAllLikes = async () => {
    const data = await getDocs(likeColectionRef)
    if (data) {
      let likes = []
      data.docs.map((doc, index) => {
        likes.push({ ...doc.data(), id: doc.id })
      })
      setLikes(likes)
    }
  }

  const [follow, setFollow] = useState([])
  const getAllFollow = async () => {
    const q = query(collection(db, "follow"), where("user_id", "==", user?.id))
    const data = await getDocs(q)
    if (data) {
      let follow = []
      data.docs.map((doc, index) => {
        follow.push(doc.data())
      })
      setFollow(follow)
    }
  }

  const getAllBookmarks = async () => {
    const data = await getDocs(bookmarksColectionRef)
    if (data) {
      let bookmarks = []
      data.docs.map((doc, index) => {
        bookmarks.push({ ...doc.data(), id: doc.id })
      })
      setBookmarks(bookmarks)
    }
  }

  const getAllComments = async () => {
    const q = query(commentcolectionRef, orderBy("createdAt", "asc"))

    const data = await getDocs(q)
    if (data) {
      let comments = []
      data.docs.map((doc, index) => {
        comments.push({ ...doc.data(), id: doc.id })
      })
      setComments(comments)
    }
  }

  const handleFollow = async (follow) => {
    await addDoc(collection(db, "follow"), {
      user_id: user.id,
      follow: follow,
    })
  }

  const handleFollower = async (follower) => {
    await addDoc(collection(db, "follower"), {
      user_id: follower.id,
      follower: user,
    })
  }

  useEffect(() => {
    getAllLikes()
    getAllPosts()
    getAllComments()
    getAllBookmarks()
    getAllFollow()
  }, [])

  useEffect(() => {
    if (userData) {
      getAllUser()
    }
  }, [userData])

  useEffect(() => {
    getUserInfoData()
  }, [])
  const handleRefreshData = () => {
    setPosts([])
    getAllPosts()
  }

  const checkIsLiked = (post_id) => {
    let check = false
    let id = ""
    let count = 0
    likes.map((item) => {
      if (item.post_id === post_id) {
        count++
      }
      if (item.post_id === post_id && user?.id === item.user_id) {
        check = true
        id = item.id
      }
    })
    return {
      check: check,
      id: id,
      count: count,
    }
  }

  const checkIsSaved = (post_id) => {
    let check = false
    let id = ""
    bookmarks.map((item) => {
      if (item.post.id === post_id && user.id === item.user_id) {
        check = true
        id = item.id
      }
    })
    return {
      check: check,
      id: id,
    }
  }

  const getPostComment = (post_id) => {
    let _comments = []
    comments.map((item) => {
      if (item.post_id === post_id) {
        _comments.push(item)
      }
    })
    return _comments
  }

  useEffect(() => {
    if (detailData) {
      let newComment = getPostComment(detailData?.id)
      setCommentsDetail(newComment)
    }
  }, [comments])

  const checkIsFollow = (user) => {
    let isFollow = true
    follow.forEach((item) => {
      if (item?.follow?.id === user?.id) isFollow = false
    })
    return isFollow
  }

  return (
    <Layout setIsCreatePost={setIsCreatePost} isCreatePost={isCreatePost}>
      <CreatePost
        setIsCreatePost={setIsCreatePost}
        isCreatePost={isCreatePost}
        handleRefreshData={handleRefreshData}
      />
      <div className="d-flex align-items-center flex-column">
        {posts.length <= 0 ? (
          <div style={{ width: 614 }} className={`text-center`}>
            <Loader
              type="MutatingDots"
              color="#EE392A"
              height={80}
              width={80}
            />
          </div>
        ) : (
          <>
            {isOpenDetail && (
              <PostDetailModal
                setIsOpen={setIsOpenDetail}
                post={detailData}
                getAllBookmarks={getAllBookmarks}
                checkIsSaved={checkIsSaved}
                getAllComments={getAllComments}
                handleRefreshData={handleRefreshData}
                comments={commentsDetail}
                isOpen={isOpenDetail}
                checkIsLiked={checkIsLiked}
                getAllLikes={getAllLikes}
              />
            )}

            {posts.map((post, index) => (
              <div className="mt-3" key={index}>
                <div className="post-container" style={{ width: 614 }}>
                  <div className="p-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <img
                        width={36}
                        height={36}
                        className="mr-3 p-1"
                        onClick={() =>
                          router.push(`/profile/${post?.user?.id}`)
                        }
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
                      <MoreIcon
                        onClick={() => router.push(`/post/${post.id}`)}
                      />
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
                      className="post-description mb-0"
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
                          like={checkIsLiked(post.id)}
                          post_id={post.id}
                          user_id={user.id}
                          getAllLikes={getAllLikes}
                        />
                        <Comment
                          onClick={() => {
                            setIsOpenDetail(true)
                            setDetaiData(post)
                            setCommentsDetail(getPostComment(post.id))
                          }}
                          className="ml-3 cursor-pointer"
                        />
                      </div>
                      <BookMark
                        saved={checkIsSaved(post.id)}
                        post={post}
                        user_id={user.id}
                        getAllBookmarks={getAllBookmarks}
                      />
                    </div>
                    {checkIsLiked(post.id).count > 0 && (
                      <div className="fo-14 mt-2">
                        {checkIsLiked(post.id).count} likes
                      </div>
                    )}
                    {getPostComment(post.id).length > 0 && (
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
                    )}
                  </div>
                  <CommentField
                    getAllComments={getAllComments}
                    post_id={post.id}
                    user={user}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="mt-3 ml-5">
        <img
          height={56}
          width={56}
          style={{ borderRadius: "50%", objectFit: "cover" }}
          src={userData?.avatar}
        />
        <span
          style={{ fontFamily: "GoogleSans-Medium" }}
          className="fo-14 font-weight-bold ml-2"
        >
          {userData.fullName}
        </span>

        {follow && (
          <div className="suggest-friend">
            <p className="mb-0 suggest-friend--title mt-3">
              Đề xuất dành cho bạn
            </p>
            <div className="mt-3">
              {allUser.map((user) => (
                <>
                  {checkIsFollow(user) && (
                    <div className="mt-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <img
                          onClick={() => router.push(`/profile/${user.id}`)}
                          height={40}
                          width={40}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                          src={
                            user?.avatar ||
                            "https://start-up.vn/upload/photos/avatar.jpg"
                          }
                        />
                        <div className="ml-2">
                          <span className="fo-14 font-weight-bold">
                            {user?.fullName}{" "}
                          </span>
                          <p
                            style={{ color: "#8c8c8c" }}
                            className="fo-12 mb-0"
                          >
                            Đề xuất cho bạn
                          </p>
                        </div>
                      </div>
                      <span
                        style={{ color: "#0095f6" }}
                        onClick={() => {
                          handleFollow(user)
                          handleFollower(user)
                          // handleFollow(user)
                          // handleFollower(user)
                          getUserInfoData()
                          getAllFollow()
                        }}
                        className="fo-12 ml-5 cursor-pointer font-weight-bold"
                      >
                        Theo dõi
                      </span>
                    </div>
                  )}
                </>
              ))}
            </div>
            <div className="d-flex align-items-center w-100 mt-4">
              <span style={{ color: "#8c8c8c" }} className="text-center fo-12">
                © 2022 savepet from Chauvannam
              </span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
