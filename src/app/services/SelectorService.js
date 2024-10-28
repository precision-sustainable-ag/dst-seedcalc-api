const { HttpClient } = require("./http/HttpClient");
const axios = require('axios');

const SELECTOR_API_URL = 'https://developapi.covercrop-selector.org';
const MAKE_CLIENT = () => { 
    return axios.create({
    baseURL: SELECTOR_API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


class SelectorService {
    static async GetCrop({crop_id, region_ids=[]}) {
        const apiClient = MAKE_CLIENT();
        let uri = `/v2/crops/${crop_id}?context=seed_calc`;
        
        for(let region of region_ids){
            uri = `${uri}&regions=${region}`;
        }

        // TODO: add more error reporting.
        if(!crop_id || region_ids.length == 0) return false;
        // TOOD: make this return crop record.
        // if(region_ids.length = 0) return false;

        // TODO: get crop and its list of attributes from selector API
        const response = await apiClient.get(uri)
        return response;
    }
}

module.exports = { SelectorService }