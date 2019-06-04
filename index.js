const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "victoryroad-ui/build")));

app.get("/api/version", (req, res) => {
  var packageJSON = require("./package.json");
  res.json(packageJSON.version);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/victoryroad-ui/build/index.js"));
});

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Victory Road listening on ${port}`);
