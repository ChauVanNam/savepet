import { Field, Formik, Form } from "formik"
import React from "react"
import { CommentFace } from "../../../small_components/Icon"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../../../firebase.config"
const Comment = ({ user, post_id, getAllComments, parrent_id }) => {
  const handleAddComment = async (values, { resetForm }) => {
    try {
      if (values.comment) {
        await addDoc(collection(db, "comments"), {
          post_id: post_id,
          user: user,
          comment: values?.comment || "",
          parrent_id: parrent_id || null,
          createdAt: new Date().getTime(),
        })
        getAllComments()
      }
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Formik
      enableReinitialize
      onSubmit={handleAddComment}
      initialValues={{ comment: "" }}
    >
      <Form>
        <div className="position-relative">
          <Field
            placeholder="Thêm bình luận"
            className="comment-input"
            name="comment"
          />
          <div style={{ left: "20px", width: 24 }} className="post-comment">
            <CommentFace />
          </div>
          <button type="submit" className="post-comment">
            Đăng
          </button>
        </div>
      </Form>
    </Formik>
  )
}
export default Comment
