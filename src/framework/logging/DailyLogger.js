const fs = require('fs');
const { app_path } = require('../helpers/path');
const { Logger } = require('./Logger');
const {DateTime} = require('luxon');

class DailyLogger extends Logger {

    configKey(){
        return 'daily';
    }

    write(stmnt){
        const time = DateTime.now();
        fs.appendFile(
            app_path(`storage/logs/express-${time.day}-${time.month}-${time.year}.log`),
            stmnt.flat,
            (error)=>{
                if(error) console.log(error)
        });
    }

}

module.exports = {
    DailyLogger, default:DailyLogger
}