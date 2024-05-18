const PiconZero = require("./piconzerojs");
const util = require("./util");

module.exports = function(RED){
	function SetOutputConfig(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {	
			util.checkIsInitialised();


			const outputId = parseInt(RED.util.evaluateNodeProperty(msg.payload?.outputid, "msg", this, msg) || config.outputid);
			if(outputId === NaN){
				throw new Error("'outputid' not found in payload or node config");
			}

			const value = parseInt(RED.util.evaluateNodeProperty(msg.payload?.value, "msg", this, msg) || config.value);
			if(value === NaN){
				throw new Error("'value' not found in payload or node config.")
			}

			PiconZero.setOutputConfig(outputId, value);


			const configModeValue = util.getConfigModeValue(value);

			this.status({
				fill: "blue",
				shape: "ring",
				text: `Output ${outputId} is ${configModeValue}`
			});

			//Store for later so we can infer things about it.
			flow.set("PiconZero_Output" + outputId, value);
			

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