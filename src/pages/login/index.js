import React, { useEffect, useState } from "react";
import cookie from "js-cookie";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../../../firebase.config";
import { useRouter } from "next/router";
import Layout from "../../components/Login/layout";
import LoginPage from "../../components/Login";

export default function Login() {
  const router = useRouter();
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({});

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  //   useEffect(() => {
  //     if(isLoggedIn()) {
  //       router.push('/')
  //     }
  //   })

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  });

  return (
    <Layout>
      <LoginPage />
    </Layout>

    // <div className="App">
    //   <div>
    //     <h3> Register User </h3>
    //     <input
    //       placeholder="Email..."
    //       onChange={(event) => {
    //         setRegisterEmail(event.target.value);
    //       }}
    //     />
    //     <input
    //       placeholder="Password..."
    //       onChange={(event) => {
    //         setRegisterPassword(event.target.value);
    //       }}
    //     />

    //     <button onClick={register}> Create User</button>
    //   </div>

    //   <div>
    //     <h3> Login </h3>
    //     <input
    //       placeholder="Email..."
    //       onChange={(event) => {
    //         setLoginEmail(event.target.value);
    //       }}
    //     />
    //     <input
    //       placeholder="Password..."
    //       onChange={(event) => {
    //         setLoginPassword(event.target.value);
    //       }}
    //     />

    //     <button onClick={login}> Login</button>
    //   </div>

    //   <h4> User Logged In: </h4>
    //   {user?.email}

    //   <button onClick={logout}> Sign Out </button>
    // </div>
  );
}
