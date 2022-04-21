import React, { useState } from "react"
import Modal from "react-modal"
import { customStyles, customActionStyles } from "./styles.js"
import { db } from "../../../../firebase.config.js"
import { MoreIcon } from "../../../small_components/Icon/index.js"
import { doc, deleteDoc } from "firebase/firestore"
import { getUserInfo } from "../../../util/auth.js"
import { Field, Formik } from "formik"

const PostDetailModal = ({
  post,
  isOpen,
  setIsOpen,
  handleRefreshData,
  comments,
}) => {
  const [isActionOpen, setIsActionOpen] = useState(false)
  const deletePost = async (id) => {
    try {
      await deleteDoc(doc(db, "post", id))
      handleRefreshData()
      setIsOpen(false)
    } catch (error) {}
  }
  const user = getUserInfo()

  return (
    <>
      <Formik initialValues={{ comment: "" }}>
        <Modal isOpen={isOpen} style={customStyles}>
          <div className="position-relative mod-scroll">
            <img style={{ width: "100%" }} src={post?.image} />
            <img
              style={{ top: 10, right: 10 }}
              className="position-absolute cursor-pointer"
              onClick={() => {
                setIsOpen(false)
                setIsActionOpen(false)
              }}
              src="/images/modal/close-icon.svg"
            />
          </div>
          <div style={{ borderBottom: "1px solid #d9d9d9" }}>
            <div className="p-2 d-flex align-items-center justify-content-between">
              <div>
                <img
                  width={36}
                  height={36}
                  className="mr-2 p-1"
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
                <p className="m-0 fo-14 text-dark font-weight-bold">
                  {post?.user?.fullName || ""}
                </p>
              </div>
              <div className="position-relative">
                <MoreIcon
                  onClick={() => setIsActionOpen((prevState) => !prevState)}
                />
                {isActionOpen && (
                  <div className="position-absolute post-action">
                    {user.id === post.user_id && (
                      <div className="item">
                        <p
                          onClick={() => deletePost(post.id)}
                          className="text-danger"
                        >
                          Xoá
                        </p>
                      </div>
                    )}
                    <div className="item">
                      <p>Chỉnh sửa</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-2">
              <p className="post-title mb-0">{post?.title}</p>
              <p className="post-description mb-0">{post?.description}</p>
              <p className="post-description mb-0">
                Số điện thoại: {post?.phone}
              </p>
              <p className="post-description">Địa chỉ: {post?.address}</p>
            </div>
          </div>
          <div className="p-2">
            {comments?.length > 0 &&
              comments.map((comment) => (
                <div className="mt-2" key={comment.id}>
                  <img
                    width={24}
                    height={24}
                    className="mr-2 p-1"
                    style={{
                      borderRadius: "50%",
                      border: "1px solid #d9d9d9",
                    }}
                    alt="post-img"
                    src={
                      comment.user.avatar ||
                      "https://start-up.vn/upload/photos/avatar.jpg"
                    }
                  />
                  <span className="fo-14 font-weight-bold text-dark mr-2">
                    {`${comment.user.fullName}`}
                  </span>
                  <span className="fo-12 text-dark">{comment.comment}</span>
                </div>
              ))}
          </div>
          {/* <Field /> */}
        </Modal>
      </Formik>
    </>
  )
}
export default PostDetailModal
