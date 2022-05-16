import { useRouter } from "next/router"
import React, { useState } from "react"
import Layout from "../../components/Layout"
import ProfilePage from "../../components/Profile"
import CreatePost from "../../components/CreatePost"
import PostShowPage from "../../components/Posts/Show"
const PostShow = () => {
  const [isCreatePost, setIsCreatePost] = useState(false)
  const router = useRouter()
  return (
    <Layout setIsCreatePost={setIsCreatePost} isCreatePost={isCreatePost}>
      <CreatePost
        setIsCreatePost={setIsCreatePost}
        isCreatePost={isCreatePost}
        handleRefreshData={() => {
          router.push("/")
        }}
      />
      <PostShowPage />
      {/* <ProfilePage /> */}
    </Layout>
  )
}
export default PostShow
