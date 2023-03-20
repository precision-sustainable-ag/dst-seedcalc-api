const Queue = require("bull");
const redis_conf = require('../../config/redis');
const { Log } = require("./LoggingProvider");
const { Provider } = require('../../framework/providers/Provider');

// const QUEUES = {}

class QueueProvider extends Provider {

    static queues = {};

    static async register(queues){

        for(let [channel, config] of Object.entries(queues)){
            // create the bull queue
            config.queue = this.buildQueue(channel);
            // store this definition for later use
            this.queues[channel] = config;
            // tell the queue how to process a job on this channel
            // the config handler should be a job class
            const handler = this.queues[channel].handler;
            this.queues[channel].queue.process((payload,done) => {
                    // create the job class and handle the job.
                    const job = new handler(payload.data,payload);
                    // job handles should return true / false
                    job.handle().then(status => {
                        // successfully handled.
                        if(status == true) return done();
                        // unsuccessfully handled, unknown reason.
                        return done(new Error(JSON.stringify({
                            queue: payload.queue.name,
                            data: payload.data,
                            opts: payload.opts
                        }, null, "\t")));

                    }).catch(err => {
                        Log.Critical({heading:`Failed Job ${payload.queue.name}`, message:err});
                        done(err);
                    });
                });
        }

        return true;

    }


    static buildQueue(channel){
        Log.Debug({heading:'Redis Configuration',message:redis_conf});
        return new Queue(channel, { 
            redis: { 
                port: redis_conf.port, 
                host: redis_conf.host, 
                password: redis_conf.password 
            } 
        });
    }

    static Queue({channel, payload}){

        if(!(channel in this.queues)){
            Log.Critical({heading:'Invalid Channel Requests',message: {channel,payload}})
            return false;
        }

        const queue = this.queues[channel].queue;
        
        queue.add(payload);

        return true;
    }

    static factory() {

        return Job;

    }

}

module.exports = {
    QueueProvider
}