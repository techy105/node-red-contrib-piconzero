const PiconZero = require("../../piconzerojs");
const util = require("../../lib/util");


module.exports = function(RED){
	function SetInputMode(config){
		RED.nodes.createNode(this, config);
		this.on("input", function(msg, send, done) {	
			util.checkIsInitialised(this);


			const inputId = parseInt(msg.payload?.input?.id || config.inputid);
			if(inputId === NaN){
				throw new Error("'input[id]' not found in payload or node config");
			}

			const mode = parseInt(msg.payload?.input?.mode || config.mode);
			if(mode === NaN){
				throw new Error("'input[mode]' not found in payload or node config.")
			}

			let pullup = msg.payload?.input?.pullup || config.pullup;
			if(pullup !== true && pullup !== false){
				pullup = false;
			}

			let period = parseInt(msg.payload?.input?.period || config.period);
			if(period === NaN){
				period = 2000;
			}

			const flow = this.context().flow;
			
			PiconZero.setInputConfig(inputId, mode, pullup, period);

			const inputType = flow.get(util.GLOBAL_PREFIX + "Input" + inputId + "Config");		
			const configModeValues = util.getConfigModeValue(inputType);

			this.status({
				fill: "blue",
				shape: "ring",
				text: `Input ${inputId} mode is now ${configModeValues}`
			});

			send(msg);

			if(done){
				done();
			}

			return msg;
		});

	}
	RED.nodes.registerType("PiconZero - Set Input Mode", SetInputMode)
}