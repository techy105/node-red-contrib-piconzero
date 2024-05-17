const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function InitNode(config){
		RED.nodes.createNode(this, config);

		const scope = this;
		this.on("input", (msg, send, done) => {
			
			PiconZero.init();

			scope.status({
				fill: "green",
				shape: "dot",
				text: "Initilized"
			})


			if(done){
				done();
			}
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