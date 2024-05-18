const PiconZero = require("./piconzerojs");

function checkIsInitialised(){
	const flow = this.context().flow;
	if(flow.get("PiconZero_IsInitialised") === null){
		throw new Error("PiconZero is not initialised");
	}
}


function getConfigModeValue(configMode, value){
	let configMode;
	let configValue;
	switch(outputType){
		case PiconZero.CONFIG_TYPES.ONOFF: 
			configMode = "On/Off"; 
			configValue = value === 1 ? "On" : "Off"; 
		break;
		case PiconZero.CONFIG_TYPES.PWM: 
			configMode = "PWM"; 
			configValue = value + "%"; 
		break;
		case PiconZero.CONFIG_TYPES.SERVO: 
			configMode = "Servo"; 
			configValue = value + "deg"
		break;
		case PiconZero.CONFIG_TYPES.WS2812B: 
			configMode = "WS2812B"; 
			configValue = value
		break;
	}

	if(value === undefined){
		return configMode;
	} else {
		return {
			mode: configMode,
			value: configValue
		}
	}
}

module.exports = {
	checkIsInitialised,
	getConfigModeValue
}