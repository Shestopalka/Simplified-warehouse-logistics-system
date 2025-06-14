const jwt = require('jsonwebtoken');

const JWT_SECRET = '12345';


class JwtStrategy{
    generateToken(payload){
        return jwt.sign(payload, JWT_SECRET, {expiresIn: "2h"});
    }

    verefyToken(token){
        return jwt.verify(token, JWT_SECRET);
    }
}

module.exports =  { JwtStrategy };
