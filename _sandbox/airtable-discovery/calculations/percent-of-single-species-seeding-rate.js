const RAW = `
    {Z6 - Final Seeding Rate (lbs/Acre) - Automated}
    /
    ({Z6 Base Seeding Rate Default (from Cover Crop)}*{Planting Method Modifier})
`;

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