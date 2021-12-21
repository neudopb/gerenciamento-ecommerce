const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) 
        throw new Error('Unauthorized - Nenhum token fornecido');
    
    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        throw new Error('Unauthorized - Token erro');
        
    const [scheme, token] = parts;
        
    if(!/^Bearer$/i.test(scheme))
        throw new Error('Unauthorized - Token malformatado');

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) throw new Error('Unauthorized - Token invalido');
        
        req.userId = decoded.params.id;
        return next();
    });

}