const { Log } = require('../../providers/LoggingProvider');
const { JwtService } = require('../../services/jwt/JwtService');



module.exports =  (req,res,next)=>{
    req.authorized = true;
    next();
}