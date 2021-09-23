const jwt = require('jsonwebtoken');

const guard = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    return jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, decode) => {
        if (err) throw new Error('something went wrong with verify');
    
        req.user = decode;
        next();
      });
};

module.exports.guard = guard;