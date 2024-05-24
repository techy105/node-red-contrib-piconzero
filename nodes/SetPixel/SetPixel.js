const PiconZero = require("../../piconzerojs");
const util = require("../../lib/util");


module.exports = function(RED){
	function SetPixel(config){
		RED.nodes.createNode(this, config);
		this.on("input", function(msg, send, done) {	
			util.checkIsInitialised(this);

			const pixelId = parseInt(msg.payload?.output?.pixelId || config.pixelId);
			if(pixelId === NaN){
				throw new Error("'output[pixelId]' not found in payload or node config.")
			}

			const pixelRed = parseInt(msg.payload?.output?.pixelRed || config.pixelRed);
			if(pixelRed === NaN){
				throw new Error("'output[pixelRed]' not found in payload or node config.")
			}

			const pixelGreen = parseInt(msg.payload?.output?.pixelGreen || config.pixelGreen);
			if(pixelGreen === NaN){
				throw new Error("'output[pixelGreen]' not found in payload or node config.")
			}

			const pixelBlue = parseInt(msg.payload?.output?.pixelBlue || config.pixelBlue);
			if(pixelBlue === NaN){
				throw new Error("'output[pixelBlue]' not found in payload or node config.")
			}

			//This only works for output 5
			PiconZero.setOutputConfig(5, 3);
			PiconZero.setPixel(pixelId, pixelRed, pixelGreen, pixelBlue);


			this.status({
				fill: "blue",
				shape: "ring",
				text: `Pixel ${pixelId}: Red ${pixelRed}, Green: ${pixelGreen}, Blue: ${pixelBlue}`
			});

			send(msg);

			if(done){
				done();
			}

			return msg;
		});

	}
	RED.nodes.registerType("Picon Zero - Set Pixel", SetPixel)
}