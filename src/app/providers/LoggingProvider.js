const { DEBUG, INFO, WARNING, CRITICAL, Logger } = require('../support/logging/Logger');
const { SingleLogger } = require('../support/logging/SingleLogger');
const { DailyLogger } = require('../support/logging/DailyLogger');
const { SlackLogger } = require('../support/logging/SlackLogger');
const {Provider} = require('../../framework/providers/Provider');
const log_conf = require('../../config/logging');


class LoggingProvider extends Provider {

    static async register(){

        const channel = log_conf.channel;

        if(channel == STACK){
    
            const stack = log_conf.stack;
    
            for(let key of stack){

                const logger = LOGGERS[key] ?? null;

                if(logger)
                    CHANNELS.push(new logger())
            }
    
            if(CHANNELS.length <= 0){
                CHANNELS.push(new LOGGERS['console'])
            }
    
        } else {
            const logger = LOGGERS[channel] ?? LOGGERS['console'];
            CHANNELS.push(new logger())
        }
    
        return CHANNELS.length > 0;

    }

    static factory(){
        return Log;
    }

}

const STACK = 'stack';

const LOGGERS = {
    'console': Logger,
    'single': SingleLogger,
    'daily': DailyLogger,
    'slack': SlackLogger
}

const CHANNELS = []

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
    LoggingProvider, Log, CHANNELS, STACK
}