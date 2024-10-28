
const listData = require('./mccc_seedcalc_crops_by_region.json');
const failedIndicies = require('./failed_mccc_seedcalc_obj_init_indicies.json');
const { Toolbelt } = require('../utils/Toolbelt');

async function main(){

    await Toolbelt.Log.WriteObject(['logs'],{test:{one:'two',three:[true,false]}});
    const contianer = [];
    for(let index of failedIndicies){

    }

}

main();