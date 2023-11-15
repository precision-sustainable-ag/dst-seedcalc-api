const axios = require('axios');

const SPECIES_SELECTOR_SERVICE_URL = 'https://developapi.covercrop-selector.org';

const SELECTOR_API_CLIENT = axios.create({
  baseURL: SPECIES_SELECTOR_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get mix
 */

const { SeedRateCalculator } = require("../../../src/app/facades/SeedRateCalculator");

const DEFAULT_GET_MIX_PARAMS = [
    {cropId:6, regions:[2], context:'seed_calc'}, // Radish, Oilseed - Zone 5
    {cropId:5, regions:[2], context:'seed_calc'}, // Rape, Oilseed, Winter - Zone 5
];

async function getMix(params){
    if(!params) params = DEFAULT_GET_MIX_PARAMS;

    const MIX = [];

    for(let param of params){
        let uri = `/v2/crops/${param.cropId}?context=seed_calc`;
        if(param.regions.length > 0){
            for(let region of param.regions){
                uri = `${uri}&regions=${region}`;
            }
        }

        await SELECTOR_API_CLIENT.get(uri)
        .then(response => {
            const data = response.data.data;
            MIX.push(data);
        })
        .catch(e => {
            console.log(e);
            console.log(param);
            throw new Error(`Failed to get Crop (${param.cropId}) for Regions (${param.regions.join(', ')})`);
        });
    }

    return MIX;
}


// this is an Immediately Invoked Function Expression (IIFE), is a function that executes as soon as it is defined.
const main = (async () => {

    // lets get out mix, and create a calculator instance

    const mix = await getMix();
    const council = 'NECCC';

    const calculator = new SeedRateCalculator({mix, council});

    const [radish, rapeseed] = mix;
    const options = {
        [radish.id] : {},
        [rapeseed.id]: {},
    };


    const printSheet = {
        radish: {
            singleSpeciesSeedingRate: calculator.getCrop(radish).coefficients.singleSpeciesSeedingRate,
            seedsPerLb: calculator.getCrop(radish).seedsPerPound,
            group: calculator.getCrop(radish).group,
            soilFertilityModifier: calculator.soilFertilityModifier(radish, options[radish.id]),
            sumSpeciesOfGroupInMix: calculator.speciesInMix[calculator.getCrop(radish).group],
            percentOfRte: calculator.getDefaultPercentOfSingleSpeciesSeedaingRate(radish,options[radish.id]),
            seedingRate: calculator.seedingRate(radish, options[radish.id]),
            percentInMix: `${(calculator.percentInMix(radish, options) * 100).toFixed(2)} %`,
            seedsPerAcre: calculator.seedsPerAcre(radish,options[radish.id]),
            lbsPerAcre: calculator.poundsForPurchase(radish, {
                ...options[radish.id],
                acres: 1
            }),
        },
        rapeseed: {
            singleSpeciesSeedingRate: calculator.getCrop(rapeseed).coefficients.singleSpeciesSeedingRate,
            seedsPerLb: calculator.getCrop(rapeseed).seedsPerPound,
            group: calculator.getCrop(rapeseed).group,
            soilFertilityModifier: calculator.soilFertilityModifier(rapeseed, options[rapeseed.id]),
            sumSpeciesOfGroupInMix: calculator.speciesInMix[calculator.getCrop(rapeseed).group],
            percentOfRate: calculator.getDefaultPercentOfSingleSpeciesSeedingRate(rapeseed,options[rapeseed.id]),
            seedingRate: calculator.seedingRate(rapeseed, options[rapeseed.id]),
            percentInMix: `${(calculator.percentInMix(rapeseed, options) * 100).toFixed(2)} %`,
            seedsPerAcre: calculator.seedsPerAcre(rapeseed,options[rapeseed.id]),
            lbsPerAcre: calculator.poundsForPurchase(rapeseed, {
                ...options[rapeseed.id],
                acres: 1
            }),
        },
    }

    console.log(printSheet);

})();