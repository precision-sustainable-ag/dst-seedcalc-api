const RAW = `
IF(
	AND({Planting Method}="Aerial", {Aerial Planting Method Coefficient (from Cover Crop)} != 0), 
	{Aerial Planting Method Coefficient (from Cover Crop)},  
	IF(
		AND({Planting Method} = "Broadcast with Cultivation, No Packing", {Broadcast with Cultivation, No Packing Coefficient (from Cover Crop)} != 0),
		{Broadcast with Cultivation, No Packing Coefficient (from Cover Crop)} , 
		IF(
			AND({Planting Method}= "Broadcast with No Cultivation, No Packing",{Broadcast with No Cultivation, No Packing Coefficient (from Cover Crop)}!= 0),
			{Broadcast with No Cultivation, No Packing Coefficient (from Cover Crop)} ,1
        )
    )
)
`
/**
 * Planting Method is gathered from user input
 * 
 * All Coefficients are Crop & Region specific.
 */
function calc({
    plantingMethod,
    crop = {}
} = {}){
    coef = 1;

    if(plantingMethod === 'Aerial' &&  crop?.aerialPlantingMethodCoeff ) 
        coef = aerialPMCoef;
    else if(plantingMethod === 'Broadcast with Cultivation, No Packing' && crop?.broadcastWithCultivationCoef) 
        coef = broadcastWithCultivationCoef
    else if(plantingMethod === 'Broadcast with No Cultivation, No Packing' && crop?.broadcastWithNoCultivationCoef) 
        coef = broadcastWithCultivationCoef

    return coef;
}


module.exports = {
    calc, RAW
}