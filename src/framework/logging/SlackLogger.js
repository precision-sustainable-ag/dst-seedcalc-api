const { IncomingWebhook } = require('@slack/webhook');
const log_conf = require('../../config/logging');
const { Logger } = require('./Logger');

const WebHookURL = log_conf.slack.webhook;
const WebHook = new IncomingWebhook(WebHookURL);

class SlackLogger extends Logger {
    
    configKey(){
        return 'slack';
    }

    write(stmnt, level){
        return WebHook.send({
            icon_emoji: level.slack.emoji,
            username: `${stmnt.heading} [${stmnt.time}]`,
            attachments: [{
                fallback: stmnt.flat,
                title: stmnt.level,
                text: stmnt.message,
                color: level.slack.color
            }]
        });
    }

}

module.exports = {
    SlackLogger, default: SlackLogger
}