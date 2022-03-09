import React, { useState } from "react";
import Modal from "react-modal";
import { customStyles } from "../styles";
import { ModalContainer } from "../../../container/modal";

function ModalErrorInfo() {
  const modal = ModalContainer.useContainer();
  const data = modal.modalErrorInfo;
  const [isLoading, setIsLoading] = useState(false);
  function onSubmit() {
    if (isLoading) return;
    if (data.onSubmit) {
      setIsLoading(true);
      data.onSubmit(data.data);
      setIsLoading(false);
    }
  }

  function onCancel() {
    modal.handleModalErrorInfo({
      isShow: false,
      text: null,
      url: null,
      onAction: null,
      buttonText: null,
      onSubmit: null,
    });
  }

  return (
    <Modal
      isOpen={data ? data.isShow : false}
      onAfterOpen={() => {}}
      onRequestClose={() => {}}
      shouldFocusAfterRender={false}
      style={customStyles}
      contentLabel="Error Info Modal"
      // className={`info-error-modal`}
    >
      <React.Fragment>
        <div className="d-flex">
          <div className={``}>
            <img src={`/images/modal/question.svg`} width={`26`} />
          </div>
          <div className={`ml-3 bright-grey-color font-size-14px`}>
            <div className={`color-black font-weight-medium font-size-16px`}>
              {data && data.text && data.text.title}
            </div>
            <div className="mt-2 color-black">
              {data && data.text && data.text.description}
            </div>
          </div>
          <div style={{ width: "22px" }} />
        </div>
        <div className={`pito-modal-footer text-right mt-auto`}>
          <button
            type="button"
            onClick={data && (data.onCancel ? data.onCancel : onCancel)}
            className={`btn-modal btn-modal-secondary`}
          >
            {data && (data.buttonTextSecond ? data.buttonTextSecond : "Không")}
          </button>
          <button
            type="button"
            onClick={data && (data.onAction ? data.onAction : onSubmit)}
            className={`btn-modal btn-modal-primary ml-2`}
          >
            {data && (data.buttonText ? data.buttonText : "Đồng Ý")}
          </button>
        </div>
      </React.Fragment>
    </Modal>
  );
}

export default ModalErrorInfo;
