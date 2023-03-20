const {env} = require('./kernel');

module.exports =  {
    channel: env.LOG_CHANNEL,
    exclude: {
        env: ['test']
    },
    stack: ['console','daily','slack'],
    single: {
        level: env.FILE_LOG_LEVEL ?? 'critical',
    },
    daily: {
        level: env.FILE_LOG_LEVEL ?? 'critical',
    },
    slack: {
        webhook: env.SLACK_WEBHOOK_URL,
        level: env.SLACK_LOG_LEVEL ?? 'critical',
        debug: {
            emoji: ':female_zombie:',
            color: '#FFD700'
        },
        info: {
            emoji: ':thought_balloon:',
            color: '#E6E6FA'
        },
        warning: {
            emoji: ':eyes:',
            color: '#FF8C00'
        },
        critical: {
            emoji: ':boom:',
            color: '#DC143C'
        },
    },
    /**
     * Console color reference:
     * https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
     */
    console: {
        level: env.CONSOLE_LOG_LEVEL ?? 'info',
        debug: {
            color: "\x1b[92m"
        },
        info: {
            color: "\x1b[96m"
        },
        warning: {
            color: "\x1b[93m"
        },
        critical: {
            color: "\x1b[91m"
        },
    },
}
