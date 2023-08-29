const express = require("express");
const bodyParser = require("body-parser");
const { scrapURL } = require("./controllers/scrapController");
const cors = require("cors");

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.options("*", cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Function to handle the root path
app.get("/api/scrap", async function (req, res) {
  scrapURL(req, res);
});

let server = app.listen(8080, function () {
  console.log("Server is listening on port 8080");
});
