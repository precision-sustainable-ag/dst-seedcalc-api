const { UnprocessableEntity } = require("../../app/exceptions/UnprocessableEntity");
const { AjvService } = require("./AjvService");

class ValidatorService extends AjvService {

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


}

module.exports = {
    ValidatorService
}