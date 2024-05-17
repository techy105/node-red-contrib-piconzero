const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetOutputConfig(config){
		RED.nodes.createNode(this, config);

		this.on("input", (msg, send, done) => {				
			PiconZero.setOutputConfig(config.motorId, config.value);

			if(done){
				done();
			}
		});

	}
	RED.nodes.registerType("Set Output Config", SetOutputConfig)
}