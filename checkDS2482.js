const DS2482 = require('@jahartley/ds2482');

const wire = new DS2482();

wire.init()
.then(() => wire.search())

.then(found => {
  console.log(found); // Returns a list of ROM addresses as hex encoded strings
})

.catch(err => {
  console.log('had an error');
  console.error(err);
});
