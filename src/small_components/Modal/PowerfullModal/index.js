import React from "react"
import ReactModal from "react-modal"
import ModalContent from "./Content"

ReactModal.setAppElement("#__next")

const PowerfullModal = ({
  isOpen,
  sizeModal = "sm",
  title,
  onClose,
  children,
  onCancel,
  onSubmit,
  footerReverseStyle,
  btnCancelText,
  btnSubmitText,
  customClassName,
  customTitleClassName,
  customFooterClassName,
  customBtnSubmitClassName,
  customBtnCancelClassName,
  customBtnBodyWrapperClassName,
  customBtnBodyClassName,
  customBodyRefCurrent,
  customOverlayClassName,
  isImage,
  customHeaderClassName,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Modal popup"
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => {
        onClose()
      }}
      className={
        "pito-modal " + `pito-modal--${sizeModal}` + ` ${customClassName}`
      }
      overlayClassName={"pito-modal__overlay " + customOverlayClassName}
      shouldCloseOnEsc
    >
      <ModalContent
        {...{
          isOpen,
          title,
          onClose,
          children,
          onCancel,
          onSubmit,
          footerReverseStyle,
          btnCancelText,
          btnSubmitText,
          customTitleClassName,
          customFooterClassName,
          customBtnSubmitClassName,
          customBtnCancelClassName,
          customBtnBodyWrapperClassName,
          customBtnBodyClassName,
          customBodyRefCurrent,
          isImage,
          customHeaderClassName,
        }}
      />
    </ReactModal>
  )
}

export default PowerfullModal
