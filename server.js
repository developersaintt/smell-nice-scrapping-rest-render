const http = require("http");
// const { getProducts } = require("./controllers/productController");
const { scrapURL } = require("./controllers/scrapController");

const server = http.createServer((req, res) => {
  if (req.url === "/api/scrap") {
    scrapURL(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Route Not Found: Please use the api/products endpoint",
      })
    );
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;
