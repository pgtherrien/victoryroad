import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import firebase from "firebase";

import { auth, db } from "../../utils/firebase";
import AppBar from "./AppBar";
import EventForm from "../EventForm";
import List from "../List";
import Timeline from "../Timeline";

const gapi = window.gapi;

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      admins: [],
      editEvent: {},
      isEventFormOpen: false,
      user: JSON.parse(localStorage.getItem("user")) || {}
    };
  }

  componentWillMount() {
    let updatedAdmins = [];

    // Capture the user from the localStorage / set the user in localStorage
    auth.onAuthStateChanged(function(updatedUser) {
      updatedUser
        ? localStorage.setItem("user", JSON.stringify(updatedUser))
        : localStorage.removeItem("user");
    });

    this.initClient();

    // Get the admins from the database and set them into the state
    db.collection("admins")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          updatedAdmins.push(doc.id);
        });
        this.setState({ admins: updatedAdmins });
      });
  }

  // Initialize the GAPI client
  initClient = () => {
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
        auth2.isSignedIn.listen(this.handleIsSignedIn);
        this.handleIsSignedIn(auth2.isSignedIn.get());
      });
    }
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

  handleSelectEditEvent = event => {
    this.setState({
      editEvent: event,
      isEventFormOpen: true
    });
  };

  render() {
    const { admins, editEvent, isEventFormOpen, user } = this.state;
    return (
      <BrowserRouter>
        <AppBar
          admins={admins}
          setIsEventFormOpen={isOpen =>
            this.setState({ isEventFormOpen: isOpen })
          }
          setUser={user => this.setState({ user: user })}
          user={user}
        />
        {isEventFormOpen && (
          <EventForm
            event={editEvent}
            handleClose={() => this.setState({ isEventFormOpen: false })}
          />
        )}
        <Route
          exact
          path="/"
          render={() => (
            <Timeline
              admins={admins}
              handleSelectEditEvent={this.handleSelectEditEvent}
              user={user || {}}
            />
          )}
        />
        <Route
          exact
          path="/checklist"
          render={() => <List user={user || {}} />}
        />
      </BrowserRouter>
    );
  }
}
