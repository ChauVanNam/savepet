import React, { forwardRef } from "react"

const Footer = forwardRef(
  (
    {
      onCancel,
      onSubmit,
      btnCancelText,
      btnSubmitText,
      customBtnCancelClassName,
      customBtnSubmitClassName,
      customFooterClassName,
    },
    ref
  ) => {
    return (
      <div
        className={["modal-footer", customFooterClassName].join(" ")}
        ref={ref}
      >
        {onCancel !== null && (
          <button
            className={[
              "ju-al-center button_cancle_modal",
              customBtnCancelClassName,
            ].join(" ")}
            data-dismiss="modal"
            onClick={onCancel}
            type="button"
          >
            {btnCancelText || "Hủy"}
          </button>
        )}

        {onSubmit !== null && (
          <button
            className={[
              "ju-al-center button_save_modal",
              customBtnSubmitClassName,
            ].join(" ")}
            onClick={onSubmit}
            type="button"
          >
            {btnSubmitText || "Đồng ý"}
          </button>
        )}
      </div>
    )
  }
)

export default Footer
