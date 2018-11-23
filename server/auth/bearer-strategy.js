const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const authConfig = require('./auth-config');


const options = {
    identityMetadata: `${authConfig.authorityUrl}/.well-known/openid-configuration`,
    clientID: authConfig.clientID,
    passReqToCallback: true,
    loggingLevel: "warn"
};

const bearerStrategy = new BearerStrategy(options, (req, token, done) => {
    const user = {
        upn: token.upn,
        name: token.name,
        roles: token.roles
    };
    return done(null, user, token);
});


module.exports = bearerStrategy;
