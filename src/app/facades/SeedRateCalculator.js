const { Crop } = require("./Crop");


class Options {

    static CALCULATED_PROPS = {
        plantingMethodModifier: (calculator, crop, options) => calculator.plantingMethodModifier(crop, options),
        mixSeedingRate: (calculator, crop, options) => calculator.mixSeedingRate(crop,options),
        seedsPerAcre: (calculator, crop, options) => calculator.seedsPerAcre(crop,options),
    }

    static factory(calculator, keys=[], {crop,options}){
        return new this(calculator, keys, {crop,options});
    }

    constructor(calculator, keys=[], {crop, options}) {
        this.calculator = calculator;
        this.options = options;
        this.crop = crop;
        this.keys = keys;
        this.props = {};
        // next we check for calculated options that were not provided.
        for(let key of keys){

            if(options[key]) {
                this[key] = options[key];
                this.props[key] = options[key];
                continue;
            };
            
            if(Options.CALCULATED_PROPS[key]){
                const getter = Options.CALCULATED_PROPS[key];
                const val = getter(calculator, crop, options);
                this[key] = val;
                this.props[key] = val;
            }

        }
        
    }

}

/**
 * NRCS Checks Interface.
 */
class NRCS {

    constructor({calculator}){
        this.calculator = calculator;
    }

    /**
     * isValidPercentInMix -
     * 
     * Checks to see if this crops percent of the current mix is within the threshold of the maximum percent in mix limit.
     * 
     * @param {object} crop 
     * @param {object} options - the options for this calculation, as well as the options for calculations for specific crops in the mix.
     * @param {number} options.percentInMix - the percent of this crop in the current mix. 
     * @param {number} options.maxInMix - maximum percent in mix limit. 
     * 
     * @returns {boolean} 
     */
    isValidPercentInMix(crop, options = {}) {
        crop = this.calculator.getCrop(crop);

        const config = Options.factory(this.calculator, ['percentInMix','maxInMix'] , {crop,options});

        const percentInMix = config?.percentInMix ?? this.calculator.percentInMix(crop, options);

        const maxInMix = config?.maxInMix ?? crop?.coefficents?.maxInMix;

        return percentInMix <= maxInMix;
    }

    /**
     * 
     * @param {object|Crop} crop 
     * @param {object} options 
     * @param {array} options.plantingDate - defaults to now.
     * @param {array} options.reliableEstablishement
     * @param {array} options.earlySeeding
     * @param {array} options.lateSeeding
     */
    isValidPlantingDate(crop, options = { plantingDate: new Date(), }){
        crop = this.calculator.getCrop(crop);

        if(!(options.plantingDate instanceof Date)) options.plantingDate = new Date(options.plantingDate);

        const config = Options.factory(
            this.calculator, 
            ['plantingDate','reliableEstablishement','earlySeeding','lateSeeding'], 
            {crop,options}
        );

        const validDates = [
            ...config?.reliableEstablishement ?? crop.plantingDates?.reliableEstablishement ?? [],
            ...config?.earlySeeding ?? crop.plantingDates?.earlySeeding ?? [],
            ...config?.lateSeeding ?? crop.plantingDates?.lateSeeding ?? [],
        ];

        for(let range of validDates){
            if(config.plantingDate >= range.start && config.plantingDate <= range.end) return true;
        }

        return false;
    }
    /**
     * isValidSeedingRate - 
     * 
     * We are going to get the base mix seeding rate and the final mix seeding rate
     * then ensure that the final mix seeding rate 
     * is between 50% and 250% of the base mix seeding rate.
     *  
     * @param {object} crop - crop object 
     * @param {object} options - options object, mimics options object for mix seeding rate. ALL options provided will be used to calculate Final Mix Seeding Rate, only singleSpeciesSeedingRate & percentOfRate will be considered when calculating the Base Mix Seeding Rate.
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number|Object} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     */
    isValidSeedingRate(crop, options = {}){

        const baseSeedingRate = this.calculator.mixSeedingRate(crop, {
            singleSpeciesSeedingRate: options?.singleSpeciesSeedingRate,
            percentOfRate: options?.percentOfRate,
        });

        const finalMixSeedingRate = this.calculator.mixSeedingRate(crop, options);

        // 250% of base seeding rate.
        const UPPER_LIMIT = baseSeedingRate * 2.5;
        // 50% of base seeding rate.
        const LOWER_LIMIT = baseSeedingRate * 0.5; 

        return finalMixSeedingRate <= UPPER_LIMIT && finalMixSeedingRate >= LOWER_LIMIT;
    }

