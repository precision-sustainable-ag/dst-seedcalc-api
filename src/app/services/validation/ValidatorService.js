
const Validator = require('validatorjs');
const { UnprocessableEntity } = require('../../exceptions/UnprocessableEntity');
const { Log } = require('../../providers/LoggingProvider');

const DATA_TYPE_CONVERSIONS = {
    STRING: 'string',
    DATE: 'date',
    INTEGER: 'integer',
    BOOLEAN: 'boolean'
}

class ValidatorService {

    static validator({data,rules}){
        return  new Validator(data,rules);
    }

    static validate({data, rules, messages}){
        
        const validator = this.validator({data,rules});

        if(validator.fails()){
            const errors = validator.errors.errors;
            throw new UnprocessableEntity({data, errors});
        }
    
        return data;
    
    }

    static async validateUnique({fields, model, payload}){
        const errors = {};
        for(let field of fields){
            const where = {};
            where[field] = payload[field]
            const record = await model.findOne({where});
            if(record) errors[field] = [`${field} already exists and is required to be unique`];
        }
        if(Object.keys(errors).length > 0){
            throw new UnprocessableEntity({data:payload, errors});
        }
        return payload;
    }

    static async validateCompositeKey({keys, model, payload}){
        const exists = this.compositeKeyExist({keys,model,payload});
        if(exists){
            const composition = [];
            for(let key of keys){
                composition.push(`${key}(${payload[key]})`)
            }

            const message = composition.join(', ') + ' pairing already exists for the given record.';
            throw new UnprocessableEntity({data:payload,errors:{
                composite_key: [message]
            }});
        }
    }

    static async validateRecordExists({key, model, payload}){
        const exists = await this.recordExists({key,model,payload});
        if(!exists){
            const errors = {};
            errors[model.name] = [`id ${payload[key]} does not exist.`];
            throw new UnprocessableEntity({data:payload, errors});
        }
        return exists;
    }

    static async compositeKeyExists({keys, model, payload}){
        const where = {};
        for(let key of keys){
            where[key] = payload[key];
        }
        const record = await model.findOne({where});
        return record == null;
    }

    static async recordExists({key, model, payload}){
        const where = {};
        where['id'] = payload[key];
        const record = await model.findOne({where});
        return record != null;
    }

    static ConvertDataTypeToRule(datatype){
        const key = datatype.key ?? 'STRING';
        return DATA_TYPE_CONVERSIONS[key];
    }

}


module.exports = {
    ValidatorService
}