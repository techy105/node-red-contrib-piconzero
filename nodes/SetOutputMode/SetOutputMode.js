const PiconZero = require("../../piconzerojs");
const util = require("../../lib/util");

module.exports = function(RED){
	function SetOutputMode(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {	
			util.checkIsInitialised(this);


			const outputId = parseInt(msg.payload?.output?.id || config.outputid);
			if(outputId === NaN){
				throw new Error("'output[id]' not found in payload or node config");
			}

			const mode = parseInt(msg.payload?.output?.mode || config.mode);
			if(mode === NaN){
				throw new Error("'output[mode]' not found in payload or node config.")
			}

			PiconZero.setOutputConfig(outputId, mode);


			const configModeValue = util.getConfigModeValue(mode);

			this.status({
				fill: "blue",
				shape: "ring",
				text: `Output ${outputId} is ${configModeValue}`
			});

			//Store for later so we can infer things about it.
			const flow = this.context().flow;
			flow.set(util.GLOBAL_PREFIX + "Output" + outputId + "Mode", mode);
			

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
				let outputMode = flow.get(util.GLOBAL_PREFIX + "Output" + i + "Mode");
				if(outputMode){
					flow.set(util.GLOBAL_PREFIX + "Output" + i + "Mode", 0)
				}
			}

			if(done){
				done();
			}
		})

	}
	RED.nodes.registerType("Set Output Mode", SetOutputMode)
}