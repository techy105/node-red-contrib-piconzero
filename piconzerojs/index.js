//A direct port of: https://github.com/4tronix/PiconZero/blob/master/Python/piconzero.py
const I2CBus = require("i2c-bus");

const I2C = I2CBus.openSync(0);

//I2C address of PiconZero
const PZAddr = 0x22;

// Definitions of Commands to Picon Zero
const COMMANDS = {
	MOTORA: 0,
	OUTCFG0: 2,
	OUTPUT0: 8,
	INCFG0: 14,
	SETBRIGHT: 18,
	UPDATENOW: 19,
	RESET: 20,
	INPERIOD0: 21
}

const I2CRetries = 10;


function getRevision(){
	for(let i=0;i<I2CRetries;i++){
		try {
			const revisionData = I2C.i2cReadSync(PZAddr, 0);
			return [revisionData/256, revisionData%256]
		} catch(e){
			throw new Error("Error in getRevision(), retrying...");
		}
	}
}

function setMotor(motor, value){
 	if (motor >= 0 && motor <= 1 && value >= -128 && value < 128){
        for(let i=0;i<I2CRetries;i++){
            try {
                I2C.writeByteSync(PZAddr, motor, value);
                return true;
			} catch(e){
				throw new Error("Error in setMotor(), retrying")
			}
		}
	}

	return false;
}

function forward (speed){
    setMotor (0, speed);
    setMotor (1, speed);
}

function reverse (speed){
    setMotor (0, -speed);
    setMotor (1, -speed);
}

function spinLeft (speed){
    setMotor (0, -speed);
    setMotor (1, speed);
}

function spinRight (speed){
    setMotor (0, speed);
    setMotor (1, -speed);
}

function stop(){
    setMotor (0, 0);
    setMotor (1,0);
}

// Read data for selected input channel (analog || digital)
// Channel is in range 0 to 3
function readInput (channel){
    if (channel >=0 && channel <= 3){
        for(let i=0;i<I2CRetries;i++){
            try {
                return I2C.readWordSync (PZAddr, channel + 1);
            } catch(e){
                throw new Error("Error in readChannel(), retrying");
			}
		}
	}

	return false;
}

function setOutputConfig(output, value){
	if (output >=0 && output <=5 && value >=0 && value <= 3){
		for(let i=0;i<I2CRetries;i++){
 			try {
				I2C.writeByteSync (PZAddr, channel + 1);
				return true;
			} catch(e){
				throw new Error("Error in setOutputConfig(), retrying")
			}
		}
	}

	return false;
}

// Set configuration of selected input channel
// 0: Digital, 1: Analog, 2: DS18B20, 4: DutyCycle 5: Pulse Width
function setInputConfig (channel, value, pullup = false, period = 2000){
    if (channel >= 0 && channel <= 3 && value >= 0 && value <= 5){
        if (value == 0 && pullup == true){
            value = 128
		}


		for(let i=0;i<I2CRetries;i++){
            try {
                I2C.writeByteSync(PZAddr, COMMANDS.INCFG0 + channel, value)
                if (value == 4 || value == 5){
                    I2C.writeWordSync (PZAddr, COMMANDS.INPERIOD0 + channel, period)
				}
                break
			} catch(e) { 
				throw new Error("Error in setInputConfig(), retrying")
			} 
		} 
	} 

	return false;
}

// Set output data for selected output channel
// Mode  Name    Type    Values
// 0     On/Off  Byte    0 is OFF, 1 is ON
// 1     PWM     Byte    0 to 100 percentage of ON time
// 2     Servo   Byte    -100 to + 100 Position in degrees
// 3     WS2812B 4 Bytes 0:Pixel ID, 1:Red, 2:Green, 3:Blue
function setOutput (channel, value){
    if (channel >= 0 && channel <= 5){
        for(let i=0;i<I2CRetries;i++){
            try {
                I2C.writeByteSync (PZAddr, COMMANDS.OUTPUT0 + channel, value);
				return true;
            } catch(e){
                throw new Error("Error in setOutput(), retrying")
			}
		}
	}

	return false;
}
//---------------------------------------------

//---------------------------------------------
// Set the colour of an individual pixel (always output 5)
function setPixel (Pixel, Red, Green, Blue, Update=true){
    pixelData = [Pixel, Red, Green, Blue]
    for(let i=0;i<I2CRetries;i++){
        try {
            I2C.writeI2cBlockSync (PZAddr, Update, pixelData)
            return true;
        } catch(e){
             throw new Error("Error in setPixel(), retrying")
		}
	}

	return false;
}

function setAllPixels (Red, Green, Blue, Update=true){
    pixelData = [100, Red, Green, Blue]
    for(let i=0;i<I2CRetries;i++){
        try {
            I2C.writeI2cBlockSync(PZAddr, Update, pixelData);
            return true;
        } catch(e){
            throw new Error("Error in setAllPixels(), retrying")
		}
	}

	return false;
}

function updatePixels(){
    for(let i=0;i<I2CRetries;i++){
        try {
            I2C.writeByteSync (PZAddr, COMMANDS.UPDATENOW, 0)
            return true;
        } catch(e){
            throw new Error("Error in updatePixels(), retrying")
		}
	}
	return false;
}

//---------------------------------------------

//---------------------------------------------
// Set the overall brightness of pixel array
function setBrightness (brightness){
    for(let i=0;i<I2CRetries;i++){
        try {
            I2C.writeByteSync (PZAddr, COMMANDS.SETBRIGHT, brightness)
             return true;
        } catch(e){
            throw new Error("Error in setBrightness(), retrying")
		}
	}
}
//---------------------------------------------

//---------------------------------------------
// Initialise the Board (same as cleanup)
function init (debug=false){
     for(let i=0;i<I2CRetries;i++){
        try {
            I2C.writeByteSync (PZAddr, COMMANDS.RESET, 0)
            return true;
        } catch(e){
            throw new Error("Error in init(), retrying")
    		time.sleep(0.01)  //1ms delay to allow time to complete
		}

	}

	return false;
}
//---------------------------------------------

//---------------------------------------------
// Cleanup the Board (same as init)
function cleanup (){
    for(let i=0;i<I2CRetries;i++){
        try {
            I2C.writeByteSync (PZAddr, COMMANDS.RESET, 0)
            return true;
        } catch(e){
            throw new Error("Error in cleanup(), retrying")
			time.sleep(0.001)   // 1ms delay to allow time to complete
		}
	}

	return false;
}
//---------------------------------------------


module.exports = {
	init,
	cleanup,
	getRevision,
	setMotor,
	forward,
	reverse,
	spinLeft,
	spinRight,
	readInput,
	setOutputConfig,
	setInputConfig,
	setOutput,
	setPixel,
	setAllPixels,
	updatePixels,
	setBrightness
}