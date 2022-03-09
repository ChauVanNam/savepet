import React, { forwardRef } from "react"

const Body = forwardRef(
  (
    { children, customBtnBodyWrapperClassName, customBtnBodyClassName },
    ref
  ) => {
    return (
      <div
        className={[
          "modal-body-wrapper mod-scroll",
          customBtnBodyWrapperClassName,
        ].join(" ")}
        ref={ref}
      >
        <div className={["modal-body", customBtnBodyClassName].join(" ")}>
          {children}
        </div>
      </div>
    )
  }
)

export default Body
