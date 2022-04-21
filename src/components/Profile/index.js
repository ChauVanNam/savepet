import React, { useEffect, useState } from "react"
import { getUserInfo } from "../../util/auth"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../../../firebase.config"
import Loader from "react-loader-spinner"
import CreatePost from "../CreatePost"
import PostDetailModal from "../Posts/Detail"
import { useRouter } from "next/router"

const ProfilePage = () => {
  const user = getUserInfo()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [detailData, setDetaiData] = useState()
  const [posts, setPost] = useState([])
  const router = useRouter()
  const getAllPosts = async () => {
    try {
      setIsLoading(true)
      const q = query(collection(db, "post"), where("user_id", "==", user.id))
      const data = await getDocs(q)
      data.forEach((doc) => {
        setPost((preState) => [...preState, { ...doc.data(), id: doc.id }])
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getAllPosts()
  }, [])
  const handleRefreshData = () => {
    setPost([])
    getAllPosts()
  }
  return (
    <React.Fragment>
      <PostDetailModal
        setIsOpen={setIsOpenModal}
        post={detailData}
        isOpen={isOpenModal}
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
              user?.avatar ||
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
                user?.avatar || "https://start-up.vn/upload/photos/avatar.jpg"
              }
            />
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
                  <img
                    onClick={() => {
                      setIsOpenModal(true)
                      setDetaiData(post)
                    }}
                    style={{ height: 300, objectFit: "cover" }}
                    className="w-100 cursor-pointer user_post_image"
                    src={post?.image}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
export default ProfilePage
