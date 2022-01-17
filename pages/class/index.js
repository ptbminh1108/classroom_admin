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


export default function Class() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);


    const [listClass, setlistClass] = useState([]);
    const [listClassstore, setlistClassstore] = useState([]);

    
    const [user, setUser] = useState({});
    const [sortdate, setSortdate] = useState("ASC");

    const [dialogData, setdialogData] = useState({
        class: "",
        host: "",
        topic: "",
        numberuser: "",
        userList: [],
    });
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
        if (!Cookie.get("accesstoken")) {
            router.push("/login");
        } else {

            setUser(JSON.parse(Cookie.get("user")));

            const access_token = "Bearer " + Cookie.get("accesstoken");
            const headers = { authorization: access_token };

            axiosApiCall("system-admin/view-classroom-list/", "get", headers, {})
                .then((res) => {
                    if (res !== {}) {
                        setlistClass(res.data);
                        setlistClassstore(res.data);
                    }
                })
                .catch(function (error) {
                    //console.log("erpr");
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                });
        }
    }, [setlistClass,setlistClassstore]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console

        let check = validate(data.get("email"), data.get("password"), data.get("re-password"));


        const postData = {
            email: data.get("email"),
            password: data.get("password"),
        }
        if (check === true) {
            axiosApiCall("auth/google-token", "post", { postData })
                .then((res) => {
                    let data = res.data;
                    if (data.success) {

                        Cookie.set("user", JSON.stringify(res.data.user));
                        Cookie.set("accesstoken", res.data.access_token);

                        console.log(res.data.access_token);

                        console.log("prepath: " + Cookie.get("prePath"));
                        Cookie.get("prePath")
                            ? router.push(Cookie.get("prePath"))
                            : router.push("/");
                    }

                    if (data.error) {
                        setError(data.error);
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

    const onChangeSortDate = (event) => {
        setSortdate(event.target.value);
    }
    const handleClickOpen = (id) => {

        listClassstore.map(function(m_class){
            if(m_class._id==id){
                console.log(m_class)
                let data_dialog = {
                    class: m_class.className,
                    host: m_class.host,
                    topic: m_class.topic,
                    numberuser: m_class.members.length,
                    userList: m_class.members,
                }
                setdialogData(data_dialog);
            }
        })
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onChangeHandle = (e) =>{
        let name = e.target.value;

        let listclass_array = [];
        listClassstore.map( function(class_m){
            console.log(class_m);
            if(class_m.className.includes(name)){
                listclass_array.push(class_m);
            }
        })

        setlistClass(listclass_array);
    }


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
                        <h2>CLASS MANAGEMENT</h2>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><h2>Class</h2></TableCell>
                                            <TableCell align="center"><h2>Creator</h2></TableCell>
                                            <TableCell align="center"><h2>Users</h2></TableCell>
                                            <TableCell align="center"><h2>TOPIC</h2></TableCell>
                                            <TableCell align="center"><h2>Edit</h2></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listClass.map((row) => (
                                            <TableRow
                                                key={row._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.className}
                                                </TableCell>
                                                <TableCell align="center">{row.host}</TableCell>
                                                <TableCell align="center">{row.members.length}</TableCell>
                                                <TableCell align="center">{row.topic}</TableCell>
                                                <TableCell align="center">
                                                    <Button variant="contained" onClick={() => handleClickOpen(row._id)}>View</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={4} sx={{ pl: 10, pr: 10 }}>
                            <h2>Filter</h2>
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
                                    id="sort_name"
                                    label="Name"
                                    name="sort_name"
                                    autoComplete="name"
                                    autoFocus
                                    defaultValue={forms.name}
                                    onChange={onChangeHandle}
                                />
                            </Box>

                        </Grid>
                    </Grid>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>CLASS INFO</DialogTitle>
                        <DialogContent >
                            <Box width={350}>
                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={4}>
                                        Class:
                                    </Grid>
                                    <Grid item xs={8}>
                                        <b>{dialogData.class}</b>
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={4}>
                                        Host:
                                    </Grid>
                                    <Grid item xs={8}>
                                        <b>{dialogData.host}</b>
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={4}>
                                        NumberUser:
                                    </Grid>
                                    <Grid item xs={8}>
                                        <b>{dialogData.numberuser}</b>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={4}>
                                        Topic:
                                    </Grid>
                                    <Grid item xs={8}>
                                        <b>{dialogData.topic}</b>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={12}>
                                        List user:
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ul>
                                            {dialogData.userList.map((row) => (
                                                <li key={row}>{row.email} - {row.userType} </li>
                                            ))}
                                        </ul>
                                    </Grid>
                                </Grid>
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
