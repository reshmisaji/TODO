const http = require("http");
const { requestHandler } = require("./src/app/app");

const PORT = process.env.PORT || 8080;

let server = http.createServer(requestHandler);
server.listen(PORT, () => console.log("listening on ", PORT));
