function checkParameters( params ) {

	if (!params.width) {
		return 'width is mandatory';
	}
	if (!params.height) {
		return 'height is mandatory';
	}
	if (!params.frame) {
		return 'frame is mandatory';
	}
	return false;
}

self.onmessage = function(event) {  

	var result;
	result = [];

	var params = event.data;
	// Check parameters
	var err;
	if ( err = checkParameters(params) ) {
		self.postMessage({ err: err });
		return;
	};
	params.size = (!params.size) ? 20 : params.size;

	// calc constants
	var length = Math.floor((params.frame.length - 1)/4),		// Total number of 'pixels' (rgba => 4 values = 1 pixel)
		blocWidth = Math.ceil(params.width / params.size),		// Number of bloc on a row
		blocHeight = Math.ceil(params.height / params.size),	// number of bloc on a colunm
		blocLength = params.size * params.size * 4,				// Number of pixels in a bloc
		paddingRight = (blocWidth % params.width) - 1;

	for (var i = 0; i < length; i++) {

		var row = Math.floor(i / params.width),			// current row number
			blocRow = Math.floor(row / params.size),	// current blocRow number 
			// Current bloc number
			blocIdx = Math.floor(((i - (params.width * row)) / params.size) + (blocRow * blocWidth));

		if (!result[blocIdx]) {
			result[blocIdx] = [];
		};

		// Add 1 pixel (ie 4 values) to the current bloc
		for (var j = 0; j< 4; j++) {
			result[blocIdx].push(params.frame[i * 4 + j]);
		};
		// Last column ?
		// need to fill the bloc with blank pixels
		if ((i+1)%params.width === 0) {

			for (var k = 0; k < paddingRight; k++) {
			 	result[blocIdx].push(0);
			 	result[blocIdx].push(0);
			 	result[blocIdx].push(0);
			 	result[blocIdx].push(0);
			}
		};
	};
	// fill the missing pixels in last row's blocs
	for (var i = result.length-blocWidth; i < result.length; i++) {

		while (result[i].length < blocLength) {
		 	result[i].push(0);				
		}
	};

	self.postMessage(result);
}; 