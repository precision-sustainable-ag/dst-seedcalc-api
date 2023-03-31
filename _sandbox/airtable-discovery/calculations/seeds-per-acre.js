const RAW = `
 {Seeds per Pound}*{Z6 - Final Seeding Rate (lbs/Acre) - Automated}
`;

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