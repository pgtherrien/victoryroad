import React from "react";
import firebase from "firebase";
import {
  Divider,
  Icon,
  Image,
  Menu,
  Responsive,
  Segment,
  Sidebar
} from "semantic-ui-react";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

import { auth, db } from "../../firebase";
import styles from "./App.module.css";
import Checklist from "../Checklist";
import EventModal from "../EventModal";
import PokemonBox from "../PokemonBox";
import Timeline from "../Timeline";

const gapi = window.gapi;

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    // Initialize the GAPI client for use with authorization
    this.initClient();

    // Capture the user from the localStorage / set the user in localStorage
    auth.onAuthStateChanged(function(user) {
      user
        ? localStorage.setItem("user", JSON.stringify(user))
        : localStorage.removeItem("user");
    });

    this.state = {
      admins: [],
      showEventModal: false,
      showSidebar: false,
      tab: window.location.pathname,
      user: JSON.parse(localStorage.getItem("user"))
    };
  }

  // Gather the admins data and set it into the state
  componentWillMount() {
    let admins = [];

    db.collection("admins")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          admins.push(doc.id);
        });
        this.setState({ admins: admins });
      });
  }

  // Initialize the GAPI client
  initClient = () => {
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
      auth2.isSignedIn.listen(this.handleIsSignedIn);
      this.handleIsSignedIn(auth2.isSignedIn.get());
    });
  };

  // Check if the user is signed into the GAPI client and Firebase
  handleIsSignedIn = isSignedIn => {
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
        this.setState({ user: user });
      });
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log("GAPI: User is not signed in");
      }
    }
  };

  // Sign the user into the GAPI client and Firebase
  authSignIn = () => {
    const auth2 = gapi.auth2.getAuthInstance();

    if (auth2.isSignedIn.get()) {
      alert("User is already signed in!");
      return;
    }

    auth2.signIn({ prompt: "select_account" }).catch(error => {
      alert(`Sign in error: ${error}`);
    });
  };

  // Sign the user out of the GAPI client and Firebase
  authSignOut = () => {
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
        this.setState({ user: undefined });
      });
  };

  // Creates an event in the user's Google Calendar
  async insertEvent(title, summary, startDate, endDate) {
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
  }

  buildTitle = () => {
    const { tab } = this.state;
    switch (tab) {
      case "/checklist":
        return "Checklists";
      case "/pokebox":
        return "Pokébox";
      case "/":
      default:
        return "Events";
    }
  };

  render() {
    const { admins, showEventModal, showSidebar, tab, user } = this.state;

    return (
      <Router>
        <Sidebar.Pushable>
          <Sidebar
            animation={
              window.innerWidth > Responsive.onlyComputer.minWidth
                ? "push"
                : "overlay"
            }
            as={Menu}
            className={styles["header-sidebar"]}
            inverted
            vertical
            visible={showSidebar}
            width="wide"
          >
            <Menu.Item className={styles["header-sidebar-image"]}>
              <Image src="images/misc/cave.png" title="Victory Road" />
              <span>Victory Road</span>
            </Menu.Item>
            <Menu.Item
              as={Link}
              className={
                tab === "/"
                  ? `${styles["header-sidebar-tab"]} ${
                      styles["header-sidebar-tab-active"]
                    }`
                  : styles["header-sidebar-tab"]
              }
              name="events"
              onClick={() => this.setState({ tab: "/" })}
              to=""
            >
              <Icon name="calendar alternate outline" /> <span>Events</span>
            </Menu.Item>
            <Menu.Item
              as={Link}
              className={
                tab === "/checklist"
                  ? `${styles["header-sidebar-tab"]} ${
                      styles["header-sidebar-tab-active"]
                    }`
                  : styles["header-sidebar-tab"]
              }
              name="checklists"
              onClick={() => this.setState({ tab: "/checklist" })}
              to="checklist"
            >
              <Icon name="check" /> <span>Checklists</span>
            </Menu.Item>
            <Menu.Item
              as={Link}
              className={
                tab === "/pokebox"
                  ? `${styles["header-sidebar-tab"]} ${
                      styles["header-sidebar-tab-active"]
                    }`
                  : styles["header-sidebar-tab"]
              }
              name="pokebox"
              onClick={() => this.setState({ tab: "/pokebox" })}
              to="pokebox"
            >
              <Icon name="box" /> <span>Pokébox</span>
            </Menu.Item>

            {user ? (
              <div className={styles["header-sidebar-profile"]}>
                <Image
                  as={Image}
                  className={styles["header-sidebar-profile-pic"]}
                  src={user.photoURL}
                />
                <Divider horizontal inverted>
                  Authentication
                </Divider>
                <Menu.Item
                  className={styles["header-sidebar-tab-profile"]}
                  onClick={this.authSignOut}
                >
                  <Icon name="sign out" /> <span>Sign Out</span>
                </Menu.Item>
                {admins.includes(user.uid) && (
                  <React.Fragment>
                    <Divider horizontal inverted>
                      Admin Controls
                    </Divider>
                    <Menu.Item
                      className={styles["header-sidebar-tab-profile"]}
                      onClick={() =>
                        this.setState({
                          showEventModal: true
                        })
                      }
                    >
                      <Icon name="calendar plus" /> <span>Create Event</span>
                    </Menu.Item>
                    <br />
                  </React.Fragment>
                )}
              </div>
            ) : (
              <div className={styles["header-sidebar-profile"]}>
                <Divider horizontal inverted>
                  Authentication
                </Divider>
                <Menu.Item
                  className={styles["header-sidebar-tab-profile"]}
                  onClick={this.authSignIn}
                >
                  <Icon name="sign in" /> <span>Sign In</span>
                </Menu.Item>
              </div>
            )}
          </Sidebar>
          <Sidebar.Pusher>
            <Segment className={styles["header-top"]} inverted>
              <Icon
                inverted
                name="bars"
                onClick={() => this.setState({ showSidebar: !showSidebar })}
                size="big"
              />
              <span className={styles["header-top-title"]}>
                {this.buildTitle()}
              </span>
            </Segment>
            <Route
              exact
              path="/"
              render={() => (
                <Timeline
                  admins={admins}
                  insertEvent={this.insertEvent}
                  user={user || {}}
                />
              )}
            />
            <Route exact path="/checklist" component={Checklist} />
            <Route exact path="/pokemonbox" component={PokemonBox} />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        {showEventModal && (
          <EventModal
            onClose={() => {
              this.setState({ showEventModal: false });
            }}
            user={user}
          />
        )}
      </Router>
    );
  }
}

export default App;
