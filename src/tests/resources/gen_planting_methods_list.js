const failedCrops = require('../../../logs/mccc_crops_test/failedCrops.json');


async function main(){

    let list = []

    failedCrops.forEach(x => {
        list.push(`(cs.crop_id = ${x.crop_id} and cs.region_id = ${x.region_id})`);
    })

    console.log(list.join('\nor'));

}

main();