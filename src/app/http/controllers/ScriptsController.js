const { Controller } = require('../../../framework/controllers/Controller');
const { Crop, MWCrop, NECrop, SOCrop } = require('../../facades/Crop');
const { SeedRateCalculator, MWSeedRateCalculator, Options, NRCS, NESeedRateCalculator, SOSeedRateCalculator } = require('../../facades/SeedRateCalculator');
const uglify = require('uglify-js');

class ScriptsController extends Controller {

    async calculator({req,params,payload}) {
        
        const js = `
            ${Options.toString()};
            ${NRCS.toString()};
            ${SeedRateCalculator.toString()};
            ${MWSeedRateCalculator.toString()};
            ${NESeedRateCalculator.toString()};
            ${SOSeedRateCalculator.toString()};
            ${Crop.toString()};
            ${MWCrop.toString()};
            ${NECrop.toString()};
            ${SOCrop.toString()};
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