const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const AuthenticationContext = require('adal-node').AuthenticationContext;
const rp = require('request-promise');
const logger = require('./logger');

const authorityUrl  = "https://login.microsoftonline.com/StatoilSRM.onmicrosoft.com";
const clientID      = "13fd846e-088a-4014-8843-a7a539ec4c4c";

const tokenCache = {};

const credentials = {
    identityMetadata: `${authorityUrl}/.well-known/openid-configuration`,
    clientID: clientID
};

const bearerStrategy = new BearerStrategy(credentials, (token, done) => {
    const userId = token.upn;
    tokenCache[userId] = token;
    return done(null, userId, token);
});

const context = new AuthenticationContext(authorityUrl);

function aquireOnBehalfOfToken(userToken) {
    const options = {
        method: 'POST',
        uri: authorityUrl + "/oauth2/token",
        formData: {
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: userToken,
            client_id: clientID,
            client_secret: "<client secret>",
            resource: "86a932f7-e20c-48b9-a9a0-70bddb783f34",
            requested_token_use: "on_behalf_of",
            scope: "openid"
        }
    };
    logger.info("Getting token...");
    return rp(options)
        .then(responseString => {
            const response = JSON.parse(responseString);
            logger.info("Got token: " + response.access_token);

            return response.access_token;
        })
        .catch(error => {
            logger.error("Error getting token: " + error);
            throw error;
        })

}

module.exports = {bearerStrategy, context, tokenCache, aquireOnBehalfOfToken};
