const PiconZero = require("./piconzerojs");
const util = require("./util");


module.exports = function(RED){
	function SetOutputValue(config){
		RED.nodes.createNode(this, config);
		this.on("input", function(msg, send, done) {	
			util.checkIsInitialised();


			const outputId = RED.util.evaluateNodeProperty(msg.payload?.outputid, "msg", this, msg) || config.outputid;
			outputId = parseInt(outputId);
			if(outputId === NaN){
				throw new Error("'outputid' not found in payload or node config");
			}

			const value = RED.util.evaluateNodeProperty(msg.payload?.value, "msg", this, msg) || config.value;
			value = parseInt(value);
			if(value === NaN){
				throw new Error("'value' not found in payload or node config.")
			}

			const outputType = flow.get("PiconZero_Output" + outputId + "Config");
			if(!outputType){
				outputType = 0;
			}			
			
			PiconZero.setOutput(outputId, value);

			const configModeValues = util.getConfigModeValue(outputType, value);

			this.status({
				fill: "blue",
				shape: "ring",
				text: `${configModeValues.mode} output ${outputid} value is ${configModeValues.value}`
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