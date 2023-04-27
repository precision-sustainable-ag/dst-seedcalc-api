const { Crop } = require("./Crop");

/**
 * CALCULATOR INTERFACE
 */
class SeedRateCalculator {

    static FACTORY_MAP = {
        'mccc': ({mix, userInput}) => new MWSeedRateCalculator({mix, userInput}),
    }

    constructor({mix, userInput} = {}){
        if(mix){
            return SeedRateCalculator.factory({mix, userInput});
        }
    }

    /**
     * Factory method to create instances of the class based on the council.
     *
     * @param {Object} options - The options object.
     * @param {Array|string} options.mix - The mix or mixes for the instance.
     * @param {string} options.council - The council for which to create the instance.
     * @param {Object} [options.userInput] - The optional user input for the instance.
     * 
     * @returns {Object} The created instance.
     * 
     * @throws {Error} If council or mix is not provided or council is invalid.
     */
    static factory({mix, council, userInput}){
        if(!council) throw new Error('council is a required parameter.');
        council = council.toLowerCase();

        if(typeof mix === 'undefined') throw new Error('mix is a required parameter.');

        if(!Array.isArray(mix)) mix = [mix];
        
        if(!Object.keys(this.FACTORY_MAP).includes(council)){
            throw new Error(`Invalid Council: ${council}`);
        }
        
        const instance = this.FACTORY_MAP[council]({mix, userInput});

        instance.mix = mix;
        instance.userInput = userInput;
        instance.council = council;

        return instance.init();
    }

    /**
     * Initalize the Calculator.
     * 
     * @returns {this}
     */
    init(){
        this.isMix = this.mix.length > 1;
        this.crops = {}
        for(let crop of this.mix){
            if(!(crop instanceof Crop)) this.crops[crop.id] = new Crop(this.council, crop);
            else this.crops[crop.id] = crop;
        }
        this.sumSpeciesInMix();
        return this;
    }

    /**
     * Planting Method Modifier -
     * Calculates the planting method modifier for a given crop and planting method.
     *
     * @param {Object} crop - The crop object to calculate the planting method modifier for.
     * @param {Object} options - The options object.
     * @param {string} options.plantingMethod - The planting method to calculate the modifier for.
     * 
     * @returns {number} The planting method modifier for the given crop and planting method.
     */
    plantingMethodModifier(crop, {plantingMethod}){
        if(!plantingMethod) plantingMethod = this.userInput?.plantingMethod;

        plantingMethod = plantingMethod.toLowerCase().trim();

        if(typeof crop?.coefficents?.plantingMethods[plantingMethod] === 'undefined'){
            return this.getDefaultPlantingMethodModifier();
        }
        
        return crop.coefficents.plantingMethods[plantingMethod];
    }

    /**
     * 
     * Gets the default planting method modifier.
     * * Generally this defaults to 1, meaning the seeding rate will be unchanged.
     * 
     * @returns {number} - defualt planting method modifier.
     */
    getDefaultPlantingMethodModifier(){
        return 1;
    }

    /**
     * Pounds for purchase
     * 
     * Mix Seeding Rate -
     * returns the Single Species Seeding Rate multipled by the percentOfRate, 
     * If no percentOfRate is given, the default value for the council will be used.
     * Planting method modifier can be a number, or an object containing the params needed for plantingMethodModifier calculations.
     * 
     * @param {Object} crop - The crop object.
     * @param {number} crop.coefficients.singleSpeciesSeedingRate - The single species seeding rate coefficient for the crop.
     * @param {Object} options - The options object.
     * @param {number} [options.acres] - The number of acres used to calculate the total number of pounds for purchase.
     * @param {number|Object} [options.mixSeedingRate] - Either the Mix Seeding Rate, or the parameters to calculate the mix seeding rate. If no parameters are given, and a mix seeding rate is not given, one will be calculated with crop's default values.
     * @param {number} [options.mixSeedingRate.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.mixSeedingRate.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number|Object} [options.mixSeedingRate.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.mixSeedingRate.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.mixSeedingRate.germination] - The germination value.
     * @param {number} [options.mixSeedingRate.purity] - The purity value.
     * 
     * @throws {Error} When management impact on mix, germination or purity values are not within the allowed range.
     * 
     * @returns {number} The mix seeding rate value.
     */
    poundsForPurchase(crop, {mixSeedingRate, acres}={}){
        if(typeof mixSeedingRate === 'undefined') mixSeedingRate = this.mixSeedingRate(crop);
        else if(typeof mixSeedingRate === 'object') mixSeedingRate = this.mixSeedingRate(crop, mixSeedingRate);

        if(!acres) acres = 1;

        return mixSeedingRate * acres;
    }