    /**
     * isValidSoilDrainage - 
     * 
     * Checks to see if this crop contains the ALL of the soil drainage values provided. 
     * 
     * @param {object|Crop} crop - the crop object.
     * @param {object} options - the options object.
     * @param {string|array} options.soilDrainage - Either a single soil drainage value OR an array of soil drainage values.
     * 
     * @returns {boolean} True only if crop.soilDrainage contains ALL of the soil drainage values provided.
     * 
     * @throws {Error} If no soil drainages are provided this will throw an error.
     */
    isValidSoilDrainage(crop, options = {}){
        if(!options?.soilDrainage) throw new Error('options.soilDrainage is required.');

        if(!Array.isArray(options.soilDrainage)) options.soilDrainage = [options.soilDrainage];

        if(options.soilDrainage.length <= 0) throw new Error('options.soilDrainage must have at least 1 value.');


        crop = this.calculator.getCrop(crop);

        for(let drainageClass of options.soilDrainage){
            if(!crop.soilDrainage.includes(drainageClass)) return false;
        }

        return true;
    }

}


/**
 * CALCULATOR INTERFACE
 */
class SeedRateCalculator {

    static FACTORY_MAP = {
        'mccc': ({mix, userInput}) => new MWSeedRateCalculator({mix, userInput}),
    }

    static PROPS;

