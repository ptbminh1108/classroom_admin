import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import TopBar from "../components/topbar/topBar";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import {  useLayoutEffect } from "react";


import { checkaccessToken } from "../services/user.service";
export default function Home() {
  const router = useRouter();

  const user = {};
  if (Cookie.get("user") != undefined) {
    user = JSON.parse(Cookie.get("user"));
    console.log("user");
    console.log(user);
  }
 

  // const isLogin = checkaccessToken();
  useLayoutEffect(() => {

    Cookie.set("prePath", "/classroom");

    if (!Cookie.get("accesstoken")) {
      router.push("/login");
    }
  }, []);

  return (
    <div className={styles.container}>
      <TopBar></TopBar>

    </div>
  );
}
