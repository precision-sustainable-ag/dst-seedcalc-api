const {Response} = require('./Response');

class RetrieveResponse extends Response { 

    status(){
        return 200
    }
    
    content(){
        return "application/json"
    }
    
    description(){
        return "";
    }

    schema(){
        return {
            type: 'object',
            properties: {
                question:{type:"string"},
                answers: {type:'array',items:{type:'string'}}
            }
        }
    }

    build(data){
        return data;
    }

}

module.exports = { RetrieveResponse }