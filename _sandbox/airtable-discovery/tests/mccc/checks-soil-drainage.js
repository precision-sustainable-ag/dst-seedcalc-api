
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
            `What is the soil drainage, hit enter to use default. (Default: Well Drained)? `, 
            (answer) => answer 
                        ? crop.userInput.soilDrainage = answer 
                        : crop.userInput.soilDrainage = 'Well Drained'
        );
        console.log();
    }

    // set MIX state values.
    const MIX_SUMS = {
        seedsInMix: 0,
    }

    const isMix = IS_MIX(mix);
    const sumSpeciesInMix = SUM_SPECIES_IN_MIX(mix);

    // CROP SPECIFIC CALCULATIONS
    for(let crop of mix){
        // get user inputs for this crop.
        const soilDrainage = crop.userInput.soilDrainage;
        // add to calcs state
        crop.calcs = {
            validSoilDrainage: calculator.checks.soilDrainage.validSoilDrainage({soilDrainage,crop:crop.nrcs})
        }
    } 
    
    // MIX SPECIFIC CALCULATIONS
    for(let crop of mix){
    }

    // create print sheet.
    for (let crop of mix){
        console.log(crop.name);
        console.log('-------------------------------------')
        console.log('Soil Drainage (from Cover Crop):', crop.nrcs.soilDrainage);
        console.log('Input - Soil Drainage:', crop.userInput.soilDrainage);
        console.log('EQIP - Soil Drainage Check:', crop.calcs.validSoilDrainage, `(${crop.calcs.validSoilDrainage ? 1 : 0})`);
        console.log('-------------------------------------\n\n')
    }

}

main();
