const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function ReadInputNode(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {
			
			msg.ReadInputValue = PiconZero.readInput(parseInt(config.channel));

			this.status({
				fill: "blue",
				shape: "dot",
				text: `Input channel ${config.channel} value is ${msg.ReadInputValue}`
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