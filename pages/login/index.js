import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Link,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import Cookie from "js-cookie";
import config from "../../next.config";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
const axiosApiCall = (url, method, body = {}) =>
  axios({
    method,
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
    data: body,
  });

export default function Login() {
  const router = useRouter();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [forms, setForms] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const access_token = Cookie.get("accesstoken");
  console.log("access token ", access_token);
  if (access_token !== undefined) {
    router.push("/");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

    let check = validate(data.get("email"), data.get("password"));

    const postData = {
      email:data.get("email"),
      password:data.get("password"),
    }

    if (check === true) {
      axiosApiCall("auth/system-admin-login", "post", postData )
        .then((res) => {
          let data = res.data;
          if (data.access_token) {
            Cookie.set("user", JSON.stringify(res.data.user));
            Cookie.set("accesstoken", res.data.access_token);

            console.log(res.data.access_token);

            console.log("prepath: " + Cookie.get("prePath"));
            router.push("/admin");
          }else{
            setError("Sai tên đăng nhập hoặc mật khẩu");
          }
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    }
  };



  const validate = (v_email, v_password) => {
    let error_email = "";
    let error_password = "";

    if (!/$^|.+@.+..+/.test(v_email) || v_email == "") {
      error_email = "Wrong email format";
    }

    if (v_password.length < 6 || v_password.length > 10) {
      error_password = "Name should be 6 to 10 characters.";
    }

    setErrors({
      email: error_email,
      password: error_password,
    });

    if (error_email != "" || error_password != "") {
      return false;
    } else {
      return true;
    }
  };
  const paperStyle = {
    padding: 20,
    width: 350,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btnstyle = { margin: "8px 0" };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>{" "}
          <h2> Sign In </h2>{" "}
        </Grid>
        <Grid align="center">
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              defaultValue={forms.email}
              error={errors.email != ""}
              helperText={errors.email != "" ? errors.email : " "}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              defaultValue={forms.password}
              error={errors.password != ""}
              helperText={errors.password != "" ? errors.password : " "}
            />
            {error != "" && (
              <Alert sx={{ mb: 2 }} severity="error">
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login in
            </Button>

            <Grid
              sx={{ mt: 2 }}
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
            </Grid>
          </Box>
        </Grid>
      </Paper>{" "}
    </Grid>
  );
}
