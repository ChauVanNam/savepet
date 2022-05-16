import React, { useEffect, useState } from "react"
import { getUserInfo } from "../../util/auth"
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "../../../firebase.config"
import Loader from "react-loader-spinner"
import CreatePost from "../CreatePost"
import PostDetailModal from "../Posts/Detail"
import { useRouter } from "next/router"
import Slider from "react-slick"
import { useDropzone } from "react-dropzone"
import { Dot } from "../../small_components/Icon"
import useGetAllComments from "../../hooks/useGetComments"
import { storage } from "../../../firebase.config"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import FollowModal from "./FollowModal"
import EditAccountModal from "./EditProfile"

const ProfilePage = () => {
  // const user = _getUserInfo()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [detailData, setDetaiData] = useState()
  const [posts, setPost] = useState([])
  const [user, setUser] = useState({})
  const [saved, setSaved] = useState([])

  const _getUserInfo = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("id", "==", router.query.id)
      )
      const data = await getDocs(q)
      data.forEach((doc) => {
        setUser({ ...doc.data(), document_id: doc.id })
      })
    } catch (error) {}
  }

  const getAllPosts = async () => {
    try {
      setIsLoading(true)
      const q = query(
        collection(db, "posts"),
        where("user_id", "==", router.query.id)
      )
      const data = await getDocs(q)
      data.forEach((doc) => {
        setPost((preState) => [...preState, { ...doc.data(), id: doc.id }])
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const getAllBookmarks = async () => {
    try {
      // setIsLoading(true)
      const q = query(
        collection(db, "bookmarks"),
        where("user_id", "==", router.query.id)
      )
      const data = await getDocs(q)
      data.forEach((doc) => {
        setSaved((preState) => [...preState, { ...doc.data(), id: doc.id }])
      })
      // setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
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
    dotsClass: "slick-dots slick-thumb",
  }

  const uploadFiles = (file) => {
    if (!file) return
    const sotrageRef = ref(storage, `avatar/${file.name}`)
    const uploadTask = uploadBytesResumable(sotrageRef, file)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // setFileUrl((prevState) => [...prevState, downloadURL])
          updateAvatar(downloadURL)
          setUser((preState) => ({ ...preState, avatar: downloadURL }))
          console.log("File available at", downloadURL)
        })
      }
    )
  }

  const updateAvatar = async (params) => {
    try {
      const washingtonRef = doc(db, "users", user.document_id)
      const response = await updateDoc(washingtonRef, {
        avatar: params,
      })
      console.log(response)
    } catch (error) {}
  }

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => {
        uploadFiles(file)
        console.log("abc")
      })
    },
  })

  useEffect(() => {
    setPost([])
    setSaved([])
    setIsOpenModal(false)
    getAllPosts()
    _getUserInfo()
    getAllBookmarks()
  }, [router.query.id])

  const handleRefreshData = () => {
    setPost([])
    setSaved([])
    getAllPosts()
    getAllBookmarks()
  }

  const { comments, getAllComments } = useGetAllComments()
  const [commentsDetail, setCommentsDetail] = useState()
  const [isOpenFollowModal, setIsOpenFollowModal] = useState(false)
  const [isOpenFollowerModal, setIsOpenFollowerModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
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

  const [follow, setFollow] = useState([])

  const getAllFollow = async () => {
    const q = query(
      collection(db, "follow")
      // where("user_id", "==", router?.query?.id || "")
    )
    const data = await getDocs(q)
    if (data) {
      let follow = []
      data.docs.map((doc, index) => {
        follow.push({
          ...doc.data().follow,
          user_id: doc.data().user_id,
          _id: doc.id,
        })
      })
      setFollow(follow)
    }
  }

  const [follower, setFollower] = useState()

  const getAllFollower = async () => {
    const q = query(
      collection(db, "follower")
      // where("user_id", "==", router?.query?.id || "")
    )
    const data = await getDocs(q)
    if (data) {
      let follower = []
      data.docs.map((doc, index) => {
        follower.push({
          ...doc.data().follower,
          user_id: doc.data().user_id,
          _id: doc.id,
        })
      })
      setFollower(follower)
    }
  }

  useEffect(() => {
    getAllFollow()
    getAllFollower()
  }, [router.query.id])
  const crrUser = getUserInfo()

  const deleteFollow = async (data) => {
    try {
      await deleteDoc(doc(db, "follow", data?._id || ""))
      const _follower = follower.find(
        (item) => item.id == router.query.id && item.user_id == data.id
      )
      await deleteDoc(doc(db, "follower", _follower?._id || ""))
      getAllFollow()
    } catch (error) {
      console.log(error)
    }
  }

  const getFollow = (data) => {
    let arr = []
    if (data) {
      data.forEach((item) => {
        if (item.user_id == router.query.id) {
          arr.push(item)
        }
      })
    }
    return arr
  }

  const deleteFollower = async (data) => {
    try {
      await deleteDoc(doc(db, "follower", data?._id || ""))
      const _follow = follow.find(
        (item) => item.id == router.query.id && item.user_id == data.id
      )
      await deleteDoc(doc(db, "follow", _follow?._id || ""))
      getAllFollower()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      <FollowModal
        title={`Đang theo dõi`}
        data={getFollow(follow)}
        isOpen={isOpenFollowModal}
        setIsOpen={setIsOpenFollowModal}
        deleteRecord={deleteFollow}
      />
      {user && (
        <EditAccountModal
          getUserInfo={_getUserInfo}
          title={`Chỉnh sửa thông tin`}
          data={user}
          isOpen={isEdit}
          setIsOpen={setIsEdit}
        />
      )}
      <FollowModal
        title={`Theo dõi`}
        data={getFollow(follower)}
        setIsOpen={setIsOpenFollowerModal}
        isOpen={isOpenFollowerModal}
        deleteRecord={deleteFollower}
      />
      <PostDetailModal
        setIsOpen={setIsOpenModal}
        post={detailData}
        isOpen={isOpenModal}
        comments={commentsDetail}
        getAllComments={getAllComments}
        handleRefreshData={handleRefreshData}
      />
      <div className="user_profile">
        <div className="header position-relative">
          <img
            className="mr-3 p-1 w-100 "
            style={{
              border: "1px solid #d9d9d9",
              objectFit: "cover",
              height: 200,
            }}
            alt="post-img"
            src={
              user?.background ||
              "https://itsfoss.com/wp-content/uploads/2016/12/ubuntu-1704-wallpaper-default.jpg"
            }
          />
          <div
            style={{
              bottom: -110,
              left: 30,
            }}
            className="position-absolute d-flex align-items-end"
          >
            <div
              className="col-lg-3 pl-0"
              {...getRootProps({ className: "dropzone" })}
            >
              <div className="avatar-drop-container">
                {" "}
                <img
                  width={150}
                  height={150}
                  className="mr-3 p-1"
                  style={{
                    borderRadius: "50%",
                    border: "1px solid #d9d9d9",
                  }}
                  alt="post-img"
                  src={
                    user?.avatar ||
                    "https://start-up.vn/upload/photos/avatar.jpg"
                  }
                />
                <input {...getInputProps()} />
              </div>
            </div>
            <div className="ml-3">
              <div>
                <span className="fo-14 font-weight-bold cursor-pointer">
                  {posts?.length || 0} Bài đăng
                </span>
                <span
                  onClick={() => setIsOpenFollowModal(true)}
                  className="fo-14 font-weight-bold ml-2 cursor-pointer"
                >
                  Đang theo dõi {getFollow(follow)?.length || 0} người
                </span>
                <span
                  onClick={() => setIsOpenFollowerModal(true)}
                  className="fo-14 font-weight-bold ml-2 cursor-pointer"
                >
                  Có {getFollow(follower)?.length || 0} người theo dõi
                </span>
              </div>
              <div className="d-flex align-items-center">
                <p className="user_name mb-0">{user?.fullName}</p>
                {crrUser?.id === router.query.id && (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-white font-weight-bold fo-12 ml-2"
                    style={{ border: "1px solid #8c8c8c", borderRadius: 4 }}
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className={`text-center mt-5`}>
            <Loader
              type="MutatingDots"
              color="#EE392A"
              height={80}
              width={80}
            />
          </div>
        ) : (
          <div className="user_posts">
            <Tabs defaultIndex={router.query.saved}>
              <TabList>
                <Tab>
                  <div className="d-flex align-items-center">
                    <svg
                      style={{ marginRight: 10 }}
                      aria-label=""
                      class="_8-yf5 "
                      color="#262626"
                      fill="#262626"
                      height="12"
                      role="img"
                      viewBox="0 0 24 24"
                      width="12"
                    >
                      <rect
                        fill="none"
                        height="18"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        width="18"
                        x="3"
                        y="3"
                      ></rect>
                      <line
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        x1="9.015"
                        x2="9.015"
                        y1="3"
                        y2="21"
                      ></line>
                      <line
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        x1="14.985"
                        x2="14.985"
                        y1="3"
                        y2="21"
                      ></line>
                      <line
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        x1="21"
                        x2="3"
                        y1="9.015"
                        y2="9.015"
                      ></line>
                      <line
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        x1="21"
                        x2="3"
                        y1="14.985"
                        y2="14.985"
                      ></line>
                    </svg>
                    Bài Đăng
                  </div>
                </Tab>
                <Tab>
                  <div className="d-flex align-items-center">
                    <svg
                      style={{ marginRight: 10 }}
                      aria-label=""
                      class="_8-yf5 "
                      color="#8e8e8e"
                      fill="#8e8e8e"
                      height="12"
                      role="img"
                      viewBox="0 0 24 24"
                      width="12"
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
                    Đã Lưu
                  </div>
                </Tab>
              </TabList>
              <TabPanel>
                <div className="row">
                  {posts.length > 0 &&
                    posts.map((post) => (
                      <div className="col-lg-4 mt-4">
                        <Slider {...settings}>
                          {post?.images.length > 0 &&
                            post.images.map((img) => (
                              <img
                                onClick={() => {
                                  setIsOpenModal(true)
                                  setDetaiData(post)
                                  setCommentsDetail(getPostComment(post.id))
                                }}
                                style={{
                                  objectFit: "cover",
                                }}
                                className=" cursor-pointer user_post_image"
                                src={img.url}
                              />
                            ))}
                        </Slider>
                      </div>
                    ))}
                </div>{" "}
              </TabPanel>
              <TabPanel>
                {user.id == router.query.id && (
                  <div className="row">
                    {saved.length > 0 &&
                      saved.map((save) => (
                        <div className="col-lg-4 mt-4">
                          <Slider {...settings}>
                            {save?.post?.images.length > 0 &&
                              save?.post.images.map((img) => (
                                <img
                                  onClick={() => {
                                    setIsOpenModal(true)
                                    setDetaiData(save.post)
                                    setCommentsDetail(
                                      getPostComment(save.post.id)
                                    )
                                  }}
                                  style={{
                                    objectFit: "cover",
                                  }}
                                  className="w-100 cursor-pointer user_post_image"
                                  src={img.url}
                                />
                              ))}
                          </Slider>
                        </div>
                      ))}
                  </div>
                )}
              </TabPanel>
            </Tabs>
          </div>
        )}
        <div
          className="d-flex align-items-center justify-content-center w-100"
          style={{ height: 100 }}
        >
          <span style={{ color: "#8c8c8c" }} className="text-center fo-14">
            © 2022 savepet from Chauvannam
          </span>
        </div>
      </div>
    </React.Fragment>
  )
}
export default ProfilePage
