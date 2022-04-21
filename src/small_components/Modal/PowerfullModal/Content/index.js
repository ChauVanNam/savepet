import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react"

import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock"

import Header from "../Header"
import Body from "../Body"
import Footer from "../Footer"

const ModalContent = ({
  isOpen,
  title,
  onClose,
  children,
  onCancel,
  onSubmit,
  footerReverseStyle,
  btnCancelText,
  btnSubmitText,
  customTitleClassName,
  customBtnSubmitClassName,
  customBtnCancelClassName,
  customFooterClassName,
  customBtnBodyWrapperClassName,
  customBtnBodyClassName,
  customBodyRefCurrent,
  isImage,
  customHeaderClassName,
}) => {
  const contentRef = useRef()
  const bodyRef = useRef()
  const footerRef = useRef()
  const headerRef = useRef()

  useEffect(() => {
    return () => {
      clearAllBodyScrollLocks()
    }
  }, [])

  // useEffect(() => {
  //   if (isOpen) {
  //     disableBodyScroll(contentRef.current)
  //   } else {
  //     enableBodyScroll(contentRef.current)
  //   }
  // }, [isOpen, contentRef])

  const handleInitialShadow = useCallback((body, footer, header) => {
    try {
      const { scrollHeight, scrollTop, clientHeight } = body

      if (scrollTop <= 1) {
        header.classList.remove("modal-header-shadow")
      } else {
        header.classList.add("modal-header-shadow")
      }

      const isHitBottom = scrollHeight - scrollTop <= clientHeight + 1

      if (isHitBottom) {
        footer.classList.remove("modal-footer-shadow")
      } else {
        footer.classList.add("modal-footer-shadow")
      }
    } catch {}
  }, [])

  const handleScroll = useCallback(
    (footer, header, isImage) => (event) => {
      try {
        const { target } = event
        const { scrollHeight, scrollTop, clientHeight } = target

        if (scrollTop <= 1) {
          header.classList.remove("modal-header-shadow")
        } else {
          header.classList.add("modal-header-shadow")
        }

        const isHitBottom = scrollHeight - scrollTop <= clientHeight + 1

        if (isHitBottom) {
          footer.classList.remove("modal-footer-shadow")
        } else {
          footer.classList.add("modal-footer-shadow")
        }

        if (isImage == "image") {
          if (scrollTop > 250) {
            header.classList.add("modal-header-show")
          } else {
            header.classList.remove("modal-header-show")
          }
        }

        if (isImage == "no-image") {
          if (scrollTop > 30) {
            header.classList.add("modal-header-show")
          } else {
            header.classList.remove("modal-header-show")
          }
        }
      } catch {}
    },
    []
  )
  useLayoutEffect(() => {
    if (bodyRef.current && footerRef.current && headerRef.current) {
      const elemnt = customBodyRefCurrent || bodyRef.current
      handleInitialShadow(elemnt, footerRef.current, headerRef.current)
    }
  }, [customBodyRefCurrent, handleInitialShadow, bodyRef, footerRef, headerRef])

  useLayoutEffect(() => {
    if (bodyRef.current && footerRef.current && headerRef.current) {
      const elemnt = customBodyRefCurrent || bodyRef.current
      const resizeObserver = new ResizeObserver((entries) => {
        handleInitialShadow(elemnt, footerRef.current, headerRef.current)
      })

      const contentElement = elemnt.querySelector(".modal-body")

      if (!contentElement) return

      resizeObserver.observe(contentElement)
      return () => {
        resizeObserver.disconnect(contentElement)
      }
    }
  }, [customBodyRefCurrent, handleInitialShadow, bodyRef, footerRef, headerRef])

  useLayoutEffect(() => {
    if (bodyRef.current && footerRef.current && headerRef.current) {
      const elemnt = customBodyRefCurrent || bodyRef.current

      elemnt.addEventListener(
        "scroll",
        handleScroll(footerRef.current, headerRef.current, isImage)
      )
      return () => {
        elemnt.removeEventListener(
          "scroll",
          handleScroll(footerRef.current, headerRef.current, isImage)
        )
      }
    }
  }, [
    customBodyRefCurrent,
    bodyRef,
    handleScroll,
    footerRef,
    headerRef,
    isImage,
  ])

  return (
    <div ref={contentRef} className="d-flex flex-column overflow-hidden">
      <Header
        ref={headerRef}
        title={title}
        onClose={onClose}
        customHeaderClassName={customHeaderClassName}
        customTitleClassName={customTitleClassName}
      />
      <Body
        ref={bodyRef}
        customBtnBodyWrapperClassName={customBtnBodyWrapperClassName}
        customBtnBodyClassName={customBtnBodyClassName}
      >
        {children}
      </Body>
      <Footer
        ref={footerRef}
        onCancel={onCancel}
        onSubmit={onSubmit}
        footerReverseStyle={footerReverseStyle}
        btnCancelText={btnCancelText}
        btnSubmitText={btnSubmitText}
        customBtnSubmitClassName={customBtnSubmitClassName}
        customBtnCancelClassName={customBtnCancelClassName}
        customFooterClassName={customFooterClassName}
      />
    </div>
  )
}

export default ModalContent
