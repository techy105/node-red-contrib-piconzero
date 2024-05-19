const PiconZero = require("../piconzerojs");

const GLOBAL_PREFIX = "PiconZero_";

function checkIsInitialised(scope){
	const flow = scope.context().flow;
	if(flow.get(GLOBAL_PREFIX + "IsInitialised") === null){
		throw new Error("PiconZero is not initialised");
	}
}


function getConfigModeValue(mode, value){
	let configMode;
	let configValue;
	switch(mode){
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
	getConfigModeValue,
	GLOBAL_PREFIX
}