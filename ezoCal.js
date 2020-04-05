// EZO calibration program.
// must have other i2c programs stopped.

const prompt = require('prompt-sync')({sigint: true});
const i2c = require('i2c-bus');


//variables
var i2cAddress = 0;
var infoData = '';
var readData = '';
var ezoType = '';
var i2c1 = 0;

//functions
async function main() {
  var p = '';
  var i = 0;
  console.log("welcome to ezo cal.");
  i2cAddress = prompt('enter i2c address: ');
  console.log(`you entered ${i2cAddress}`);
  i2cAddress = parseInt(i2cAddress, 16);
  i2c1 = i2c.openSync(1);

  await info();

  ezoType = infoData.slice(infoData.indexOf(',')+1, infoData.lastIndexOf(','));
  console.log(ezoType);

//  await read();

  while (i < 100) {
    for (z = 0; z < 5; z++) {
      await read();
    }
    p = prompt('press enter to continue, c to calibrate, x to exit', 'a')
    if (p == 'x') i = 200; 
    if (p == 'c') {i = 201; await calibrate();}
  }



  i2c1.closeSync();

}

async function calibrate() {
// find out which ezo we have
  if (ezoType === "pH") {
    console.log('calibrate pH routine mid, then low, then high');
    var ci = 0;
    while (ci < 100) {
      for (cz = 0; cz < 5; cz++) {
        await read();
      } //for end
      p = prompt('press enter to continue taking readings, c to calibrate mid , x to exit', 'a')
      if (p == 'x') ci = 900;
      if (p == 'c') {
        ci = 201;
        var mid = prompt('enter ph of mid: (7.00)','1.00');
        var mid2 = prompt(`is ${mid} the correct value, press enter for yes, 0 for no`, mid);
        if (mid === mid2) {
          console.log('cal mid write start');
          var calBuf = Buffer.from(`Cal,mid,${mid}`);
          console.log(calBuf.toString());
          //i2c1.i2cWriteSync(i2cAddress, calBuf.length, calBuf);
          console.log('cal mid write complete');
          await sleep(1000);
        } // if mid===mid2
        if (mid2 == 0) ci = 0;
      } //if p == c end

    } //while ci<100 end
    while (ci < 300) {
      for (cz = 0; cz < 5; cz++) {
        await read();
      } //for end
      p = prompt('press enter to continue taking readings, c to calibrate low, x to exit', 'a')
      if (p == 'x') ci = 900;
      if (p == 'c') {
        ci = 401;
        var mid = prompt('enter ph of low: (4.00)','1.00');
        var mid2 = prompt(`is ${mid} the correct value, press enter for yes, 0 for no`, mid);
        if (mid === mid2) {
          console.log('cal low write start');
          var calBuf = Buffer.from(`Cal,low,${mid}`);
          console.log(calBuf.toString());
          //i2c1.i2cWriteSync(i2cAddress, calBuf.length, calBuf);
          console.log('cal low write complete');
          await sleep(1000);
        } // if mid===mid2
        if (mid2 == 0) ci = 201;
      } //if p == c end

    } //while ci<300 end

    while (ci < 500) {
      for (cz = 0; cz < 5; cz++) {
        await read();
      } //for end
      p = prompt('press enter to continue taking readings, c to calibrate high , x to exit', 'a')
      if (p == 'x') ci = 900;
      if (p == 'c') {
        ci = 601;
        var mid = prompt('enter ph of high: (10.00)','1.00');
        var mid2 = prompt(`is ${mid} the correct value, press enter for yes, 0 for no`, mid);
        if (mid === mid2) {
          console.log('cal high write start');
          var calBuf = Buffer.from(`Cal,high,${mid}`);
          console.log(calBuf.toString());
          //i2c1.i2cWriteSync(i2cAddress, calBuf.length, calBuf);
          console.log('cal high write complete');
          await sleep(1000);
        } // if mid===mid2
        if (mid2 == 0) ci = 401;
      } //if p == c end

    } //while ci<500 end



  } //if PH end
  if (ezoType === "ORP") {
    console.log('calibrate ORP routine');
    var oi = 0;
    while (oi < 100) {
      for (z = 0; z < 5; z++) {
        await read();
      } //for end
      p = prompt('press enter to continue taking readings, c to calibrate ORP, x to exit', 'a')
      if (p == 'x') oi = 200;
      if (p == 'c') {
        oi = 201;
        var mid = prompt('enter ORP: (225)','1');
        var mid2 = prompt(`is ${mid} the correct value, press enter for yes, 0 for no`, mid);
        if (mid === mid2) {
          console.log('cal ORP write start');
          var calBuf = Buffer.from(`Cal,${mid}`);
          console.log(calBuf.toString());
          //i2c1.i2cWriteSync(i2cAddress, calBuf.length, calBuf);
          console.log('cal ORP write complete');
          await sleep(1000);
        } // if mid===mid2
        if (mid2 == 0) oi = 0;
      } //if p == c end

    } //while oi<100 end


  } //if ORP end


} //calibrate end

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function info() {
//  console.log('info start');
  i2c1.i2cWriteSync(i2cAddress, 1, Buffer.from('i'));
//  console.log('info write complete');
  await sleep(500);
  const readBuf = Buffer.alloc(15);
//  console.log('info wait over, reading');
  i2c1.i2cReadSync(i2cAddress, readBuf.length, readBuf);
  infoData = readBuf.toString('utf8', 1);
//  await sleep(1000);
  console.log(infoData);
}

async function read() {
//  console.log('read start');
  i2c1.i2cWriteSync(i2cAddress, 1, Buffer.from('R'));
  await sleep(1000);
  const readBuf = Buffer.alloc(15);
//  console.log('read wait over, reading');
  i2c1.i2cReadSync(i2cAddress, readBuf.length, readBuf);
  valueData = readBuf.toString('utf8', 1);
//  await sleep (1000);
//  readBuf.fill(0);
  console.log(valueData);
}



//code

main();
