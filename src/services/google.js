import { auth } from "../firebase";

const AUTHORIZATION_KEY = "client:auth2";
const CALENDAR_KEY = "calendar";
const CALENDAR_VERSION = "v3";
const PROMPT_KEY = "select_account";

const google = window.gapi;

class GoogleService {
  firebase = null;
  setUser = ({ user }) => {};

  constructor({ firebase, setUser }) {
    this.firebase = firebase;
    this.setUser = setUser;
  };

  initialize = () => {
    google.load(AUTHORIZATION_KEY, () => {
      this.setUpClient();
      this.setUpAuthorization();
      this.setUpCalendar();
    });
  };

  handleIsSignedIn = isSignedIn => {
    if (isSignedIn) {
      const credential = this.getCredential();
      this.signIntoFirebase({ credential });
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log("🔓 User Is Not Signed In 🔓");
      }
    }
  }

  getAuthorizationInstance = () => {
    const { auth2: authorization } = google;
    const authorizationInstance = authorization.getAuthInstance();
    return authorizationInstance;
  }

  getCredential = () => {
    const authorizationInstance = this.getAuthorizationInstance();
    const currentUser = authorizationInstance.currentUser.get();
    const response = currentUser.getAuthResponse(true);
    const credential = this.firebase.auth.GoogleAuthProvider.credential(
      response.id_token,
      response.access_token
    );
    return credential;
  }

  setUpAuthorization = () => {
    const { isSignedIn } = this.getAuthorizationInstance();
    isSignedIn.listen(this.handleIsSignedIn);
    this.handleIsSignedIn(isSignedIn.get());
  }

  setUpCalendar = () => {
    const { client } = google;
    client.load(CALENDAR_KEY, CALENDAR_VERSION, () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("📅 Loaded Calendar 📅");
      }
    });
  }

  setUpClient = () => {
    const { client } = google;
    client.init({
      apiKey: process.env.REACT_APP_API_KEY,
      clientId: process.env.REACT_APP_OATH_CLIENT_ID,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
      ],
      scope: "https://www.googleapis.com/auth/calendar"
    });
  }

  signIntoFirebase = ({ credential }) => {
    auth.signInAndRetrieveDataWithCredential(credential).then(({ user }) => {
      localStorage.setItem("user", JSON.stringify(user));
      this.setUser({ user });
    });
  }

  signInUser = () => {
    const authorizationInstance = this.getAuthorizationInstance();
    const { isSignedIn } = authorizationInstance;
    if (isSignedIn.get()) {
      console.log("🔒 User Is Already Signed In 🔒");
      return;
    } else {
      authorizationInstance.signIn({ prompt: PROMPT_KEY }).catch(error => {
        console.error("🔥 Error Signing In 🔥", error);
      });
    }
  }

  signOutUser = () => {
    const authorizationInstance = this.getAuthorizationInstance();
    const { isSignedIn } = authorizationInstance;
    if (isSignedIn.get()) {
      console.log("🔒 User Is Already Signed In 🔒");
      return;
    }
    authorizationInstance
      .signOut()
      .then(() => {
        if (process.env.NODE_ENV !== "production") {
          console.log("🔓 Google: User Signed Out 🔓");
        }
      })
      .then(() => {
        return auth.signOut();
      })
      .then(() => {
        if (process.env.NODE_ENV !== "production") {
          console.log("🔓 Firebase: User Signed Out 🔓");
        }
      })
      .then(() => {
        localStorage.removeItem("user");
      })
      .then(() => {
        this.setUser({ user: undefined });
      })
      .then(() => {
        if (process.env.NODE_ENV !== "production") {
          console.log("🔓 Sign Out Complete 🔓");
        }
      });
  }
};

export default GoogleService;
