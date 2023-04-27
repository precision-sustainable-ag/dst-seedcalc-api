const mixSeedingRate = require('./mix-seeding-rate');
const plantingMethodModifier = require('./planting-method-modifier');
const finalMixSeedingRate = require('./final-mix-seeding-rate');

module.exports = {
  mixSeedingRate: mixSeedingRate.calc,
  plantingMethodModifier: plantingMethodModifier.calc,
  finalMixSeedingRate: finalMixSeedingRate.calc,
};
