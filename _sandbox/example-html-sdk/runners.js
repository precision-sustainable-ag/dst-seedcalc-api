


function AdjustProportionsPage_Pea(pea_winter, calculator){
    const crop = calculator.getCrop(pea_winter); // loads standardized crop interface, this is best for when you need to access properties of the crop itself, because this object will be standardized across all councils. and provides standard dot notation property accessors.
    const defaultSingleSpeciesSeedingRatePLS = crop.coefficents.singleSpeciesSeedingRate;
    const defaultMixSeedingRate = calculator.mixSeedingRate(pea_winter); // here you can use either the pea_winter response object, or the crop interface. it does not matter.
    const seedsPerAcre = calculator.seedsPerAcre(pea_winter) 
    const plantPerAcre = calculator.plantsPerAcre(pea_winter);
    const plantPerSqft = calculator.plantsPerSqft(pea_winter);
    console.log('\n> ',pea_winter.label, '- AdjustProportionsPage')
    console.log('Default Single Species Seeding Rate PLS :',defaultSingleSpeciesSeedingRatePLS);
    console.log('Default mix seeding Rate :',defaultMixSeedingRate);
    console.log('Seeds Per Pound :',crop.seedsPerPound);
    console.log('Seeds Per Acre',seedsPerAcre);
    console.log('Plants Per Acre',plantPerAcre);
    console.log('Plants Per Sqft',plantPerSqft);
}


function AdjustProportionsPage_Rapeseed(rapeseed, calculator){
    const options = {
        // values that are purely obtained from user input. 
        acres: null, // if null or undefined, defaults to 1
        plantingMethod: null, // if null or undefined, default value will be generated.
        // these values are purley user input
        // but also only effect calculations when a value is provided.
        managementImpactOnMix: null, // if null or undefined, the managementImpactOnMix will not be considered ( no additional calculation will occur. )
        germination: null, // if null or undefined, the % germination will not be considered ( no additional calculation will occur. )
        purity: null, // if null or undefined, the % purity will not be considered ( no additional calculation will occur. ) 
       
        // values that have crop / static defaults
        singleSpeciesSeedingRate: 3, // if this is null or undefined, a default value will be generated.
        percentOfRate: 0.25, // if this is null or undefined, a default value will be generated.
        seedsPerPound: null, // if null or undefined, it will be extracted from crop object
        percentSurvival:null, // if null or undefined, defaults to 0.85 (85%)
        
        // values that are calculations
        seedsPerAcre: null,  // if null or undefined, this will be calculated using other options provided or default values.
        plantingMethodModifier: 1, // if this is null or undefined, it will be calculated using options provided or default values.
        mixSeedingRate: null,  // if null or undefined, it will be calculated other options provided or default values.
    }
    /**
     * NOTE:
     * On this page, we want to calculate the base seeding without any additional modifier,
     * so we nulled out all of our options, and gave plantingMethodModifier a 1
     * We needed to pass 1 as the plantingMethodModifier, because we initialized the calculator with 
     * a plantingMethod of 'Precision' which will cause the calculator to generate a plantingMethodModifier value
     * for the mixSeedingRate, passing in a 1 will override the need to calculate the plantingMethodModifier. 
     */
    const crop = calculator.getCrop(rapeseed); // loads standardized crop interface, this is best for when you need to access properties of the crop itself, because this object will be standardized across all councils. and provides standard dot notation property accessors.
    const defaultSingleSpeciesSeedingRatePLS = options.singleSpeciesSeedingRate ?? crop.coefficents.singleSpeciesSeedingRate;
    const defaultMixSeedingRate = calculator.mixSeedingRate(rapeseed,options); // here you can use either the pea_winter response object, or the crop interface. it does not matter.
    const seedsPerAcre = calculator.seedsPerAcre(rapeseed,options) 
    const plantPerAcre = calculator.plantsPerAcre(rapeseed,options);
    const plantPerSqft = calculator.plantsPerSqft(rapeseed,options);

    console.log('\n> ',rapeseed.label, '- AdjustProportionsPage')
    console.log('Default Single Species Seeding Rate PLS :',defaultSingleSpeciesSeedingRatePLS);
    console.log('Default mix seeding Rate :',defaultMixSeedingRate);
    console.log('Seeds Per Pound :',crop.seedsPerPound);
    console.log('Seeds Per Acre',seedsPerAcre);
    console.log('Plants Per Acre',plantPerAcre);
    console.log('Plants Per Sqft',plantPerSqft);

}


