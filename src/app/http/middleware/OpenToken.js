const { Log } = require('../../providers/LoggingProvider');
const { JwtService } = require('../../services/jwt/JwtService');



module.exports =  async (req,res,next)=>{
    try{
        req.token = await JwtService.decode(req.headers.authorization)
        req.authorized = true
        Log.Debug({heading:'Validated token'})
        next();
    } catch(err){
        if(!(req.authorized === true)) req.authorized = false
        Log.Debug({heading:'Invalid token'})
        next();
    }
}