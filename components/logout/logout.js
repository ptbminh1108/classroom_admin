import * as React from "react";

import Button from "@mui/material/Button";
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { useRouter } from "next/router";
import Cookie from "js-cookie";


const axiosApiCall = (url, method, body , headers = {}) =>
  axios({
    method,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
    data: body,
    headers : headers,
  });

export default function Logout() {
  const router = useRouter();

  const handleLogout = () => {

    const access_token = Cookie.get("asm_accesstoken");
    const headers = {authorization : `bearer ${access_token}`}
    console.log(access_token);
    axiosApiCall("auth/logout", "get", { access_token } , headers ).then((res) => {
      console.log("send logout request");
    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });

    // remove asm_accesstoken
    Cookie.remove("asm_accesstoken");
    Cookie.remove("user");
    router.push("/login");
  };

  return (
    <Button onClick={handleLogout} variant="outlined" startIcon={<LogoutIcon />}>
    </Button>
  );
}
