const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const logger = require('./logger');
const port = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const api = require('./api');

app.use(cors({origin: ['http://localhost:3001']}));
app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.json());
app.use('/api', api);

const server = http.createServer(app);
server.listen(port, () => logger.info(`Library App is running on ${port}`));
