
// 
// calculator
// const calculatorStage1 = require('../../calculations/neccc/stage-1/index');
// const calculator = require('../../calculations/neccc/stage-3/index');
const calculator = require('../../calculations/neccc/index');
// helpers
const {promptInput, IS_MIX, SUM_OF_TYPE} = require('../helpers');

// crops
const RAPESEED_FORAGE = require('../../crops/neccc/rapeseed-forage');
const PEA_WINTER = require('../../crops/neccc/pea-winter');
const OATS_WINTER = require('../../crops/neccc/oats-winter');
const { calc } = require('../../calculations/neccc/stage-1/approx-plants-per-sq-ft');

// state setup
const MIX = [RAPESEED_FORAGE, PEA_WINTER, OATS_WINTER];


/**
 * NOTES:
 * 
 * Is seeds per acre meant to be calculated using the Final Seeding Rate - Bulk?
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
            `What is the percent Purity, hit enter to use default. (Default: 95%)? `, 
            (answer) => answer 
                        ? crop.userInput.purity = answer 
                        : crop.userInput.purity = 0.95
        );
        await promptInput( 
            `What is the percent Germination, hit enter to use default. (Default: 85%)? `, 
            (answer) => answer 
                        ? crop.userInput.germination = answer 
                        : crop.userInput.germination = 0.85
        );
        await promptInput( 
            `What is the number of Acres, hit enter to use default. (Default: 13)? `, 
            (answer) => answer 
                        ? crop.userInput.acres = answer 
                        : crop.userInput.acres = 13
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
        const sumOfType = SUM_OF_TYPE(crop.group, mix);
        const plantingMethodModifier = calculator.stage1.plantingMethodModifer({plantingMethod: crop.userInput.plantingMethod, crop });
        const soilFertilityModifier = calculator.stage1.soilFertilityModifer({isMix, soilFertility: crop.userInput.soilFertility, crop});
        const mixRatioModifier = calculator.stage1.mixRatioModifier({sumOfType,soilFertilityModifier,plantingMethodModifier});
        const finalSeedingRate = calculator.stage1.finalSeedingRate({mixRatioModifier, crop});
        const seedsPerAcre = calculator.stage1.seedsPerAcre({finalSeedingRate, crop});
        const finalSeedingRateBulk = calculator.stage3.finalSeedingRateBulk({
            finalSeedingRate, 
            purity: crop.userInput.purity,
            germination: crop.userInput.germination,
        });
        const finalPoundsForPurchase = calculator.stage3.finalPoundsForPurchase({
            finalSeedingRateBulk,
            acres: crop.userInput.acres
        });

        crop.calcs = {
            sumOfType,
            plantingMethodModifier,
            soilFertilityModifier,
            mixRatioModifier,
            finalSeedingRate,
            seedsPerAcre,
            finalSeedingRateBulk,
            finalPoundsForPurchase,
        }

        // collect required sums needed for mix specific calculations.
    } 
    
    // perform calculations that are mix specific.
    for(let crop of mix){
    }

    // create print sheet.
    for (let crop of mix){
        console.log(crop.name);
        console.log('-------------------------------------')
        console.log('Z6 - Final Seeding Rate (lbs/Acre) - Automated', crop.calcs.finalSeedingRate)
        console.log('Final Seeding Rate - Bulk', crop.calcs.finalSeedingRateBulk, `(${crop.calcs.finalSeedingRateBulk.toFixed(0)})`);
        console.log('Seeds per Acre', crop.calcs.seedsPerAcre)
        console.log('Final Pounds for Purchase', crop.calcs.finalPoundsForPurchase, `(${crop.calcs.finalPoundsForPurchase.toFixed(0)})`)
        console.log('-------------------------------------\n\n')
    }

}

main();
