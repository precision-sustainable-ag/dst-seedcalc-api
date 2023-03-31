
/**
 * 
 * 
    plantingMethod = PLANTING_METHOD,
    aerialPMCoef = AERIAL_PM_COEF,
    broadcastWithCultivationCoef = BROADCAST_WITH_CULTIVATION_COEF,
    broadcastWithNoCultivationCoef = BROADCAST_WITH_NO_CULTIVATION_COEF


    isMix = IS_MIX, 
    soilFertility = SOIL_FERTILITY, 
    highFertilityMixCoef = HIGH_FERTILITY_COEF,
    lowFertilityMixCoef = LOW_FERTILITY_COEF,
    monoCultureHighFertilityCoef = MONOCULTURE_STANDARD_HIGH_FERTILITY_COEF,
    monoCultureLowFertilityCoef = MONOCULTURE_STANDARD_LOW_FERTILITY_COEF


    sumOfType = SUM_OF_TYPE,
    soilFertilityModifierParams = {},
    plantingMethodModiferParams = {}


    baseSeedingRateDefault = BASE_SEEDING_RATE_DEFAULT,
    mixRatioModifierParams = {}
 * 
 */

// 3rd party packages    
const readline = require('readline');

// calculators
const calculator = require('../calculations/index');

// crops
const RAPESEED_FORAGE = require('../crops/neccc/rapeseed-forage');
const PEA_WINTER = require('../crops/neccc/pea-winter');
const OATS_WINTER = require('../crops/neccc/oats-winter');
const { calc } = require('../calculations/final-seeding-rate');

// helper functions
async function promptInput(question, callback){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve,reject)=>{

        rl.question(question, (answer) => {
            callback(answer);
            rl.close();
            resolve();
        });

    });
}


// state setup
const MIX = [];
const IS_MIX = () => MIX.length > 1;

const MIX_TYPE_COUNTS = () => {
    const counts = {};
    for(let crop of MIX){
        if(typeof counts[crop.group] === 'undefined') counts[crop.group] = 1;
        else counts[crop.group] += 1;
    }
    return counts;
}

const SUM_OF_TYPE = (T) => {
    const counts = MIX_TYPE_COUNTS();
    return counts[T] ?? 0;
}

MIX.push(RAPESEED_FORAGE, PEA_WINTER, OATS_WINTER);




async function main(){

    // get required user inputs
    // Planting Method
    // Soil Fertility
    for( let crop of MIX){
        crop.userInput = {};
        console.log(crop.name,':')
        await promptInput( `What is the seeding method, hit enter to use default. (Default: Drilled)? `, 
                            (answer) => answer 
                                        ? crop.userInput.plantingMethod = answer 
                                        : crop.userInput.plantingMethod = 'Drilled'
        );
        await promptInput( `What is your soil fertility, hit enter to use default. (Default: Low To Moderate)? `, 
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
    const isMix = IS_MIX();

    // perform calculations that are crop specific
    for(let crop of MIX){
        const sumOfType = SUM_OF_TYPE(crop.group);
        const plantingMethodModifier = calculator.plantingMethodModifer({plantingMethod: crop.userInput.plantingMethod, crop });
        const soilFertilityModifier = calculator.soilFertilityModifer({isMix, soilFertility: crop.userInput.soilFertility, crop});
        const mixRatioModifier = calculator.mixRatioModifier({sumOfType,soilFertilityModifier,plantingMethodModifier});
        const finalSeedingRate = calculator.finalSeedingRate({mixRatioModifier, crop});
        const seedsPerAcre = calculator.seedsPerAcre({finalSeedingRate, crop});
        const approxPlantsPerSqft = calculator.approxPlantsPerSqft({seedsPerAcre});
        const percentOfSingleSpeciesSeedingRate = calculator.percentSingleSpeciesSeedingRate({finalSeedingRate, plantingMethodModifier, crop});

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
    for(let crop of MIX){
        crop.calcs.percentPoundsOfSeedPerAcreInMix = calculator.percentPoundsPerAcreInMix({
            finalSeedingRate: crop.calcs.finalSeedingRate,
            sumOfMixSeedingRates: MIX_SUMS.finalSeedingRates,
        });
        crop.calcs.percentSeedsInMix = calculator.percentSeedsInMix({
            seedsPerAcre: crop.calcs.seedsPerAcre,
            sumOfSeedsPerAcreInMix: MIX_SUMS.seedsPerAcre,
        });


    }

    // create print sheet.
    for (let crop of MIX){
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
