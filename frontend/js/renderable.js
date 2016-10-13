/**
 * 
 */

Renderable = function(canvas) {
	this.canvas = canvas;
	if (canvas.ownerDocument.readyState == "complete" || 
			canvas.ownerDocument.readyState == "interactive") {
		this.setCanvasSize();
	} else {
		canvas.ownerDocument.addEventListener("load", this, false);
	}
	
	canvas.ownerDocument.defaultView.addEventListener("resize", this, false)
}

Renderable.prototype.setCanvasSize = function () {
	var newWidth = this.canvas.parentNode.clientWidth
	var newHeight = this.canvas.parentNode.clientHeight;
	if (newWidth != this.canvas.width || newHeight != this.canvas.height) {
		this.canvas.width = newWidth;
		this.canvas.height = newHeight;
		if (this.onSetCanvasSize)
			this.onSetCanvasSize();
		this.render();
	}
}

Renderable.prototype.handleEvent = function(evt) {
	switch (evt.type) {
	case "load":
	case "resize":
		if (this.canvas.ownerDocument.readyState == "complete" || 
				this.canvas.ownerDocument.readyState == "interactive") {
			this.setCanvasSize();
		}
		break;
	}
}