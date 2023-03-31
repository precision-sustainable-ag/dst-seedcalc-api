
const RAW = `
IF( 
	{Calculation Mode} = "Mix", 
	IF({Soil Fertility} = "High", {High Fertility Competition Coefficient (from Cover Crop)}, {Low to Moderate Fertility Coefficient (from Cover Crop)}), 
	IF({Soil Fertility}= "High", {High Fertility - Monoculture standard planting window (from Cover Crop)},1)
)
`
/**
 * Static Variable.
 */
const DEFAULT_COEFF = 1;

/**
 * Planting Method is gathered from user input
 * 
 * All Coefficients are Crop & Region specific.
 */
function calc({
    isMix,
    soilFertility, 
    crop = {}
} = {}){

    let coeff = DEFAULT_COEFF;

    const isHighSoilFertility = soilFertility === 'High';

    if(isMix){
        if(isHighSoilFertility) return crop.soilConditions.highFertilityCompetitionCoeff;

        return crop.soilConditions.lowFertilityCompetitionCoeff
    }

    if(isHighSoilFertility) return crop.soilConditions.highFertilityMonocultureStandardCoeff;

    return coeff;
}

module.exports = {
    calc, RAW, DEFAULT_COEFF
}