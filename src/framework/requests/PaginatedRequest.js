const {Request} = require('./Request');
const pag_conf = require('../../config/pagination');

class PaginatedRequest extends Request {

    /**
     * follow OpenAPI standards of parameter declaration
     * https://spec.openapis.org/oas/v3.0.0#parameter-object
     */
    parameters(){
        return [
            {in:'query',name:'page',schema:{type:'integer'}, default:pag_conf.default.page},
            {in:'query',name:'perPage',schema:{type:'integer'}, default: pag_conf.default.limit},
            {in:'query',name:'orderBy',schema:{type:'string'}},
            {in:'query',name:'orderDirection',schema:{type:'string'}},
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
        req.query.page = req.query?.page ? req.query.page : pag_conf.default.page;
        req.query.perPage = req.query?.perPage ? req.query.perPage : pag_conf.default.limit;
        req.query.limit = req.query.perPage;
        req.query.offset = req.query.page > 1 ? req.query.page * req.query.limit : 0;
        return super.getData(req);
    }

}

module.exports = { PaginatedRequest }