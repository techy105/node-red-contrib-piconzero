const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetMotorNode(config){
		RED.nodes.createNode(this, config);

		this.on("input", (msg, send, done) => {				
			PiconZero.setMotor(parseInt(config.motorid), parseFloat(config.value));

			send(msg);
			if(done){
				done();
			}

			return msg;
		});

		this.on("close", (done)=> {
			if(done){
				done();
			}
		})
	}
	RED.nodes.registerType("Set Motor", SetMotorNode)
}