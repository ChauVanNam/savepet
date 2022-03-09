import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { isLoggedIn } from "../util/auth";
import Layout from "../components/Layout";

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if(!isLoggedIn()) {
      router.push('/login')
    }
  })
  return (
    <Layout>
      abc
    </Layout>
  );
}