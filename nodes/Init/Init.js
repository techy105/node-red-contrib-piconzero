const PiconZero = require("../../piconzerojs");
const util = require("../../lib/util");

module.exports = function(RED){
	function InitNode(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {
			
			PiconZero.init();

			this.status({
				fill: "green",
				shape: "dot",
				text: "Initialised"
			})

			const flow = this.context().flow;
			flow.set(util.GLOBAL_PREFIX + "IsInitialised", true);


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
	RED.nodes.registerType("Picon Zero - Initialise", InitNode)
}