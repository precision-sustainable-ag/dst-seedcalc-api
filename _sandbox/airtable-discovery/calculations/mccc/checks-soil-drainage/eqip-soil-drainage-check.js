const RAW = `
IF(FIND({Input - Soil Drainage}, {Soil Drainage (from Cover Crop)}) > 0, 1, 0)
`;

const VARS = {
    'Input - Soil Drainage': (userInput) => userInput.soilDrainage,
    'Soil Drainage (from Cover Crop)': (crop) => crop.soilDrainage,
};

/**
 * LOGIC Translation
 * 
 * The formula checks if the "Input - Soil Drainage" is found within the
 * "Soil Drainage (from Cover Crop)" string.
 * 
 * If it is found (the index is greater than 0), the formula returns 1; otherwise, it returns 0.
 */
function calc({
    soilDrainage,
    crop = {}
} = {}){
    const soilDrainages = crop.soilDrainage;

    return soilDrainages.indexOf(soilDrainage) > -1;
}

module.exports = {
    calc, RAW, VARS
}
