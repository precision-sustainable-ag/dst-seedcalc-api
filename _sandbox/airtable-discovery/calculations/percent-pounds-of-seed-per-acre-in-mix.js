const RAW = `
    {Z6 - Final Seeding Rate (lbs/Acre) - Automated}/128
`;

const FINAL_SEEDING_RATE = require('./final-seeding-rate');



function calc({
    finalSeedingRate,
    sumOfMixSeedingRates,
} = {}){

    return finalSeedingRate / sumOfMixSeedingRates;
}


module.exports = {
    calc, RAW
}