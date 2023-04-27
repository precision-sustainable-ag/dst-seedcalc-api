
class Crop {

    static FACTORY_MAP = {
        'mccc': (data) => new MWCrop(data),
    }


    constructor(council, data){
        if(council){
            return Crop.factory(council, data);
        }
    }

    static factory(council, data){
        if(!council) throw new Error('Council parameter must be provided.');
        if(!data?.id) throw new Error('Invalid Data Structure, Missing Property: id');

        if(!Object.keys(this.FACTORY_MAP).includes(council)){
            throw new Error(`Invalid Council: ${council}`);
        }
        
        council = council.toLowerCase();

        const instance = this.FACTORY_MAP[council](data);
        
        instance.raw = data;
        instance.id = data.id;
        instance.label = data.label;
        instance.calcs = {};

        return instance.init();
    }


    init(){
        return this;
    }

    get(...K){
        let val = this.raw;
        for(let k of K){
            val = val[k]
            if(typeof val === 'undefined') return null;
        }
    }


    percentInMix(mix){

    }

}


class MWCrop extends Crop {

    constructor(data){
        super();

    }

    init(){
        super.init();
        if(!this.raw?.attributes) 
            throw new Error(`Invalid Crop Structure, Misssing Property(${this.raw.label}): attributes`);
            
        if(typeof this.raw.attributes['Coefficients'] === 'undefined') 
            throw new Error(`Invalid Crop Structure, Misssing Property(${this.raw.label}): Coefficients`);
        
        if(
            typeof this.raw.attributes['Coefficients']['Single Species Seeding Rate'] == 'undefined'
            || !Array.isArray(this.raw.attributes['Coefficients']['Single Species Seeding Rate'].values)
        ){
            throw new Error(`Invalid Crop Structure (${this.raw.label}): Failed to load Coefficients[Single Species Seeding Rate]`)
        }
            
        if(typeof this.raw.attributes['Planting Information'] === 'undefined') {
            throw new Error(`Invalid Crop Structure, Misssing Property(${this.raw.label}): Planting Information`);
        }

        if(
            typeof this.raw.attributes['Planting Information']['Seed Count'] === 'undefined'
            || !Array.isArray(this.raw.attributes['Planting Information']['Seed Count']?.values)
        ) {
            throw new Error(`Invalid Crop Structure, Misssing Property(${this.raw.label}): ['Planting Information']['Seed Count']`);
        }


        if(
            typeof this.raw.attributes['Planting Information']['Planting Methods'] === 'undefined'
            || !Array.isArray(this.raw.attributes['Planting Information']['Planting Methods']?.values)
        ){
            throw new Error(`Invalid Crop Structure: Missing Attribute(${this.raw.label}): ['Planting Information']['Planting Methods']`);
        }


        this.seedsPerPound = Number(this.raw.attributes['Planting Information']['Seed Count'].values[0]);

        this.coefficents = {
            singleSpeciesSeedingRate: Number(this.raw.attributes['Coefficients']['Single Species Seeding Rate'].values[0]),
            plantingMethods: {
                precision: Number(this.raw.attributes['Coefficients']['Precision Coefficient'].values[0]),
                aerial: Number(this.raw.attributes['Coefficients']['Aerial Coefficient'].values[0]),
                broadcast: Number(this.raw.attributes['Coefficients']['Broadcast Coefficient'].values[0]),
            }
        }

        this.custom = this.raw.custom ?? {};

        return this;
    }




}


module.exports = { 
    Crop, MWCrop
}