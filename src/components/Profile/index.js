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
const ProfilePage = () => {
  // const user = getUserInfo()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [detailData, setDetaiData] = useState()
  const [posts, setPost] = useState([])
  const [user, setUser] = useState({})

  const getUserInfo = async () => {
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
    // prevArrow: <PrevArrow />,
    // nextArrow: <NextArrow />,
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
    getAllPosts()
    getUserInfo()
  }, [router.query.id])

  const handleRefreshData = () => {
    setPost([])
    getAllPosts()
  }

  const { comments } = useGetAllComments()
  const [commentsDetail, setCommentsDetail] = useState()
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
    <React.Fragment>
      <PostDetailModal
        setIsOpen={setIsOpenModal}
        post={detailData}
        isOpen={isOpenModal}
        comments={commentsDetail}
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
              "https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.6435-9/56900904_782768232122683_6418888770594013184_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=e3f864&_nc_ohc=Db616cWFf3EAX8EPB0g&_nc_ht=scontent.fsgn2-6.fna&oh=00_AT-OZk_laoHgyI4Uj8wXM89vFW5TwEq7OurTTkJclz-fxQ&oe=6283DA19"
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
            <p className="user_name">{user?.fullName}</p>
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
          <div className="user_posts row">
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
                          className="w-100 cursor-pointer user_post_image"
                          src={img.url}
                        />
                      ))}
                  </Slider>
                </div>
              ))}
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
export default ProfilePage
