const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function InitNode(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {
			
			PiconZero.init();

			this.status({
				fill: "green",
				shape: "dot",
				text: "Initilized"
			})


			send(msg);
			if(done){
				done();
			}

			return msg;
		});

		this.on("close", (done)=> {
			PiconZero.cleanup();

			if(done){
				done();
			}
		})
	}
	RED.nodes.registerType("Initilize", InitNode)
}