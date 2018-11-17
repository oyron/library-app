const express = require('express');
const router = express.Router();
const logger = require('./logger');
const bearerStrategy = require('./auth/bearer-strategy');
const acquireTokenOnBehalfOf = require('./auth/aquire-token');
const rp = require('request-promise');
const passport = require('passport');
passport.use(bearerStrategy);

router.get('*', logRequest);
router.get("/books", passport.authenticate('oauth-bearer', { session: false }), booksHandler);
router.use(errorHandler);


function booksHandler (req, res) {
    const apiUrl = 'http://localhost:3100/api/books';
    acquireTokenOnBehalfOf(getBearerToken(req))
        .then(token => callApi(apiUrl, token))
        .then(libraryData => res.send(libraryData.body))
        .catch(error => {
            logger.error(error);
            if (error.statusCode) {
                res.status(error.statusCode).send(error.message);
            }
            else {
                res.status(500).send(error.message);
            }
        })
}

function getBearerToken(req) {
    return req.headers.authorization.match(/^Bearer (.*)/)[1];
}

function callApi(url, token) {
    const options = {
        url,
        auth: {
            bearer: token
        },
        json: true,
        resolveWithFullResponse: true
    };
    return rp(options)
}

// noinspection JSUnusedLocalSymbols
function errorHandler (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send(err.stack);
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