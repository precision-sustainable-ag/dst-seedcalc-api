
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
        await promptInput( // PLANTING DATE
            `What is the planting date, hit enter to use default. (Default: null)? `, 
            (answer) => answer 
                        ? crop.userInput.plantingDate = answer 
                        : crop.userInput.plantingDate = null
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
        const plantingDate = crop.userInput.plantingDate;
        // perform calcs
        const validPlantingDate = calculator.checks.plantingDate.validDate({plantingDate, crop});
        // add to calcs state
        crop.calcs = {
            validPlantingDate,
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
        console.log('EQIP Seeding Rate Range', crop.calcs.validPlantingDate, `(${crop.calcs.validPlantingDate ? 1 : 0})`);
        console.log('-------------------------------------\n\n')
    }

}

main();
