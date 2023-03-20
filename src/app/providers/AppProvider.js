
const { Log } = require('./LoggingProvider');
const {Provider} = require('../../framework/providers/Provider');
const express = require('express');
const { bootstrap } = require('../../bootstrap');
const { DatabaseProvider } = require('./DatabaseProvider');
const { ModelsProvider } = require('./ModelsProvider');
const app_conf = require('../../config/app');

class AppProvider extends Provider {

    static APP;

    static async factory(){

        if(this.APP){ return this.APP; }

        
        const app = express();

        const bootstrapped = await bootstrap(app);
        
        if(!bootstrapped){
            Log.Critical({message:`Failed to instantiate ${app_conf.name}.`, heading:'Bootstrapping Failed.'})
            return null;
        } 

        return this.APP = app;

    }

    static async testFactory(){

        if(this.APP){ return this.APP; }

        const app = express();

        // we must register db provider first to set up the factory to run in memory database.
        await DatabaseProvider.registerInMemory();

        const bootstrapped = await bootstrap(app);

        // create fresh db.
        await DatabaseProvider.sync(ModelsProvider,{force:true});

        if(!bootstrapped){
            Log.Critical({message:`Failed to instantiate ${app_conf.name}.`, heading:'Bootstrapping Failed.'})
            return null;
        } 

        return this.APP = app;

    }

}


module.exports = {
    AppProvider
}
