

// calculator
const calculator = require('../../calculations/neccc/index');

// helpers
const {promptInput, IS_MIX, SUM_OF_TYPE} = require('../helpers');

// crops
const RAPESEED_FORAGE = require('../../crops/neccc/rapeseed-forage');
const PEA_WINTER = require('../../crops/neccc/pea-winter');
const OATS_WINTER = require('../../crops/neccc/oats-winter');

// state setup
const MIX = [RAPESEED_FORAGE, PEA_WINTER, OATS_WINTER];


/**
 * NOTES:
 * 
 * Rapeseed, Forage's Planting date is within the Early Fall boundaries, 
 * but has a Early Fall planting Coeff. of 0, causing it to have zero production.
 * 
 * Pea, Winter, has no input for Planting date, 
 * thus defaults it Early Fall planting Coeff. to 1, 
 * causing it to have no planting date, but give production.
 * When a valid planting date is given for Pea, Winter it results in zero production,
 * for the same reason as Rapeseed, Forage.
 * 
 * Also i dont see any termination information in this stage.  
 * 
 * also % Seeds in mix is 129% for Oats, Winter
 */
async function main(mix){
    if(!mix) mix = MIX;

    // get required user inputs
    // Planting Method
    // Soil Fertility
    for( let crop of MIX){
        crop.userInput = {};
        console.log(crop.name,':');
        await promptInput( 
            `What is the seeding method, hit enter to use default. (Default: Drilled)? `, 
            (answer) => answer 
                        ? crop.userInput.plantingMethod = answer 
                        : crop.userInput.plantingMethod = 'Drilled'
        );
        await promptInput( 
            `What is your soil fertility, hit enter to use default. (Default: Low To Moderate)? `, 
            (answer) => answer 
                        ? crop.userInput.soilFertility = answer 
                        : crop.userInput.soilFertility = 'Low to Moderate'
        );
        await promptInput( 
            `What is the Planting Date, hit enter to use default. (Default: null)? `, 
            (answer) => answer 
                        ? crop.userInput.plantingDate = answer 
                        : crop.userInput.plantingDate = null
        );
        console.log();
    }

    // set some state values.
    const MIX_SUMS = {
        finalSeedingRates: 0,
        seedsInMix: 0,
    }
    const isMix = IS_MIX(mix);

    // perform calculations that are crop specific
    for(let crop of MIX){
        const plantingDate = crop.userInput.plantingDate;
        const soilFertility = crop.userInput.soilFertility;
        const sumOfType = SUM_OF_TYPE(crop.group, mix);
        const plantingMethodModifier = calculator.stage1.plantingMethodModifer({plantingMethod: crop.userInput.plantingMethod, crop });
        const soilFertilityModifier = calculator.stage1.soilFertilityModifer({isMix, soilFertility: crop.userInput.soilFertility, crop});
        const mixRatioModifier = calculator.stage1.mixRatioModifier({sumOfType,soilFertilityModifier,plantingMethodModifier});
        const finalSeedingRate = calculator.stage1.finalSeedingRate({mixRatioModifier, crop});
        const plantingTimeModifier = calculator.stage2.plantingTimeModifier({plantingDate,crop});
        const finalPlantingTimeModifier = calculator.stage2.finalPlantingTimeModifier({plantingTimeModifier, soilFertility});
        const finalSeedingRateWithModifiers = calculator.stage2.finalRecommendedSeedingRateWithPlantingAndTerminationModifiers({plantingTimeModifier, finalSeedingRate});
        const seedsInMixStage2 = calculator.stage2.seedsInMix({finalSeedingRateWithModifiers,crop});
        const approxPlantsPerSqft = calculator.stage2.approxPlantsPerSqFt({seedsPerAcre:seedsInMixStage2});

        crop.calcs = {
            plantingTimeModifier,
            finalPlantingTimeModifier,
            finalSeedingRateWithModifiers,
            seedsInMixStage2,
            approxPlantsPerSqft,
        }

        // collect required sums needed for mix specific calculations.
        MIX_SUMS.seedsInMix += seedsInMixStage2;
    } 
    
    // perform calculations that are mix specific.
    for(let crop of mix){
        crop.calcs.percentSeedsInMix = calculator.stage2.percentSeedsInMixStep2({
            sumSeedsInMix: MIX_SUMS.seedsInMix, 
            seedsInMix: crop.calcs.seedsInMixStage2
        });
    }

    // create print sheet.
    for (let crop of mix){
        console.log(crop.name);
        console.log('-------------------------------------')
        console.log('Planting Time Modifier:',crop.calcs.plantingTimeModifier);
        console.log('Final Planting Time Modifier:',crop.calcs.finalPlantingTimeModifier);
        console.log('Final Recommended Seeding Rate with Planting and Termination Modifiers?:',crop.calcs.finalSeedingRateWithModifiers);
        console.log('Seeds in Mix - Step 2:',crop.calcs.seedsInMixStage2);
        console.log('% seeds in mix - Step 2:',crop.calcs.percentSeedsInMix, `(${(crop.calcs.percentSeedsInMix*100).toFixed(1)}%)`);
        console.log('Approx Plants per Sq Ft - Step 2:',crop.calcs.approxPlantsPerSqft, `(${crop.calcs.approxPlantsPerSqft.toFixed(1)})`);
        console.log('-------------------------------------\n\n')
    }

}

main();
