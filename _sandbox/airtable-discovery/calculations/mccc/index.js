const MIX_MAKING = require('./mix-making/index');
const CHECKS_SEEDING_RATE_RANGE = require('./checks-seeding-rate-range/index');
const CHECKS_PLANTING_DATE = require('./checks-planting-date/index');
const CHECKS_PERCENT_IN_MIX = require('./checks-percent-in-mix/index');
const CHECK_SOIL_DRAINAGE = require('./checks-soil-drainage/index');

module.exports = {
    mixMaking: MIX_MAKING,
    percentInMix: CHECKS_PERCENT_IN_MIX.percentInMix,
    checks: {
        seedingRateRange: CHECKS_SEEDING_RATE_RANGE,
        plantingDate: CHECKS_PLANTING_DATE,
        soilDrainage: CHECK_SOIL_DRAINAGE,
        percentInMix: CHECKS_PERCENT_IN_MIX.validPercentInMix,
    }
}