const logger = require('../logger');

function permit(...allowedRoles) {
    function isAllowed(userRoles) {
        return userRoles  //Determine if any of the userRoles is in the list of allowedRoles
            .map(userRole => allowedRoles.indexOf(userRole) > -1)
            .reduce((acc, curr) => acc || curr, false);
    }

    function validate(req, res, next) {
        if (req.user && isAllowed(req.user.roles)) {
            logger.debug("User is authorized");
            next(); // role is allowed, so continue on the next middleware
        }
        else {
            res.status(403).json({message: "Forbidden"}); // user is forbidden
        }
    }

    return validate;
}

module.exports = permit;