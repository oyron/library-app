const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const rp = require('request-promise');
const logger = require('./logger');
const port = process.env.PORT || 3000;
const cors = require('cors');
const passport = require('passport');
const authenticationStrategy = require('./auth.js').bearerStrategy;
const aquireOnBehalfOfToken = require('./auth.js').aquireOnBehalfOfToken;
const tokenCache = require('./auth.js').tokenCache;

app.use(cors({origin: ['http://localhost:3001']}));
app.use(express.static(path.join(__dirname, '../build')));
passport.use(authenticationStrategy);

app.get('*', logRequest);

/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});*/

app.get("/books", passport.authenticate('oauth-bearer', { session: false }), dataHandler);
app.get("/books/:id", passport.authenticate('oauth-bearer', { session: false }), bookHandler);

function bookHandler(req, res) {
    const bookId =req.params.id;
    rp(`http://localhost:3100/api/books/${bookId}`)
        .then(response => {
            logger.info(response);
            res.send([JSON.parse(response)])
        })
        .catch(error => res.status(500).send(error));
}

function callLibrary(token) {
    const options = {
        url: 'http://localhost:3100/api/books',
        auth: {
            bearer: token
        }
    };

    return rp(options)
        .then(response => {
            logger.info("Response from library: " + response);
            return response;
        })
}

function dataHandler (req, res) {
    const bearerToken = req.headers.authorization.match(/^Bearer (.*)/)[1];
    logger.info(bearerToken);
    aquireOnBehalfOfToken(bearerToken)
        .then(token => {
            logger.info("Got on-behalf-of token: " + token);
            return callLibrary(token)
        })
        .then(libraryData => {
            logger.info("Got library data: " + libraryData);
            res.send(JSON.parse(libraryData));
        })
        .catch(error => {
            logger.error(error);
            res.status(500).send(error)
        });
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