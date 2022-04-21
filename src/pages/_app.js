import "../styles/argon/argon.min.css"
import "../styles/argon/animate.min.css"
import "../styles/base/base.scss"
import "../styles/button/button.scss"
import "../styles/fonts/fonts.css"
import "../styles/auth/login.scss"
import "../small_components/Modal/PowerfullModal/styles.scss"
import "../styles/pricing/pricing.scss"
import "../components/Login/styles.scss"
import "../components/Profile/styles.scss"
import "../components/Layout/Header/styles.scss"
import "./styles.scss"
import "../components/Layout/styles.scss"
import "../components/Posts/Comment/styles.scss"
import "../components/CreatePost/styles.scss"
import "react-datepicker/dist/react-datepicker.css"

import { Fragment } from "react/cjs/react.production.min"
function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Component {...pageProps} />
    </Fragment>
  )
}
export default MyApp
