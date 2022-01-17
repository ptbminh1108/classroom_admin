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
    Item,
    fabClasses,
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


export default function User() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const [openmap, setOpenmap] = React.useState(false);
    const [mapid, setMapid] = React.useState(false);

    const [sortdate, setSortdate] = useState("ASC");
    const [filtername, setFiltername] = useState("");
    const [filteremail, setFilteremail] = useState("");

    const [listUser, setListUser] = useState([]);
    const [listUserstore, setListUserstore] = useState([]);

    const [error, setError] = useState("");

    // dialogData
    const [dialogData, setdialogData] = useState({
        email: "",
        name: "",
        dateCreate: "",
        StudentID: "",
        classList: [],
    });


    // filter
    const [user, setUser] = useState({});

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

    const onChangeEmailHandle = (e) => {
        setFilteremail(e.target.value);
        updateFileFilter(sortdate, filtername, e.target.value);


    }

    const onChangeNameHandle = (e) => {
        setFiltername(e.target.value);
        updateFileFilter(sortdate, e.target.value, filteremail);


    }
    const onChangeSortDate = (event) => {
        setSortdate(event.target.value);
        updateFileFilter(event.target.value, filtername, filteremail);
    }

    const updateFileFilter = (m_sort, m_filter_name, m_filter_email) => {


        let listuser_arr = [];
        listUserstore.map(function (user_m,) {

            if (user_m.name.includes(m_filter_name) && user_m.email.includes(m_filter_email)) {
                if (m_sort == "ASC") {
                    listuser_arr.push(user_m);
                }

                if (m_sort == "DESC") {
                    listuser_arr.unshift(user_m);
                }

            }
        })

        setListUser(listuser_arr);

    }
    useLayoutEffect(() => {
        Cookie.set("prePath", "/user");
        if (!Cookie.get("accesstoken")) {
            router.push("/login");
        } else {

            setUser(JSON.parse(Cookie.get("user")));

            const access_token = "Bearer " + Cookie.get("accesstoken");
            const headers = { authorization: access_token };

            axiosApiCall("system-admin/view-user-list", "GET", headers, {})
                .then((res) => {
                    if (res.data !== {}) {
                        setListUser(res.data);
                        setListUserstore(res.data);
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
    }, []);




    const handleClickOpen = (id) => {

        listUserstore.map(function (m_user) {
            if (m_user._id == id) {

                let data_dialog = {
                    email: m_user.email,
                    name: m_user.name,
                    createdTime: m_user.createdTime,
                    StudentID: m_user.code,
                    classList: m_user.classrooms,
                }
                setdialogData(data_dialog);
                console.log(data_dialog);
            }
        })
        setOpen(true);
    };

    const handleClickLock = (id, status) => {

        const access_token = "Bearer " + Cookie.get("accesstoken");
        const headers = { authorization: access_token };

        const dataPost = {
            userId: id,
            isLock: status,
        }
        axiosApiCall("system-admin/lock-unlock-user", "post", headers, dataPost)
            .then((res) => {
                axiosApiCall("system-admin/view-user-list", "GET", headers, {})
                    .then((res) => {
                        if (res.data !== {}) {
                            setListUser(res.data);
                            setListUserstore(res.data);
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

            })
            .catch(function (error) {
                console.log(error);
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };
    const handleClickMap = (id) => {
        setMapid(id)
        setOpenmap(true);
    };
    const validate = (v_studentid) => {


        if (v_studentid.length < 6 || v_studentid.length > 10) {
            setError("Name should be 6 to 10 characters.")
            return false;
        }
        return true;

    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console

        let check = validate(data.get("student_id"));


        const postData = {
            userId: data.get("user_id"),
            code: data.get("student_id"),
        }

        if (check === true) {
            const access_token = "Bearer " + Cookie.get("accesstoken");
            const headers = { authorization: access_token };

            axiosApiCall("system-admin/mapping-user-code", "post", headers, postData)
                .then((res) => {

                    axiosApiCall("system-admin/view-user-list", "GET", headers, {})
                        .then((res) => {
                            if (res.data !== {}) {
                                setListUser(res.data);
                                setListUserstore(res.data);
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
                    setOpenmap(false);

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
    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMap = () => {
        setOpenmap(false);
    };
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
                        <h2>USER MANAGEMENT</h2>
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
                                            <TableCell align="center"><h2>Action</h2></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listUser.map((row) => (
                                            <TableRow
                                                key={row._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    {row.email}
                                                </TableCell>
                                                <TableCell align="center">{row.name}</TableCell>
                                                <TableCell align="center">{row.createdTime}</TableCell>
                                                <TableCell align="center">

                                                    <Button variant="contained" onClick={() => handleClickOpen(row._id)}>
                                                        View
                                                    </Button>

                                                    {row.isLock ?
                                                        <Button variant="contained" color="success" sx={{ ml: 1 }} onClick={() => handleClickLock(row._id, false)}> Unlock </Button>
                                                        :
                                                        <Button variant="contained" color="error" sx={{ ml: 1 }} onClick={() => handleClickLock(row._id, true)}> Lock </Button>
                                                    }

                                                    <Button variant="contained" color="error" sx={{ ml: 1 }} onClick={() => handleClickMap(row._id)} > MAP </Button>
                                                </TableCell>
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
                        </Grid>
                    </Grid>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>USER INFO</DialogTitle>
                        <DialogContent >
                            <Box width={350}>
                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={4}>
                                        Name:
                                    </Grid>
                                    <Grid item xs={8}>
                                        <b>{dialogData.name}</b>
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={4}>
                                        Email:
                                    </Grid>
                                    <Grid item xs={8}>
                                        <b>{dialogData.email}</b>
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={4}>
                                        Student ID:
                                    </Grid>
                                    <Grid item xs={8}>
                                        <b>{dialogData.StudentID}</b>
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={4}>
                                        Date Create:
                                    </Grid>
                                    <Grid item xs={8}>
                                        <b>{dialogData.createdTime}</b>
                                    </Grid>
                                </Grid>

                                <Grid container sx={{ minWidth: 30 }}>
                                    <Grid item xs={12}>
                                        List class join:
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ul>
                                            {dialogData.classList.map((row) => (
                                                <li key={row._id}>{row.className}</li>
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

                    <Dialog open={openmap} onClose={handleCloseMap}>
                        <DialogTitle>USER INFO</DialogTitle>
                        <DialogContent >
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

                                <TextField
                                    sx={{ display: 'none' }}
                                    hidden
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="studentid"
                                    label="Student ID"
                                    name="user_id"
                                    autoFocus
                                    defaultValue={mapid}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="studentid"
                                    label="Student ID"
                                    name="student_id"
                                    type="number"
                                    error={error != ""}
                                    helperText={error != "" ? 'Student id for 6 to 10 number' : ' '}
                                />


                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}

                                >
                                    MAP
                                </Button>
                            </Box>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseMap}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </>{" "}
        </Layout >
    );
}
