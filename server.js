const path = require("path");
const http = require("http");
const express = require("express");

let app = express();
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
require("./utils/socket")(server);

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`Application running on port ${PORT}...`);
});