    constructor({mix, council, userInput} = {}){
        if(mix){
            return SeedRateCalculator.factory({mix, council, userInput});
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
        this.setProps();
        this.nrcs = new NRCS({calculator: this});
        return this;
    }

    /**
     * Get Crop Instance
     */
    getCrop(obj){
        // if(obj instanceof Crop) return obj;

        if(!obj?.id) throw new Error('Crop object ID could not be located. (path: crop?.id)');

        const id = obj.id;

        if(typeof this.crops[id] === 'undefined') throw new Error(`Crop with ID: ${id} is not part of this calculators mix.`);

        return this.crops[id];
    }

    setProps(){

        this.PROPS = {};
        this.PROPS.plantingMethodModifier = ['plantingMethod'];

        this.PROPS.mixSeedingRate = [
            'singleSpeciesSeedingRate', 
            'percentOfRate', 
            'plantingMethodModifier', 
            'managementImpactOnMix', 
            'germination', 
            'purity',
            ...this.PROPS.plantingMethodModifier
        ];
        
        this.PROPS.poundsForPurchase = ['acres', 'mixSeedingRate', ...this.PROPS.mixSeedingRate];
        this.PROPS.seedsPerAcre = ['mixSeedingRate','seedsPerPound', ...this.PROPS.mixSeedingRate];
        this.PROPS.plantsPerAcre = ['seedsPerAcre','percentSurvival', ...this.PROPS.seedsPerAcre];
        this.PROPS.plantsPerSqft = ['seedsPerAcre','percentSurvival', ...this.PROPS.seedsPerAcre];

        return this.PROPS;
    }

    /**
     * Props interface
     * 
     * The Props interface maps option keys to function names, 
     * this is used to denote which object keys that should be made available when constructing the options object.
     * options objects are constructed for most functions on this class, and the options object
     * primarily enables us to set defaults, and perform calculations when a specific options default is the result of a calculation.
     * please see the Options class for more information & implementations.
     */
    props(P){
        if(!this.PROPS) this.setProps();

        const props = this.PROPS;

        if(P){
            return props[P];
        }

        return props;
    }

    /**
     * Percent In Mix - 
     * 
     * Calculates a specific crops percent of seeds in the current mix. 
     * 
     * @param {object} crop 
     * @param {object} options - the options for this calculation, as well as the options for calculations for specific crops in the mix.
     * @param {number} options.sumSeedsPerAcre - sum of all seeds in the mix. if this option is not given, it will be calculated using other config options provided, or default values. 
     * @param {object} options [{cropId}] - options for a specific cropId that will be used for calculations (mix seeding rate, seeds per acre) needed for the specified crop in the mix.
     * @param {number} options [{cropId}].mixSeedingRate - overrides and sets the mixSeedingRate for the given cropId in this mix. 
     * @param {number} options [{cropId}].seedsPerAcre - overrides and sets the seedsPerAcre for the given cropId in this mix. 
     * 
     * @returns {number} The percent of seed for the given crop in the current mix.
     */
    percentInMix(crop, options={}){

        crop = this.getCrop(crop);

        let sumSeedsPerAcre = 0;
        for(let [id, cropInMix] of Object.entries(this.crops)){
            const cropInMixOptions = options[id] ?? {};
            // get mix seeding rate
            if(cropInMixOptions?.mixSeedingRate) cropInMix.mixSeedingRate = cropInMixOptions.mixSeedingRate;
            if(!cropInMix?.mixSeedingRate) cropInMixOptions.mixSeedingRate = this.mixSeedingRate(cropInMix, cropInMixOptions);
            
            // get seeds per acre
            if(cropInMixOptions?.seedsPerAcre) cropInMix.seedsPerAcre = cropInMixOptions.seedsPerAcre;
            if(!cropInMix?.seedsPerAcre) cropInMixOptions.seedsPerAcre = this.seedsPerAcre(cropInMix, cropInMixOptions);

            sumSeedsPerAcre += cropInMix.seedsPerAcre;
        }

        return crop.percentInMix = (crop.seedsPerAcre / sumSeedsPerAcre);
    }

    /**
     * Planting Method Modifier -
     * Calculates the planting method modifier for a given crop and planting method.
     *
     * @param {Object} crop - The crop object to calculate the planting method modifier for. MUST be part of the mix used to instantiate the calculator instance.
     * @param {Object} options - The options object.
     * @param {string} options.plantingMethod - The planting method to calculate the modifier for.
     * 
     * @returns {number} The planting method modifier for the given crop and planting method.
     */
    plantingMethodModifier(crop, options={}){

        crop = this.getCrop(crop);

        options = new Options(this, this.props('plantingMethodModifier'), {crop,options})

        let plantingMethod = options?.plantingMethod;

        if(!plantingMethod) plantingMethod = this.userInput?.plantingMethod;

        if(!plantingMethod){
            return this.getDefaultPlantingMethodModifier(); 
        }

        plantingMethod = plantingMethod.toLowerCase().trim();

        if(typeof crop?.coefficents?.plantingMethods[plantingMethod] === 'undefined'){
            return this.getDefaultPlantingMethodModifier();
        }
        
        return crop.plantingMethodModifier = crop.coefficents.plantingMethods[plantingMethod];
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
     * @param {Object} crop - The crop object.
     * @param {Object} options - The options object.
     * @param {number} [options.acres] - The number of acres used to calculate the total number of pounds for purchase.
     * @param {number} [options.mixSeedingRate] - The mix seeding rate to use for calculations. This will override the need to perform the mix seeding rate calculation inline.
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
    poundsForPurchase(crop, options={}){
        crop = this.getCrop(crop);

        options = new Options(this, this.props('poundsForPurchase'), {crop,options})

        if(!options.acres) options.acres = 1;

        return crop.poundsForPurchase = options.mixSeedingRate * options.acres;
    }

    /**
     * Plants Per Acre -
     * Calculates the plants per acre for a given crop
     * 
     * @param {Crop} crop - The name of the crop
     * @param {Object} [options={}] - An optional object containing configuration parameters
     * @param {number} [options.percentSurvival=0.85] - The percentage of seeds that survive and grow
     * @param {number} [options.seedsPerAcre] - The number of seeds per acre of the crop
     * @param {number} [options.seedsPerPound] - The number of seeds per pound of the crop
     * @param {number} [options.mixSeedingRate] - The mix seeding rate to use for calculations. This will override the need to perform the mix seeding rate calculation inline.
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number|Object} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     * 
     * 
     * @throws {Error} If percent survival is not a value between 0 and 1 (inclusive)
     * 
     * @returns {number} The plants per acre for the given crop
     */
    plantsPerAcre(crop, options={}){
        crop = this.getCrop(crop);

        options = new Options(this, this.props('plantsPerAcre'), {crop, options})

        if(!options.percentSurvival){
            options.percentSurvival = 0.85;
        }
        if(options.percentSurvival > 1 || options.percentSurvival < 0){
            throw new Error('Percent survival must be a value between 0 and 1  ( inclusive ).');
        }
        
        return crop.plantsPerAcre = options.seedsPerAcre * options.percentSurvival;
    }

    /**
     * Plant Per SqFt -
     * Calculates the plants per square foot for a given crop
     * 
     * @param {Crop} crop - The name of the crop
     * @param {Object} [options={}] - An optional object containing configuration parameters
     * @param {number} [options.percentSurvival=0.85] - The percentage of seeds that survive and grow
     * @param {number} [options.seedsPerAcre] - The number of seeds per acre of the crop
     * @param {number} [options.seedsPerPound] - The number of seeds per pound of the crop
     * @param {number} [options.mixSeedingRate] - The mix seeding rate to use for calculations. This will override the need to perform the mix seeding rate calculation inline.
     * @param {number} [options.percentOfRate] - The percentage of the mix seeding rate to use
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number|Object} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     * 
     * 
     * @throws {Error} If percent survival is not a value between 0 and 1 (inclusive)
     * 
     * @returns {number} The plants per acre for the given crop
     */    
    plantsPerSqft(crop, options={}){
        crop = this.getCrop(crop);
        const plantPerAcre = this.plantsPerAcre(crop, options);
        const ACRES_PER_SQFT = 43560;

        return crop.plantsPerSqft = plantPerAcre / ACRES_PER_SQFT;
    }

    /**
     * Seeds Per Acre -
     * Calculates the seeds per acre for a given crop
     * 
     * @param {Crop} crop - The name of the crop
     * @param {Object} [options] - An optional object containing configuration parameters
     * @param {number} [options.seedsPerPound] - The number of seeds per pound of the crop
     * @param {number} [options.mixSeedingRate] - The mix seeding rate to use for calculations. This will override the need to perform the mix seeding rate calculation inline.
     * @param {number} [options.singleSpeciesSeedingRate] - The single species seeding rate value for the crop. If not provided, it is set to the crop's single species seeding rate coefficient.
     * @param {number} [options.percentOfRate] - The percent of rate value for the mix seeding rate. If not provided, it is set to the default percent of single species seeding rate.
     * @param {number|Object} [options.plantingMethodModifier] - The planting method modifier value or object. If it is an object, it should have the plantingMethod property to determine the planting method modifier value.
     * @param {number} [options.managementImpactOnMix] - The management impact on mix value.
     * @param {number} [options.germination] - The germination value.
     * @param {number} [options.purity] - The purity value.
     * 
     * 
     * @throws {Error} If no mix seeding rate is provided or invalid parameters to calculate mix seeding rate
     * @throws {Error} If seeds per pound data could not be located
     * 
     * @returns {number} The seeds per acre for the given crop
     */
    seedsPerAcre(crop, options={}) {
        crop = this.getCrop(crop);
        options = new Options(this, this.props('seedsPerAcre'), {crop, options})

        if(!options.seedsPerPound) {
            options.seedsPerPound = crop.seedsPerPound;
        }
        
        if(!options.mixSeedingRate) throw new Error('No Mix Seeding Rate provided, or invailid parameters to calculate mix seeding rate.');
        if(!options.seedsPerPound) throw new Error('Could not locate seeds per pound data.');

        return crop.seedsPerAcre = options.seedsPerPound * options.mixSeedingRate;
    }

    /**
     * Mix Seeding Rate -
     * returns the Single Species Seeding Rate multipled by the percentOfRate, 
     * If no percentOfRate is given, the default value for the council will be used.
     * Planting method modifier can be a number, or an object containing the params needed for plantingMethodModifier calculations.
     * 
     * @param {Object} crop - The crop object.
     * @param {number} crop.coefficents.singleSpeciesSeedingRate - The single species seeding rate coefficient for the crop.
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
    mixSeedingRate(crop, options = {}){
        if(options?.mixSeedingRate) return options.mixSeedingRate;

        crop = this.getCrop(crop);

        options = new Options(this, this.props('mixSeedingRate'), {crop, options})
        
        let {
            percentOfRate, 
            singleSpeciesSeedingRate, 
            plantingMethodModifier, 
            managementImpactOnMix, 
            germination, 
            purity,
        } = options;

        
        if(!percentOfRate){
            percentOfRate = this.getDefaultPercentOfSingleSpeciesSeedingRate();
        }
        
        if(!singleSpeciesSeedingRate){
            singleSpeciesSeedingRate = crop.coefficents.singleSpeciesSeedingRate
        }
        
        let mixSeedingRate = singleSpeciesSeedingRate * percentOfRate;

        if(plantingMethodModifier){
            mixSeedingRate = mixSeedingRate * plantingMethodModifier;
        }

        if(managementImpactOnMix){
            if(managementImpactOnMix <= 0) throw new Error('Management Impact on mix must be greater than 0');
            if(managementImpactOnMix > 1) throw new Error('Management Impact on mix must be less than or equal to 1');
            mixSeedingRate = mixSeedingRate + ( mixSeedingRate * managementImpactOnMix);
        }

        if(germination){
            if(germination <= 0) throw new Error('Germination must be greater than 0');
            if(germination > 1) throw new Error('Germination must be less than or equal to 1');
            mixSeedingRate = mixSeedingRate / germination;
        }

        if(purity){
            if(purity <= 0) throw new Error('Purity must be greater than 0');
            if(purity > 1) throw new Error('Purity must be less than or equal to 1');
            mixSeedingRate = mixSeedingRate / purity;
        }

        return crop.mixSeedingRate = mixSeedingRate;
    }

    /**
     * Gets the default percent of single species seeding rate. 
     * This means that only a certain percantage of single species seeding rate will be applied for the given mix. 
     * 
     * In general this will always be 1 for non-mixes, and the default value for mixes is 1/mixDiversity
     * 
     * @returns {number} Default Percent of Single Species Seeding Rate
     */
    getDefaultPercentOfSingleSpeciesSeedingRate(crop){
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

}



module.exports = {
    Options, SeedRateCalculator, MWSeedRateCalculator
}