const RAW = `
{Seeds per Acre}/43560
`;

const SQFT_PER_ACRE = 43560;

function calc({
    seedsPerAcre,
} = {}){

    return seedsPerAcre / SQFT_PER_ACRE;

}


module.exports = {
    calc, RAW, SQFT_PER_ACRE
}