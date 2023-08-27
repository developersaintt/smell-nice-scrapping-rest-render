const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");
const querystring = require("querystring");
const { scrapURL } = require("./controllers/scrapController");

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Function to handle the root path
app.get("/api/scrap", async function (req, res) {
  scrapURL(req, res);
});

let server = app.listen(8080, function () {
  console.log("Server is listening on port 8080");
});

// const http = require("http");
// // const { getProducts } = require("./controllers/productController");
// const { scrapURL } = require("./controllers/scrapController");

// const server = http.createServer((req, res) => {
//   if (req.url === "/api/scrap") {
//     scrapURL(req, res);
//   } else {
//     res.writeHead(404, { "Content-Type": "application/json" });
//     res.end(
//       JSON.stringify({
//         message: "Route Not Found: Please use the api/products endpoint",
//       })
//     );
//   }
// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = server;
