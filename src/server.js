const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const logger = require('./logger');
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'static')));

const server = http.createServer(app);
server.listen(port, () => logger.info(`Library server is running on ${port}`));

module.exports = server;