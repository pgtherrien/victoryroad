import { auth } from "./firebase";

// Sign the user into the GAPI client and Firebase
export const authSignIn = () => {
  const auth2 = window.gapi.auth2.getAuthInstance();

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
export const authSignOut = setGoogleUser => {
  const auth2 = window.gapi.auth2.getAuthInstance();
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

// Creates an event in the user's Google Calendar
export const insertEvent = async (title, summary, startDate, endDate) => {
  const insert = await window.gapi.client.calendar.events.insert({
    calendarId: "primary",
    description: summary,
    end: {
      dateTime: endDate.toISOString(),
      timeZone: "America/New_York"
    },
    start: {
      dateTime: startDate.toISOString(),
      timeZone: "America/New_York"
    },
    summary: title
  });
  return insert;
};
