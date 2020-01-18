import React, { useEffect, useState } from "react";
import {
  AppBar,
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
import { BrowserRouter as Router, Route } from "react-router-dom";
import clsx from "clsx";
import firebase from "firebase";

import { auth, db } from "../../firebase";
import Checklist from "../Checklist";
import Drawer from "../Drawer";
import EventForm from "../EventForm";
import Timeline from "../Timeline";

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
  footer: {
    alignItems: "center",
    backgroundColor: "#333333",
    display: "flex",
    height: "50px",
    justifyContent: "center",
    marginTop: "50px",
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  hide: { display: "none" },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  }
}));

const gapi = window.gapi;

export default function App() {
  const [admins, setAdmins] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  useEffect(() => {
    let updatedAdmins = [];

    // Capture the user from the localStorage / set the user in localStorage
    auth.onAuthStateChanged(function(updatedUser) {
      updatedUser
        ? localStorage.setItem("user", JSON.stringify(updatedUser))
        : localStorage.removeItem("user");
    });

    initClient();
    db.collection("admins")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          updatedAdmins.push(doc.id);
        });
        setAdmins(updatedAdmins);
      });
  }, []);

  // Sign the user into the GAPI client and Firebase
  const authSignIn = () => {
    const auth2 = gapi.auth2.getAuthInstance();

    if (auth2.isSignedIn.get()) {
      alert("User is already signed in!");
      return;
    }

    auth2
      .signIn({ prompt: "select_account" })
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        alert(`Sign in error: ${error}`);
      });
  };

  // Sign the user out of the GAPI client and Firebase
  const authSignOut = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    localStorage.removeItem("user");

    if (!auth2.isSignedIn.get()) {
      alert("User is not signed in!");
      return;
    }

    auth2
      .signOut()
      .then(() => {
        if (process.env.NODE_ENV !== "production") {
          console.log("GAPI: Sign out complete");
        }
      })
      .then(() => {
        return auth.signOut();
      })
      .then(() => {
        localStorage.removeItem("user");
        if (process.env.NODE_ENV !== "production") {
          console.log("Firebase: Sign out complete");
        }
        setGoogleUser(undefined);
        window.location.reload();
      });
  };

  // Check if the user is signed into the GAPI client and Firebase
  const handleIsSignedIn = isSignedIn => {
    if (isSignedIn) {
      const auth2 = gapi.auth2.getAuthInstance();
      const currentUser = auth2.currentUser.get();
      const authResponse = currentUser.getAuthResponse(true);
      const credential = firebase.auth.GoogleAuthProvider.credential(
        authResponse.id_token,
        authResponse.access_token
      );

      auth.signInAndRetrieveDataWithCredential(credential).then(({ user }) => {
        localStorage.setItem("user", JSON.stringify(user));
        setGoogleUser(user);
      });
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log("GAPI: User is not signed in");
      }
    }
  };

  // Initialize the GAPI client
  const initClient = () => {
    if (gapi) {
      gapi.load("client:auth2", () => {
        gapi.client.init({
          apiKey: process.env.REACT_APP_API_KEY,
          clientId: process.env.REACT_APP_OATH_CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
          ],
          scope: "https://www.googleapis.com/auth/calendar"
        });

        gapi.client.load("calendar", "v3", () => {
          if (process.env.NODE_ENV !== "production") {
            console.log("Loaded GAPI Calendar Client");
          }
        });

        const auth2 = gapi.auth2.getAuthInstance();
        auth2.isSignedIn.listen(handleIsSignedIn);
        handleIsSignedIn(auth2.isSignedIn.get());
      });
    }
  };

  // // Creates an event in the user's Google Calendar
  const insertEvent = async (title, summary, startDate, endDate) => {
    const insert = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "America/New_York"
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "America/New_York"
      },
      summary: title,
      description: summary
    });

    return insert;
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "primary-search-account-menu";

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Router>
      <AppBar
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
            {googleUser && googleUser.uid ? (
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
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={menuId}
        keepMounted
        onClose={handleMenuClose}
        open={isMenuOpen}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {admins.includes(googleUser.uid) && (
          <MenuItem onClick={() => setIsEventFormOpen(true)}>
            <Add className={classes.accountIcon} /> Add Event
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            authSignOut();
            handleMenuClose();
          }}
        >
          <ExitToApp className={classes.accountIcon} /> Log Out
        </MenuItem>
      </Menu>
      {isDrawerOpen && (
        <Drawer handleDrawerClose={() => setIsDrawerOpen(false)} />
      )}
      <Route
        exact
        path="/"
        render={() => (
          <Timeline
            admins={admins}
            insertEvent={insertEvent}
            user={googleUser || {}}
          />
        )}
      />
      <Route
        exact
        path="/checklist"
        render={() => <Checklist admins={admins} user={googleUser || {}} />}
      />
      {isEventFormOpen && (
        <EventForm handleClose={() => setIsEventFormOpen(false)} />
      )}
    </Router>
  );
}
