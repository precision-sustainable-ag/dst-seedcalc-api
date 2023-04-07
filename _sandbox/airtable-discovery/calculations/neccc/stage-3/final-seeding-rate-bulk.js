const RAW = `{Z6 - Final Seeding Rate (lbs/Acre) - Automated}/{%Purity}/{%Germination}`;

const VARS = {
    'Z6 - Final Seeding Rate (lbs/Acre) - Automated': (calcs) => calcs.finalSeedingRate,
    '%Purity': (userInputs) => userInputs.purity,
    '%Germination': (userInputs) => userInputs.germination,
};

/**
 * LOGIC Translation
 * 
 * The formula divides the value of "Z6 - Final Seeding Rate (lbs/Acre) - Automated" by 
 * the values of "%Purity" and "%Germination".
 */
function calc({
    finalSeedingRate,
    purity,
    germination
} = {}){
    return finalSeedingRate / purity / germination;
}

module.exports = {
    calc, RAW, VARS
};
