const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetOutputConfig(config){
		RED.nodes.createNode(this, config);

		this.on("input", (msg, send, done) => {				
			PiconZero.setOutput(parseFloat(config.outputid), parseFloat(config.value));

			if(done){
				done();
			}
		});

	}
	RED.nodes.registerType("Set Output Value", SetOutputConfig)
}