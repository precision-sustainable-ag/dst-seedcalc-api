const Ajv = require("ajv")
const addFormats = require("ajv-formats");
const { UnprocessibleEntityError } = require("../errors/UnprocessibleEntityError");


class AjvService {

    static ILLEGAL_PROPS = ['minimum'];

    static FormatOpenAPISchema({parameters, body={}}){
        const required = [];
        const properties = {};

        for(let param of parameters){
            properties[param.name] = param.schema;
            if(param.required) required.push(param.name);
        }

        if(body?.properties){
            for(let [attribute,prop] of Object.entries(body.properties)){
                if(this.ILLEGAL_PROPS.includes(attribute)) delete body.properties[attribute];
            }
        }


        const schema = {
            type: "object",
            properties: {
                params: {
                    type:'object',
                    properties,
                    required
                },
                body,
            },
        }


        return schema;
    }

    static GetValidator(){
        const ajv = new Ajv({allErrors:true});
        addFormats(ajv);
        return ajv;
    }

    static Validate({schema, parameters, body, data,strict=true}){
        console.log('>> DATA',data);
        const validator = this.GetValidator();

        if(!schema) schema = this.FormatOpenAPISchema({parameters,body});

        schema.additionalProperties = !strict; // if we allow additional properties, then we are not strict.
       
        const valid = validator.validate(schema, data);
            
        if(!valid){
            throw new UnprocessibleEntityError(data, {parameters,body}, validator.errors);
        }
        
        return data;
    }

    static Filter({parameters, body, data}){
        const schema = this.FormatOpenAPISchema({parameters,body});
        const paramKeys = Object.keys(schema.properties.params.properties ?? {});
        const bodyKeys = Object.keys(schema.properties.body.properties ?? {});

        const filtered = {params:{},body:{}};

        for(let key of paramKeys){
            if(typeof data.params[key] == 'undefined') continue;
            filtered.params[key] = data.params[key];
        }

        for(let key of bodyKeys){
            if(typeof data.body[key] == 'undefined') continue;
            filtered.body[key] = data.body[key];
        }

        return filtered;
    }

}

module.exports = {
    AjvService
}