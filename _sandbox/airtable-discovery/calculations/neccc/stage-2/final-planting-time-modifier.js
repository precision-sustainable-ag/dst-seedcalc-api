const RAW = `
    IF({Planting Time Modifier} < 1, 
        IF({Soil Fertility}="High", 1, {Planting Time Modifier}),
        {Planting Time Modifier} 
    )
`;

const VARS = {
    'Planting Time Modifier': (calcs) => calcs.plantingTimeModifier,
    'Soil Fertility': (userInput) => userInput.soilFertility,
    'Default': () => 1,
};

/**
 * LOGIC Translation
 * 
 * If the "Planting Time Modifier" is less than 1, 
 * then the formula checks if the "Soil Fertility" is "High". 
 * If it is, then the formula returns 1; otherwise, it returns the "Planting Time Modifier".
 * 
 * If the "Planting Time Modifier" is not less than 1, 
 * the formula returns the "Planting Time Modifier".
 */
function calc({
    plantingTimeModifier,
    soilFertility
} = {}){
    if (plantingTimeModifier < 1) {
        if (soilFertility === "High") {
            return 1;
        } else {
            return plantingTimeModifier;
        }
    } else {
        return plantingTimeModifier;
    }
}

module.exports = {
    calc, RAW, VARS
};
