const { Crop } = require("../../src/app/facades/Crop");
const { SeedRateCalculator } = require("../../src/app/facades/SeedRateCalculator");
const axios = require('axios');

const SPECIES_SELECTOR_SERVICE_URL = 'https://developapi.covercrop-selector.org';

const SELECTOR_API_CLIENT = axios.create({
  baseURL: SPECIES_SELECTOR_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function getCouncil(){
    const STATES = await SELECTOR_API_CLIENT.get('/v2/regions?locality=state&context=seed_calc')
    .then(response => response.data.data)
    .catch(err => {
        console.log(err);
        throw new Error('Failed to get States List.')
    });

    for(let state of STATES){
        if(state.label === 'Indiana'){
            return state.parents[0].shorthand;
        }
    }

    throw new Error('Could not locate Indiana State.');
}

async function getMix(){
    const PEA_WINTER = await SELECTOR_API_CLIENT.get(`/v2/crops/148?regions=18&context=seed_calc&regions=180`)
        .then(response => response.data.data)
        .catch(e => {
            console.log(e);
            throw new Error('Failed to get Pea Winter');
        });
    const OATS_SPRING = await SELECTOR_API_CLIENT.get(`/v2/crops/23?regions=18&context=seed_calc&regions=180`)
        .then(response => response.data.data)
        .catch(e => {
            console.log(e);
            throw new Error('Failed to get Oats Spring');
        });
    const RAPESEED = await SELECTOR_API_CLIENT.get(`/v2/crops/161?regions=18&context=seed_calc&regions=180`)
        .then(response => response.data.data)
        .catch(e => {
            console.log(e);
            throw new Error('Failed to get Rapeseed');
        });

    return [PEA_WINTER, OATS_SPRING, RAPESEED];
}

function mixSeedingRateBeforeAfter({mix, council, crop, calculator}){


    console.log('before:',crop.mixSeedingRate);
    
    calculator.mixSeedingRate(mix[0]);
    
    console.log('after:',crop.mixSeedingRate);
}

function percentInMix({calculator,crop}){
    console.log(crop.label,'- 1:',calculator.percentInMix(crop, {
        148: { seedsPerPound: 3500, mixSeedingRate: 14.83 }, // crop specific options, where property key is crop.id
        23: { seedsPerPound: 13000, mixSeedingRate: 15.97 }, // crop specific options, where property key is crop.id
        161: { seedsPerPound: 157000, mixSeedingRate: 0.88}, // crop specific options, where property key is crop.id
    }));
}


function nrcsValidPercentInMix({calculator, crop}){
    const defaultPercentInMix = calculator.percentInMix(crop);
    console.log('Default % in mix', defaultPercentInMix);
    console.log('Passing NRCS?', calculator.nrcs.isValidPercentInMix(crop));
    
    const customOptions = {
        148: { seedsPerPound: 3500, mixSeedingRate: 14.83 }, // crop specific options, where property key is crop.id
        23: { seedsPerPound: 13000, mixSeedingRate: 15.97 }, // crop specific options, where property key is crop.id
        161: { seedsPerPound: 157000, mixSeedingRate: 0.88}, // crop specific options, where property key is crop.id
    };
    
    const customPercentInMix = calculator.percentInMix(crop,customOptions);
    console.log('custom % in mix', customPercentInMix);
    console.log('Passing NRCS?', calculator.nrcs.isValidPercentInMix(crop,customOptions));
}

function nrcsValidSeedingRate({calculator,crop}){
    // imitates the values considered in the MCCC Airtable as of 6/5/2023
    // https://airtable.com/appwVLKETedegCglQ/tblbF2v9Pc94kE7e3/viwoH0nHGCMDPUdgZ?blocks=hide
    const cropMixSeedingRateOptions = {
        plantingMethod: 'Precision',
    };

    const valid = calculator.nrcs.isValidSeedingRate(crop, cropMixSeedingRateOptions);
    console.log('Is valid?',valid);
}

function nrcsValidSoilDrainage({calculator, crop}){
    const userInput = ['Well Drained','Excessively Drained']; // this should fail for mix[2] (rapeseed)
    // const userInput = ['Well Drained','Muck - Well Drained']; // this should pass for mix[2] (rapeseed)

    crop = calculator.getCrop(crop); // retrieve the Crop object instance from the calculator object.
    console.log('Crops Soil Drainages:', crop.soilDrainage);
    const valid = calculator.nrcs.isValidSoilDrainage(crop, { soilDrainage: userInput });
    console.log('Is valid?',valid);
}


function nrcsValidPlantingDate({calculator, crop}){
    const userInput = '3/31';

    const valid = calculator.nrcs.isValidPlantingDate(crop,{plantingDate: userInput});

    console.log('valid date?',valid);
}




function initCrop(struct){
    const crop = Crop.factory('mccc',struct);
    console.log('Created crop',crop);
    console.log('Planting Dates:', crop.plantingDates);

    return crop;
}

async function main(){
    const council = await getCouncil();
    const mix = await getMix();

    const calculator = new SeedRateCalculator({mix, council});

    let crop = calculator.getCrop(mix[0]);

    console.log('Crops:')
    for(let c of mix){
        console.log(c.label,':',c.id);
    }
    console.log('')

    // const customCrop = initCrop({id:1, label:'Custom Crop', attributes:{
    //     'Coefficients': {
    //         'Single Species Seeding Rate': {values:[1]},
    //         'Broadcast Coefficient': {values:[1]},
    //         'Aerial Coefficient': {values:[1]},
    //         'Precision Coefficient': {values:[1]},
    //         '% Live Seed to Emergence': {values:[1]},
    //         'Max % Allowed in Mix': {values:[1]},
    //         '% Chance of Winter Survial': {values:[1]},
    //     },
    //     'Planting Information': {
    //         'Seed Count': {values:[1]},
    //         'Planting Methods': {values:['aerial','drilled']}
    //     },            
    //     "Planting and Growth Windows": {
    //         "Reliable Establishment": {
    //             "values": [
    //                 "3/31/2009 - 06/06/2009",
    //                 "08/29/2009 - 09/19/2009"
    //             ]
    //         },
    //     },
    //     "NRCS": {
    //         'Single Species Seeding Rate': {values: [1]},
    //     }
    // }});

    percentInMix({council,mix,calculator,crop});
    
    nrcsValidPercentInMix({calculator, crop});

    nrcsValidPlantingDate({calculator,crop:mix[2]});

    nrcsValidSeedingRate({calculator,crop:mix[2]});

    nrcsValidSoilDrainage({calculator,crop:mix[2]});

}



main();