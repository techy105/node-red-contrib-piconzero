const PiconZero = require("../../piconzerojs");
const util = require("../../lib/util");


module.exports = function(RED){
	function SetPixelBrightness(config){
		RED.nodes.createNode(this, config);
		this.on("input", function(msg, send, done) {	
			util.checkIsInitialised(this);

			const pixelId = parseInt(msg.payload?.output?.pixelId || config.pixelId);
			if(pixelId === NaN){
				throw new Error("'output[pixelId]' not found in payload or node config.")
			}

			const pixelBrightness = parseInt(msg.payload?.output?.pixelBrightness || config.pixelBrightness);
			if(pixelBrightness === NaN){
				throw new Error("'output[pixelBrightness]' not found in payload or node config.")
			}

			
			//This only works for output 5			
			PiconZero.setBrightness(pixelBrightness);


			this.status({
				fill: "blue",
				shape: "ring",
				text: `Pixel ${pixelId} brightness set to ${Math.round(pixelBrightness/40*100)}`
			});

			send(msg);

			if(done){
				done();
			}

			return msg;
		});

	}
	RED.nodes.registerType("Picon Zero - Set Pixel Brightness", SetPixelBrightness)
}