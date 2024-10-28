// const Setup = require('./Setup');

const { Crop } = require("../app/facades/Crop");
const { Toolbelt } = require("./utils/Toolbelt");

// const { expect } = require('jest-expect-message');


test("Retrieved All MCCC Crops From Selector", async () => {
    const {failed_to_fetch} = process.testSetup.mccc;
    let failedParams = [];
    
    failed_to_fetch.map(({params}) => {
        failedParams.push(`(${params.crop_id},${params.region_id})`);
    })    
    
    let failedParamsString = failedParams.join(',');
    
    expect(failed_to_fetch.length,`Failed To Fetch Params: ${failedParamsString}`).toBe(0);
});

test('All Retrieved MCCC Crop Data Builds to Crop Object', async () => {
    
    const {api_crop_list, params} = process.testSetup.mccc;
    let failedCrops = [];
    let failedIndices = [];
    let failedMessages = [];

    api_crop_list.map(({index,data}) => {
        try {
            const crop = new Crop('mccc',data);
        } catch(e){
            failedIndices.push(`${index}`);
            failedMessages.push(`${e.message}`);
            failedCrops.push({
                index,
                crop_id: data.id,
                region_id: params[index].region_id,
                message: e.message
            })
        }

    })

    await Toolbelt.Log.WriteObject(['mccc_crops_test'],{failedCrops});

    expect(failedCrops.length,`Failed to initialize ${failedCrops.length} crops. Check logs/mccc_crops_test/failedCrops.json for failed objects.`).toBe(0)
    
});


