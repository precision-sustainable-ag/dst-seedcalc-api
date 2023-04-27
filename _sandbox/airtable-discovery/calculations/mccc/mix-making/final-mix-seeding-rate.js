const RAW = `
    {Mix Seeding Rate - MCCC}*{Planting Method Modifier}
`;

const VARS = {
  'Mix Seeding Rate - MCCC': (calcs) => calcs.mixSeedingRate,
  'Planting Method Modifier': (calcs) => calcs.plantingMethodModifier,
};

/**
 * LOGIC Translation
 *
 * Multiply the "Mix Seeding Rate - MCCC" with the "Planting Method Modifier".
 */
function calc({ 
    mixSeedingRate,
    plantingMethodModifier
} = {}) {
  return mixSeedingRate * plantingMethodModifier;
}

module.exports = { calc, RAW, VARS };
