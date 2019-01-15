const authConfig = require('./auth-config');
const rp = require('request-promise');
const logger = require('../logger');
const NodeCache = require( "node-cache" );

const tokenCache = new NodeCache();


function acquireTokenOnBehalfOf(upn, tokenString, resourceId) {
    const key = getKey(upn, resourceId);
    const cachedToken = tokenCache.get(key);
    if (cachedToken) {
        logger.debug("Using cached token for resource " + resourceId);
        return Promise.resolve(cachedToken);
    }
    return acquire(tokenString, resourceId)
        .then(accessToken => {
            tokenCache.set(key, accessToken);
            return accessToken;
        });
}

function acquire(userToken, resourceId) {
    logger.debug('Acquiring token for resource ' + resourceId);
    const options = {
        method: 'POST',
        uri: authConfig.authorityUrl + '/oauth2/token',
        formData: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: userToken,
            client_id: authConfig.clientID,
            client_secret: authConfig.clientSecret,
            resource: resourceId,
            requested_token_use: 'on_behalf_of',
            scope: 'openid'
        }
    };
    return rp(options)
        .then(responseString => JSON.parse(responseString).access_token)
        .catch(error => {
            logger.error('Error getting on-behalf-of token: ' + error);
            throw error;
        })
}

function getKey(upn, resourceId) {
    return `${upn}-${resourceId}`;
}

module.exports = acquireTokenOnBehalfOf;