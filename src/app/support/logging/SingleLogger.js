const fs = require('fs');
const { app_path } = require('../helpers/path');
const { Logger, LOG_LEVELS } = require('./Logger');

class SingleLogger extends Logger{
    
    configKey(){
        return 'single';
    }

    write(stmnt){
        fs.appendFile(
            app_path('storage/logs/express.log'),
            stmnt.flat, 
            (error)=>{
                if(error) console.log(error)
        });
    }

}

module.exports = {
    SingleLogger, default:SingleLogger
}