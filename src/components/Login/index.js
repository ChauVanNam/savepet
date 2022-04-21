import React, { useState, useEffect } from "react"
import { Field, Form, Formik } from "formik"
import { signInWithEmailAndPassword } from "firebase/auth"
import ErrorMessage from "../../small_components/ErrorMessage"
import { auth } from "../../../firebase.config"
import cookie from "js-cookie"
import * as Yup from "yup"
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore"
import { useRouter } from "next/router"
import LoadingOverlay from "react-loading-overlay"
import { isLoggedIn } from "../../util/auth"
import { db } from "../../../firebase.config"
import Loader from "react-loader-spinner"
import { ModalContainer } from "../../container/modal"

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Vui lòng nhập đúng định dạng Email.")
    .required("Vui lòng nhập Email."),
  password: Yup.string().required("Vui lòng nhập mật khẩu."),
})

const LoginPage = () => {
  const Modal = ModalContainer.useContainer()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // const userColectionRef = collection(db, "users")

  const Login = async (values, { isSubmitting }) => {
    setIsLoading(true)
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      if (user) {
        const q = query(
          collection(db, "users"),
          where("id", "==", user.user.uid)
        )
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          cookie.set("user_info", JSON.stringify(doc.data()), { expires: 1 })
        })
      }
      if (user?.user?.accessToken) {
        cookie.set("token", user.user.accessToken, { expires: 1 })
        router.push("/")
      }

      setIsLoading(false)
    } catch (error) {
      console.log(error)
      Modal.handleModalError({
        text: {
          title: "Có lỗi xảy ra!",
          description: "Vui lòng kiểm tra email và mật khẩu",
        },
        isShow: true,
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/")
    }
  })

  return (
    <React.Fragment>
      <LoadingOverlay
        active={isLoading}
        spinner={
          <Loader type="Puff" color="#EE392A" height={100} width={100} />
        }
      >
        <div className="login">
          <div className="login-card">
            <Formik
              validationSchema={LoginSchema}
              initialValues={{ email: "", password: "" }}
              onSubmit={Login}
            >
              {({ values, errors }) => (
                <Form>
                  <h1 className="text-center text-dark font-weight-bold">
                    Đăng Nhập
                  </h1>
                  <Field
                    name="email"
                    placeholder="Email"
                    className="form-control login-input"
                  />
                  <ErrorMessage name="email" />
                  <Field
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    className="form-control login-input"
                  />
                  <button type="submit" className="login-button mt-3">
                    Đăng nhập
                  </button>
                  <div className="d-flex justify-content-center mt-3">
                    <span>Bạn chưa có tài khoản? </span>
                    <span
                      onClick={() => router.push("/register")}
                      className="pito-color font-weight-bold cursor-pointer"
                    >
                      Đăng ký ngay
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </LoadingOverlay>
    </React.Fragment>
  )
}

export default LoginPage
