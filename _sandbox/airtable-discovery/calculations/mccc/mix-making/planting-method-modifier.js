const RAW = `IF({Input - Planting Method} = "Precision", {Precision Coefficient (from Cover Crop)}, IF({Input - Planting Method} = "Broadcast", {Broadcast Coefficient (from Cover Crop)}, IF({Input - Planting Method} = "Aerial", {Aerial Coefficient (from Cover Crop)}, 1)))`;

const VARS = {
    'Input - Planting Method': (userInput) => userInput.plantingMethod,
    'Precision Coefficient (from Cover Crop)': (crop) => crop.precisionCoefficient,
    'Broadcast Coefficient (from Cover Crop)': (crop) => crop.broadcastCoefficient,
    'Aerial Coefficient (from Cover Crop)': (crop) => crop.aerialCoefficient,
    'Default': () => 1,
};

/**
 * LOGIC Translation
 * 
 * The formula checks the value of "Input - Planting Method" and returns a different coefficient
 * based on the value of this input.
 * 
 * If "Input - Planting Method" is "Precision", the formula returns "Precision Coefficient (from Cover Crop)".
 * 
 * If "Input - Planting Method" is "Broadcast", the formula returns "Broadcast Coefficient (from Cover Crop)".
 * 
 * If "Input - Planting Method" is "Aerial", the formula returns "Aerial Coefficient (from Cover Crop)".
 * 
 * If none of the above conditions are true, the formula returns 1.
 */
function calc({
    plantingMethod,
    crop = {}
} = {}) {

    switch(plantingMethod) {
        case 'Precision':
            return VARS['Precision Coefficient (from Cover Crop)'](crop);
        case 'Broadcast':
            return VARS['Broadcast Coefficient (from Cover Crop)'](crop);
        case 'Aerial':
            return VARS['Aerial Coefficient (from Cover Crop)'](crop);
        default:
            return VARS['Default']();
    }
    
}

module.exports = {
    calc, RAW, VARS
};
