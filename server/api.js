const express = require('express');
const router = express.Router();
const logger = require('./logger');
const bearerStrategy = require('./auth/bearer-strategy');
const acquireTokenOnBehalfOf = require('./auth/aquire-token');
const rp = require('request-promise');
const passport = require('passport');
const { libraryApiID } = require('./auth/auth-config');
const permit = require('./auth/permission');

passport.use(bearerStrategy);
router.use(passport.initialize());


router.all('*', passport.authenticate('oauth-bearer', { session: false }));
router.all('*', logRequest);
router.get("/books", permit('LibraryReader', 'LibraryAdmin'), getAllBooks);
router.post("/books", permit('LibraryAdmin'), addBook);
router.delete('/books/:id', permit('LibraryAdmin'), deleteBook);
router.use(genericErrorHandler);


function getAllBooks (req, res) {
    const apiUrl = 'http://localhost:3100/api/books';
    relayCall(req, res, apiUrl, 'GET', {});
}

function addBook (req, res) {
    const bookData = req.body;
    const apiUrl = 'http://localhost:3100/api/books';
    relayCall(req, res, apiUrl, 'POST', bookData);
}

function deleteBook (req, res) {
    const bookId = req.params.id;
    const apiUrl = `http://localhost:3100/api/books/${bookId}`;
    relayCall(req, res, apiUrl, 'DELETE', {});
}

function relayCall(req, res, url, method, body) {
    logger.debug("About to call: " + url);
    acquireTokenOnBehalfOf(req.user.upn, getBearerToken(req), libraryApiID)
        .then(token => callApi(url, body, method, token))
        .then(libraryData => res.status(libraryData.statusCode).send(libraryData.body))
        .catch(error => apiCallErrorHandler(res, error, url))
}

function getBearerToken(req) {
    return req.headers.authorization.match(/^Bearer (.*)/)[1];
}

function callApi(url, body, method, token) {
    const options = {
        url,
        method,
        body: body,
        auth: {
            bearer: token
        },
        json: true,
        resolveWithFullResponse: true
    };
    logger.debug("Calling " + url);
    return rp(options)
        .then(response => {
            logger.debug(JSON.stringify({statusCode: response.statusCode, body: response.body}));
            return response;
        });
}

// noinspection JSUnusedLocalSymbols
function genericErrorHandler (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send(err.stack);
}

function apiCallErrorHandler(res, error, url) {
    logger.error(`Error calling URL: ${url} - ${error.stack}`);
    if (error.statusCode) {
        res.status(error.statusCode).send(error.message);
    }
    else {
        res.status(500).send(error.message);
    }
}

function logRequest(req, res, next) {
    let payloadLog = '';
    if (req.body && Object.keys(req.body).length > 0) {
        payloadLog = 'Payload: ' + JSON.stringify(req.body);
    }
    logger.debug(`${req.method} ${req.url} ${payloadLog}`);
    next();
}

module.exports = router;