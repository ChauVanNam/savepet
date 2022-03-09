import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { withModal } from "../../container/modal";
import Modal from "../../small_components/Modal";
// import SEOHead from "../Layout/SEOHead"

const Layout = ({ children, title }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  //   const checkLoggedIn = () => {
  //     const flag = isLoggedIn();
  //     if (flag) router.push("/");
  //     setIsLoading(false);
  //   };

  //   useEffect(() => {
  //     checkLoggedIn();
  //   }, []);

  return (
    <React.Fragment>
      {/* <SEOHead title={title} /> */}

      {/* <div style={{ backgroundColor: "#F0F2F5", minHeight: "100vh" }}>
      </div> */}
      <main>{children}</main>
      <Modal />
    </React.Fragment>
  );
};

export default withModal(Layout);
