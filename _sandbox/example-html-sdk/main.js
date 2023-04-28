
const SPECIES_SELECTOR_SERVICE_URL = 'https://developapi.covercrop-selector.org';

const SELECTOR_API_CLIENT = axios.create({
  baseURL: SPECIES_SELECTOR_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


/**
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
    acres: 50, // this is purley user input, value stored as valid number.
    plantingDate: '11/27/2021', // this is purely user input date MUST always follow the MM/DD/YYYY format.
    plantingMethod: "Precision", // picked from values using selector attribute endpoint above
    soilDrainage: [ "Well Drained", "Excessively Drained" ] // picked from values using selector attribute endpoint above
}


/**
 * STEP 1) GET COUNCIL
 * We are assuming that the user selects Indiana -> Adams County
 * The ID's for these regions are as follows:
 * 
 * Indiana
 * ID = 18
 * 
 * Adams County
 * ID = 180
 * 
 * 
 * This can be retrieved 
 * from the region object the user selects when picking a state.
 * 
 * A list of states can be acquired through the following HTTP request:
 *   GET https://{selector-api}/v2/regions?locality=state&context=seed_calc
 *   NOTE: here we use the context=seed_calc to ensure we only get states applicable to the seed calc application.
 *
 * Typically once you a user has selected a state, you will then prompt them to select child regions. 
 * You can get the 1st level of child regions for a given region with the following HTTP Request:
 *      GET https://{selector-api}/v2/regions/{region_id}
 *      NOTE: This will only include 1st level children for the region_id given, 
 *            it is possible that a selected child region could have its own children, but this is uncommon.
 * It is most common that a region will only have 1 type of child region ( ex: County, or Plant Hardiness Zone)
 * But it is possible that a region could have any number of types of child regions. 
 * Typically the user should only select 1 of each type of child region, 
 * selecting multiple child regions will most commonly cause attribute key collision producing unreliable data sets.
 * You should only select multipule regions of a specific child type if you know you will not create collision errors.
 * 
 * the council information can be gathered from an item in the states array
 * through this object path:
 *
 * state.parents[0].shorthand
 * 
 * NOTE: when compiling the regions query parameter array, 
 *       it should include the id's for all regions that the user has selected.
 *       Example: const regions = [18,180]
 *          here you can see our regions contains the ids for Indiana(18) and Adams County(180) , 
 *          where Adams County is a child region of Indiana.
 * 
 * 
 */
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

/**
 * STEP 2) CREATE MIX
 * Create a mix utilizing the Species Selector API
 * where each item in the array is either
 *
 * - the data object returned from the HTTP request
 *   GET https://{selector-api}/v2/crops/{crop_id}?regions={region_id}&context=seed_calc  
 *
 * - an instantiated instance of the Crop Object class.
 * 
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



/**
 * MAIN FUNCTION
 */

async function main(){
    const mix = await getMix();
    const council = await getCouncil();

    const userInput = {
        ...MOCK_USER_INPUT,
        singleSpeciesSeedingRate: 3,
        percentOfRate: 0.25,
    }

    const calculator = new SeedRateCalculator({mix, council, userInput});

    /**
     * Print frunctions can be found in the printer.js
     */
    printMix(mix);
    printUserInput(userInput);
    printMixOverview(calculator);
    printMixRatiosPageDefault(calculator);
    printMixRatiosPageCustom(calculator,userInput);

}



main();
