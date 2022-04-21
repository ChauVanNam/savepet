import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
// import { deleteImages, uploadImages } from "../../services/api/food"
import { uniqueId } from "lodash"
function DragDropImage({
  setSubmitting,
  partner_id,
  fileData,
  setFieldValue,
  index,
  classValues,
  disabled,
  name,
}) {
  const upLoadImage = async (params) => {
    try {
      const response = await uploadImages(params)
      return response.data.data
    } catch (error) {
      console.error()
      return { status: "error", _order: params._order }
    }
  }

  const _onRemoveImage = (id) => {
    try {
      let _fileData = [...fileData]
      const index = _fileData.findIndex((item) => item.response.id === id)
      _fileData.splice(index, 1)
      setFieldValue("fileData", _fileData)
    } catch (e) {
      console.log(e)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: (acceptedFiles) => {
      setSubmitting(true)
      let files = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
      let _fileData = [...fileData]
      files.map((file, index) => {
        if (fileData.length + index >= 5) return
        else {
          _fileData.push({
            file: [],
            base64: null,
            response: {
              _order: _fileData.length,
              id: uniqueId(),
            },
          })
          setFieldValue(name, _fileData)
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = async () => {
            try {
              const params = {
                partner_id: partner_id,
                image: reader.result,
                _order: fileData.length + index,
              }
              const response = await upLoadImage(params)
              setTimeout(() => {
                _fileData[fileData.length + index].response = response
                setFieldValue(name, _fileData)
              }, 1500)
            } catch (error) {
              setTimeout(() => {
                _fileData[fileData.length + index].response = {
                  status: "error",
                  _order: fileData.length + index,
                }
                setFieldValue(name, _fileData)
              }, 1500)
            }
          }
        }
      })
    },
  })
  return (
    <React.Fragment>
      {disabled ? (
        <div className={`bg-secondary ` + classValues}></div>
      ) : (
        <div className="d-flex">
          {fileData.map((image, index) => (
            <div
              key={image?.response?.id}
              className={`${index >= 5 && "d-none"}`}
            >
              {image?.response?.url ? (
                <div className="border-upload-image-buffet">
                  <div className={`max-height-food `}>
                    <img
                      src={image.response.url}
                      style={{
                        height: 120,
                        width: 120,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                      className={
                        index == 0 ? `img-fluid max-height-food ` : `img-fluid`
                      }
                    />
                  </div>
                  <div
                    className={
                      index == 0
                        ? `border-upload-image-buffet-remove-icon`
                        : `border-upload-image-buffet-remove-icon-small-food`
                    }
                  >
                    <img
                      onClick={() => _onRemoveImage(image.response.id)}
                      width={16}
                      src={`/images/icon/remove_image_buffet_ic.svg`}
                      className={`cursor-pointer`}
                    />
                  </div>
                </div>
              ) : (
                <div className={`border-upload-image-buffet`}>
                  {image.response?.status === "error" ? (
                    <>
                      <div className="uploading-error">
                        <img
                          src="/images/icon/upload_image_fail.svg"
                          alt="upload_fail"
                        />
                        <p className="m-0">Lỗi</p>
                      </div>
                      <div
                        className={
                          index == 0
                            ? `border-upload-image-buffet-remove-icon`
                            : `border-upload-image-buffet-remove-icon-small-food`
                        }
                      >
                        <img
                          onClick={() => _onRemoveImage(image.response.id)}
                          width={16}
                          src={`/images/icon/remove_image_buffet_ic.svg`}
                          className={`cursor-pointer`}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="border-upload-image-default">
                      <div className="uploading-container">
                        <span>Đang tải lên</span>
                        <div className="uploading-image" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {fileData.length < 5 && (
            <>
              <div {...getRootProps()} className="border-upload-image-buffet">
                <div className={index != 0 ? `` : `max-height-food`}></div>
                <div className="border-upload-image-default">
                  <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                    <img src="/images/icon/paper_upload.svg" />
                    <span>Tải Lên</span>
                  </div>
                </div>
              </div>
              <input {...getInputProps()} />
            </>
          )}
        </div>
      )}
    </React.Fragment>
  )
}
export default DragDropImage
