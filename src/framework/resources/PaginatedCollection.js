const { Collection } = require('./Collection');


class PaginatedCollection extends Collection {


    status(){
        return 200
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "Returns a paginated collection of Objects";
    }

    schema(){
        return {}
    }

    meta(){
        return {
            type: 'object',
            properties: {
                page: {type:'integer'},
                perPage: {type:'integer'},
                records: {type:'integer'},
                next: {type: 'string',format:'url'},
                previous:{type:'string',format:'url'}
            }
        };
    }

    build(res,req){
        const data = res.data;
        const meta = this.buildMeta(res,req);
        return {type:'array',data,meta};
    }

    buildMeta(res,req){
        const count = res?.count
        const meta = {
            ...req.query,
            ...req.params,
        }
        if(count) meta.records = count;
        return meta;
    }


}

module.exports = {
    PaginatedCollection
}