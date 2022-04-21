import { useRouter } from "next/router"
import React from "react"
import Modal from "react-modal"
import { ModalContainer } from "../../../container/modal"
import { formStyles } from "../styles"

function ModalForm() {
  const router = useRouter()
  const modal = ModalContainer.useContainer()
  const data = modal.modalForm
  function onSubmit() {
    if (data) {
      if (data.url) {
        router.push(data.url)
      } else {
        modal.handleModalForm({ isShow: false })
      }
    }
    return
  }

  function onCancel() {
    modal.handleModalForm({
      isShow: false,
      text: null,
      url: null,
      Form: null,
      onAction: null,
      buttonText: null,
      onSubmit: null,
    })
  }

  return (
    <Modal
      isOpen={data ? data.isShow : false}
      onAfterOpen={() => {}}
      onRequestClose={() => {}}
      style={{
        ...formStyles,
        content: {
          ...formStyles.content,
          width: data?.extendStyleWidth || formStyles.content.width,
          overflow: data?.extendOverflow || "auto",
        },
      }}
      contentLabel="Success Modal"
      ariaHideApp={false}
    >
      <React.Fragment>
        <div className={``}>
          <div className={`px-4 p-3`}>
            <span className={`color-black font-weight-bold font-size-16px`}>
              {data && data.text && data.text.title}
            </span>
            <span
              className={`float-right cursor-pointer`}
              onClick={() => {
                if (data?.onActionCancel) {
                  data.onActionCancel()
                } else {
                  onCancel()
                }
              }}
            >
              <img
                src="/images/modal/cross_close.svg"
                alt="Close icon"
                width="14"
                height="14"
              />
            </span>
          </div>

          <div className={`color-black font-size-14px`}>
            {data && data.Form}
          </div>
        </div>
      </React.Fragment>
    </Modal>
  )
}

export default ModalForm
