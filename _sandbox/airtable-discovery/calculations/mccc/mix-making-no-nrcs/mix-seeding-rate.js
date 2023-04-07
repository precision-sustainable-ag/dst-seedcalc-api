const RAW = `{Single Species Seeding Rate - MCCC}/{SUM of Species in Mix (from Calculation Mode)}`;

const VARS = {
    'Single Species Seeding Rate - MCCC': (crop) => crop.singleSpeciesSeedingRate,
    'SUM of Species in Mix (from Calculation Mode)': (calcs) => calcs.sumOfSpeciesInMix,
};

/**
 * LOGIC Translation
 * 
 * The formula divides the value of "Single Species Seeding Rate - MCCC" by 
 * the value of "SUM of Species in Mix (from Calculation Mode)".
 */
function calc({
    sumSpeciesInMix,
    crop = {}
} = {}){
    const singleSpeciesSeedingRate = crop.singleSpeciesSeedingRate;

    return singleSpeciesSeedingRate / sumSpeciesInMix;
}

module.exports = {
    calc, RAW, VARS
};
