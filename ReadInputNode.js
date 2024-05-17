const PiconZero = require("./piconzerojs");

module.exports = function(RED){
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

	RED.nodes.registerType("Read Input", ReadInputNode)
}