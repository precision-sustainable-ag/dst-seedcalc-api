


function AdjustProportionsPage_Pea(pea_winter, calculator){
    const crop = calculator.getCrop(pea_winter); // loads standardized crop interface, this is best for when you need to access properties of the crop itself, because this object will be standardized across all councils. and provides standard dot notation property accessors.
    const defaultSingleSpeciesSeedingRatePLS = crop.coefficents.singleSpeciesSeedingRate;
    const defaultMixSeedingRate = calculator.mixSeedingRate(pea_winter); // here you can use either the pea_winter response object, or the crop interface. it does not matter.
    const seedsPerAcre = calculator.seedsPerAcre(pea_winter) 
    const plantPerAcre = calculator.plantsPerAcre(pea_winter);
    const plantPerSqft = calculator.plantsPerSqft(pea_winter);
    console.log('> ',pea_winter.label, '- AdjustProportionsPage')
    console.log('Default Single Species Seeding Rate PLS :',defaultSingleSpeciesSeedingRatePLS);
    console.log('Default mix seeding Rate :',defaultMixSeedingRate);
    console.log('Seeds Per Pound :',crop.seedsPerPound);
    console.log('Seeds Per Acre',seedsPerAcre);
    console.log('Plants Per Acre',plantPerAcre);
    console.log('Plants Per Sqft',plantPerSqft);
}