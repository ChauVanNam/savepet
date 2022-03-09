import React from "react"

function PreviewModalFile({
  data,
  urlIdx,
  setUrlIdx,
  isModalOpen,
  setIsModalOpen,
}) {
  return (
    <div
      className={
        "my-modal-overlay-v2 my-modal-image-menu-v2 " +
        (isModalOpen ? "" : "d-none")
      }
    >
      <div className="my-modal-container-v2 d-flex align-items-center justify-content-center">
        <button
          className="btn-none d-none d-sm-inline-block my-modal-nav-btn nav-btn-left"
          type="button"
          onClick={() =>
            setUrlIdx(
              preState =>
                (preState - 1 + data?.images?.length) %
                Math.min(data?.images?.length, 5)
            )
          }
        >
          <img src="/images/icon/icon-nav-left.svg" alt="<" />
        </button>

        <div className="my-modal-content-v2 px-0 mx-0 m-sm-5 p-sm-5">
          <div className="modal-close-btn-v2">
            <button
              className={"btn-none"}
              type="button"
              onClick={() => {
                setIsModalOpen(false)
              }}
            >
              <img src={"/images/icon/icon-close-white.svg"} alt="X" />
            </button>
          </div>
          <div className="my-modal-wrapper-img-v2">
            <img src={data?.images[urlIdx]?.url} alt="Food image" />
          </div>
        </div>

        <button
          className="btn-none d-none d-sm-inline-block my-modal-nav-btn nav-btn-right"
          type="button"
          onClick={() =>
            setUrlIdx(
              preState => (preState + 1) % Math.min(data?.images?.length, 5)
            )
          }
        >
          <img src="/images/icon/icon-nav-right.svg" alt=">" />
        </button>
      </div>
    </div>
  )
}
export default PreviewModalFile
