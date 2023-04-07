const RAW = `
    {Z6 - Final Seeding Rate (lbs/Acre) - Automated}
    /
    ({Z6 Base Seeding Rate Default (from Cover Crop)}*{Planting Method Modifier})
`;

const VARS = {
    'Z6 - Final Seeding Rate (lbs/Acre) - Automated': (calcs) => calcs.z6FinalSeedingRate,
    'Z6 Base Seeding Rate Default (from Cover Crop)': (crop) => crop.z6BaseSeedingRateDefault,
    'Planting Method Modifier': (calcs) => calcs.plantingMethodModifier,
};

function calc({
    finalSeedingRate,
    plantingMethodModifier,
    crop = {},
} = {}){

    return finalSeedingRate / (crop.baseSeedingRateDefault*plantingMethodModifier);
}


module.exports = {
    calc, RAW
}