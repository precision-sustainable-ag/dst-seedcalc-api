---
to: src/app/jobs/<%= Name %>Job.js
---

class <%= Name %>Job {

    /**
    * channel for this job to run on.
    * channels are handled FIFO
    */
    static channel(){
        return 'default';
    }

    constructor(data={}, config={}){
        this.payload = data;
        this.config = config;
    }

    data(){
        return {};
    }

    /**
    * should return true / false for if job was properly handled.
    */
    async handle(){
        return true;
    }

}

module.exports = {
    <%= Name %>Job
}