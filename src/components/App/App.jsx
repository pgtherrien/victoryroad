import React from "react";
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "firebase";

import { auth, db } from "../../firebase";
import Checklist from "../Checklist";
import Header from "../Header";
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
      if (process.env.NODE_ENV !== "production") {
        console.log("Initializing GAPI Client");
      }

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
      const profile = currentUser.getBasicProfile();

      if (process.env.NODE_ENV !== "production") {
        console.log("GAPI: User signed in", {
          name: profile.getName(),
          imageURL: profile.getImageUrl(),
          email: profile.getEmail()
        });
      }

      const authResponse = currentUser.getAuthResponse(true);
      const credential = firebase.auth.GoogleAuthProvider.credential(
        authResponse.id_token,
        authResponse.access_token
      );

      auth.signInAndRetrieveDataWithCredential(credential).then(({ user }) => {
        if (process.env.NODE_ENV !== "production") {
          console.log("Firebase: User signed in", {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          });
        }
        localStorage.setItem("user", JSON.stringify(user));
        this.setState({ user: user });
      });

      // Try to get calendar events here?
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

  render() {
    const { admins, user } = this.state;
    return (
      <Router>
        <Header
          actions={{
            signIn: this.authSignIn,
            signOut: this.authSignOut
          }}
          admins={admins}
          user={user}
        />
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
      </Router>
    );
  }
}

export default App;
