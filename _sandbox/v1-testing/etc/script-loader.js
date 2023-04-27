const uglify = require('uglify-js');
const { Crop,MWCrop } = require('../../../src/app/facades/Crop');

// Build the cropString dynamically
const cropString = `${Crop.toString()}${MWCrop.toString()}`;

// Uglify the string
const result = uglify.minify(cropString);

// Log the uglified string
console.log(result.code);