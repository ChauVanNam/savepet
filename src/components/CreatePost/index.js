import React, { useEffect, useRef, useState } from "react"
import Modal from "react-modal"
import PowerfullModal from "../../small_components/Modal/PowerfullModal"
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getBlob,
  getStorage,
  deleteObject,
} from "firebase/storage"
import { Formik, Form, Field } from "formik"
import { storage } from "../../../firebase.config"
import { db } from "../../../firebase.config"
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  setDoc,
  doc,
  firestore,
} from "firebase/firestore"
import CurrencyFormat from "react-currency-format"
import * as Yup from "yup"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/router"
import { getUserInfo } from "../../util/auth"

const createPostSchema = Yup.object().shape({
  title: Yup.string().required("Vui lòng nhập tiêu đề"),
  description: Yup.string().required("Vui lòng mô tả"),
  phone: Yup.string().required("Vui lòng nhập số điện thoại liên hệ"),
  address: Yup.string().required("Vui lòng nhập địa chỉ"),
})

const CreatePost = ({
  setIsCreatePost,
  isCreatePost,
  handleRefreshData,
  post,
  isEdit,
}) => {
  const user = getUserInfo()
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => {
        uploadFiles(file)
      })
    },
  })

  const [fileUrl, setFileUrl] = useState(post ? post.images : [])

  const storage = getStorage()
  const deleteImage = async (name, index) => {
    const desertRef = ref(storage, `posts/${name}`)
    let _fileUrl = [...fileUrl]
    try {
      const res = await deleteObject(desertRef)
      _fileUrl.splice(index, 1)
      setFileUrl(_fileUrl)
    } catch (error) {
      console.log(error)
    }
  }
  const [progress, setProgress] = useState()

  const uploadFiles = (file) => {
    if (!file) return
    const sotrageRef = ref(storage, `posts/${file.name}`)
    const uploadTask = uploadBytesResumable(sotrageRef, file)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(prog)
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUrl((prevState) => [
            ...prevState,
            { url: downloadURL, name: file.name },
          ])
          console.log("File available at", downloadURL)
        })
      }
    )
  }
  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        const washingtonRef = doc(db, "posts", post.id)
        await updateDoc(washingtonRef, {
          ...values,
          images: fileUrl || "",
          user_id: user.id,
        })
        // await updateDoc(collection(db, "posts"), {
        //   ...values,
        //   images: fileUrl || "",
        //   user_id: user.id,
        // })
      } else {
        await addDoc(collection(db, "posts"), {
          ...values,
          images: fileUrl || "",
          user_id: user.id,
        })
      }
      handleRefreshData()
      setIsCreatePost(false)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          title: post?.title ? post.title : "",
          description: post?.description ? post.description : "",
          address: post?.address ? post.address : user?.address || "",
          phone: post?.phone ? post.phone : user?.phone || "",
        }}
        validationSchema={createPostSchema}
      >
        {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form>
            <PowerfullModal
              onSubmit={handleSubmit}
              btnSubmitText={isSubmitting ? "Đang đăng" : "Đăng"}
              sizeModal="md"
              title={isEdit ? "Chỉnh Sửa Bài Đăng" : "Tạo Bài Đăng"}
              isOpen={isCreatePost}
              onCancel={() => setIsCreatePost(false)}
              onClose={() => setIsCreatePost(false)}
            >
              <section className="row mx-0">
                {fileUrl?.length > 0 &&
                  fileUrl.map((item, index) => (
                    <div className="position-relative">
                      <img
                        className="col-lg-3 px-0 mr-3 mb-3"
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                          maxWidth: 120,
                        }}
                        width={120}
                        height={120}
                        src={item.url}
                      />
                      <img
                        onClick={() => deleteImage(item.name, index)}
                        className="position-absolute"
                        style={{ top: -5, right: 10 }}
                        src="/images/icon/remove_image_buffet_ic.svg"
                      />
                    </div>
                  ))}
                <div
                  className="col-lg-3 pl-0"
                  {...getRootProps({ className: "dropzone" })}
                >
                  <div className="drop-container d-flex align-items-center justify-content-center">
                    <div className="d-flex flex-column">
                      <img src="/images/icon/paper_upload.svg" />
                      <p
                        style={{
                          color: "#8c8c8c",
                          letterSpacing: "0.002em",
                          fontWeight: 400,
                        }}
                        className="mb-0 fo-12 mt-1"
                      >
                        Tải lên
                      </p>
                    </div>
                    <input {...getInputProps()} />
                  </div>
                </div>
              </section>
              <div className="mt-3">
                <label className="create-post--label">Tiêu đề:</label>
                <Field
                  name="title"
                  placeholder="Tiêu đề"
                  className="form-control w-100 mb-2"
                />
              </div>
              <div>
                <label className="create-post--label">Chú thích:</label>
                <Field
                  style={{ minHeight: 200 }}
                  name="description"
                  as="textarea"
                  placeholder="Chú thích"
                  className="form-control w-100 mb-2"
                />
              </div>
              <div>
                <label className="create-post--label">Số điện thoại:</label>
                <CurrencyFormat
                  type={`text`}
                  value={values.phone}
                  onChange={(e) => setFieldValue("phone", e.target.value)}
                  name="phone"
                  placeholder="Số điện thoại liên hệ"
                  className="form-control w-100 mb-2"
                />
              </div>
              <div>
                <label className="create-post--label">Địa chỉ:</label>
                <Field
                  name="address"
                  placeholder="Địa chỉ"
                  className="form-control w-100 mb-2"
                />
              </div>
            </PowerfullModal>
          </Form>
        )}
      </Formik>
    </div>
  )
}
export default CreatePost
