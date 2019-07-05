import React from "react";
import firebase from "firebase";
import {
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar
} from "semantic-ui-react";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

import { auth, db } from "../../firebase";
import styles from "./App.module.css";
import Checklist from "../Checklist";
import { EventModal } from "../Modals";
import PokemonBox from "../PokemonBox";
import Timeline from "../Timeline";
import GoogleService from "../../services/google";

const gapi = window.gapi;

class App extends React.PureComponent {
  fireBase = {
    auth,
    db,
  };

  googleService = new GoogleService({
    firebase,
    setUser: user => {
      this.setState({ user });
    },
  });

  constructor(props) {
    super(props);

    // initialize the Google service
    this.googleService.initialize();

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
        <Sidebar
          animation="overlay"
          as={Menu}
          className={styles["header-sidebar"]}
          inverted
          onHide={() => this.setState({ showSidebar: false })}
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
                onClick={this.googleService.signOutUser}
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
                onClick={this.googleService.signInUser}
              >
                <Icon name="sign in" /> <span>Sign In</span>
              </Menu.Item>
            </div>
          )}
        </Sidebar>
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
        <Grid className={styles["footer"]}>
          <Grid.Column width="4" />
          <Grid.Column width="8">
            <Header
              as="h4"
              className={styles["footer-title"]}
              inverted
              onClick={() =>
                window.open(
                  "https://github.com/pgtherrien/victoryroad/issues/new",
                  "_blank"
                )
              }
              title="Submit an issue on Github"
            >
              <Icon inverted name="github" size="large" />
              Victory Road
            </Header>
          </Grid.Column>
          <Grid.Column width="4" />
        </Grid>
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
