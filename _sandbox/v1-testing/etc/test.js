const axios = require('axios');
const seedcalcSDK = require('http://localhost:3002/v1/scripts/js/calculator.js');


// const { Crop } = require('../../src/app/facades/Crop');
const SPECIES_SELECTOR_SERVICE_URL = 'http://localhost:3001';

const SELECTOR_CLIENT = axios.create({
  baseURL: SPECIES_SELECTOR_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


// class Crop{static FACTORY_MAP={mccc:t=>new MWCrop(t)};constructor(t,r){if(t)return Crop.factory(t,r)}static factory(t,r){if(!t)throw new Error("Council parameter must be provided.");if(!r?.id)throw new Error("Invalid Data Structure, Missing Property: id");var i;if(Object.keys(this.FACTORY_MAP).includes(t))return(i=this.FACTORY_MAP[t](r)).raw=r,i.id=r.id,i.label=r.label,i.calcs={},i.init();throw new Error("Invalid Council: "+t)}init(){return this}get(...t){let r=this.raw;for(var i of t)if(void 0===(r=r[i]))return null}percentInMix(t){}}class MWCrop extends Crop{constructor(t){super()}init(){if(super.init(),!this.raw?.attributes)throw new Error(`Invalid Crop Structure, Misssing Property(${this.raw.label}): attributes`);if(void 0===this.raw.attributes.Coefficients)throw new Error(`Invalid Crop Structure, Misssing Property(${this.raw.label}): Coefficients`);if(void 0===this.raw.attributes.Coefficients["Single Species Seeding Rate"]||!Array.isArray(this.raw.attributes.Coefficients["Single Species Seeding Rate"].values))throw new Error(`Invalid Crop Structure (${this.raw.label}): Failed to load Coefficients[Single Species Seeding Rate]`);if(void 0===this.raw.attributes["Planting Information"])throw new Error(`Invalid Crop Structure, Misssing Property(${this.raw.label}): Planting Information`);if(void 0!==this.raw.attributes["Planting Information"]["Seed Count"]&&Array.isArray(this.raw.attributes["Planting Information"]["Seed Count"]?.values))return this.seedsPerPound=Number(this.raw.attributes["Planting Information"]["Seed Count"].values[0]),this.coefficients={singleSpeciesSeedingRate:Number(this.raw.attributes.Coefficients["Single Species Seeding Rate"].values[0])},this.custom=this.raw.custom??{},this;throw new Error(`Invalid Crop Structure, Misssing Property(${this.raw.label}): ['Planting Information']['Seed Count']`)}}




async function main(){

    const PEA_WINTER = await SELECTOR_CLIENT.get(`/v2/crops/148?regions=18&context=seed_calc&regions=180`)
    .then(response => response.data.data)
    .catch(e => null);

    const crop = new seedcalcSDK.Crop('mccc',PEA_WINTER);

    console.log(crop.label);

}


main()