const { CropsSeed } = require("./CropsSeed");
const { CropsZonesSeed } = require("./CropsZonesSeed");
const { FamiliesSeed } = require("./FamiliesSeed");
const { GroupsSeed } = require("./GroupsSeed");
const { RegionsSeed } = require("./RegionsSeed");
const { ZonesSeed } = require("./ZonesSeed");

// ORDER HERE IS IMPORTANT FOR FOREIGN KEY CONSTRAINTS.
const Seeds = [
    GroupsSeed, // this must be before crops.
    FamiliesSeed, // this must be before crops
    CropsSeed,
    RegionsSeed, // this must be before zones.
    ZonesSeed,
    CropsZonesSeed, // this must be after crops and zones.
];

module.exports = class Seeder {

    static async sow(){

        for(let seed of Seeds){
    
            const data = await seed.plant();
    
        }
    }
}
