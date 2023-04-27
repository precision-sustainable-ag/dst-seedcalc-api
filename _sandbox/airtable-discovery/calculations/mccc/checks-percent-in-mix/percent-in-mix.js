const RAW = `
{Seeds Per Pound - Cost Share}/{SUM of all Seeds in Mix}
`;

const VARS = {
    'Seeds Per Pound - Cost Share': (calcs) => calcs.seedsPerPound,
    'SUM of all Seeds in Mix': (sums) => sums.seedsInMix,
};

/**
 * LOGIC Translation
 * 
 * The formula calculates the proportion of the "Seeds Per Pound - Cost Share" for a specific seed
 * in relation to the total "Seeds Per Pound - Cost Share" of all seeds in the mix.
 */
function calc({
    seedsPerPound,
    sumSeedsInMix
} = {}){

    return seedsPerPound / sumSeedsInMix;

}

module.exports = {
    calc, RAW, VARS
}
