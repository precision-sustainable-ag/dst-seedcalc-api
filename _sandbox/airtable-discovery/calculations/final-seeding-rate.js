const RAW = `
    {Z6 Base Seeding Rate Default (from Cover Crop)}*{Mix Ratio Modifier}
`;


function calc({
    mixRatioModifier,
    crop = {},
} = {}){

    return crop.baseSeedingRateDefault * mixRatioModifier;
}


module.exports = {
    calc, RAW
}