const { BadRequestError } = require("../errors/BadRequestError");
const { InternalServerError } = require("../errors/InternalServerError");
const { UnprocessibleEntityError } = require("../errors/UnprocessibleEntityError");
const { Resource } = require("./Resource");


class CreateResource extends Resource {


    status(){
        return 201
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "Returns an Object";
    }

    schema(){
        return {};
    }

    errors(){
        return [
            BadRequestError,
            UnprocessibleEntityError,
            InternalServerError,
        ]
    }


}

module.exports = {
    CreateResource
}