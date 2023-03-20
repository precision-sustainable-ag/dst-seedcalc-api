const { request } = require('express');
const { Log } = require('../../providers/LoggingProvider');



module.exports =  (scopes) => {
    
    if(scopes instanceof String){
        scopes = scopes.trim().split(',');
    }

    return (req,res,next)=>{
        const tokenScopes = req.token?.scopes;

        if(!tokenScopes){ 
            request.authorized = false;
            return next(); 
        }

        for(let scope of scopes){
            if(!tokenScopes.includes(scope)){
                request.authorized = false;
                return next();
            }
        }

        return next();
    }

}