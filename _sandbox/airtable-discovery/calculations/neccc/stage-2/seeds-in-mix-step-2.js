const RAW = `
    {Seeds per Pound}*{Final Recommended Seeding Rate with Planting and Termination Modifiers?}
`;

const VARS = {
    'Seeds per Pound': (crop) => crop.seedsPerPound,
    'Final Recommended Seeding Rate with Planting and Termination Modifiers?': (calcs) => calcs.finalSeedingRateWithModifiers,
};

/**
 * LOGIC Translation
 * 
 * The formula multiplies the value of "Seeds per Pound" with the value of
 * "Final Recommended Seeding Rate with Planting and Termination Modifiers?".
 */
function calc({
    finalSeedingRateWithModifiers,
    crop = {}
} = {}){
    return VARS['Seeds per Pound'](crop) * finalSeedingRateWithModifiers;
}

module.exports = {
    calc, RAW, VARS
};
