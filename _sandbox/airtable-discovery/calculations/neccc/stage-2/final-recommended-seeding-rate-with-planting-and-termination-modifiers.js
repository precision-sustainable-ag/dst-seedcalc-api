const RAW = `{Z6 - Final Seeding Rate (lbs/Acre) - Automated}*{Planting Time Modifier}`;

const VARS = {
    'Z6 - Final Seeding Rate (lbs/Acre) - Automated': (calcs) => calcs.fsr,
    'Planting Time Modifier': (calcs) => calcs.ptm,
};

/**
 * LOGIC Translation
 * 
 * The formula multiplies the value of "Z6 - Final Seeding Rate (lbs/Acre) - Automated"
 * with the value of "Planting Time Modifier".
 */
function calc({
    plantingTimeModifier,
    finalSeedingRate,
} = {}){
    return finalSeedingRate * plantingTimeModifier;
}

module.exports = {
    calc, RAW, VARS
};
