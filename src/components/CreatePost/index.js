import React, { useEffect, useRef, useState } from "react"
import Modal from "react-modal"
import PowerfullModal from "../../small_components/Modal/PowerfullModal"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { Formik, Form, Field } from "formik"
import { storage } from "../../../firebase.config"
import { db } from "../../../firebase.config"
import { collection, addDoc, Timestamp } from "firebase/firestore"
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

const CreatePost = ({ setIsCreatePost, isCreatePost, handleRefreshData }) => {
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

  const [fileUrl, setFileUrl] = useState()

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
          setFileUrl(downloadURL)
          console.log("File available at", downloadURL)
        })
      }
    )
  }
  const onSubmit = async (values) => {
    try {
      await addDoc(collection(db, "post"), {
        ...values,
        image: fileUrl || "",
      })
      handleRefreshData()
      setIsCreatePost(false)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          title: "",
          description: "",
          address: user?.address || "",
          phone: user?.phone || "",
        }}
        validationSchema={createPostSchema}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <Form>
            <PowerfullModal
              onSubmit={handleSubmit}
              sizeModal="md"
              title={"Tạo Bài Đăng"}
              isOpen={isCreatePost}
              onCancel={() => setIsCreatePost(false)}
              onClose={() => setIsCreatePost(false)}
            >
              <section className="drop-container">
                <div
                  style={{ height: 300 }}
                  {...getRootProps({ className: "dropzone" })}
                >
                  <input {...getInputProps()} />
                  {fileUrl && (
                    <div className="d-flex justify-content-center">
                      <img
                        className="w-100"
                        style={{ height: 300, objectFit: "cover" }}
                        src={fileUrl}
                      />
                    </div>
                  )}
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
