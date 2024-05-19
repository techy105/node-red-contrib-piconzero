const PiconZero = require("../../piconzerojs");
const util = require("../../lib/util");


module.exports = function(RED){
	function Cleanup(config){
		RED.nodes.createNode(this, config);
		this.on("input", function(msg, send, done) {	
			util.checkIsInitialised(this);
			
			PiconZero.cleanup();

			this.status({
				fill: "green",
				shape: "dot",
				text: `Cleaned up and reset`
			});

			send(msg);

			if(done){
				done();
			}

			return msg;
		});

	}
	RED.nodes.registerType("Cleanup", Cleanup)
}