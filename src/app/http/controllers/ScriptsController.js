const { Controller } = require('../../../framework/controllers/Controller');
const { Crop, MWCrop, NECrop } = require('../../facades/Crop');
const { SeedRateCalculator, MWSeedRateCalculator, Options, NRCS, NESeedRateCalculator } = require('../../facades/SeedRateCalculator');
const uglify = require('uglify-js');

class ScriptsController extends Controller {

    async calculator({req,params,payload}) {
        
        const js = `
            ${Options.toString()};
            ${NRCS.toString()};
            ${SeedRateCalculator.toString()};
            ${MWSeedRateCalculator.toString()};
            ${NESeedRateCalculator.toString()};
            ${Crop.toString()};
            ${MWCrop.toString()};
            ${NECrop.toString()};
        `;

        if(params?.pretty === 'true'){
            return js;
        }

        const minijs = uglify.minify(js);
        return minijs?.code;
    }

}

module.exports = {
    ScriptsController
};