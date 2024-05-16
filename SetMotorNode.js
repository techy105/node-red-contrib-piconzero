const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function SetMotorNode(config){
		RED.nodes.createNode(this, config);

		const scope = this;
		this.on("input", (msg, send, done) => {
			let payload;
			try {
				payload = JSON.parse(msg.payload);
			} catch(e){
				if(done){
					done(`Payload must be JSON, format: { "motorId": 0, "value": 0 }`)
				} else {
					scope.error(`Payload must be JSON, format: { "motorId": 0, "value": 0 }`)
				}
			}

			if(payload.motorId <= -1 || payload.motorId >= 2 ){
				return scope.error("MotorId must be 0 or 1")
			}
			

			if(payload.value >= 129 || payload.value <= -129){
				return scope.error("Value must be within range -128 - 128");
			}

			
			const isSuccess = PiconZero.setMotor(payload.motorId, payload.value);

			if(!isSuccess){
				return scope.error("Failed to set motor");
			}

			if(done){
				done();
			}
		});

	}
	RED.nodes.registerType("PiconZero - Set Motor Value", SetMotorNode)
}

function ReadInputNode(config){
	RED.nodes.createNode(this, config);

	const scope = this;
	this.on("input", (msg, send, done) => {
		if(msg.payload === "" || parseInt(msg.payload) === NaN){
			return scope.error("Channel number required - Range 0-3.");
		}
		
		msg.payload = PiconZero.readInput(msg.payload);

		send(msg);

		if(done){
			done();
		}
	});

}

RED.nodes.registerType("PiconZero - Read Input", ReadInputNode)