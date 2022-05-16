import React, { useState, useEffect } from "react"
import { Field, Form, Formik } from "formik"
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  FacebookAuthProvider,
} from "firebase/auth"
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
  addDoc,
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
  const provider = new GoogleAuthProvider()
  const facebookProvider = new FacebookAuthProvider()
  const Modal = ModalContainer.useContainer()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // const userColectionRef = collection(db, "users")

  const LoginWithFacebook = async () => {
    try {
      const auth = getAuth()
      const response = await signInWithPopup(auth, facebookProvider)
      console.log(response)
      if (response) {
        addDoc(collection(db, "users"), {
          id: response.user.uid,
          fullName: response.user.displayName,
          email: response.user.email,
          phone: "",
          is_active: true,
          role: "USER",
          avatar:
            response.user.photoURL ||
            "https://start-up.vn/upload/photos/avatar.jpg",
          background:
            "https://itsfoss.com/wp-content/uploads/2016/12/ubuntu-1704-wallpaper-default.jpg",
          address: "",
        })

        if (response?.user?.accessToken) {
          let info = {
            id: response.user.uid,
            fullName: response.user.displayName,
            email: response.user.email,
            avatar:
              response.user.photoURL ||
              "https://start-up.vn/upload/photos/avatar.jpg",
          }
          cookie.set("user_info", JSON.stringify(info), { expires: 1 })
          cookie.set("token", response.user.accessToken, { expires: 1 })
          router.push("/")
        }
        // console.log(response)
        // updateUserProfile({ displayName: values.name })
      }
    } catch (error) {
      console.log(error)
    }
  }
  const LoginWithGoogle = async () => {
    const auth = getAuth()
    const response = await signInWithPopup(auth, provider)
    if (response) {
      addDoc(collection(db, "users"), {
        id: response.user.uid,
        fullName: response.user.displayName,
        email: response.user.email,
        phone: "",
        is_active: true,
        role: "USER",
        avatar:
          response.user.photoURL ||
          "https://start-up.vn/upload/photos/avatar.jpg",
        background:
          "https://itsfoss.com/wp-content/uploads/2016/12/ubuntu-1704-wallpaper-default.jpg",
        address: "",
      })

      if (response?.user?.accessToken) {
        let info = {
          id: response.user.uid,
          fullName: response.user.displayName,
          email: response.user.email,
          avatar:
            response.user.photoURL ||
            "https://start-up.vn/upload/photos/avatar.jpg",
        }
        cookie.set("user_info", JSON.stringify(info), { expires: 1 })
        cookie.set("token", response.user.accessToken, { expires: 1 })
        router.push("/")
      }
      // console.log(response)
      // updateUserProfile({ displayName: values.name })
    }
    try {
    } catch (error) {
      console.log(error)
    }
  }
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
          let info = {
            id: doc.data().id,
            address: doc.data().address,
            fullName: doc.data().fullName,
            avatar: doc.data().avatar,
          }
          cookie.set("user_info", JSON.stringify(info), { expires: 1 })
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
                  <button type="submit" className="login-button mt-3 mb-2">
                    Đăng nhập
                  </button>
                  <h2 className="login-with-social-text">
                    <span>hoặc</span>
                  </h2>
                  <button
                    style={{ background: "rgb(220, 78, 65)" }}
                    onClick={() => LoginWithGoogle()}
                    type="button"
                    className="login-button"
                  >
                    Đăng nhập bằng Google
                  </button>
                  <button
                    style={{ background: "rgb(57, 87, 154)", border: "none" }}
                    onClick={() => LoginWithFacebook()}
                    type="button"
                    className="login-button mt-2"
                  >
                    Đăng nhập bằng Facebook
                  </button>
                  <div className="d-flex justify-content-center mt-3">
                    <span>Bạn chưa có tài khoản? </span>
                    <span
                      onClick={() => router.push("/register")}
                      className="pito-color font-weight-bold cursor-pointer ml-1"
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
