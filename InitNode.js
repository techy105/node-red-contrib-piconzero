const PiconZero = require("./piconzerojs");

module.exports = function(RED){
	function InitNode(config){
		RED.nodes.createNode(this, config);

		const scope = this;
		this.on("input", (msg, send, done) => {
			
			PiconZero.init();

			scope.status({
				fill: "green",
				shape: "check",
				text: "Initilized"
			})


			if(done){
				done();
			}
		});

		this.on("close", ()=> {
			PiconZero.cleanup();
		})
	}
	RED.nodes.registerType("PiconZero - Initilize", InitNode)
}