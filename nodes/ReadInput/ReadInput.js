const PiconZero = require("../../piconzerojs");
const util = require("../../lib/util");

module.exports = function(RED){
	function ReadInputNode(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {
			
			util.checkIsInitialised(this);

			const channel = parseInt(msg.payload?.input?.id || config.channel);
			if(channel === NaN){
				throw new Error("'input[id]' not found in payload or node config");
			}


			msg.ReadInputValue = PiconZero.readInput(channel);

			this.status({
				fill: "blue",
				shape: "dot",
				text: `Input channel ${channel} value is ${msg.ReadInputValue}`
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

	RED.nodes.registerType("Read Input", ReadInputNode)
}