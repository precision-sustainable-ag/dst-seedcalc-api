const { BadRequestError } = require("../errors/BadRequestError");
const { InternalServerError } = require("../errors/InternalServerError");
const { RecordNotFoundError } = require("../errors/RecordNotFoundError");
const { UnprocessibleEntityError } = require("../errors/UnprocessibleEntityError");
const { Resource } = require("./Resource");


class UpdateResource extends Resource {


    status(){
        return 200
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "Returns an Object";
    }

    schema(){
        return {}
    }

    errors(){
        return [
            BadRequestError,
            RecordNotFoundError,
            UnprocessibleEntityError,
            InternalServerError,
        ]
    }


}

module.exports = {
    UpdateResource
}