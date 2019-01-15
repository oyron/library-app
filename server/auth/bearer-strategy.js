const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const authConfig = require('./auth-config');


const options = {
    identityMetadata: `${authConfig.authorityUrl}/.well-known/openid-configuration`,
    clientID: authConfig.clientID,
    loggingLevel: "warn"
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
    const user = {
        upn: token.upn,
        name: token.name,
        roles: token.roles
    };
    return done(null, user, token);
});


module.exports = bearerStrategy;
