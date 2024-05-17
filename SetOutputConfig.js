const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetOutputConfig(config){
		RED.nodes.createNode(this, config);

		this.on("input", (msg, send, done) => {				
			PiconZero.setOutputConfig(parseInt(config.motorId), parseInt(config.value));

			if(done){
				done();
			}
		});

	}
	RED.nodes.registerType("Set Output Config", SetOutputConfig)
}