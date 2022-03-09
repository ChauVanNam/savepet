import React, { forwardRef } from "react"

const Header = forwardRef(
  ({ title, onClose, customTitleClassName, customHeaderClassName }, ref) => {
    return (
      <div
        className={["modal-header border-0", customHeaderClassName].join(" ")}
        ref={ref}
      >
        <div
          className={[
            "modal-title title-underline mb-20",
            customTitleClassName,
          ].join(" ")}
        >
          {title}
        </div>

        <button
          type="button"
          className="modal-btn-close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => {
            if (onClose !== null) onClose()
          }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }
)

export default Header
