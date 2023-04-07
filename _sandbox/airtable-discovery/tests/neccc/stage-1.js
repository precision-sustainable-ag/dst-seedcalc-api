
// calculator.stage1
const calculator = require('../../calculations/neccc/index');

// helpers
const {promptInput, IS_MIX, SUM_OF_TYPE} = require('../helpers');

// crops
const RAPESEED_FORAGE = require('../../crops/neccc/rapeseed-forage');
const PEA_WINTER = require('../../crops/neccc/pea-winter');
const OATS_WINTER = require('../../crops/neccc/oats-winter');

// state setup
const MIX = [RAPESEED_FORAGE, PEA_WINTER, OATS_WINTER];

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
        console.log();
    }

    // set some state values.
    const MIX_SUMS = {
        finalSeedingRates: 0,
        seedsPerAcre: 0,
    }
    const isMix = IS_MIX(mix);

    // perform calculations that are crop specific
    for(let crop of mix){
        const sumOfType = SUM_OF_TYPE(crop.group, mix);
        const plantingMethodModifier = calculator.stage1.plantingMethodModifer({plantingMethod: crop.userInput.plantingMethod, crop });
        const soilFertilityModifier = calculator.stage1.soilFertilityModifer({isMix, soilFertility: crop.userInput.soilFertility, crop});
        const mixRatioModifier = calculator.stage1.mixRatioModifier({sumOfType,soilFertilityModifier,plantingMethodModifier});
        const finalSeedingRate = calculator.stage1.finalSeedingRate({mixRatioModifier, crop});
        const seedsPerAcre = calculator.stage1.seedsPerAcre({finalSeedingRate, crop});
        const approxPlantsPerSqft = calculator.stage1.approxPlantsPerSqft({seedsPerAcre});
        const percentOfSingleSpeciesSeedingRate = calculator.stage1.percentSingleSpeciesSeedingRate({finalSeedingRate, plantingMethodModifier, crop});

        crop.calcs = {
            sumOfType,
            plantingMethodModifier,
            soilFertilityModifier,
            mixRatioModifier,
            finalSeedingRate,
            seedsPerAcre,
            approxPlantsPerSqft,
            percentOfSingleSpeciesSeedingRate,
        }

        // collect required sums needed for mix specific calculations.
        MIX_SUMS.finalSeedingRates += crop.calcs.finalSeedingRate;
        MIX_SUMS.seedsPerAcre += crop.calcs.seedsPerAcre;
    } 
    
    // perform calculations that are mix specific.
    for(let crop of mix){
        crop.calcs.percentPoundsOfSeedPerAcreInMix = calculator.stage1.percentPoundsPerAcreInMix({
            finalSeedingRate: crop.calcs.finalSeedingRate,
            sumOfMixSeedingRates: MIX_SUMS.finalSeedingRates,
        });
        crop.calcs.percentSeedsInMix = calculator.stage1.percentSeedsInMix({
            seedsPerAcre: crop.calcs.seedsPerAcre,
            sumOfSeedsPerAcreInMix: MIX_SUMS.seedsPerAcre,
        });


    }

    // create print sheet.
    for (let crop of mix){
        console.log(crop.name);
        console.log('-------------------------------------')
        console.log('Planting Mehod Modifier:',crop.calcs.plantingMethodModifier);
        console.log('Soil Fertility Modifier:',crop.calcs.soilFertilityModifier);
        console.log('Mix Ratio Modifier:',crop.calcs.mixRatioModifier);
        console.log('Final Seeding Rate (lbs/Acre):',crop.calcs.finalSeedingRate);
        console.log('% Pounds of Seed Per Acre In Mix:',crop.calcs.percentPoundsOfSeedPerAcreInMix, `(${crop.calcs.percentPoundsOfSeedPerAcreInMix*100}%)`);
        console.log('% of Single Species Seeding Rate:',crop.calcs.percentOfSingleSpeciesSeedingRate, `(${crop.calcs.percentOfSingleSpeciesSeedingRate*100}%)`);
        console.log('Seeds In Mix:',crop.calcs.seedsPerAcre);
        console.log('% Seeds In Mix:',crop.calcs.percentSeedsInMix, `(${(crop.calcs.percentSeedsInMix*100).toFixed(1)}%)`);
        console.log('Seeds Per Acre:',crop.calcs.seedsPerAcre);
        console.log('Approx. Plants Per SqFt:',crop.calcs.approxPlantsPerSqft, `(${crop.calcs.approxPlantsPerSqft.toFixed(1)})`);
        console.log('-------------------------------------\n\n')
    }

}

main();
