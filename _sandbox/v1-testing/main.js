const axios = require('axios');
const { SeedRateCalculator } = require('../../src/app/facades/SeedRateCalculator');

const SPECIES_SELECTOR_SERVICE_URL = 'http://localhost:3001';

const SELECTOR_CLIENT = axios.create({
  baseURL: SPECIES_SELECTOR_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * To get the regions you can use the following steps:
 * 1) have the user select a State
 *      endpoint: {species_selector_service}/v2/regions?locality=state&context=seed_calc
 *      NOTE: here we use the context=seed_calc to ensure we only get states applicable to the seed calc application.
 * 2) once the user has selected a state we can get the child regions for that state, 
 *    this could include multiple region "types" ex: County , Zone , etc.
 *    a user should be prompted to pick 1 item from each "region type".
 *      endpoint: {species_selector_service}/v2/regions/{stateId}
 *      NOTE: we used {stateId} but you can perform this call using the id value from any region, but not all regions have child regions.
 * 
 * NOTE: when compiling the users regions, 
 *       you should treat the state region id and all child region ids the same and contain them in the same array.
 * 
 * 
 * In order to populate a drop down menu options for an "attribute" such as soil drainage or planting methods
 * you can use the endpoint: {species_selector_service}/v2/attribute?regions={regionId}&label={attributeLabel}
 * 
 * example: {species_selector_service}/v2/attribute?regions=18&regions=180&label=planting methods
 * will retrieve the Planting Methods(label=planting methods) attribute for Adams County(region=180) Indiana(region=18)
 * to test this endpoint and view the documentation please visit: https://developapi.covercrop-selector.org/
 * 
 * For this example we will simply pre-populate user inputs,
 * using the example values found in the MCCC Seedcalc airtable:  https://airtable.com/appwVLKETedegCglQ/tblbF2v9Pc94kE7e3/viwKAiORg1e0SkzkQ?blocks=hide
 */
const MOCK_USER_INPUT = {
    council: 'MCCC', // this can be retrieved from the regions[i].parents[0].shorthand property where regions is the array returned from step 1 in regions steps above.
    regions: [18,180],  // Indiana, Adams County (values pulled from steps 1 & 2 of regions steps above.)
    acres: 50, // this is purley user input, value stored as valid number.
    plantingDate: '11/27/2021', // this is purely user input date MUST always follow the MM/DD/YYYY format.
    plantingMethod: "Precision", // picked from values using selector attribute endpoint above
    soilDrainage: [ "Well Drained", "Excessively Drained" ] // picked from values using selector attribute endpoint above
}

/**
 * STEP 1) CREATE MIX
 * Create a mix utilizing the Species Selector API
 * NOTE: ( if building mix off user input, these calls would be made on user click )
 * 
 * 
 * We will create the same mix as used in the MCCC Seedcalc Airtable.
 * ( Pea, Field/Winter , Oats, Spring , Rapeseed )
 * 
 * Pea, Field/Winter 
 * ID = 148
 * 
 * Oats, Spring
 * ID = 23
 * 
 * Rapeseed
 * ID = 161
 * 
 * ** Crops list can be retireved from {species_selector_service}/v2/crops?regions=18&regions=180
 * NOTE: this returns crops available for Indiana(region=18) and Adams County(region=180)
 *       You can further filter this list by requiring the crops to be NRCS approved by adding the context parameter.
 *       example: {species_selector_service}/v2/crops?regions=18&regions=180&context=nrcs
 * 
 * Theorhetically this is emulating the user selecting crops from the endpoint {species_selector_service}/v2/crops?regions=18&regions=180
 * to add to their mix, where the user first selects pea winter, then oats spring, and finally rapeseed.
 */
async function getMix(){
    const PEA_WINTER = await SELECTOR_CLIENT.get(`/v2/crops/148?regions=18&context=seed_calc&regions=180`)
        .then(response => response.data.data)
        .catch(e => null);
    const OATS_SPRING = await SELECTOR_CLIENT.get(`/v2/crops/23?regions=18&context=seed_calc&regions=180`)
    .then(response => response.data.data)
    .catch(e => null)
    const RAPESEED = await SELECTOR_CLIENT.get(`/v2/crops/161?regions=18&context=seed_calc&regions=180`)
    .then(response => response.data.data)
    .catch(e => null)

    return [PEA_WINTER, OATS_SPRING, RAPESEED];
}

/**
 * STEP 2) Create a SeedRateCalculator Instance
 */
async function createCalculator(mix, userInput){
    const calculator = new SeedRateCalculator({mix, userInput});
}


/**
 * PRINTER METHODS
 */
function printMix(mix){

    console.log('Current Mix')
    console.log('--------------------------------------------')
    for(let crop of mix){
        console.log(crop.label,`(ID: ${crop.id})`);
    }
    console.log('--------------------------------------------\n\n')
}
function printUserInput(ui){

    console.log('User Input')
    console.log('--------------------------------------------')
    for(let [key,val] of Object.entries(ui)){
        console.log(key,':',val);
    }
    console.log('--------------------------------------------\n\n')
}
function printMixOverview(calculator){

    console.log('Mix Overview')
    console.log('--------------------------------------------')
    console.log('Is Mix?', calculator.isMix);
    console.log('Mix Diversity:',calculator.mixDiversity); // county of group types in mix
    console.log('Species In Mix:', calculator.speciesInMix);
    console.log('--------------------------------------------\n\n')
}

