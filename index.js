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
const DS18B20 = require('@jahartley/ds2482-temperature');
const sense = new DS18B20();



client.on('message', function(topic, message) {
  console.log(message.toString())
})


bme680.initialize().then(async () => {
  console.log('Sensor Init')
  setInterval(async () => {
    bme680result =  await bme680.getSensorData()
    console.log(bme680result)
    client.publish('home/pool/airTemp1', bme680result.data.temperature.toString())
    client.publish('home/pool/airPress1', bme680result.data.pressure.toString())
    client.publish('home/pool/airHumid1', bme680result.data.humidity.toString())
    if (bme680result.data.heat_stable == true) client.publish('home/pool/airQuality1', bme680result.data.gas_resistance.toString());
  }, 120000);
});

sense.init().then(() => {
  console.log('ds18b20 init')
  sense.search()}).then(() => {
    setInterval(async () => {
      sense.readTemperatures().then(temps => {
        console.log(temps); // Returns a list of temperature reading from all found sensors
        console.log('first temp');
        console.log(temps[0]);
      })  
    }, 120000)
  })
.catch(err => {
  console.error(err);
});
  

