import firebase from "firebase";
import {
  MockAuthentication,
  MockFirebase,
  MockFirebaseSdk,
  MockFirestore,
  MockMessaging,
  MockStorage
} from "firebase-mock";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

const mockFirebase = new MockFirebaseSdk(
  path => {
    return path ? new MockFirebase().child(path) : new MockFirebase();
  },
  () => {
    return new MockAuthentication();
  },
  () => {
    return new MockFirestore();
  },
  () => {
    return new MockStorage();
  },
  () => {
    return new MockMessaging();
  }
);

const production = process.env.NODE_ENV === "production";

if (production) {
  firebase.initializeApp(firebaseConfig);
}

export const db = production
  ? new firebase.firestore()
  : new mockFirebase.firestore();
export const provider = production
  ? new firebase.auth.GoogleAuthProvider()
  : new mockFirebase.auth.GoogleAuthProvider();
export const auth = production ? firebase.auth() : mockFirebase.auth();
export default (production ? firebase : mockFirebase);
