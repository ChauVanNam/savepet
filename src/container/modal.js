import { useState } from "react"
import { createContainer } from "unstated-next"

export const Container = () => {
  const _defaultValue = {
    isShow: false,
    text: null,
    url: null,
    onAction: null,
    buttonText: null,
    onSubmit: null,
  }
  const [modalSuccess, setModalSuccess] = useState(_defaultValue)
  const [modalError, setModalError] = useState(_defaultValue)
  const [modalErrorInfo, setModalErrorInfo] = useState(_defaultValue)
  const [modalForm, setModalForm] = useState(_defaultValue)

  function handleModalSuccess(_modalSuccess) {
    setModalSuccess(_modalSuccess)
  }

  function handleModalError(_modalError) {
    setModalError(_modalError)
  }

  function handleModalErrorInfo(_modalErrorInfo) {
    setModalErrorInfo(_modalErrorInfo)
  }

  function handleModalForm(_modalForm) {
    setModalForm(_modalForm)
  }

  return {
    modalSuccess,
    modalError,
    modalErrorInfo,
    modalForm,
    setModalSuccess,
    setModalError,
    setModalErrorInfo,
    setModalForm,
    handleModalSuccess,
    handleModalError,
    handleModalErrorInfo,
    handleModalForm,
  }
}

// Create context

export const ModalContainer = createContainer(Container)
// Provider wrapper
const withModal = (Page) => {
  const ProviderWrapper = (props) => (
    <ModalContainer.Provider>
      <Page {...props} />
    </ModalContainer.Provider>
  )

  return ProviderWrapper
}
// Consumer hooks
const useModal = () => {
  const modal = ModalContainer.useContainer()
  return modal
}
// export
export { withModal }
export default useModal
