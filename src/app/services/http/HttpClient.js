const axios = require('axios');



class HttpClient {


    static async post(url, data){

        return axios.post(url, data);

    }

    static async get(url, params={}){
        return axios.get(url, {params});
    }
    
}

module.exports = {
    HttpClient
}