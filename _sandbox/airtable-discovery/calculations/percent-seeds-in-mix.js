/**
 * Magic number 1680400
 * is actually the sum of Seeds Per Acre for the entire mix. 
 */
const RAW = `
    {Seeds in Mix}/1680400
`;

function calc({
    seedsPerAcre,
    sumOfSeedsPerAcreInMix,
} = {}){

    return seedsPerAcre / sumOfSeedsPerAcreInMix;
}


module.exports = {
    calc, RAW
}