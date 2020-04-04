// pool Pi main program...
//connects to: 
//atlas scientific ph and orp ezo modules.   
//BME680 air quality.  
//DS18B20 pool water temp through DS2482S-100.
//analog water pressure via ADS1115.

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://192.168.77.1')
const { Bme680 } = require('bme680-sensor')
const bme680 = new Bme680(1, 0x77)//pool Pi main program
