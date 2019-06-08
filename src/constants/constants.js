export const firestoreURL = `https://firestore.googleapis.com/v1/projects/${
  process.env.REACT_APP_PROJECT_ID
}/databases/(default)/documents/`;

export const spriteURL = `https://${
  process.env.REACT_APP_S3_PROJECT
}.s3.amazonaws.com/pokemon_icon_`;
