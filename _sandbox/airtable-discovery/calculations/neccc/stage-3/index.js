const finalPoundsForPurchase = require('./final-pounds-for-purchase');
const finalSeedingRateBulk = require('./final-seeding-rate-bulk');

module.exports = {
  finalPoundsForPurchase: finalPoundsForPurchase.calc,
  finalSeedingRateBulk: finalSeedingRateBulk.calc,
};