function printMixRatiosPageDefault(calculator){

    const crop = calculator.crops[148];
    const percentOfRate = calculator.getDefaultPercentOfSingleSpeciesSeedingRate(crop);
    const mixSeedingRate = calculator.mixSeedingRate(crop);
    const seedsPerAcre = calculator.seedsPerAcre(crop);
    const plantsPerAcre = calculator.plantsPerAcre(crop);
    const plantsPerSqft = calculator.plantsPerSqft(crop);

    console.log(`Mix Ratio Page (${crop.label}) Default Vals.`)
    console.log('--------------------------------------------')
    console.log(`Single Species Seeding Rate PLS (${crop.coefficents.singleSpeciesSeedingRate}) x % of Single Species Seedings Rate (${percentOfRate.toFixed(2)}) = Mix Seeding Rate (${mixSeedingRate.toFixed(2)})`);
    console.log(`\t${crop.coefficents.singleSpeciesSeedingRate} x ${percentOfRate.toFixed(2)} = ${mixSeedingRate.toFixed(2)}`);
    console.log(`Seeds Per Pound (${crop.seedsPerPound}) x Mix Seeding Rate (${mixSeedingRate.toFixed(2)}) = Seeds Per Acre (${seedsPerAcre.toFixed(2)})`);
    console.log(`\t${crop.seedsPerPound} x ${mixSeedingRate.toFixed(2)} = ${seedsPerAcre.toFixed(2)}`);
    console.log(`Seeds Per Acre (${seedsPerAcre.toFixed(2)}) x % Survival (85%) = Plants Per Acre (${plantsPerAcre.toFixed(2)})`);
    console.log(`\t${seedsPerAcre.toFixed(2)} x 0.85 = ${plantsPerAcre.toFixed(2)}`);
    console.log(`Plants Per Acre (${plantsPerAcre.toFixed(2)}) / SqFt/Acre (43560) = Plants Per Sqft (${plantsPerSqft.toFixed(2)})`);
    console.log(`\t${plantsPerAcre.toFixed(2)} / 43560 = ${plantsPerSqft.toFixed(2)}`);
    console.log('--------------------------------------------\n\n')



}
function printMixRatiosPageCustom(calculator){

    const userInput = {
        singleSpeciesSeedingRate: 3,
        percentOfRate: 0.25,
    }

    const crop = calculator.crops[161];
    const percentOfRate = calculator.getDefaultPercentOfSingleSpeciesSeedingRate(crop,userInput);
    const mixSeedingRate = calculator.mixSeedingRate(crop,userInput);
    const seedsPerAcre = calculator.seedsPerAcre(crop,userInput);
    const plantsPerAcre = calculator.plantsPerAcre(crop,userInput);
    const plantsPerSqft = calculator.plantsPerSqft(crop,userInput);

    console.log(`Mix Ratio Page (${crop.label}) Custom Vals.`)
    console.log('--------------------------------------------')
    console.log(`Single Species Seeding Rate PLS (${userInput.singleSpeciesSeedingRate}) x % of Single Species Seedings Rate (${userInput.percentOfRate}) = Mix Seeding Rate (${mixSeedingRate.toFixed(2)})`);
    console.log(`\t${userInput.singleSpeciesSeedingRate} x ${userInput.percentOfRate} = ${mixSeedingRate.toFixed(2)}`);
    console.log(`Seeds Per Pound (${crop.seedsPerPound}) x Mix Seeding Rate (${mixSeedingRate.toFixed(2)}) = Seeds Per Acre (${seedsPerAcre.toFixed(2)})`);
    console.log(`\t${crop.seedsPerPound} x ${mixSeedingRate.toFixed(2)} = ${seedsPerAcre.toFixed(2)}`);
    console.log(`Seeds Per Acre (${seedsPerAcre.toFixed(2)}) x % Survival (85%) = Plants Per Acre (${plantsPerAcre.toFixed(2)})`);
    console.log(`\t${seedsPerAcre.toFixed(2)} x 0.85 = ${plantsPerAcre.toFixed(2)}`);
    console.log(`Plants Per Acre (${plantsPerAcre.toFixed(2)}) / SqFt/Acre (43560) = Plants Per Sqft (${plantsPerSqft.toFixed(2)})`);
    console.log(`\t${plantsPerAcre.toFixed(2)} / 43560 = ${plantsPerSqft.toFixed(2)}`);
    console.log('--------------------------------------------\n\n')



}


/**
 * MAIN FUNCTION
 */

async function main(){
    const mix = await getMix();
    const userInput = MOCK_USER_INPUT;
    printMix(mix);
    printUserInput(userInput);

    
    const calculator = new SeedRateCalculator({mix, userInput});
    printMixOverview(calculator);
    printMixRatiosPageDefault(calculator);
    printMixRatiosPageCustom(calculator);
}



main();
