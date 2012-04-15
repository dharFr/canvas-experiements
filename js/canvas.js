var CanvasUtils;

CanvasUtils = (function() {

	var defaults = {
		maxWidth: null,
		maxHeight: null
	};

	function CanvasUtils(canvas, options) {

		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.settings = $.extend({}, defaults, options);
	}

	CanvasUtils.prototype.loadImage = function(file, loadedCb) {
		
		var reader;
				
		reader = new FileReader();
		reader.onerror = console.log;
		reader.onload = (function (self) {

			return function (e) {
				var img;

				img = new Image();
				img.onerror = console.log;
				img.onload = (function(self) {

					return function () {

						var frameData, w, h;

						w = img.width;
						h = img.height;

						// Preserving img ratio
						if (self.settings.maxWidth && img.width > self.settings.maxWidth) {

							w = self.settings.maxWidth;
							h = Math.round(w * img.height / img.width);
						}
						if (self.settings.maxHeight && img.height > self.settings.maxHeight) {
							
							h = self.settings.maxHeight;
							w = Math.round(h * img.width / img.height);
						}

						self.width = w;
						self.height = h;

						self.canvas.setAttribute('width', self.width);
						self.canvas.setAttribute('height', self.height);

						self.ctx.drawImage(img, 0, 0, self.width, self.height);

						if (loadedCb) {
							loadedCb();
						}
					}
				})(self);

				img.src = e.target.result;
			}

		})(this);

		reader.readAsDataURL(file);
	};

	CanvasUtils.prototype.computeMediumColor = function(frame, cb) {

		if (typeof frame === "function" && typeof cb === "undefined") {
			cb = frame;
			frame = this.ctx.getImageData(0, 0, this.width, this.height);
		}
		console.log('>>> starting medium color worker');

		var worker = new Worker('js/workers/computeMediumColor.js');  
		worker.onmessage = function(event) {
			console.log("Called back by the mediumColor worker!", event.data); 
			if (cb) {
				cb(event.data.color)
			} 
			worker.terminate();
		};
		worker.postMessage(frame.data);
	};

	CanvasUtils.prototype.mosaique = function(cb) {

		var size = 20;
		var frame = this.ctx.getImageData(0, 0, this.width, this.height);
		console.log('>>> starting mosaique', frame);

		var worker = new Worker('js/workers/mosaique.js');  
		
		worker.onmessage = function(event) {
			console.log("Called back by the mosaique worker!", event.data); 
			if (cb) {
				cb(event.data)
			}
			worker.terminate();
		};
		worker.postMessage({
			frame: frame.data,
			width: this.width,
			height: this.height,
			size: size
		});
	};

	CanvasUtils.prototype.defaults = defaults;

	return CanvasUtils;
})();