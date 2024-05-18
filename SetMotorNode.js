const PiconZero = require("./piconzerojs");
const util = require("./util");


module.exports = function(RED){
	function SetMotorNode(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {				

			util.checkIsInitialised();

			const motorId = parseInt(RED.util.evaluateNodeProperty(msg.payload?.motorid, "msg", this, msg) || config.motorid);
			if(motorId === NaN){
				throw new Error("'motorId' not found in payload or node config");
			}

			const value = parseInt(RED.util.evaluateNodeProperty(msg.payload?.value, "msg", this, msg) || config.value);
			if(value === NaN){
				throw new Error("'value' not found in payload or node config.")
			}

			PiconZero.setMotor(parseInt(motorId), parseFloat(value));

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