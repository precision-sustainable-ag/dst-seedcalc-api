const RAW = `
IF(
    OR(
        AND({Input - Planting Date} >= {First Relaible Establishment Start (from Cover Crop)}, {Input - Planting Date} <= {First Relaible Establishment End (from Cover Crop)}),
        AND({Input - Planting Date} >= {Second Reliable Establishment Start (from Cover Crop)}, {Input - Planting Date} <= {Second Reliable Establishment End (from Cover Crop)}),
        AND({Input - Planting Date} >= {Early Seeding Date Start (from Cover Crop)}, {Input - Planting Date} <= {Early Seeding Date End (from Cover Crop)}),
        AND({Input - Planting Date} >= {Late Seeding Date Start (from Cover Crop)}, {Input - Planting Date} <= {Late Seeding Date End (from Cover Crop)})
    ), 1, 0)
`;

const VARS = {
    'Input - Planting Date': (userInput) => userInput.plantingDate,
    'First Relaible Establishment Start (from Cover Crop)': (crop) => crop.firstReliableEstablishmentStart,
    'First Relaible Establishment End (from Cover Crop)': (crop) => crop.firstReliableEstablishmentEnd,
    'Second Reliable Establishment Start (from Cover Crop)': (crop) => crop.secondReliableEstablishmentStart,
    'Second Reliable Establishment End (from Cover Crop)': (crop) => crop.secondReliableEstablishmentEnd,
    'Early Seeding Date Start (from Cover Crop)': (crop) => crop.earlySeedingDateStart,
    'Early Seeding Date End (from Cover Crop)': (crop) => crop.earlySeedingDateEnd,
    'Late Seeding Date Start (from Cover Crop)': (crop) => crop.lateSeedingDateStart,
    'Late Seeding Date End (from Cover Crop)': (crop) => crop.lateSeedingDateEnd,
};

/**
 * LOGIC Translation
 * 
 * The formula checks if the "Input - Planting Date" is within any of the following date ranges:
 * 1. First Reliable Establishment Start and End
 * 2. Second Reliable Establishment Start and End
 * 3. Early Seeding Date Start and End
 * 4. Late Seeding Date Start and End
 * 
 * If the planting date falls within any of these ranges, the formula returns 1; otherwise, it returns 0.
 */
function calc({
    plantingDate,
    crop = {}
} = {}){
  console.log('>> Planting Date:',plantingDate);
  
  /**
   * This is here because that is what the airtable function does,
   * but not sure if this is intended.
   */
  if(plantingDate === null) return true;
  
  if(!(plantingDate instanceof Date)) plantingDate = new Date(plantingDate);

  const firstReliableEstablishmentStart = new Date(crop.plantingDates.firstReliableEstablishmentStart);
  const firstReliableEstablishmentEnd = new Date(crop.plantingDates.firstReliableEstablishmentEnd);
  const secondReliableEstablishmentEnd = new Date(crop.plantingDates.secondReliableEstablishmentEnd);
  const secondReliableEstablishmentStart = new Date(crop.plantingDates.secondReliableEstablishmentStart);
  const earlySeedingDateStart = new Date(crop.plantingDates.earlySeedingDateStart);
  const earlySeedingDateEnd = new Date(crop.plantingDates.earlySeedingDateEnd);
  const lateSeedingDateStart = new Date(crop.plantingDates.lateSeedingDateStart);
  const lateSeedingDateEnd = new Date(crop.plantingDates.lateSeedingDateEnd);

  console.log('>> crop:',crop);

  const inFirstReliableEstablishment = plantingDate >= firstReliableEstablishmentStart && plantingDate <= firstReliableEstablishmentEnd;
  const inSecondReliableEstablishment = plantingDate >= secondReliableEstablishmentStart && plantingDate <= secondReliableEstablishmentEnd;
  const inEarlySeedingDate = plantingDate >= earlySeedingDateStart && plantingDate <= earlySeedingDateEnd;
  const inLateSeedingDate = plantingDate >= lateSeedingDateStart && plantingDate <= lateSeedingDateEnd;

  return inFirstReliableEstablishment || inSecondReliableEstablishment || inEarlySeedingDate || inLateSeedingDate ? true : false;
}

module.exports = {
    calc, RAW, VARS
}