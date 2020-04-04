// EZO calibration program.
// must have other i2c programs stopped.

const prompt = require('prompt-sync')({sigint: true});
const i2c = require('i2c-bus');

//variables
var i2cAddress = 0;

console.log("welcome to ezo cal.");
i2cAddress = prompt('enter i2c address');
console.log(`you entered ${i2cAddress}`);