    /**
     * Plants Per Acre -
     * Calculates the plants per acre for a given crop
     * 
     * @param {Crop} crop - The name of the crop
     * @param {Object} [config={}] - An optional object containing configuration parameters
     * @param {number} [config.percentSurvival=0.85] - The percentage of seeds that survive and grow
     * @param {number} [config.seedsPerAcre] - The number of seeds per acre of the crop
     * @param {number} [config.seedsPerPound] - The number of seeds per pound of the crop
     * @param {number} [config.mixSeedingRate] - The mix seeding rate for the crop
     * @param {number} [config.percentOfRate] - The percentage of the mix seeding rate to use
     * 
     * @throws {Error} If percent survival is not a value between 0 and 1 (inclusive)
     * 
     * @returns {number} The plants per acre for the given crop
     */
    plantsPerAcre(crop, {percentSurvival, seedsPerAcre, seedsPerPound, mixSeedingRate, percentOfRate}={}){
        if(!seedsPerAcre){
            seedsPerAcre = this.seedsPerAcre(crop, {seedsPerPound, mixSeedingRate, percentOfRate});
        }
        if(!percentSurvival){
            percentSurvival = 0.85;
        }
        if(percentSurvival > 1 || percentSurvival < 0){
            throw new Error('Percent survival must be a value between 0 and 1  ( inclusive ).');
        }

        return seedsPerAcre * percentSurvival;
    }

    /**
     * Plant Per SqFt -
     * Calculates the plants per square foot for a given crop
     * 
     * @param {Crop} crop - The name of the crop
     * @param {Object} [config={}] - An optional object containing configuration parameters
     * @param {number} [config.percentSurvival=0.85] - The percentage of seeds that survive and grow
     * @param {number} [config.seedsPerAcre] - The number of seeds per acre of the crop
     * @param {number} [config.seedsPerPound] - The number of seeds per pound of the crop
     * @param {number} [config.mixSeedingRate] - The mix seeding rate for the crop
     * @param {number} [config.percentOfRate] - The percentage of the mix seeding rate to use
     * 
     * @throws {Error} If percent survival is not a value between 0 and 1 (inclusive)
     * 
     * @returns {number} The plants per acre for the given crop
     */    
    plantsPerSqft(crop, {percentSurvival, seedsPerAcre, seedsPerPound, mixSeedingRate, percentOfRate}={}){
        const plantPerAcre = this.plantsPerAcre(crop, {percentSurvival, seedsPerAcre, seedsPerPound, mixSeedingRate, percentOfRate});
        const ACRES_PER_SQFT = 43560;

        return plantPerAcre / ACRES_PER_SQFT;
    }

    /**
     * Seeds Per Acre -
     * Calculates the seeds per acre for a given crop
     * 
     * @param {Crop} crop - The name of the crop
     * @param {Object} [config] - An optional object containing configuration parameters
     * @param {number} [config.seedsPerPound] - The number of seeds per pound of the crop
     * @param {number} [config.mixSeedingRate] - The mix seeding rate for the crop
     * @param {number} [config.percentOfRate] - The percentage of the mix seeding rate to use
     * 
     * @throws {Error} If no mix seeding rate is provided or invalid parameters to calculate mix seeding rate
     * @throws {Error} If seeds per pound data could not be located
     * 
     * @returns {number} The seeds per acre for the given crop
     */
    seedsPerAcre(crop, {seedsPerPound, mixSeedingRate, percentOfRate}={}) {
        if(!mixSeedingRate) {
            mixSeedingRate = crop?.calcs?.mixSeedingRate;
        }
        if(!mixSeedingRate){
            mixSeedingRate = this.mixSeedingRate(crop, {percentOfRate});
        }
        if(!seedsPerPound) {
            seedsPerPound = crop.seedsPerPound;
        }
        
        if(!mixSeedingRate) throw new Error('No Mix Seeding Rate provided, or invailid parameters to calculate mix seeding rate.');
        if(!seedsPerPound) throw new Error('Could not locate seeds per pound data.');

        return seedsPerPound * mixSeedingRate;
    }

