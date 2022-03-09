import React from "react";
import SuccessModal from "./Success";
import ErrorModal from "./Error";
import ErrorInfoModal from "./ErrorInfo";
import FormModal from "./Form";
export default function Modal() {
  return (
    <React.Fragment>
      <FormModal />
      <SuccessModal />
      <ErrorModal />
      <ErrorInfoModal />
    </React.Fragment>
  );
}
