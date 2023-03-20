const bodyParser = require("body-parser");
const { AjvService } = require("../services/AjvService");
const { StaticDocument } = require("../documents/StaticDocument");


class Request extends StaticDocument {
    
    static handle(){
        const instance = new this()
        return [
            instance.authorize(),
            instance.urlNumberParser(),
            instance.parser(),
            instance.filter(),
            instance.validate(),
        ];
    }

    static factory(){
        return new this();
    }

    static [Symbol.hasInstance](obj) {
        if (obj.handle && typeof obj.handle == 'function') return true;
    }

    static schema(){
        return this.factory().body();
    }

    content(){
        return 'application/json';
    }

    parser(){
        return bodyParser.urlencoded({extended:true});
    }

    authorized(){
        return false;
    }

    strict(){
        return true;
    }

    filtered(){
        return true;
    }

    /**
     * follow OpenAPI standards of parameter declaration
     * https://spec.openapis.org/oas/v3.0.0#parameter-object
     */
    parameters(){
        return [

        ];
    }

    /**
     * follow OpenAPI standards for schema declaration 
     * https://spec.openapis.org/oas/v3.0.0#schema-object
     */
    body(){
        return {

        }
    }

    getData(req){
        return {
            params: {
                ...req.params,
                ...req.query,
            },
            body: {
                ...req.body
            }
        }
    }

    authorize(){
        const authorized = this.authorized();
        return (req,res,next) => {
            if(authorized == true) req.authorized = true;
            next();
        }
    }

    validate(){
        const parameters = this.parameters()
        const body = this.body();

        const getData = this.getData;
        const filtered = this.filtered();
        const strict = this.strict();

        return (req, res, next) => {
            let data = filtered ? req.filtered : getData(req);

            data = AjvService.Validate({parameters, body, data, strict});

            req.validated = data;

            return next();
        }
    }

    filter(){
        const parameters = this.parameters()
        const body = this.body();

        const getData = this.getData;
        const filtered = this.filtered();

        return (req, res, next) => {
            if(!filtered) return next();

            let data = getData(req);

            data = AjvService.Filter({parameters, body, data});

            req.filtered = data;

            return next();
        }
    }

    buildDocument(){
        const parameters = this.parameters();
        const body = this.body();
        const contentType = this.content();
        const requestBody = {};

        if(Object.keys(body).length > 0) requestBody.content = {
            [contentType]: { schema: body }
        };

        return {
            parameters,
            requestBody
        }
    }


    urlNumberParser(){
        return (req,res,next)=> {
            const params = req.params;
            
            for(let [key,val] of Object.entries(params)){
              const numeric = Number(val);
              if(numeric) req.params[key] = numeric;
            }
          
            const query = req.query;
            for(let [key,val] of Object.entries(query)){
                if(val instanceof Array){
                    for(let i in val){
                        console.log('parsing',key,i)
                        const numI = Number(req.query[key][i]);
                        if(numI) req.query[key][i] = numI;
                    }
                }    
                const numeric = Number(val);
                if(numeric) req.query[key] = numeric;
            }
          
            next();
        }
    }

}

module.exports = { Request }