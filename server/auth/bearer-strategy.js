const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const authConfig = require('./auth-config');

const options = {
    identityMetadata: `${authConfig.authorityUrl}/.well-known/openid-configuration`,
    clientID: authConfig.clientID,
    passReqToCallback: false,
    loggingLevel: "warn"
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
    return done(null, token.upn, token);
});

module.exports = bearerStrategy;
