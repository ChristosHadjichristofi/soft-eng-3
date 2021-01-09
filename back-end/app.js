const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 8765;


const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));