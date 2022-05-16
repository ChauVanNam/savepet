import { useRouter } from "next/router"
import React from "react"
import Modal from "react-modal"
import { customStyles } from "./styles"
const FollowModal = ({ isOpen, setIsOpen, data, title, deleteRecord }) => {
  const router = useRouter()
  return (
    <React.Fragment>
      <Modal style={customStyles} isOpen={isOpen}>
        <div
          style={{
            borderBottom: "1px solid #d9d9d9",
          }}
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
        <div
          style={{ overflow: "scroll", height: 300 }}
          className="mt-2 mod-scroll"
        >
          {data &&
            data.map((item) => (
              <div className="px-2 py-1">
                <div className="d-flex justify-content-between">
                  <div>
                    <img
                      className="cursor-pointer"
                      onClick={() => {
                        setIsOpen(false)
                        router.push(`/profile/${item?.id}`)
                      }}
                      style={{ width: 40, borderRadius: "50%", height: 40 }}
                      src={
                        item?.avatar ||
                        "https://start-up.vn/upload/photos/avatar.jpg"
                      }
                    />
                    <span className="ml-2">{item?.fullName}</span>
                  </div>
                  <button
                    onClick={() => deleteRecord(item)}
                    className="bg-white px-2 py-1 fo-12"
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: 4,
                      height: 30,
                      width: 80,
                    }}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
        </div>
      </Modal>
    </React.Fragment>
  )
}
export default FollowModal
