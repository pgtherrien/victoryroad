import React, { Fragment, useState } from "react";
import clsx from "clsx";
import {
  AppBar as MaterialAppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  AccountCircle,
  Add,
  ExitToApp,
  Menu as MenuIcon
} from "@material-ui/icons";

import { authSignIn, authSignOut } from "../../utils/gapi";
import Drawer from "./Drawer";

const useStyles = makeStyles(theme => ({
  accountIcon: {
    marginRight: "10px"
  },
  appBar: {
    backgroundColor: "#333333",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${240}px)`,
    marginLeft: 240,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  grow: {
    flexGrow: 1
  },
  hide: { display: "none" },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

export default function AppBar({ admins, setIsEventFormOpen, setUser, user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const classes = useStyles();
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Fragment>
      <MaterialAppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: isDrawerOpen
        })}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            className={clsx(classes.menuButton, isDrawerOpen && classes.hide)}
            color="inherit"
            edge="start"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Victory Road
          </Typography>
          <div className={classes.grow} />
          <div className={classes.account}>
            {user && user.uid ? (
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircle />
              </IconButton>
            ) : (
              <Button color="inherit" onClick={authSignIn}>
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </MaterialAppBar>
      {isDrawerOpen && (
        <Drawer handleDrawerClose={() => setIsDrawerOpen(false)} />
      )}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        onClose={handleMenuClose}
        open={isMenuOpen}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {user && admins.includes(user.uid) && (
          <MenuItem onClick={() => setIsEventFormOpen(true)}>
            <Add className={classes.accountIcon} /> Add Event
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            authSignOut(setUser);
            handleMenuClose();
          }}
        >
          <ExitToApp className={classes.accountIcon} /> Log Out
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
