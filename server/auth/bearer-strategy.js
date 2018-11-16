const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const authConfig = require('./auth-config');

const credentials = {
    identityMetadata: `${authConfig.authorityUrl}/.well-known/openid-configuration`,
    clientID: authConfig.clientID
};

const bearerStrategy = new BearerStrategy(credentials, (token, done) => {
    return done(null, token.upn, token);
});

module.exports = bearerStrategy;
