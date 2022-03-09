import { useRouter } from "next/router";
import React from "react";
import Modal from "react-modal";
import { customStyles } from "../styles";
import { ModalContainer } from "../../../container/modal";

function ModalSuccess() {
  const router = useRouter();
  const modal = ModalContainer.useContainer();
  const data = modal.modalSuccess;
  function onSubmit() {
    if (data) {
      if (data.url) {
        router.push(data.url);
      }
      modal.handleModalSuccess({ isShow: false });
    }
    return;
  }

  return (
    <Modal
      isOpen={data ? data.isShow : false}
      onAfterOpen={() => {}}
      onRequestClose={() => {}}
      style={customStyles}
      contentLabel="Success Modal"
    >
      <React.Fragment>
        <div className="d-flex">
          <div className={``}>
            <img src={`/images/modal/tick_success.svg`} width={`22`} />
          </div>
          <div className={`ml-3 bright-grey-color font-size-14px`}>
            <div className={`color-black font-weight-medium font-size-16px`}>
              {data && data.text && data.text.title}
            </div>
            <div className="mt-2">
              {data && data.text && data.text.description}
            </div>
          </div>
          <div style={{ width: "22px" }} />
        </div>
        <div className={`pito-modal-footer text-right mt-auto`}>
          {data?.buttonTextSecond && data?.onActionSecond && (
            <button
              type="button"
              onClick={data?.onActionSecond}
              className={`btn-modal btn-modal-secondary`}
            >
              {data?.buttonTextSecond}
            </button>
          )}

          <button
            onClick={data && (data.onAction ? data.onAction : onSubmit)}
            className={`btn-modal btn-modal-primary ml-2`}
          >
            {data && (data.buttonText ? data.buttonText : "Hoàn Tất")}
          </button>
        </div>
      </React.Fragment>
    </Modal>
  );
}

export default ModalSuccess;
