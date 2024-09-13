
const { AppProvider } = require("../app/providers/AppProvider");
const { SelectorService } = require("../app/services/SelectorService");

const MCCC_CROP_REGIONS_ARRAY = require('./resources/mccc_seedcalc_crops_by_region.json');

async function SetupMcccCropsData() {
    const container = {
        params: MCCC_CROP_REGIONS_ARRAY,
        api_crop_list: [],
        failed_to_fetch: [],
    }

    for(let [index, params] of MCCC_CROP_REGIONS_ARRAY.entries()) {
        const apiCropData = await SelectorService
            .GetCrop({crop_id:params.crop_id, region_ids: [params.region_id]})
            .then( response => response?.data?.data);
        if(apiCropData) container.api_crop_list.push({index,data:apiCropData});
        else container.failed_to_fetch.push({index,params});
    }

    return container;
}

module.exports = async () => {
    console.log('\nPerforming Test Setup:')
    console.log('\t - Gathering MCCC Crops ...')
    const MCCC_CROPS_DATA = await SetupMcccCropsData();
    
    console.log('\nSetup Complete!')
    // const app = await AppProvider.testFactory();
    process.testSetup = {
        // app,
        mccc: MCCC_CROPS_DATA
    }

}



