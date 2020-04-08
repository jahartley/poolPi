const DS18B20 = require('@jahartley/ds2482-temperature');

const sense = new DS18B20();

sense.init()
.then(() => sense.search())
.then(() => sense.readTemperatures())

.then(temps => {
  console.log(temps); // Returns a list of temperature reading from all found sensors
})

.catch(err => {
  console.error(err);
});
