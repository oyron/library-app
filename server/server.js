const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const logger = require('./logger');
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors({origin: ['http://localhost:3001']}));
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', logRequest);

/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});*/

app.get("/data", someDataHandler);
function someDataHandler (req, res) {
    res.send({data: "Data from server"});
}

const server = http.createServer(app);
server.listen(port, () => logger.info(`Library App is running on ${port}`));

module.exports = server;

function logRequest(req, res, next) {
    let payloadLog = '';
    if (req.body && Object.keys(req.body).length > 0) {
        payloadLog = 'Payload: ' + JSON.stringify(req.body);
    }
    logger.debug(`${req.method} ${req.url} ${payloadLog}`);
    next();
}