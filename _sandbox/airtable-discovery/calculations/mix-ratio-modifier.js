RAW = `

IF({Soil Fertility Modifier}>0,{Soil Fertility Modifier}, 1)
*
{Planting Method Modifier}/{SUM - Cover Crop Type (from Seeding Rate Calculator)}
`

// this is the number of crops of a specific cover crop type used in this mix.
// we have defaulted to 1 based on seedcalc airtable vars at time of writing this. 
const SUM_OF_TYPE = 1; 

function calc({
    sumOfType,
    soilFertilityModifier,
    plantingMethodModifier,
} = {}){

    if(soilFertilityModifier <= 0) soilFertilityModifier = 1;

    return soilFertilityModifier * plantingMethodModifier / sumOfType;
}

module.exports = {
    calc, SUM_OF_TYPE
}