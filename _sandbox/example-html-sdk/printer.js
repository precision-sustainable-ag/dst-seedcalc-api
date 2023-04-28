
function printMix(mix){

    console.log('Current Mix')
    console.log('--------------------------------------------')
    for(let crop of mix){
        console.log(crop.label,`(ID: ${crop.id})`);
    }
    console.log('--------------------------------------------\n\n')
}

function printUserInput(ui){

    console.log('User Input')
    console.log('--------------------------------------------')
    for(let [key,val] of Object.entries(ui)){
        console.log(key,':',val);
    }
    console.log('--------------------------------------------\n\n')
}

function printMixOverview(calculator){

    console.log('Mix Overview')
    console.log('--------------------------------------------')
    console.log('Is Mix?', calculator.isMix);
    console.log('Mix Diversity:',calculator.mixDiversity); // county of group types in mix
    console.log('Species In Mix:', calculator.speciesInMix);
    console.log('--------------------------------------------\n\n')
}

function printMixRatiosPageDefault(calculator){

    const crop = calculator.crops[148];
    const percentOfRate = calculator.getDefaultPercentOfSingleSpeciesSeedingRate(crop);
    const mixSeedingRate = calculator.mixSeedingRate(crop);
    const seedsPerAcre = calculator.seedsPerAcre(crop);
    const plantsPerAcre = calculator.plantsPerAcre(crop);
    const plantsPerSqft = calculator.plantsPerSqft(crop);

    console.log(`Mix Ratio Page (${crop.label}) Default Vals.`)
    console.log('--------------------------------------------')
    console.log(`Single Species Seeding Rate PLS (${crop.coefficents.singleSpeciesSeedingRate}) x % of Single Species Seedings Rate (${percentOfRate.toFixed(2)}) = Mix Seeding Rate (${mixSeedingRate.toFixed(2)})`);
    console.log(`\t${crop.coefficents.singleSpeciesSeedingRate} x ${percentOfRate.toFixed(2)} = ${mixSeedingRate.toFixed(2)}`);
    console.log(`Seeds Per Pound (${crop.seedsPerPound}) x Mix Seeding Rate (${mixSeedingRate.toFixed(2)}) = Seeds Per Acre (${seedsPerAcre.toFixed(2)})`);
    console.log(`\t${crop.seedsPerPound} x ${mixSeedingRate.toFixed(2)} = ${seedsPerAcre.toFixed(2)}`);
    console.log(`Seeds Per Acre (${seedsPerAcre.toFixed(2)}) x % Survival (85%) = Plants Per Acre (${plantsPerAcre.toFixed(2)})`);
    console.log(`\t${seedsPerAcre.toFixed(2)} x 0.85 = ${plantsPerAcre.toFixed(2)}`);
    console.log(`Plants Per Acre (${plantsPerAcre.toFixed(2)}) / SqFt/Acre (43560) = Plants Per Sqft (${plantsPerSqft.toFixed(2)})`);
    console.log(`\t${plantsPerAcre.toFixed(2)} / 43560 = ${plantsPerSqft.toFixed(2)}`);
    console.log('--------------------------------------------\n\n')

}

function printMixRatiosPageCustom(calculator, userInput){



    const crop = calculator.crops[161];
    const mixSeedingRate = calculator.mixSeedingRate(crop,userInput);
    const seedsPerAcre = calculator.seedsPerAcre(crop,userInput);
    const plantsPerAcre = calculator.plantsPerAcre(crop,userInput);
    const plantsPerSqft = calculator.plantsPerSqft(crop,userInput);

    console.log(`Mix Ratio Page (${crop.label}) Custom Vals.`)
    console.log('--------------------------------------------')
    console.log(`Single Species Seeding Rate PLS (${userInput.singleSpeciesSeedingRate}) x % of Single Species Seedings Rate (${userInput.percentOfRate}) = Mix Seeding Rate (${mixSeedingRate.toFixed(2)})`);
    console.log(`\t${userInput.singleSpeciesSeedingRate} x ${userInput.percentOfRate} = ${mixSeedingRate.toFixed(2)}`);
    console.log(`Seeds Per Pound (${crop.seedsPerPound}) x Mix Seeding Rate (${mixSeedingRate.toFixed(2)}) = Seeds Per Acre (${seedsPerAcre.toFixed(2)})`);
    console.log(`\t${crop.seedsPerPound} x ${mixSeedingRate.toFixed(2)} = ${seedsPerAcre.toFixed(2)}`);
    console.log(`Seeds Per Acre (${seedsPerAcre.toFixed(2)}) x % Survival (85%) = Plants Per Acre (${plantsPerAcre.toFixed(2)})`);
    console.log(`\t${seedsPerAcre.toFixed(2)} x 0.85 = ${plantsPerAcre.toFixed(2)}`);
    console.log(`Plants Per Acre (${plantsPerAcre.toFixed(2)}) / SqFt/Acre (43560) = Plants Per Sqft (${plantsPerSqft.toFixed(2)})`);
    console.log(`\t${plantsPerAcre.toFixed(2)} / 43560 = ${plantsPerSqft.toFixed(2)}`);
    console.log('--------------------------------------------\n\n')
}
