const RAW = `
    {Z6 - Final Seeding Rate (lbs/Acre) - Automated}/{sum of mix seeding rates}
`;

const VARS = {
    'Z6 - Final Seeding Rate (lbs/Acre) - Automated': (calcs) => calcs.z6FinalSeedingRate,
    'sum of mix seeding rates': (calcs) => calcs.sumMixSeedingRates,
};

function calc({
    finalSeedingRate,
    sumOfMixSeedingRates,
} = {}){

    return finalSeedingRate / sumOfMixSeedingRates;
}


module.exports = {
    calc, RAW
}