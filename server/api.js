const express = require('express');
const router = express.Router();
const logger = require('./logger');
const bearerStrategy = require('./auth/bearer-strategy');
const acquireTokenOnBehalfOf = require('./auth/aquire-token');
const rp = require('request-promise');
const passport = require('passport');
passport.use(bearerStrategy);
router.use(passport.initialize());

router.all('*', passport.authenticate('oauth-bearer', { session: false }));
router.all('*', logRequest);
router.get("/books", getAllBooks);
router.post("/books", addBook);
router.use(genericErrorHandler);


function getAllBooks (req, res) {
    const apiUrl = 'http://localhost:3100/api/books';
    acquireTokenOnBehalfOf(getBearerToken(req))
        .then(token => callApi(apiUrl, {}, 'GET', token))
        .then(libraryData => res.send(libraryData.body))
        .catch(error => apiCallErrorHandler(res, error))
}

function addBook (req, res) {
    const bookData = req.body;
    const apiUrl = 'http://localhost:3100/api/books';
    acquireTokenOnBehalfOf(getBearerToken(req))
        .then(token => callApi(apiUrl, bookData, 'POST', token))
        .then(libraryData => res.send(libraryData.body))
        .catch(error => apiCallErrorHandler(res, error))
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
    return rp(options)
}

// noinspection JSUnusedLocalSymbols
function genericErrorHandler (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send(err.stack);
}

function apiCallErrorHandler(res, error) {
    logger.error(error.stack);
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