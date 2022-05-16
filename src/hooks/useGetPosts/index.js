import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../../firebase.config"

function useGetPosts() {
  const [posts, setPosts] = useState([])
  const postColectionRef = collection(db, "post")

  const getUserInfo = async (user_id, index, list) => {
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
        getUserInfo(doc.data().user_id, index, doc.data())
      })
    }
  }
  useEffect(() => {
    getAllPosts()
  }, [])
  return {
    posts,
  }
}
export default useGetPosts
