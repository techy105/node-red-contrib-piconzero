const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function ReadInputNode(config){
		RED.nodes.createNode(this, config);

		const scope = this;
		this.on("input", (msg, send, done) => {
			
			msg.ReadInputValue = PiconZero.readInput(config.channel);

			send(msg);

			if(done){
				done();
			}
		});

	}

	RED.nodes.registerType("Read Input", ReadInputNode)
}