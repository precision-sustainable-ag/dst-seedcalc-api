
// 3rd party packages    
const readline = require('readline');

async function promptInput(question, callback){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve,reject)=>{

        rl.question(question, (answer) => {
            callback(answer);
            rl.close();
            resolve();
        });

    });
}


const IS_MIX = (mix) => mix.length > 1;

const MIX_TYPE_COUNTS = (mix) => {
    const counts = {};
    for(let crop of mix){
        if(typeof counts[crop.group] === 'undefined') counts[crop.group] = 1;
        else counts[crop.group] += 1;
    }
    return counts;
}

const SUM_OF_TYPE = (T, mix) => {
    const counts = MIX_TYPE_COUNTS(mix);
    return counts[T] ?? 0;
}

const SUM_SPECIES_IN_MIX = (mix) => {
    const count = MIX_TYPE_COUNTS(mix);
    return Object.keys(count).length;
}

module.exports = {
    promptInput, IS_MIX, MIX_TYPE_COUNTS, SUM_OF_TYPE, SUM_SPECIES_IN_MIX
}