const RAW = `{Final Seeding Rate - Bulk}*Acres`;

const VARS = {
    'Final Seeding Rate - Bulk': (calcs) => calcs.finalSeedingRateBulk,
    'Acres': (userInput) => userInput.acres,
};

/**
 * LOGIC Translation
 * 
 * The formula multiplies the value of "Final Seeding Rate - Bulk" by "Acres".
 * Acres is provided by user input.
 */
function calc({
    finalSeedingRateBulk,
    acres,
} = {}){

    return finalSeedingRateBulk * acres;
    
}

module.exports = {
    calc, RAW, VARS
};
