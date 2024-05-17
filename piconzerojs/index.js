//A direct port of: https://github.com/4tronix/PiconZero/blob/master/Python/piconzero.py
const I2CBus = require("i2c-bus");

const I2C = I2CBus.openSync(1);

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
			console.error(`Error in getRevision(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
		}
	}
	throw new Error("Error in getRevision(), tried "+ I2CRetries + " times")
}

function setMotor(motor, value){
 	if (motor >= 0 && motor <= 1 && value >= -128 && value < 128){
        for(let i=0;i<I2CRetries;i++){
            try {
                I2C.writeByteSync(PZAddr, motor, value);
                return true;
			} catch(e){
				console.error(`Error in setMotor(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
			}
		}
		throw new Error("Error in setMotor(), tried "+ I2CRetries + " times")
	}

	throw new Error("Error in setMotor(), bad motor or value")
}

// Read data for selected input channel (analog || digital)
// Channel is in range 0 to 3

//Read Only Registers - These are WORDs
//-------------------------------------
//Register  Name  			Type	Values
//1 		Input0_Data   	Word	0 or 1 for Digital, 0..1023 for Analog
//2 		Input1_Data   	Word	0 or 1 for Digital, 0..1023 for Analog
//3 		Input2_Data  	Word	0 or 1 for Digital, 0..1023 for Analog
//4 		Input3_Data   	Word	0 or 1 for Digital, 0..1023 for Analog

function readInput (channel){
    if (channel >=0 && channel <= 3){
        for(let i=0;i<I2CRetries;i++){
            try {
                return I2C.readWordSync(PZAddr, channel + 1);
            } catch(e){
                console.error(`Error in readInput(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
			}
		}
		throw new Error("Error in readInput(), tried "+ I2CRetries + " times")
	}

	throw new Error("Error in readInput(), bad channel")
}


//Mode  Name    Type    Values
//0     On/Off  Byte    0 is OFF, 1 is ON
//1     PWM     Byte    0 to 100 percentage of ON time
//2     Servo   Byte    -100 to + 100 Position in degrees
//3     WS2812B 4 Bytes 0:Pixel ID, 1:Red, 2:Green, 3:Blue
function setOutputConfig(output, value){
	if (output >=0 && output <=5 && value >=0 && value <= 3){
		for(let i=0;i<I2CRetries;i++){
 			try {
				I2C.writeByteSync (PZAddr, COMMANDS.OUTCFG0+output, value);
				return true;
			} catch(e){
				console.error(`Error in setOutputConfig(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
			}
		}
		throw new Error("Error in setOutputConfig(), tried "+ I2CRetries + " times")
	}

	throw new Error("Error in setOutputConfig(), bad output or value")
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
				console.error(`Error in setInputConfig(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
			}
		}
		throw new Error("Error in setInputConfig(), tried "+ I2CRetries + " times")
	}

	throw new Error("Error in setInputConfig(), bad channel or value")
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
                console.error(`Error in setOutput(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
			}
		}
		throw new Error("Error in setOutput(), tried "+ I2CRetries + " times")
	}

	throw new Error("Error in setOutput(), bad channel or value")
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
            console.error(`Error in setPixel(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
		}
	}

	throw new Error("Error in setPixel(), tried "+ I2CRetries + " times")
}

function setAllPixels (Red, Green, Blue, Update=true){
    pixelData = [100, Red, Green, Blue]
    for(let i=0;i<I2CRetries;i++){
        try {
            I2C.writeI2cBlockSync(PZAddr, Update, pixelData);
            return true;
        } catch(e){
            console.error(`Error in setAllPixels(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
		}
	}

	throw new Error("Error in setAllPixels(), tried "+ I2CRetries + " times")
}

function updatePixels(){
    for(let i=0;i<I2CRetries;i++){
        try {
            I2C.writeByteSync (PZAddr, COMMANDS.UPDATENOW, 0)
            return true;
        } catch(e){
			console.error(`Error in updatePixels(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
		}
	}
	
	throw new Error("Error in updatePixels(), tried "+ I2CRetries + " times")
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
			console.error(`Error in setBrightness(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
		}
	}
	throw new Error("Error in setBrightness(), tried "+ I2CRetries + " times")

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
            console.error(`Error in init(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
    		wait(1);  //1ms delay to allow time to complete
		}

	}

	throw new Error("Error in init(), tried "+ I2CRetries + " times")
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
            console.error(`Error in cleanup(): ${e.message}. Retrying ${i+1}/${I2CRetries}`)
			wait(1);   // 1ms delay to allow time to complete
		}
	}

	throw new Error("Error in cleanup(), tried "+ I2CRetries + " times")
}
//---------------------------------------------

function wait(ms){
	const tsNow = Date.now();
	const tsTarget = tsNow + ms;
	while(Date.now() < tsTarget){
		var noop;
	}
}
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