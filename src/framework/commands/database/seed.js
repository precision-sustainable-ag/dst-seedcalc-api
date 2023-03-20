const Seeder = require("./seeds/Seeder");

async function run(){
    
    await Seeder.sow();

}

run();

module.exports = {
    run
}