const {DateTime} = require('luxon');
const log_conf = require('../../config/logging');
const app_conf = require('../../config/app');

const DEBUG  = {
    order: 1,
    label: 'DEBUG',
    slack: log_conf.slack.debug,
    console: log_conf.console.debug,
};

const INFO = {
    order: 2,
    label: 'INFO',
    slack: log_conf.slack.info,
    console: log_conf.console.info,
};

const WARNING = {
    order: 3,
    label: 'WARNING',
    slack: log_conf.slack.warning,
    console: log_conf.console.warning,
};

const CRITICAL = {
    order: 4,
    label: 'CRITICAL',
    slack: log_conf.slack.critical,
    console: log_conf.console.critical
};

const LOG_LEVELS = {
    info:INFO, debug:DEBUG, warning:WARNING, critical:CRITICAL
};


class Logger {

    configKey(){
        return 'console';
    }

    logLevel(){
        const conf = log_conf[this.configKey()]
        return LOG_LEVELS[conf?.level] ?? INFO;
    }

    log({message, heading, level}){
        if(log_conf.exclude.env.includes(app_conf.env)){ return; }

        const LOG_LEVEL = this.logLevel();

        if(!level) level = INFO;
        if(!heading) heading = level;
        
        if(!message){ message = '';}
        else if(message instanceof Error) message = message.stack
        else if(typeof message == 'object')message = JSON.stringify(message, null, "\t");

        const time = DateTime.now();
        // const stmnt = ;
        const stmnt = {
            level: level.label,
            time,
            heading,
            message,
            flat: `[${level.label}\t| ${time}] ${heading}\n${message}\n`
        }

        if(level.order >= LOG_LEVEL.order){
            this.write(stmnt, level);
        }

    }

    write(stmnt, level){
        // console.log(stmnt.flat);
        console.log("\x1b[1m", `[${stmnt.level}\t|${stmnt.time}]`,level.console.color,stmnt.heading)
        console.log("\x1b[0m",stmnt.message);
    }

}

module.exports = {
    DEBUG, INFO, WARNING, CRITICAL, LOG_LEVELS, Logger, default:Logger
}