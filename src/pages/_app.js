import "../styles/argon/argon.min.css";
import "../styles/argon/animate.min.css";
import "../styles/base/base.scss";
import "../styles/button/button.scss";
import "../styles/fonts/fonts.css";
import "../styles/auth/login.scss";
import "../styles/pricing/pricing.scss";
import "../components/Login/styles.scss";
import { Fragment } from "react/cjs/react.production.min";
import Modal from "../small_components/Modal";
import { withModal } from "../container/modal";
function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Component {...pageProps} />
    </Fragment>
  );
}
export default MyApp;
