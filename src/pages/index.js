import { useRouter } from "next/router"
import React, { useEffect, useState, useContext } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import Layout, { LayoutContext } from "../components/Layout"
import useGetPosts from "../hooks/useGetPosts"
import { isLoggedIn } from "../util/auth"
import { HeartIcon, BookMark, Comment } from "../small_components/Icon"
import Loader from "react-loader-spinner"
import { db } from "../../firebase.config"
import PostDetailModal from "../components/Posts/Detail"
import CreatePost from "../components/CreatePost"
import { getUserInfo } from "../util/auth"
import { MoreIcon } from "../small_components/Icon"
import { Formik } from "formik"
import CommentField from "../components/Posts/Comment"

export default function Home() {
  const router = useRouter()
  // const { posts } = useGetPosts()
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login")
    }
  })

  const [posts, setPosts] = useState([])
  const postColectionRef = collection(db, "post")
  const likeColectionRef = collection(db, "likes")
  const commentcolectionRef = collection(db, "comments")
  const [isOpenDetail, setIsOpenDetail] = useState(false)
  const [detailData, setDetaiData] = useState()
  const [isCreatePost, setIsCreatePost] = useState(false)
  const [commentsDetail, setCommentsDetail] = useState([])
  const [comments, setComments] = useState([])
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

  const getAllPosts = async () => {
    const data = await getDocs(postColectionRef)
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

  const getAllComments = async () => {
    const data = await getDocs(commentcolectionRef)
    if (data) {
      let comments = []
      data.docs.map((doc, index) => {
        comments.push({ ...doc.data(), id: doc.id })
      })
      setComments(comments)
    }
  }

  const user = getUserInfo()

  useEffect(() => {
    getAllLikes()
    getAllPosts()
    getAllComments()
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
      if (item.post_id === post_id && user.id === item.user_id) {
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

  const getPostComment = (post_id) => {
    let _comments = []
    comments.map((item) => {
      if (item.post_id === post_id) {
        _comments.push(item)
      }
    })
    return _comments
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
          <div className={`text-center`}>
            <Loader
              type="MutatingDots"
              color="#EE392A"
              height={80}
              width={80}
            />
          </div>
        ) : (
          <>
            <PostDetailModal
              setIsOpen={setIsOpenDetail}
              post={detailData}
              comments={commentsDetail}
              isOpen={isOpenDetail}
            />
            {posts.map((post) => (
              <div className="mt-3" key={post.id}>
                <div className="post-container" style={{ width: 614 }}>
                  <div className="p-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <img
                        width={36}
                        height={36}
                        className="mr-3 p-1"
                        style={{
                          borderRadius: "50%",
                          border: "1px solid #d9d9d9",
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
                    <div className="position-relative">
                      <MoreIcon />
                    </div>
                  </div>
                  {post?.image && (
                    <div className="post-image-container">
                      <img
                        className="post-image"
                        alt="post-img"
                        src={post?.image}
                      />
                    </div>
                  )}
                  <div className="post-container--info">
                    <p className="post-title mb-0">{post?.title}</p>
                    <p className="post-description mb-0">{post?.description}</p>
                    <p className="post-description mb-0">
                      Số điện thoại: {post?.phone}
                    </p>
                    <p className="post-description">Địa chỉ: {post?.address}</p>
                  </div>
                  <div className="d-flex justify-content-between mb-1 px-2">
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
                        }}
                        className="ml-3 cursor-pointer"
                      />
                    </div>
                    <BookMark />
                  </div>
                  {checkIsLiked(post.id).count > 0 && (
                    <div className="px-2 fo-14">
                      {checkIsLiked(post.id).count} likes
                    </div>
                  )}
                  {getPostComment(post.id).length > 0 && (
                    <span
                      onClick={() => {
                        setIsOpenDetail(true)
                        setDetaiData(post)
                        setCommentsDetail(getPostComment(post.id))
                      }}
                      className="px-2 fo-14 cursor-pointer"
                    >
                      Xem tất cả {getPostComment(post.id).length} bình luận
                    </span>
                  )}

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
    </Layout>
  )
}
