const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function ReadInputNode(config){
		RED.nodes.createNode(this, config);

		const scope = this;
		this.on("input", (msg, send, done) => {
			
			msg.ReadInputValue = PiconZero.readInput(parseInt(config.channel));

			scope.status({
				fill: "blue",
				shape: "dot",
				text: `Input channel ${config.channel} value is ${msg.ReadInputValue}`
			});

			send(msg);

			if(done){
				done();
			}
		});

		this.on("close", (done)=> {
			if(done){
				done();
			}
		})

	}

	RED.nodes.registerType("Read Input", ReadInputNode)
}