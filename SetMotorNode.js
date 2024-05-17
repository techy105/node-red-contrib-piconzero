const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetMotorNode(config){
		RED.nodes.createNode(this, config);

		this.on("input", (msg, send, done) => {				
			PiconZero.setMotor(config.motorId, config.value);

			if(done){
				done();
			}
		});

	}
	RED.nodes.registerType("Set Motor", SetMotorNode)
}