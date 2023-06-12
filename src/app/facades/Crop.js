
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

    validate({prop, checks = [], container, fullPath}){
        const path = prop.key;
        const pathKeys = path.split('.');

        let next = this.raw;
        if(container) next = container;
        for(let key of pathKeys) {
            if(!(typeof next === 'object')) break;

            if(Object.keys(next).includes(key)) next = next[key];
            else if(prop.required) throw new Error(`Invalid Crop Structure - Missing Attributes: ${fullPath ?? path}`);
        }

        for(let check of checks){
            if(typeof check.validate === 'function'){
                if(!check.validate(next)) throw new Error(`Failed Check: ${fullPath ?? path} - ${check.summary}`)
            }
        }

        if(typeof next === 'object') return {};
        
        return next;
    }

    validateProps(props, container, fullPath){
        if(!container) container = this.raw;

        if(!Array.isArray(props)){

            if(fullPath) fullPath = `${fullPath}.${props.key}`;
            else fullPath = props.key;

            this.validate({prop:props, checks: props.checks, fullPath, container});
  
            container = container[props.key];

            if(props?.props){
                return this.validateProps(props.props, container, fullPath);
            }
            
            if(props.required && !(container?.values || container.values.length < 1)) {
                throw new Error(`Invalid Crop Structure - Missing Values: ${fullPath ?? path}`)
            }
            
            if(props?.setter && container?.values?.length >= 1 && typeof props.setter === 'function'){
                props.setter(this, container);
            }
            
            return;
        }

        for(let prop of props){
            this.validateProps(prop,container,fullPath);
        }

    }


    static interpretDateRange(range){
        let dates = range.split(' - ');
        const container = [];
        for(let date of dates){
            let segments = date.split('/');

            if(segments.length > 2){
                date = `${segments[0]}/${segments[1]}`;
            }

            date = new Date(date);
            container.push(date)
        }
        return container;
    }


}


class MWCrop extends Crop {

    constructor(data){
        super();
    }

    static props = [
        {
            key: 'attributes',
            required: true,
            props: [
                {
                    key: 'Coefficients',
                    required: true,
                    props: [
                        {
                            key: 'Single Species Seeding Rate', 
                            required: true, 
                            setter: (inst, val) => inst.coefficents.singleSpeciesSeedingRate = Number(val.values[0])
                        },
                        {
                            key: 'Broadcast Coefficient', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.plantingMethods.broadcast = Number(val.values[0])
                        },
                        {
                            key: 'Aerial Coefficient', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.plantingMethods.aerial = Number(val.values[0])
                        },
                        {
                            key: 'Precision Coefficient', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.plantingMethods.precision = Number(val.values[0])
                        },
                        {
                            key: '% Live Seed to Emergence', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.liveSeedToEmergence = Number(val.values[0])
                        },
                        {
                            key: 'Max % Allowed in Mix',
                            required: true,
                            setter: (inst, val) => inst.coefficents.maxInMix = Number(val.values[0])
                        },
                        {
                            key: '% Chance of Winter Survial', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.chanceWinterSurvival = Number(val.values[0])
                        },
                    ]
                },
                {
                    key: 'Planting Information', 
                    required: true,
                    props: [
                        {
                            key: 'Seed Count', 
                            required: true,
                            setter: (inst, val) => inst.seedsPerPound = Number(val.values[0])
                        },
                        {   
                            key: 'Planting Methods', 
                            required: true, 
                            checks: [{validate: (val) => { return Array.isArray(val.values); }, summary: 'Must be an array.'}],
                            setter: (inst, val) => inst.plantingMethods = val.values
                        },
                    ]
                },
                {
                    key: 'Soil Conditions', 
                    required: true,
                    props: [
                        {
                            key: 'Soil Drainage', 
                            required: true,
                            setter: (inst, val) => inst.soilDrainage = val.values
                        },
                    ]
                },
                {
                    key: 'NRCS', 
                    required: false,
                    props: [
                        {
                            key: 'Single Species Seeding Rate', 
                            required: false,
                            setter: (inst, val) => inst.nrcs.singleSpeciesSeedingRate = Number(val.values[0])
                        },
                    ]
                },
                {
                    key: 'Planting and Growth Windows', 
                    required: false,
                    props: [
                        {   
                            key: 'Reliable Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.reliableEstablishement = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Freeze/Moisture Risk to Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.riskToEstablishment = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Early Seeding Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.earlySeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Late Seeding Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.lateSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Average Frost', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.averageFrost = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                    ]
                },
            ]
        }
    ];

    init(){
        super.init();

        this.coefficents = { plantingMethods: {} };
        this.plantingDates = { }
        this.nrcs = { }
        this.custom = this.raw.custom ?? {};

        // validates and sets props.
        this.validateProps(MWCrop.props);

        return this;
    }
    
}

class NECrop extends Crop {

