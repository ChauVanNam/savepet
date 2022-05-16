import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import React, { useState, useEffect } from "react"
import { db } from "../../../firebase.config"
function useGetAllComments() {
  const commentcolectionRef = collection(db, "comments")
  const [comments, setComments] = useState([])
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

  useEffect(() => {
    getAllComments()
  }, [])
  return {
    comments,
    getAllComments,
  }
}
export default useGetAllComments
