import { Formik, Form, Field } from "formik"
import { useRouter } from "next/router"
import React from "react"
import Modal from "react-modal"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebase.config"
import { customStyles } from "./styles"
const EditAccountModal = ({ isOpen, setIsOpen, data, title, getUserInfo }) => {
  const onSubmit = async (values) => {
    try {
      const washingtonRef = doc(db, "users", data.document_id)
      await updateDoc(washingtonRef, {
        ...data,
        fullName: values?.fullName || "",
        address: values?.address || "",
        phone: values?.phone || "",
      })
      getUserInfo()
      setIsOpen(false)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <React.Fragment>
      <Modal style={customStyles} isOpen={isOpen}>
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            fullName: data.fullName || "",
            address: data.address || "",
            phone: data.phone || "",
          }}
        >
          {({ values }) => (
            <Form>
              <div
                style={{ borderBottom: "1px solid #d9d9d9" }}
                className="py-2 position-relative"
              >
                <h2
                  style={{ color: "#262626" }}
                  className="font-weight-bold text-center mb-0"
                >
                  {title}
                </h2>
                <svg
                  style={{
                    right: 0,
                    bottom: 5,
                    transform: "translate(-50%, -50%)",
                    position: "absolute",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  class="_8-yf5 "
                  color="#262626"
                  fill="#262626"
                  height="18"
                  role="img"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <polyline
                    fill="none"
                    points="20.643 3.357 12 12 3.353 20.647"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                  ></polyline>
                  <line
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    x1="20.649"
                    x2="3.354"
                    y1="20.649"
                    y2="3.354"
                  ></line>
                </svg>
              </div>
              <div className="mt-2 px-3 create-post">
                <div>
                  <label
                    className="font-weight-bold fo-14 mb-1"
                    style={{ fontFamily: "GoogleSans-Medium" }}
                  >
                    Họ và Tên:
                  </label>
                  <Field className="form-control" name="fullName" />
                </div>
                <div className="mt-2">
                  <label
                    className="font-weight-bold fo-14 mb-1"
                    style={{ fontFamily: "GoogleSans-Medium" }}
                  >
                    Số điện thoại:
                  </label>
                  <Field className="form-control" name="phone" />
                </div>
                <div className="mt-2">
                  <label
                    className="font-weight-bold fo-14 mb-1"
                    style={{ fontFamily: "GoogleSans-Medium" }}
                  >
                    Địa chỉ:
                  </label>
                  <Field className="form-control" name="address" />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-end p-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="ju-al-center button_cancle_modal "
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="ju-al-center button_save_modal ml-3"
                >
                  Lưu
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </React.Fragment>
  )
}
export default EditAccountModal
