import React, { useState, useEffect, useLayoutEffect } from "react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {
    Grid,
    Paper,
    Avatar,
    TextField,
    Button,
    Alert,
    Box,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    List,
} from "@mui/material";

import styles from "../../styles/Home.module.css";
import Layout from "../../components/layout";


import TopBar from "../../components/topbar/topBar";
import { useRouter } from "next/router";



import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Cookie from "js-cookie";
import axios from "axios";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const axiosApiCall = (url, method, headers = {}, data) =>
    axios({
        method,
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
        data: data,
        headers: headers,
    });

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}
const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];


export default function Admin() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);


    const [listadmin, setListadmin] = useState([]);
    const [listadminstore, setListadminstore] = useState([]);

    const [sortdate, setSortdate] = useState("ASC");
    const [filtername, setFiltername] = useState("");
    const [filteremail, setFilteremail] = useState("");

    const [user, setUser] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        rePassword: "",
    });

    const [forms, setForms] = useState({
        name: "",
        email: "",
        password: "",
        rePassword: "",
    });

    useLayoutEffect(() => {

        Cookie.set("prePath", "/classroom");
        if (!Cookie.get("asm_accesstoken")) {
            router.push("/login");
        } else {

            setUser(JSON.parse(Cookie.get("user")));

            const access_token = "Bearer " + Cookie.get("asm_accesstoken");
            const headers = { authorization: access_token };

            axiosApiCall("system-admin/view-admin-list", "get", headers, {})
                .then((res) => {
                    // console.log(res);
                    if (res.data) {
                        setListadmin(res.data);
                        setListadminstore(res.data);
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                });
        }
    }, [setListadmin, setListadminstore]);

    const onChangeEmailHandle = (e) => {
        setFilteremail(e.target.value);
        updateFileFilter(sortdate,filtername,e.target.value);


    }

    const onChangeNameHandle = (e) => {
        setFiltername(e.target.value);
        updateFileFilter(sortdate,e.target.value,filteremail);


    }
    const onChangeSortDate = (event) => {
        setSortdate(event.target.value);
        updateFileFilter(event.target.value,filtername,filteremail);
    }

    const updateFileFilter = (m_sort,m_filter_name,m_filter_email) => {
      

        let listadmin_arr = [];
        listadminstore.map(function (admin_m) {

            if (admin_m.name.includes(m_filter_name) && admin_m.email.includes(m_filter_email)) {
                if (m_sort == "ASC") {
                    listadmin_arr.push(admin_m);
                }

                if (m_sort == "DESC") {
                    listadmin_arr.unshift(admin_m);
                }
                console.log(sortdate, filtername, filteremail);

            }
        })

        setListadmin(listadmin_arr);

    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console

        let check = validate(data.get("email"), data.get("password"), data.get("re-password"));


        const postData = {
            email: data.get("email"),
            name: data.get("name"),
            password: data.get("password"),
        }

        if (check === true) {
            const access_token = "Bearer " + Cookie.get("asm_accesstoken");
            const headers = { authorization: access_token };

            axiosApiCall("system-admin/register", "post", headers, postData)
                .then((res) => {
                    let data = res.data;
                    console.log(data);
                    if (data.resValue) {

                        const n_admin = data.resValue.new_system_admin;
                        let m_listadmin = listadmin;

                        let new_admin = {
                            createdTime: n_admin.createdTime,
                            email: n_admin.email,
                            name: n_admin.name,
                            _id: n_admin._id,
                        }
                        console.log("newadmin", new_admin);
                        m_listadmin.push(new_admin);

                        setListadmin(m_listadmin);
                        setListadminstore(m_listadmin);

                        setOpen(false);
                    }

                    if (res.data === "Email da ton tai roi") {
                        setError("Email is already registered");
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


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const validate = (v_email, v_password, v_repassword) => {

        let error_email = "";
        let error_password = "";
        let error_repassword = "";



        if (!(/$^|.+@.+..+/).test(v_email) || v_email == "") {
            error_email = "Wrong email format"
        }
        if (v_password.length < 6 || v_password.length > 10) {
            error_password = "Name should be 6 to 10 characters."
        }
        if (v_password != v_repassword) {
            error_repassword = "Password and rePassword are not same."
        }



        setErrors({
            email: error_email,
            password: error_password,
            rePassword: error_repassword,
        })

        if (error_email != "" || error_password != "" || error_repassword != "") {
            return false;
        } else {
            return true;
        }

    }
    return (
        <Layout>
            <>
                <div className={styles.container}>
                    <TopBar ></TopBar>
                    <Grid container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center">
                        <h2>ADMIN MANAGEMENT</h2>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><h2>Email</h2></TableCell>
                                            <TableCell align="center"><h2>Name</h2></TableCell>
                                            <TableCell align="center"><h2>Date create</h2></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listadmin.map((row) => (
                                            <TableRow
                                                key={row._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    {row.email}
                                                </TableCell>
                                                <TableCell align="center">{row.name}</TableCell>
                                                <TableCell align="center">{row.createdTime}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={4} sx={{ pl: 10, pr: 10 }}>
                            <h2>Filter</h2>
                            

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="sort_email"
                                    label="Email"
                                    name="sort_email"
                                    autoComplete="email"
                                    autoFocus
                                    defaultValue={forms.email}
                                    onChange={onChangeEmailHandle}

                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="sort_email"
                                    label="Name"
                                    name="sort_name"
                                    autoComplete="name"
                                    autoFocus
                                    onChange={onChangeNameHandle}
                                />
                                <FormControl sx={{ mb: 4, mt: 4, minWidth: 400 }}>
                                    <InputLabel id="demo-simple-select-label">Date create</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={sortdate}
                                        label="Date create"
                                        onChange={onChangeSortDate}
                                    >
                                        <MenuItem value="ASC">ASC</MenuItem>
                                        <MenuItem value="DESC">DESC</MenuItem>
                                    </Select>
                                </FormControl>
                            <Button variant="contained" onClick={handleClickOpen}>
                                Create New Admin
                            </Button>
                        </Grid>
                    </Grid>

                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Create New Admin</DialogTitle>
                        <DialogContent>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

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
                                    helperText={errors.email != "" ? errors.email : ' '}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="name"
                                    label="Name"
                                    id="name"
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
                                    helperText={errors.password != "" ? errors.password : ' '}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="re-password"
                                    label="re-Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    defaultValue={forms.rePassword}
                                    error={errors.rePassword != ""}
                                    helperText={errors.rePassword != "" ? errors.rePassword : ' '}
                                />
                                {error != "" && (
                                    <Alert sx={{ mb: 2 }} severity="error">
                                        {error}
                                    </Alert>
                                )}
                                {success != "" && (
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
                                    CREATE
                                </Button>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </>{" "}
        </Layout>
    );
}
