const rapeseed = require('../custom-crops/neccc-airtable-mocks/rapeseed');
const oats = require('../custom-crops/neccc-airtable-mocks/oats');
const pea = require('../custom-crops/neccc-airtable-mocks/pea');
const { SeedRateCalculator } = require('../../../src/app/facades/SeedRateCalculator');
const { NECrop, Crop } = require('../../../src/app/facades/Crop');

async function main(){
    const mix = [rapeseed, oats, pea];
    const council = 'neccc';
    const userInput = {};

    const calc = new SeedRateCalculator({mix, council, userInput});
    // console.log('Mix:',mix);

}

main();