
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

        // add to calcs state
        crop.calcs = {
        }

        // add to mix calcs state
        MIX_SUMS.seedsInMix += crop.nrcs.seedsPerPound
    } 
    
    // MIX SPECIFIC CALCULATIONS
    for(let crop of mix){
        crop.calcs.percentInMix = calculator.percentInMix({
            seedsPerPound: crop.nrcs.seedsPerPound,
            sumSeedsInMix: MIX_SUMS.seedsInMix
        });

        crop.calcs.validPercentInMix = calculator.checks.percentInMix({
            percentInMix: crop.calcs.percentInMix,
            crop: crop.nrcs
        })
    }

    // create print sheet.
    for (let crop of mix){
        console.log(crop.name);
        console.log('-------------------------------------')
        console.log('% in Mix', crop.calcs.percentInMix, `(${(crop.calcs.percentInMix*100).toFixed(0)}%)`);
        console.log('EQIP % in Mix', crop.calcs.validPercentInMix, `(${crop.calcs.validPercentInMix ? 1 : 0})`);
        console.log('-------------------------------------\n\n')
    }

}

main();
