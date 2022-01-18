import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

import AddIcon from "@mui/icons-material/Add";
import DialpadIcon from "@mui/icons-material/Dialpad";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Link from "next/link";

import DrawerLeftSide from "./drawerLeftSide";

import { styled } from "@mui/material/styles";

import topBarStyle from "./topBar.module.css";

import AddClassDialog from "./addClassDialog";

import LogoutBtn from "../logout/logout";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function TopBar({ handleAddClass }) {
  const [anchorAdd, setAnchorAdd] = useState(null);

  const isMenuOpen = Boolean(anchorAdd);

  const handleProfileMenuOpen = (event) => {
    setAnchorAdd(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorAdd(null);
  };

  const joinClassClick = () => {
    setAnchorAdd(null);
  };
  const createClassClick = () => {
    setAnchorAdd(null);
  };
  const menuId = "primary-search-account-menu";
  const AddMenu = (
    <Menu
      anchorEl={anchorAdd}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={joinClassClick}>Join Class</MenuItem>
      <MenuItem onClick={createClassClick}>
        <AddClassDialog handleAddClass={handleAddClass}></AddClassDialog>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={topBarStyle.topBarContainer}>
      <Paper className={topBarStyle.topBarContainer}>
        <Box
          sx={{ flexGrow: 1 }}
          className={topBarStyle.topbar}
          display="flex"
          justifyContent="center"
        >
          <Grid container spacing={2}>
            <Grid item xs={1} className={topBarStyle.topBarItem}>
              <DrawerLeftSide></DrawerLeftSide>
            </Grid>
            <Grid item xs className={topBarStyle.topBarItem}>
              <Link href="/admin">
                <a className={topBarStyle.ClassVipPro}>Classroom Admin Page</a>
              </Link>
            </Grid>
            
            
            <Grid item xs={0.5} className={topBarStyle.topBarItem}>
                <a>
                  <AccountCircleIcon> </AccountCircleIcon>
                </a>
            </Grid>
            <Grid item xs={1} className={topBarStyle.topBarItem}>
              <LogoutBtn />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
}
