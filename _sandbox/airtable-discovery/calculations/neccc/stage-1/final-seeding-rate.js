const RAW = `
    {Z6 Base Seeding Rate Default (from Cover Crop)}*{Mix Ratio Modifier}
`;

const VARS = {
    'Z6 Base Seeding Rate Default (from Cover Crop)': (crop) => crop.z6BaseSeedingRateDefault,
    'Mix Ratio Modifier': (calcs) => calcs.mixRatioModifier,
};


function calc({
    mixRatioModifier,
    crop = {},
} = {}){

    return crop.baseSeedingRateDefault * mixRatioModifier;
}


module.exports = {
    calc, RAW,VARS
}