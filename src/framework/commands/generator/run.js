const { argv } = require('../Argv');
const { exec } = require('child_process');
const { Log } = require('../../../app/providers/LoggingProvider');

function buildCommand({action, type, args}){

    type = type ?? 'gen';
    
    let command = `npx --prefix ./_generator hygen ${action} new:${type}`;
    console.log('BUILD',action,type,args);
    for(let [key, val] of Object.entries(args)){
        command = `${command} --${key}=${val}`;
    }

    console.log('Command',command);

    return command;
}

async function runAll(args){
    const actions = ['controller','model','requests','resources','router'];
    for(let action of actions){
        await RunAction({action, type:null, args});
    }
}

async function runRequests(args){
    const types = ['create','delete','list','retrieve','update'];
    for(let type of types){
        await RunAction({action:'request',type,args});
    }
}

async function runResources(args){
    const types = ['create','delete','list','retrieve','update'];
    for(let type of types){
        await RunAction({action:'resource',type,args});
    }

}

const ACTION_SCRIPTS = {
    'all': (action, type, args)=>{return runAll(args);},
    'requests': (action, type, args)=>{return runRequests(args);},
    'resources': (action, type, args)=>{return runResources(args);},
}

async function RunAction({action, type, args}){
    if(ACTION_SCRIPTS[action]){
        return await ACTION_SCRIPTS[action](action, type, args)
    }

    const command = buildCommand({action,type,args});


    return await exec(command, (error, stdout, stderr)=>{
        if(error) Log.Critical({heading:command, message:{error:error.message, stack:error.stack}});
        if(stdout) {
            Log.Debug({heading:command, message:stdout});
            // console.log(stdout);
        }
        if(stderr) {
            Log.Debug({heading:command, message: stderr});
            // console.log(stderr);
        }
    });

}

function main(){

    const args = argv();
    Log.Info({heading:`Running Generator Action`, message:args});
    RunAction(args);
}

main();