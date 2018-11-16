const authConfig = require('./auth-config');
const rp = require('request-promise');
const logger = require('../logger');
const NodeCache = require( "node-cache" );

const tokenCache = new NodeCache();


function acquireTokenOnBehalfOf(userToken) {
    const cachedToken = tokenCache.get(userToken);
    if (cachedToken) {
        return Promise.resolve(cachedToken);
    }
    return acquire(userToken);
}

function acquire(userToken) {
    const options = {
        method: 'POST',
        uri: authConfig.authorityUrl + '/oauth2/token',
        formData: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: userToken,
            client_id: authConfig.clientID,
            client_secret: process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : '<client secret>',
            resource: '86a932f7-e20c-48b9-a9a0-70bddb783f34',
            requested_token_use: 'on_behalf_of',
            scope: 'openid'
        }
    };
    logger.debug('Getting on-behalf-of token for user token ' + userToken);
    return rp(options)
        .then(responseString => {
            const tokenResponse = JSON.parse(responseString);
            tokenCache.set(userToken, tokenResponse.access_token, tokenResponse.expires_in);
            logger.debug('Got on-behalf-of token: ' + tokenResponse.access_token);
            return tokenResponse.access_token;
        })
        .catch(error => {
            logger.error('Error getting token: ' + error);
            throw error;
        })
}

module.exports = acquireTokenOnBehalfOf;