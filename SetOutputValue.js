const PiconZero = require("./piconzerojs");
const util = require("./util");


module.exports = function(RED){
	function SetOutputValue(config){
		RED.nodes.createNode(this, config);
		this.on("input", function(msg, send, done) {	
			util.checkIsInitialised(this);


			const outputId = parseInt(msg.payload?.output?.id || config.outputid);
			if(outputId === NaN){
				throw new Error("'output[id]' not found in payload or node config");
			}

			const value = parseInt(msg.payload?.output?.value || config.value);
			if(value === NaN){
				throw new Error("'output[value]' not found in payload or node config.")
			}

			const flow = this.context().flow;
			
			PiconZero.setOutput(outputId, value);

			const outputType = flow.get("PiconZero_Output" + outputId + "Config");		
			const configModeValues = util.getConfigModeValue(outputType, value);

			this.status({
				fill: "blue",
				shape: "ring",
				text: `${configModeValues.mode} output ${outputId} value is ${configModeValues.value}`
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