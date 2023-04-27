const RAW = `
IF(
    AND(
        {Final Mix Seeding Rate - Cost Share} < ({Mix Seeding Rate - Cost Share} * 2.5 ),
        {Final Mix Seeding Rate - Cost Share} > ({Mix Seeding Rate - Cost Share} / 2 )
    ), 
    1, // if true
    0 // if false
)`;

const VARS = {
  'Final Mix Seeding Rate - Cost Share': (calcs) => calcs.finalMixSeedingRateCostShare,
  'Mix Seeding Rate - Cost Share': (calcs) => calcs.mixSeedingRateCostShare,
};

const MAGIC_2_POINT_5 = 2.5;
const MAGIC_2 = 2;

/**
 * LOGIC Translation
 *
 * Check if the "Final Mix Seeding Rate - Cost Share" is less than the "Mix Seeding Rate - Cost Share" multiplied by 2.5,
 * and if the "Final Mix Seeding Rate - Cost Share" is greater than the "Mix Seeding Rate - Cost Share" divided by 2.
 * If both conditions are true, then return 1, otherwise return 0.
 */
function calc({ 
    finalMixSeedingRate,
    mixSeedingRate
 } = {}) {

  if (finalMixSeedingRate < mixSeedingRate * MAGIC_2_POINT_5 && finalMixSeedingRate > mixSeedingRate / MAGIC_2) {
    return true;
  } else {
    return false;
  }
}

module.exports = { calc, RAW, VARS };
