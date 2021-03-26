const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const header = req.get('Authorization');

    if (!header) {
        req.isAuth = false;
        return next();
    }

    const bearerToken = header.split(' ')[1];
    if (!bearerToken || bearerToken === '') {
        req.isAuth = false;
        return next();
    }

    let token; 
    try {
        token = jsonwebtoken.verify(bearerToken, 'secret');
    } catch (error) {
        req.isAuth = false;
        return next();
    }
    
    if (!token) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = token.userId;
    req.email = token.email;
    next();
}