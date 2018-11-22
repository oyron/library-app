const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const authConfig = require('./auth-config');
const acquireTokenOnBehalfOf = require('./aquire-token');
const NodeCache = require( "node-cache" );
const logger = require('../logger');
const rp = require('request-promise');

const rolesCache = new NodeCache();

const options = {
    identityMetadata: `${authConfig.authorityUrl}/.well-known/openid-configuration`,
    clientID: authConfig.clientID,
    passReqToCallback: true,
    loggingLevel: "warn"
};

const groupToRoleMapping = new Map([
    ['167818bc-d792-4fab-9776-d99fc39ccbb9', 'LibraryReader'],
    ['409e1942-f763-4a17-96a6-722256b202f2', 'LibraryAdmin']]);

const bearerStrategy = new BearerStrategy(options, (req, token, done) => {
    findRoles(token.upn, getBearerToken(req))
        .then(roles => {
            const user = {
                upn: token.upn,
                name: token.name,
                roles
            };
            return done(null, user, token);
        });
});

function findRoles(upn, tokenString) { //map relevant security groups to application roles
    const cachedRoles = rolesCache.get(upn);
    if (cachedRoles) {
        logger.debug("Using cached roles: " + JSON.stringify(cachedRoles));
        return Promise.resolve(cachedRoles);
    }
    return aquireRoles(upn, tokenString)
        .then(roles => {
            rolesCache.set(upn, roles);
            return roles;
        });
}


function aquireRoles(upn, tokenString) {
    logger.debug("Acquiring user roles");
    return acquireTokenOnBehalfOf(upn, tokenString, 'https://graph.microsoft.com')
        .then(graphToken => {
            const options = {
                url: `https://graph.microsoft.com/v1.0/me/getMemberGroups`,
                method: 'POST',
                body: {
                    securityEnabledOnly: true
                },
                auth: {
                    bearer: graphToken
                },
                json: true
            };
            return rp(options);
        })
        .then(userGroups => {
            if (!userGroups.value) {
                return [];
            }
            const roles = userGroups.value
                .filter(group => groupToRoleMapping.has(group))
                .map(group => groupToRoleMapping.get(group));
            logger.debug("Roles found: " + JSON.stringify(roles));
            return roles;
        })
        .catch (error => {
            logger.error("Error getting roles: " + error);
            throw error;
        })
}

function getBearerToken(req) {
    return req.headers.authorization.match(/^Bearer (.*)/)[1];
}


module.exports = bearerStrategy;
