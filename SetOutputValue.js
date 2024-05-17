const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetOutputValue(config){
		RED.nodes.createNode(this, config);
		this.on("input", function(msg, send, done) {	

			const value = RED.util.evaluateNodeProperty(config.value, "msg", this, msg);

			console.log(`OutputValue - MSG: ${msg.payload.value} | Config: ${value}`)
			
			
			PiconZero.setOutput(parseFloat(config.outputid), parseFloat(value));

			let configMode;
			let configValue;
			switch(parseInt(value)){
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