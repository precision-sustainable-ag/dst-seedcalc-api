const RAW = `{Seeds per Acre - Step 2}/{sqFT per Acre}`;

const SQFT_PER_ACRE = 43560;

const VARS = {
    'Seeds per Acre - Step 2': (calcs) => calcs.seedsPerAcre,
    'sqFT per Acre': () => SQFT_PER_ACRE
};

/**
 * LOGIC Translation
 * 
 * The formula divides the value of "Seeds per Acre - Step 2" by sqFT per Acre.
 */
function calc({
    seedsPerAcre,
} = {}){
    return seedsPerAcre / SQFT_PER_ACRE;
}

module.exports = {
    calc, RAW, VARS, SQFT_PER_ACRE
};
