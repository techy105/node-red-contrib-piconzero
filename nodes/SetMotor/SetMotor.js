const PiconZero = require("../../piconzerojs");
const util = require("../../lib/util");


module.exports = function(RED){
	function SetMotorNode(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {				

			util.checkIsInitialised(this);

			const motorId = parseInt(msg.payload?.motor?.id || config.motorid);
			if(motorId === NaN){
				throw new Error("'motor[id]' not found in payload or node config");
			}

			const value = parseInt(msg.payload?.motor?.value || config.value);
			if(value === NaN){
				throw new Error("'motor[value]' not found in payload or node config.")
			}

			PiconZero.setMotor(motorId, value);

			this.status({
				fill: "blue",
				shape: "ring",
				text: `Motor ${motorId} set to ${value}`
			});

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
	RED.nodes.registerType("Picon Zero - Set Motor", SetMotorNode)
}