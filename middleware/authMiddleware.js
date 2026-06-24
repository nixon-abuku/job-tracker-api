// IMPORT JWT 
const jwt = require('jsonwebtoken');

// MIDDLEWARE FUNCTION 
function authMiddleware(req, res, next){
    //
    const authHeader = req.get('Authorization');
    
    // CHECK IF AUTHORIZATION HEADER IS MISSING 
    if (!authHeader){
        return res.status(401).json({message: "Authorization token required"});
    }

    //CHECK AUTH HEADER FORMAT
    const authHeaderFormat = authHeader.startsWith("Bearer ");
    if (authHeaderFormat === false){
        return res.status(401).json({message: "Wrong Authorization token format"});
    }
    
    //CHECK IF TOKEN IS MISSING 
    const splitAuthHeader = authHeader.split(" ");
    const token = splitAuthHeader[1];
    if (!token){
        return res.status(401).json({message: "The token is missing"});
    }

    // VERIFY THE TOKEN 
    try {
        const verification = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verification.userId;
        return next();
    }
    catch(error){
        console.error(error);
        return res.status(401).json({message: "Invalid or expired token"});
    }

}

module.exports = authMiddleware;