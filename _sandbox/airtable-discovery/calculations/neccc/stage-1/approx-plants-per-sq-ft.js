const RAW = `
{Seeds per Acre}/{sqft per acre}
`;

const SQFT_PER_ACRE = 43560;



const VARS = {
    'Seeds per Acre': (calcs) => calcs.seedsPerAcre,
    'sqft per acre': () => SQFT_PER_ACRE,
};

function calc({
    seedsPerAcre,
} = {}){

    return seedsPerAcre / SQFT_PER_ACRE;

}


module.exports = {
    calc, RAW, SQFT_PER_ACRE, VARS
}