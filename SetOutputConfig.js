const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetOutputConfig(config){
		RED.nodes.createNode(this, config);
		const scope = this;

		this.on("input", (msg, send, done) => {				
			PiconZero.setOutputConfig(parseInt(config.outputid), parseInt(config.value));

			let configMode;
			switch(config.value){
				case PiconZero.ONOFF: configMode = "On/Off"; break;
				case PiconZero.PWM: configMode = "PWM"; break;
				case PiconZero.SERVO: configMode = "Servo"; break;
				case PiconZero.WS2812B: configMode = "WS2812B"; break;
			}

			scope.status({
				fill: "blue",
				shape: "ring",
				text: `Output ${config.outputid} is ${configMode}`
			});

			//Store for later so we can infer things about it.
			const flow = scope.context().flow;
			flow.set("PiconZero_Output" + config.outputid, config.value);
			


			if(done){
				done();
			}

			return msg;
		});

		this.on("close", done => {
			const flow = scope.this.context().flow;

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