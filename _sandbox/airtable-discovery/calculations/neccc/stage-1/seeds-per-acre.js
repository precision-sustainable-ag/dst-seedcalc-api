const RAW = `
 {Seeds per Pound}*{Z6 - Final Seeding Rate (lbs/Acre) - Automated}
`;

const VARS = {
    'Seeds per Pound': (crop) => crop.seedsPerPound,
    'Z6 - Final Seeding Rate (lbs/Acre) - Automated': (calcs) => calcs.z6FinalSeedingRate,
};

function calc({
    finalSeedingRate,
    crop = {}
} = {}){

    const seedsPerPound = crop.seedsPerPound ?? 0;

    return seedsPerPound * finalSeedingRate;
}


module.exports = {
    calc, RAW,
}