/**
 * Magic number 1680400
 * is actually the sum of Seeds Per Acre for the entire mix. 
 */
const RAW = `
    {Seeds per acre}/{sum of seeds per acre in mix}
`;


const VARS = {
    'Seeds per acre': (calcs) => calcs.seedsPerAcre,
    'sum of seeds per acre in mix': (calcs) => calcs.sumSeedsPerAcreInMix,
};

function calc({
    seedsPerAcre,
    sumOfSeedsPerAcreInMix,
} = {}){

    return seedsPerAcre / sumOfSeedsPerAcreInMix;
}


module.exports = {
    calc, RAW
}