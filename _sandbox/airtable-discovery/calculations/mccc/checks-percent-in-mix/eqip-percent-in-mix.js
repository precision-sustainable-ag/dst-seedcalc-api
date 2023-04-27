const RAW = `
IF({% in Mix} > {Max % Allowed in Mix (from Cover Crop)}, 0, 1)
`;

const VARS = {
    '% in Mix': (calcs) => calcs.percentInMix,
    'Max % Allowed in Mix (from Cover Crop)': (crop) => crop.maxPercentAllowedInMix,
};

/**
 * LOGIC Translation
 * 
 * The formula checks if the "% in Mix" for a specific seed is greater than the
 * "Max % Allowed in Mix (from Cover Crop)".
 * 
 * If it is, the formula returns 0; otherwise, it returns 1.
 */
function calc({
    percentInMix,
    crop = {}
} = {}){

    const maxPercentAllowedInMix = crop.maxPercentAllowedInMix;

    return percentInMix > maxPercentAllowedInMix ? false : true;
}

module.exports = {
    calc, RAW, VARS
}
