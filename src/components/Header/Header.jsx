import React, { Fragment, useContext, useState } from "react";
import {
  AppBar,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
  AccountCircle as AccountIcon,
  ExitToApp as ExitIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import PropTypes from "prop-types";

import { authSignIn, authSignOut } from "../../utils/gapi";
import AuthContext from "../../contexts/AuthContext";
import Sidebar from "../Sidebar";

const useStyles = makeStyles((theme) => ({
  accountIcon: {
    marginRight: "10px",
  },
  grow: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#333333",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  headerShift: {
    marginLeft: 240,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: `calc(100% - ${240}px)`,
  },
  hide: { display: "none" },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  inputRoot: {
    color: "inherit",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  root: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Header = ({ searchOnChange, showSearch, sidebarChildren }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { setUser, user } = authContext;
  const classes = useStyles();
  const isMenuOpen = Boolean(anchorEl);

  // handleMenuClose closes the auth menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // handleMenuOpen opens the auth menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Fragment>
      <AppBar
        position="fixed"
        className={clsx(classes.header, {
          [classes.headerShift]: isSidebarOpen,
        })}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            className={clsx(classes.menuButton, {
              [classes.hide]: isSidebarOpen,
            })}
            color="inherit"
            edge="start"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
          {!isSidebarOpen && (
            <Typography noWrap variant="h6">
              Victory Road
            </Typography>
          )}
          <div className={classes.grow} />
          {showSearch && (
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                classes={{
                  input: classes.inputInput,
                  root: classes.inputRoot,
                }}
                onChange={searchOnChange}
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
              />
            </div>
          )}
          <div className={classes.account}>
            {user && user.uid ? (
              <IconButton
                aria-haspopup="true"
                aria-label="account of current user"
                color="inherit"
                edge="end"
                onClick={handleMenuOpen}
              >
                <AccountIcon />
              </IconButton>
            ) : (
              <Button color="inherit" onClick={authSignIn}>
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {isSidebarOpen && (
        <Sidebar
          handleClose={() => setIsSidebarOpen(false)}
          sidebarChildren={sidebarChildren}
        />
      )}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        keepMounted
        onClose={handleMenuClose}
        open={isMenuOpen}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem
          onClick={() => {
            authSignOut(setUser);
            handleMenuClose();
          }}
        >
          <ExitIcon className={classes.accountIcon} /> Log Out
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

Header.propTypes = {
  searchOnChange: PropTypes.func,
  showSearch: PropTypes.bool.isRequired,
  sidebarChildren: PropTypes.element,
};

export default Header;
