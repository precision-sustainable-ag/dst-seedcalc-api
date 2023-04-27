const CALCS = [
    '% in Mix',
    'Seeds Per Pound - Cost Share',
    'SUM of all Seeds in Mix',
    'Final Mix Seeding Rate - Cost Share',
    'Mix Seeding Rate - Cost Share',
    'Mix Seeding Rate - MCCC',
    'Planting Method Modifier',
    'SUM of Species in Mix (from Calculation Mode)'
];
  
const  USER_INPUTS = [
    'Input - Planting Date',
    'Input - Soil Drainage',
    'Input - Planting Method'
];
  
const  CROP_VARS = [
    'Max % Allowed in Mix (from Cover Crop)',
    'First Relaible Establishment Start (from Cover Crop)',
    'First Relaible Establishment End (from Cover Crop)',
    'Second Reliable Establishment Start (from Cover Crop)',
    'Second Reliable Establishment End (from Cover Crop)',
    'Early Seeding Date Start (from Cover Crop)',
    'Early Seeding Date End (from Cover Crop)',
    'Late Seeding Date Start (from Cover Crop)',
    'Late Seeding Date End (from Cover Crop)',
    'Soil Drainage (from Cover Crop)',
    'Single Species Seeding Rate - MCCC',
    'Precision Coefficient (from Cover Crop)',
    'Broadcast Coefficient (from Cover Crop)',
    'Aerial Coefficient (from Cover Crop)',
    'Default'
];

const KEYS_USED_IN_FRONTEND = [
    'Name',
    'Seed Count (per pound)',
    'Min Drilled Seeding Rate (lbs/acre)',
    'Max Drilled Seeding Rate (lbs/acre)',
    'Estimated Base Seeding Rate',
    'Can Aerial Seed?',
    'First Relaible Establishment End',
    'First Relaible Establishment Start',
    'Second Reliable Establishment Start',
    'Second Reliable Establishment End',
    'Early Seeding Date Start',
    'Early Seeding Date End',
    'Late Seeding Date Start',
    'Late Seeding Date End',
    'Winter survival',
    '% Chance of Winter Survial',
    'Seeding Rate Calculator',
    'Cover Crop Group',
    'NRCS Cost Share: Single Species Seeding Rate (lbs/acre)',
    'Seeds per Pound (Indiana Calculator)',
    'Broadcast Coefficient',
    'Aerial Coefficient',
    'Precision Coefficient',
    'Emergence Group',
    '% Live Seed to Emergence',
    'Max % Allowed in Mix',
    'Soil Drainage'
];

const FRONT_END_KEYS_MAPPED_TO_CROP_VARS = {
    'Max % Allowed in Mix': 'Max % Allowed in Mix (from Cover Crop)',
    'First Relaible Establishment Start': 'First Relaible Establishment Start (from Cover Crop)',
    'First Relaible Establishment End': 'First Relaible Establishment End (from Cover Crop)',
    'Second Reliable Establishment Start': 'Second Reliable Establishment Start (from Cover Crop)',
    'Second Reliable Establishment End': 'Second Reliable Establishment End (from Cover Crop)',
    'Early Seeding Date Start': 'Early Seeding Date Start (from Cover Crop)',
    'Early Seeding Date End': 'Early Seeding Date End (from Cover Crop)',
    'Late Seeding Date Start': 'Late Seeding Date Start (from Cover Crop)',
    'Late Seeding Date End': 'Late Seeding Date End (from Cover Crop)',
    'Soil Drainage': 'Soil Drainage (from Cover Crop)',
    'NRCS Cost Share: Single Species Seeding Rate (lbs/acre)': 'Single Species Seeding Rate - MCCC',
    'Broadcast Coefficient': 'Broadcast Coefficient (from Cover Crop)',
    'Aerial Coefficient': 'Aerial Coefficient (from Cover Crop)',
    'Precision Coefficient': 'Precision Coefficient (from Cover Crop)'
}
  

module.exports = {
    CALCS, USER_INPUTS, CROP_VARS
}
  