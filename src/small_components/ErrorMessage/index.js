import { ErrorMessage as Message } from "formik"
import React from "react"

const ErrorMessage = ({ name = "" }) => {
  return (
    <Message name={name} render={(msg) => <p className={`error`}>{msg}</p>} />
  )
}

export default ErrorMessage
export { ErrorMessage }
