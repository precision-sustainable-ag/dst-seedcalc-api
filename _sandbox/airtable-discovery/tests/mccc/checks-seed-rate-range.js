
// calculator.stage1
const calculator = require('../../calculations/mccc/index');

// helpers
const {promptInput, IS_MIX, SUM_SPECIES_IN_MIX} = require('../helpers');

// crops
const RAPESEED = require('../../crops/mccc/rapeseed');
const PEA_WINTER = require('../../crops/mccc/pea-winter');
const OATS_SPRING = require('../../crops/mccc/oats-spring');




// state setup
const MIX = [PEA_WINTER, OATS_SPRING, RAPESEED];

async function main(mix){
    if(!mix) mix = MIX;

    // get required user inputs
    for( let crop of MIX){
        crop.userInput = {};
        console.log(crop.name,':');
        await promptInput( // PLANTING METHOD
            `What is the planting method, hit enter to use default. (Default: Precision)? `, 
            (answer) => answer 
                        ? crop.userInput.plantingMethod = answer 
                        : crop.userInput.plantingMethod = 'Precision'
        );
        console.log();
    }

    // set MIX state values.
    const MIX_SUMS = {
        finalSeedingRates: 0,
        seedsPerAcre: 0,
    }

    const isMix = IS_MIX(mix);
    const sumSpeciesInMix = SUM_SPECIES_IN_MIX(mix);

    // CROP SPECIFIC CALCULATIONS
    for(let crop of mix){
        // get user inputs for this crop.
        const plantingMethod = crop.userInput.plantingMethod;
        // perform calcs
        const mixSeedingRate = calculator.mixMaking.mixSeedingRate({sumSpeciesInMix,crop:crop.nrcs}); // !!THIS IS THE ONLY DIFFERENCE FOR NRCS
        const plantingMethodModifier = calculator.mixMaking.plantingMethodModifier({plantingMethod, crop});
        const finalMixSeedingRate = calculator.mixMaking.finalMixSeedingRate({mixSeedingRate,plantingMethodModifier});
        const validSeedRateRange = calculator.checks.seedingRateRange.validSeedRateRange({finalMixSeedingRate,mixSeedingRate})
        // add to calcs state
        crop.calcs = {
            mixSeedingRate,
            plantingMethodModifier,
            finalMixSeedingRate,
            validSeedRateRange,
        }

        // add to mix calcs state
    } 
    
    // MIX SPECIFIC CALCULATIONS
    for(let crop of mix){
        
    }

    // create print sheet.
    for (let crop of mix){
        console.log(crop.name);
        console.log('-------------------------------------')
        console.log('Mix Seeding Rate - MCCC', crop.calcs.mixSeedingRate, `(${crop.calcs.mixSeedingRate.toFixed(2)})`);
        console.log('Planting Method Modifier', crop.calcs.plantingMethodModifier);
        console.log('Final Mix Seeding Rate - MCCC', crop.calcs.finalMixSeedingRate, `(${crop.calcs.finalMixSeedingRate.toFixed(2)})`);
        console.log('EQIP Seeding Rate Range', crop.calcs.validSeedRateRange, `(${crop.calcs.finalMixSeedingRate ? 1 : 0})`);
        console.log('-------------------------------------\n\n')
    }

}

main();
