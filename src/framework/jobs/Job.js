const { Log } = require("../../app/providers/LoggingProvider");
const { QueueProvider } = require("../../app/providers/QueueProvider");


class Job {

    static channel(){
        return 'default';
    }

    constructor(data={}, config={}){
        // this.handle = this.wrapHandler()
        this.payload = data;
        this.config = config;
    }

    data(){
        return {};
    }

    async handle(){
        return true;
    }


    static Queue(payload){
        const channel = this.channel();
        return QueueProvider.Queue({channel, payload});
    }

}

module.exports = {
    Job
}