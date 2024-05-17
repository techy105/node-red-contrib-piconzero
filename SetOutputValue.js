const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetOutputValue(config){
		RED.nodes.createNode(this, config);

		this.on("input", (msg, send, done) => {				
			PiconZero.setOutput(parseFloat(config.outputid), parseFloat(config.value));

			let configMode;
			let configValue;
			switch(config.value){
				case PiconZero.ONOFF: 
					configMode = "On/Off"; 
					configValue = config.value === 1 ? "On" : "Off"; 
				break;
				case PiconZero.PWM: 
					configMode = "PWM"; 
					configValue = config.value + "%"; 
				break;
				case PiconZero.SERVO: 
					configMode = "Servo"; 
					configValue = config.value + "deg"
				break;
				case PiconZero.WS2812B: 
					configMode = "WS2812B"; 
					configValue = config.value
				break;
			}

			scope.status({
				fill: "blue",
				shape: "ring",
				text: `${configMode} output ${config.outputid} value is ${configValue}`
			});

			if(done){
				done();
			}
		});

	}
	RED.nodes.registerType("Set Output Value", SetOutputValue)
}