export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    width: "450px",
    zIndex: "9999",
    minHeight: "192px",
    display: "flex",
    flexFlow: "column",
    padding: "25px 15px 20px 35px",
  },
  overlay: {
    zIndex: "9999",
  },
}

export const formStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    // https://stackoverflow.com/questions/27385126/chrome-font-appears-blurry
    transform: "translateX(-50%) translateY(calc(-50% - .5px))",
    background: "#fff",
    width: "450px",
    maxHeight: "90vh",
    padding: 0,
  },
}
