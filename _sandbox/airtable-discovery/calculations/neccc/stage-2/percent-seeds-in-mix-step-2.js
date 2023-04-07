const RAW = `{Seeds in Mix - Step 2}/SUM({Seeds In Mix - Step2})`;

const VARS = {
    'Seeds in Mix - Step 2': (calcs) => calcs.seedsInMix,
    'SUM({Seeds In Mix - Step2})': (sums) => sums.seedsInMix,
};

/**
 * LOGIC Translation
 * 
 * The formula divides the value of "Seeds in Mix - Step 2" by the sum of 
 * all values of "Seeds In Mix - Step2".
 */
function calc({
    sumSeedsInMix,
    seedsInMix,
} = {}){
    return seedsInMix / sumSeedsInMix;
}

module.exports = {
    calc, RAW, VARS
};
