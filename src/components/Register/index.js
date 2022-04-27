import { createUserWithEmailAndPassword } from "firebase/auth"
import { Field, Form, Formik } from "formik"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Loader from "react-loader-spinner"
import LoadingOverlay from "react-loading-overlay"
import * as Yup from "yup"
import { auth } from "../../../firebase.config"
import { ModalContainer } from "../../container/modal"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import ErrorMessage from "../../small_components/ErrorMessage"
import { isLoggedIn } from "../../util/auth"
import { db } from "../../../firebase.config"
import { getAuth, updateProfile } from "firebase/auth"
import DatePicker from "react-datepicker"
import Select from "react-select"

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Vui lòng nhập đúng định dạng Email.")
    .required("Vui lòng nhập Email."),
  // password: Yup.string()
  //   .required("Vui lòng nhập mật khẩu.")
  //   .min(
  //     8,
  //     "Mật khẩu phải từ 8-16 kí tự, bao gồm chữ cái in hoa, chữ cái in thường, ký tự đặc biệt và con số."
  //   )
  //   .matches(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])/,
  //     "Mật khẩu phải từ 8-16 kí tự, bao gồm chữ cái in hoa, chữ cái in thường, ký tự đặc biệt và con số."
  //   ),
  password2: Yup.string()
    .required("Vui lòng nhập mật khẩu xác nhận.")
    .oneOf([Yup.ref("password"), null], "Mật khẩu không trùng khớp."),
})

const RegisterPage = () => {
  const Modal = ModalContainer.useContainer()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // const auth = getAuth()
  const genderOption = [
    {
      label: "Nam",
      value: 1,
    },
    {
      label: "Nữ",
      value: 0,
    },
    {
      label: "Không xác định",
      value: 2,
    },
  ]
  const updateUserProfile = async (params) => {
    try {
      await updateProfile(auth.currentUser, params)
    } catch (error) {
      console.error(error)
    }
  }
  const [user, setState] = useState()
  const register = async (values) => {
    setIsLoading(true)
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      // const auth = getAuth()
      if (response) {
        setState(response)
        addDoc(collection(db, "users"), {
          id: response.user.uid,
          fullName: values.name,
          phone: values.phone,
          birthday: values.birthday,
          is_active: true,
          role: "USER",
          avatar: "https://start-up.vn/upload/photos/avatar.jpg",
          gender: values.gender,
          background:
            "https://itsfoss.com/wp-content/uploads/2016/12/ubuntu-1704-wallpaper-default.jpg",
          address: values.address,
        })
        // console.log(response)
        // updateUserProfile({ displayName: values.name })
      }
      router.push("/login")
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      // console.log(error.message)
      Modal.handleModalError({
        text: {
          title: "Có lỗi xảy ra!",
          description: "Vui lòng kiểm tra lại mạng",
        },
        isShow: true,
      })
    }
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
              validationSchema={RegisterSchema}
              initialValues={{
                email: "",
                password: "",
                password2: "",
                phone: "",
                name: "",
                birthday: new Date(),
                address: "",
                gender: 1,
              }}
              onSubmit={register}
            >
              {({ values, errors, setFieldValue }) => (
                <Form>
                  <h1 className="text-center text-dark font-weight-bold">
                    Đăng Ký
                  </h1>
                  <Field
                    name="name"
                    placeholder="Họ và Tên"
                    className="form-control login-input"
                  />
                  <ErrorMessage name="name" />
                  <Field
                    name="address"
                    placeholder="Địa chỉ"
                    className="form-control login-input"
                  />
                  <Field
                    name="email"
                    placeholder="Email"
                    className="form-control login-input"
                  />
                  <ErrorMessage name="email" />
                  <Select
                    defaultValue={genderOption[0]}
                    onChange={(data) => setFieldValue("gender", data.value)}
                    className="p-0 login-input"
                    options={genderOption}
                  />
                  <DatePicker
                    name="birthday"
                    selected={values.birthday}
                    onChange={(date) => setFieldValue("birthday", date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control login-input"
                    popperPlacement="bottom"
                    placeholderText="Ngày sinh"
                  />
                  <Field
                    name="phone"
                    placeholder="Số điện thoại"
                    className="form-control login-input"
                  />
                  <Field
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    className="form-control login-input"
                  />
                  <ErrorMessage name="password" />
                  <Field
                    type="password"
                    name="password2"
                    placeholder="Nhập lại mật khẩu"
                    className="form-control login-input"
                  />
                  <ErrorMessage name="password2" />

                  <button type="submit" className="login-button mt-3">
                    Đăng ký
                  </button>
                  <div className="d-flex justify-content-center mt-3">
                    <span>Bạn đã có tài khoản? </span>
                    <span
                      onClick={() => router.push("/login")}
                      className="pito-color font-weight-bold cursor-pointer"
                    >
                      Đăng nhập
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

export default RegisterPage
