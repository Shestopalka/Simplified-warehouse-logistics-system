import jwt from 'jsonwebtoken';

const JWT_SECRET = '12345'

export function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    
    if(!token) {
        res.writeHead(401, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify({message: 'Token mising'}));
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.writeHead(403, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({message: "Invalid token"}));
    }
}