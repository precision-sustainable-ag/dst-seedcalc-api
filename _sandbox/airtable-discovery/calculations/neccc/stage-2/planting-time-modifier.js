
const RAW = `
IF(
	AND({Planting Date} >= {Early Fall/Winter Seeding Rate Start (from Cover Crop)},{Planting Date}<={Early Fall/Winter Seeding Rate End (from Cover Crop)}),
	{Early Fall Planting Coefficient (from Cover Crop)}, 
	IF(
		AND({Planting Date}>= {Late Fall/Winter Seeding Rate Start (from Cover Crop)},{Planting Date}<={Late Fall/Winter Seeding Rate End (from Cover Crop)}),
		{Late Fall Planting Coefficient (from Cover Crop)},
		1)
	)
`;

const VARS = {
    'Planting Date': (userInput) => userInput.plantingDate,
    'Early Fall/Winter Seeding Rate Start (from Cover Crop)': (crop) => crop.earlyFallSeedingRateStart,
    'Early Fall/Winter Seeding Rate End (from Cover Crop)': (crop) => crop.earlyFallSeedingRateEnd,
    'Late Fall/Winter Seeding Rate Start (from Cover Crop)': (crop) => crop.lateFallSeedingRateStart,
    'Late Fall/Winter Seeding Rate End (from Cover Crop)': (crop) => crop.lateWinterSeedingRateEnd,
    'Early Fall Planting Coefficient (from Cover Crop)': (crop) => crop.earlyFallPlantingCoeff,
    'Late Fall Planting Coefficient (from Cover Crop)': (crop) => crop.lateFallPlantingCoeff,
    'Default': () => 1,
};

/**
 * LOGIC Translation
 * 
 * The formula first checks 
 * if the "Planting Date" is between the start and end dates for the early fall/winter season. 
 * If it is, then the formula returns the "Early Fall Planting Coefficient (from Cover Crop)".
 * 
 * If the planting date is not within the early fall/winter range, 
 * the formula checks if it is between the start and end dates for the late fall/winter season. 
 * If it is, then the formula returns the "Late Fall Planting Coefficient (from Cover Crop)".
 * 
 * If the planting date is not within either range, the formula returns 1.
 */
function calc({
    plantingDate,
    crop = {}
} = {}){

    console.log(plantingDate)
    if(!(plantingDate instanceof Date)) plantingDate = new Date(plantingDate);

    const earlyFallStartDate = new Date(VARS['Early Fall/Winter Seeding Rate Start (from Cover Crop)'](crop));
    const earlyFallEndDate = new Date(VARS['Early Fall/Winter Seeding Rate End (from Cover Crop)'](crop));

    console.log(plantingDate)
    console.log(earlyFallStartDate)
    console.log(earlyFallEndDate)

    if(plantingDate >= earlyFallStartDate && plantingDate <= earlyFallEndDate) {
        return VARS['Early Fall Planting Coefficient (from Cover Crop)'](crop);
    }

    const lateFallStartDate = VARS['Late Fall/Winter Seeding Rate Start (from Cover Crop)'](crop);
    const lateFallEndDate = VARS['Late Fall/Winter Seeding Rate End (from Cover Crop)'](crop);

    if(plantingDate >= lateFallStartDate && plantingDate <= lateFallEndDate){
        return VARS['Late Fall Planting Coefficient (from Cover Crop)'](crop);
    }

    return VARS['Default']();

}


module.exports = {
    calc, RAW, VARS
}
