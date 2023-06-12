const { Controller } = require('../../../framework/controllers/Controller');
const { Crop, MWCrop } = require('../../facades/Crop');
const { SeedRateCalculator, MWSeedRateCalculator, Options, NRCS } = require('../../facades/SeedRateCalculator');
const uglify = require('uglify-js');

class ScriptsController extends Controller {

    async calculator({req,params,payload}) {
        
        const js = `${Options.toString()};${NRCS.toString()};${SeedRateCalculator.toString()};${MWSeedRateCalculator.toString()};${Crop.toString()};${MWCrop.toString()};`
        const minijs = uglify.minify(js);
        return minijs?.code;
    }

}

module.exports = {
    ScriptsController
};