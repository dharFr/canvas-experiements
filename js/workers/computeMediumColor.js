self.onmessage = function(event) {  

	function getColor(frameData, i) {
		return {
			r: frameData[i * 4 + 0],
			g: frameData[i * 4 + 1],
			b: frameData[i * 4 + 2],
			a: frameData[i * 4 + 3]
		}
	}
	var frameData = event.data, 
		i = Math.floor((frameData.length - 1)/4),
		color = getColor(frameData, i),
		count = 0,
		result = {
			start: Math.floor((frameData.length - 1)/4),
			initColor: getColor(frameData, Math.floor((frameData.length - 1)/4))
		};

	for (; i >= 0; i--) {
		var r, g, b, a;
		var cur = getColor(frameData, i);
		
		for( key in color ) {
			color[key] = (color[key] + cur[key]) / 2;
		}
		count++;
	};

	for( key in color ) {
		color[key] = Math.round(color[key]);
	}
	result.count = count;
	result.color = color;

	self.postMessage(result);
}; 