    /**
     * Mix Seeding Rate -
     * returns the Single Species Seeding Rate multipled by the percentOfRate, 
     * If no percentOfRate is given, the default value for the council will be used.
     * Planting method modifier can be a number, or an object containing the params needed for plantingMethodModifier calculations.
     * 
     * @param {Object} crop - The crop object.
     * @param {number} crop.coefficients.singleSpeciesSeedingRate - The single species seeding rate coefficient for the crop.
     * @param {Object} options - The options object.
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number|Object} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     * 
     * @throws {Error} When management impact on mix, germination or purity values are not within the allowed range.
     * 
     * @returns {number} The mix seeding rate value.
     */
    mixSeedingRate(crop, { singleSpeciesSeedingRate, percentOfRate, plantingMethodModifier, managementImpactOnMix, germination, purity } = {}){
        if(!percentOfRate){
            percentOfRate = this.getDefaultPercentOfSingleSpeciesSeedingRate();
        }

        if(!singleSpeciesSeedingRate){
            singleSpeciesSeedingRate = crop.coefficents.singleSpeciesSeedingRate
        }

        let mixSeedingRate = crop.calcs.mixSeedingRate = singleSpeciesSeedingRate * percentOfRate;

        if(plantingMethodModifier){
            if(typeof plantingMethodModifier === 'object' && plantingMethodModifier?.plantingMethod){
                plantingMethodModifier = this.plantingMethodModifier(crop, plantingMethodModifier);
            }
            mixSeedingRate = mixSeedingRate * plantingMethodModifier;
        }

        if(managementImpactOnMix){
            if(managementImpactOnMix <= 0) throw new Error('Management Impact on mix must be greater than 0%');
            if(managementImpactOnMix > 1) throw new Error('Management Impact on mix must be less than or equal to 100%');
            mixSeedingRate = mixSeedingRate + ( mixSeedingRate * managementImpactOnMix);
        }

        if(germination){
            if(germination <= 0) throw new Error('Germination must be greater than 0%');
            if(germination > 1) throw new Error('Germination must be less than or equal to 100%');
            mixSeedingRate = mixSeedingRate / germination;
        }

        if(purity){
            if(purity <= 0) throw new Error('Purity must be greater than 0%');
            if(purity > 1) throw new Error('Purity must be less than or equal to 100%');
            mixSeedingRate = mixSeedingRate / purity;
        }

        return mixSeedingRate;
    }

    /**
     * Gets the default percent of single species seeding rate. 
     * This means that only a certain percantage of single species seeding rate will be applied for the given mix. 
     * 
     * In general this will always be 1 for non-mixes, and the default value for mixes is 1/mixDiversity
     * 
     * @returns {number} Default Percent of Single Species Seeding Rate
     */
    getDefaultPercentOfSingleSpeciesSeedingRate(crop, {}={}){
        return 1/this.mixDiversity;
    }

    /**
     * Generally this is an operation function that triggers when a mix is created or edited.
     * * If you simply need the `speciesInMix` object, you can access it through the public property `speciesInMix`.
     * 
     * * If you want to get the count of a specific group based on the group name, you can call the public function 
     * `getCountOfGroupInMix(G)` where `G` is the group label.
     * 
     * @returns {object} returns an object containing crop groups as the key, and the count of that group for the given mix. 
     */
    sumSpeciesInMix(){
        const mix = this.mix;
        const counts = {};
        for(let crop of mix){
            if(!crop?.group?.label) throw new Error(`Invalid Crop structure, missing crop.group.label for ${crop?.label}`);
            if(typeof counts[crop.group.label] === 'undefined') counts[crop.group.label] = 1;
            else counts[crop.group.label] += 1;
        }
        this.mixDiversity = Object.keys(counts).length;
        return this.speciesInMix = counts;
    }

    /**
     * Gets the count of a specific group based on the group name, 
     * 
     * @param {string} G - label of group to get count for. 
     * 
     * @returns {number} - defaults to 0 if the group is not in the mix.
     */
    getCountOfGroupInMix(G){
        return this.speciesInMix[G] ?? 0;
    }


}


/**
 * MID WEST CALCULATOR
 */

class MWSeedRateCalculator extends SeedRateCalculator {

    constructor({mix, userInput}){
        super();
    }

    // init(){
    //     super.init();

    //     for(let [id, crop] of Object.entries(this.crops)){
    //         this.mixSeedingRate(crop);
    //     }

    //     return this;
    // }


    // getDefaultPercentOfSingleSpeciesSeedingRate(){
    //     return 1/this.mixDiversity;
    // }


}



module.exports = {
    SeedRateCalculator, MWSeedRateCalculator
}