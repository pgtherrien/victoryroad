const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

functions.auth.user().onCreate(user => {
  checklist = {
    lucky: "[]",
    normal: "[]",
    purified: "[]",
    shiny: "[]",
    shadow: "[]"
  };

  admin
    .firestore()
    .collection("checklists")
    .doc(user.data.uid)
    .set(checklist)
    .catch(err => {
      console.log(err);
      return;
    });
});