    constructor(data){
        super();
    }

    static props = [
        {
            key: 'attributes',
            required: true,
            props: [
                {
                    key: 'Coefficients',
                    required: true,
                    props: [
                        {
                            key: 'Single Species Seeding Rate', 
                            required: true, 
                            setter: (inst, val) => inst.coefficents.singleSpeciesSeedingRate = Number(val.values[0])
                        },
                        {
                            key: 'Broadcast Coefficient', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.plantingMethods.broadcast = Number(val.values[0])
                        },
                        {
                            key: 'Aerial Coefficient', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.plantingMethods.aerial = Number(val.values[0])
                        },
                        {
                            key: 'Precision Coefficient', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.plantingMethods.precision = Number(val.values[0])
                        },
                        {
                            key: '% Live Seed to Emergence', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.liveSeedToEmergence = Number(val.values[0])
                        },
                        {
                            key: 'Max % Allowed in Mix',
                            required: true,
                            setter: (inst, val) => inst.coefficents.maxInMix = Number(val.values[0])
                        },
                        {
                            key: '% Chance of Winter Survial', 
                            required: true,
                            setter: (inst, val) => inst.coefficents.chanceWinterSurvival = Number(val.values[0])
                        },
                    ]
                },
                {
                    key: 'Planting Information', 
                    required: true,
                    props: [
                        {
                            key: 'Seed Count', 
                            required: true,
                            setter: (inst, val) => inst.seedsPerPound = Number(val.values[0])
                        },
                        {   
                            key: 'Planting Methods', 
                            required: true, 
                            checks: [{validate: (val) => { return Array.isArray(val.values); }, summary: 'Must be an array.'}],
                            setter: (inst, val) => inst.plantingMethods = val.values
                        },
                    ]
                },
                {
                    key: 'Soil Conditions', 
                    required: true,
                    props: [
                        {
                            key: 'Soil Drainage', 
                            required: true,
                            setter: (inst, val) => inst.soilDrainage = val.values
                        },
                    ]
                },
                {
                    key: 'NRCS', 
                    required: false,
                    props: [
                        {
                            key: 'Single Species Seeding Rate', 
                            required: false,
                            setter: (inst, val) => inst.nrcs.singleSpeciesSeedingRate = Number(val.values[0])
                        },
                    ]
                },
                {
                    key: 'Planting and Growth Windows', 
                    required: false,
                    props: [
                        {   
                            key: 'Reliable Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.reliableEstablishement = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Freeze/Moisture Risk to Establishment', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.riskToEstablishment = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Early Seeding Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.earlySeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Late Seeding Date', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.lateSeeding = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                        {   
                            key: 'Average Frost', 
                            required: false, 
                            setter: (inst, val) => {
                                const container = inst.plantingDates.averageFrost = [];
                                for(let range of val.values){
                                    let [start, end] = Crop.interpretDateRange(range);
                                    container.push({
                                        start, end, range
                                    });
                                }
                            }
                        },
                    ]
                },
            ]
        }
    ];

    init(){
        super.init();

        this.coefficents = { plantingMethods: {} };
        this.plantingDates = { }
        this.nrcs = { }
        this.custom = this.raw.custom ?? {};

        // validates and sets props.
        this.validateProps(MWCrop.props);

        return this;
    }

}


module.exports = { 
    Crop, MWCrop
}