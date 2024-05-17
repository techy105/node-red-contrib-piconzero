const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetOutputConfig(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {				
			PiconZero.setOutputConfig(parseInt(config.outputid), parseInt(config.value));

			let configMode;
			switch(parseInt(config.value)){
				default: configMode = "Unknown: " + config.value; break;
				case PiconZero.CONFIG_TYPES.ONOFF: configMode = "On/Off"; break;
				case PiconZero.CONFIG_TYPES.PWM: configMode = "PWM"; break;
				case PiconZero.CONFIG_TYPES.SERVO: configMode = "Servo"; break;
				case PiconZero.CONFIG_TYPES.WS2812B: configMode = "WS2812B"; break;
			}

			this.status({
				fill: "blue",
				shape: "ring",
				text: `Output ${config.outputid} is ${configMode}`
			});

			//Store for later so we can infer things about it.
			const flow = this.context().flow;
			flow.set("PiconZero_Output" + config.outputid, config.value);
			

			send(msg);

			if(done){
				done();
			}

			return msg;
		});

		this.on("close", function(done){
			const flow = this.context().flow;

			//Reset any vars we might have stored back to 0, as the Cleanup() function will be run anyway though Initilize..
			for(var i=0;i<5;i++){
				let outputConfig = flow.get("PiconZero_Output" + i + "Config");
				if(outputConfig){
					flow.set("PiconZero_Output" + i + "Config", 0)
				}
			}

			if(done){
				done();
			}
		})

	}
	RED.nodes.registerType("Set Output Config", SetOutputConfig)
}