const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetOutputValue(config){
		RED.nodes.createNode(this, config);
		this.on("input", function(msg, send, done) {	
			console.log(`OutputValue - MSG: ${msg.payload.value} | Config: ${config.value}`)
			config.value = parseInt(config.value);	
			PiconZero.setOutput(parseFloat(config.outputid), parseFloat(config.value));

			let configMode;
			let configValue;
			switch(parseInt(config.value)){
				case PiconZero.CONFIG_TYPES.ONOFF: 
					configMode = "On/Off"; 
					configValue = config.value === 1 ? "On" : "Off"; 
				break;
				case PiconZero.CONFIG_TYPES.PWM: 
					configMode = "PWM"; 
					configValue = config.value + "%"; 
				break;
				case PiconZero.CONFIG_TYPES.SERVO: 
					configMode = "Servo"; 
					configValue = config.value + "deg"
				break;
				case PiconZero.CONFIG_TYPES.WS2812B: 
					configMode = "WS2812B"; 
					configValue = config.value
				break;
			}

			this.status({
				fill: "blue",
				shape: "ring",
				text: `${configMode} output ${config.outputid} value is ${configValue}`
			});

			send(msg);

			if(done){
				done();
			}

			return msg;
		});

	}
	RED.nodes.registerType("Set Output Value", SetOutputValue)
}