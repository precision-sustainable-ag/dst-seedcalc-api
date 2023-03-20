
let ARGV;

function argv(){
    if(ARGV) return ARGV;

    ARGV = {};

    const action =  process.argv[2];
    const _argv = process.argv.slice(3);
    const args = {};

    if(action.indexOf(':') === -1){
        ARGV['action'] = action;
    }
    else {
        const [generator, type] = action.split(':');
        ARGV['action'] = generator;
        ARGV['type'] = type;
    }

    for(let arg of _argv){
        if(arg.indexOf('=') === -1) {
            args[arg] = true;
        }
        else {
            const [key, val] = arg.split('=');
            args[key] = val;
        }
    }

    ARGV['args'] = args;

    return ARGV;
}


module.exports = {
    argv
}