function ReviewYourMixPage_Oat(oat_spring, calculator){
    const options = {
        // values that are purely obtained from user input. 
        acres: 50, // if null or undefined, defaults to 1
        plantingMethod: 'Drilled', // if null or undefined, default value will be generated.
        // these values are purley user input
        // but also only effect calculations when a value is provided.
        managementImpactOnMix: 0.57, // if null or undefined, the managementImpactOnMix will not be considered ( no additional calculation will occur. )
        germination: 0.85, // if null or undefined, the % germination will not be considered ( no additional calculation will occur. )
        purity: 0.95, // if null or undefined, the % purity will not be considered ( no additional calculation will occur. ) 
       
        // values that have crop / static defaults
        singleSpeciesSeedingRate: 45, // if this is null or undefined, a default value will be generated.
        percentOfRate: null, // if this is null or undefined, a default value will be generated.
        seedsPerPound: null, // if null or undefined, it will be extracted from crop object
        percentSurvival:null, // if null or undefined, defaults to 0.85 (85%)
        
        // values that are calculations
        seedsPerAcre: null,  // if null or undefined, this will be calculated using other options provided or default values.
        plantingMethodModifier: 1, // if this is null or undefined, it will be calculated using options provided or default values.
        mixSeedingRate: null,  // if null or undefined, it will be calculated other options provided or default values.
    }


    const crop = calculator.getCrop(oat_spring); // loads standardized crop interface, this is best for when you need to access properties of the crop itself, because this object will be standardized across all councils. and provides standard dot notation property accessors.
    const singleSpeciesSeedingRate = options.singleSpeciesSeedingRate ?? crop.coefficents.singleSpeciesSeedingRate;
    const percentOfSingleSpeciesRate = options.percentOfRate ?? calculator.getDefaultPercentOfSingleSpeciesSeedingRate(oat_spring)
    // here we want the base seeding rate, so we need to pass in only the singleSpeciesSeedingRate, percentOfRate, and plantingMethodModifier = 1
    const baseMixSeedingRate = calculator.mixSeedingRate(oat_spring, {
        singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
        percentOfRate: options.percentOfRate,
        plantingMethodModifier: 1
    });
    // here we want to account for planting method modifier so we pass in the planting method,
    // you could also pass in plantingMethodModifier if you have pre-calculated it else ware.
    const mixSeedingRateAfterPlantingMethodModifier = calculator.mixSeedingRate(oat_spring, {
        singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
        percentOfRate: options.percentOfRate,
        plantingMethod: options.plantingMethod,
        plantingMethodModifier: options.plantingMethodModifier // if this is null, it will be calculated with the plantingMethod option.
    });

    const mixSeedingRateAfterManagementImpact = calculator.mixSeedingRate(oat_spring, {
        singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
        percentOfRate: options.percentOfRate,
        plantingMethod: options.plantingMethod,
        plantingMethodModifier: options.plantingMethodModifier, // if this is null, it will be calculated with the plantingMethod option.
        managementImpactOnMix: options.managementImpactOnMix // this does not have a default value, and if it is null or undefined the operation will be ignored.
    });
    
    const mixSeedingRateAfterPurityAndGermination = calculator.mixSeedingRate(oat_spring, {
        singleSpeciesSeedingRate: options.singleSpeciesSeedingRate,
        percentOfRate: options.percentOfRate,
        plantingMethod: options.plantingMethod,
        plantingMethodModifier: options.plantingMethodModifier, // if this is null, it will be calculated with the plantingMethod option.
        managementImpactOnMix: options.managementImpactOnMix, // this does not have a default value, and if it is null or undefined the operation will be ignored.
        purity: options.purity, // this does not have a default value, and if it is null or undefined the operation will be ignored.
        germination: options.germination, // this does not have a default value, and if it is null or undefined the operation will be ignored.
    });

    const bulkSeedingRate = mixSeedingRateAfterPurityAndGermination;

    const poundsForPurchase = calculator.poundsForPurchase(oat_spring, {
        acres: options.acres,
        mixSeedingRate: bulkSeedingRate,
    });

    console.log('\n> ',oat_spring.label, '- ReviewYourMixPage')
    console.log('Single Species Seeding Rate PLS :',singleSpeciesSeedingRate);
    console.log('% of single species rate :',percentOfSingleSpeciesRate);
    console.log('Base mix seeding Rate :',baseMixSeedingRate);
    console.log('Mix Seeding rate after planting method modifier (Step 3)', mixSeedingRateAfterPlantingMethodModifier);
    console.log('Mix seeding rate after management impact (Step 4)',mixSeedingRateAfterPlantingMethodModifier);
    console.log('Mix seeding rate after germination and purity (Step 4)',mixSeedingRateAfterPurityAndGermination);
    console.log('Bulk Seeding Rate',bulkSeedingRate)
    console.log('Acres',options.acres ?? 1)
    console.log('Pounds for purchase',poundsForPurchase);
}