
const log_conf = require('../../config/logging');
const { DailyLogger } = require('./DailyLogger');
const { Logger } = require('./Logger');
const { SingleLogger } = require('./SingleLogger');
const { SlackLogger } = require('./SlackLogger');

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

const LOGGERS = {
    'console': Logger,
    'single': SingleLogger,
    'daily': DailyLogger,
    'slack': SlackLogger
}

class Log { 

    static Debug({message,heading}){
        const level = DEBUG;
        Log.log({message, heading, level});
    }

    static Info({message,heading}){
        const level = INFO;
        Log.log({message, heading, level});
    }

    static Warning({message,heading}){
        const level = WARNING;
        Log.log({message, heading, level});
    }

    static Critical({message,heading}){
        const level = CRITICAL;
        Log.log({message, heading, level});
    }

    static log({message, heading, level}){

        if (CHANNELS.length <= 0) {  
            const logger = new LOGGERS['console']();
            logger.log({message,heading,level});
            return false;
        }

        for(let channel of CHANNELS){
            channel.log({message, heading, level})
        }

        return true;

    }

}

module.exports = {
    Log, LOGGERS, DEBUG,INFO,WARNING,CRITICAL,LOG_LEVELS
}