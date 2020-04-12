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
const EZO = require('@jahartley/ezo-i2c');
const ezo = new EZO();

var airTemp1Old = 0;
var airPress1Old = 0;
var airHumid1Old = 0;
var airQuality1Old = 0;
var poolTempOld = 0;
var phOld = 0;
var orpOld = 0;

var airTemp1 = 0;
var airPress1 = 0;
var airHumid1 = 0;
var airQuality1 = 0;
var poolTemp = 0;
var ph = 0;
var orp = 0;


client.on('message', function(topic, message) {
  console.log(message.toString())
})


bme680.initialize().then(async () => {
  console.log('bme680 Sensor Init')
  setInterval(async () => {
    bme680result =  await bme680.getSensorData()
    // console.log(bme680result)
    airTemp1 = parseFloat(bme680result.data.temperature)
    airPress1 = parseFloat(bme680result.data.pressure)
    airHumid1 = parseFloat(bme680result.data.humidity)

    if (bme680result.data.heat_stable == true) {
      airQuality1 = parseFloat(bme680result.data.gas_resistance)
      if ((airQuality1 - airQuality1Old) > 10000 || (airQuality1 - airQuality1Old) < -10000 ) {
        client.publish('home/pool/airQuality1', airQuality1.toString())
        airQuality1Old = airQuality1;
      }
    }

    if ((airTemp1 - airTemp1Old) > 0.2 || (airTemp1 - airTemp1Old) < -0.2 ) {
      client.publish('home/pool/airTemp1', airTemp1.toString())
      airTemp1Old = airTemp1;
    }
    if ((airPress1 - airPress1Old) > 0.5 || (airPress1 - airPress1Old) < -0.5) {
      client.publish('home/pool/airPress1', airPress1.toString());
      airPress1Old = airPress1;
    }
    if ((airHumid1 - airHumid1Old) > 0.5 || (airHumid1 - airHumid1Old) < -0.5 ) {
      client.publish('home/pool/airHumid1', airHumid1.toString());
      airHumid1Old = airHumid1;
    }

//    if (bme680result.data.heat_stable == true) client.publish('home/pool/airQuality1', bme680result.data.gas_resistance.toString());
  }, 30000);
}).catch(console.log);

sense.init().then(() => {
  console.log('ds18b20 init')
  sense.search()}).
//then(console.log).
then(() => {
    setInterval(async () => {
      sense.readTemperatures().then(temps => {
        //console.log('ds18b20 read');
        //console.log(temps); // Returns a list of temperature reading from all found sensors
        //console.log('first temp');
        //console.log(temps[0]);
        //console.log(temps.length);
        //for (i = 0; i < temps.length; i++) {
        //  client.publish('home/pool/poolTemp' + i.toString(), temps[i].value.toString());
        //}
        poolTemp = parseFloat(temps[0].value);
        if ((poolTemp - poolTempOld) > 0.2 || (poolTemp - poolTempOld) < -0.2 ) {
          client.publish('home/pool/poolTemp0', poolTemp.toString());
          poolTempOld = poolTemp;
          ezo.phReadTemp('ph').then((resp) => {
            if (resp != poolTemp) {
              //console.log(poolTemp);
              ezo.phWriteTemp('ph', poolTemp);
            } 
          })
        }
      })
    }, 30000)
})
.catch(console.log);

  
ezo.info('ph').then(console.log)
//.then(() => delay(2000))
.then(() => ezo.info('orp'))
.then(console.log)
.then(() => ezo.status('ph'))
.then(console.log)
.then(() => ezo.status('orp'))
.then(console.log)
.then(() => ezo.phReadCal('ph'))
.then(console.log)
.then(() => ezo.phReadSlope('ph'))
.then(console.log)
.then(() => ezo.phReadTemp('ph'))
.then(console.log)
.then(() => ezo.orpReadCal('orp'))
.then(console.log)
.then(() => ezo.read('ph'))
.then(console.log)
.then(() => ezo.read('orp'))
.then(console.log)
.then(async () => {

  setInterval(async () => {
      ph =  await ezo.read('ph')
      //console.log(phResult)
      orp = await ezo.read('orp')
      //console.log(orpResult)
      ph = parseFloat(ph);
      orp = parseFloat(orp);
      if ((ph - phOld) > 0.01 || (ph - phOld) < -0.01 ) {
        client.publish('home/pool/ph1', ph.toString());
        phOld = ph;
      }
      if ((orp - orpOld) > 5 || (orp - orpOld) < -5 ) {
        client.publish('home/pool/orp1', orp.toString());
        orpOld = orp;
      }
    }, 10000);
}).catch(console.log);
