const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const accountCreate = functions.auth.user().onCreate(user => {
  console.log(user.data);

  checklist = {
    lucky: "[]",
    normal: "[]",
    shiny: "[]"
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
