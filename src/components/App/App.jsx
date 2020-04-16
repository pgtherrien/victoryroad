import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import firebase from "firebase";

import { auth, db } from "../../utils/firebase";
import { AuthProvider } from "../../contexts/AuthContext";
import Checklist from "../Checklist";
import Timeline from "../Timeline";

const googleAPI = window.gapi;

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      admins: [],
      user: JSON.parse(localStorage.getItem("user")) || {},
    };
  }

  componentWillMount() {
    // On an authentication change, update the localStorage
    auth.onAuthStateChanged(function (updatedUser) {
      updatedUser
        ? localStorage.setItem("user", JSON.stringify(updatedUser))
        : localStorage.removeItem("user");
    });

    this.initClient();

    // Get the admins from the database and set them into the state
    db.collection("admins")
      .get()
      .then((querySnapshot) => {
        this.setState({
          admins: querySnapshot.docs.map((doc) => doc.id),
        });
      });
  }

  // Initialize the Google API client
  initClient = () => {
    if (googleAPI) {
      googleAPI.load("client:auth2", () => {
        googleAPI.client.init({
          apiKey: process.env.REACT_APP_API_KEY,
          clientId: process.env.REACT_APP_OATH_CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
          scope: "https://www.googleapis.com/auth/calendar",
        });

        googleAPI.client.load("calendar", "v3", () => {
          if (process.env.NODE_ENV !== "production") {
            console.log("Loaded GAPI Calendar Client");
          }
        });

        const auth2 = googleAPI.auth2.getAuthInstance();
        auth2.isSignedIn.listen(this.handleIsSignedIn);
        this.handleIsSignedIn(auth2.isSignedIn.get());
      });
    }
  };

  // Check if the user is signed into the Google API client
  handleIsSignedIn = (isSignedIn) => {
    if (isSignedIn) {
      const auth2 = googleAPI.auth2.getAuthInstance();
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
        console.log("Google API: User is not signed in");
      }
    }
  };

  render() {
    const { admins, user } = this.state;

    return (
      <AuthProvider
        value={{
          admins: admins,
          setUser: (user) => this.setState({ user: user }),
          user: user,
        }}
      >
        <BrowserRouter>
          <Route exact path="/" render={() => <Timeline />} />
          <Route exact path="/checklist" render={() => <Checklist />} />
        </BrowserRouter>
      </AuthProvider>
    );
  }
}
