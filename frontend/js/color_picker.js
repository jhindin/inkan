HSVSlice = function(canvas, color) {
	if (!color)
		this.color = new StyleAttributes.ComponentColor();
	else
		this.color = color;

	this.hsv = {
		h : this.color.h,
		s : this.color.s,
		v : this.color.v
	}

	Renderable.call(this, canvas);

	this.clickAndDrag = new ClickAndDrag(window, canvas, this)
	this.color.ll.addListener(this);
}

HSVSlice.prototype = Object.create(Renderable.prototype);

HSVSlice.prototype.changed = function() {
	var newHSV = this.color.hsv;
	
	if (newHSV.h == this.hsv.h && newHSV.s == this.hsv.s
			&& newHSV.v == this.hsv.v)
		return;
	
	var oldHSV = this.hsv;
	
	this.hsv = {
		h : this.color.h,
		s : this.color.s,
		v : this.color.v
	};
	this.render(oldHSV);
}

HSVSlice.prototype.setColor = function(newColor)
{
	var oldHSV = this.hsv;
	
	this.color.ll.removeListener(this);
	this.color = newColor;
	this.color.ll.addListener(this);
	
	this.hsv = {
			h : this.color.h,
			s : this.color.s,
			v : this.color.v
		};
	
	this.render(oldHSV);
}

HSVSlice.prototype.handleEvent = function(evt) {
	switch (evt.type) {
	case "mousedown":
	case "mousemove":
	case "mouseup":
		var canvasRect = this.canvas.getBoundingClientRect();
		var centerX = canvasRect.width / 2;
		var centerY = canvasRect.height / 2;
		var minEdge = Math.min(canvasRect.width, canvasRect.height);

		var x = evt.elementX;
		var y = evt.elementY;
		
		var rX = x - centerX;
		var rY = centerY - y;
		var angle = Math.atan2(rY, rX) * 180 / Math.PI;
		if (angle < 0)
			angle += 360;
		
		distance = Math.sqrt(rX * rX + rY * rY);
		if (distance >= (minEdge /2))
			break;
		
		distance /= (minEdge / 2);
		
		this.color.hsv =  { h: angle * 255 / 360, s: distance * 255, v: this.color.v};

		break;

	}

}

/*
HSVSlice.prototype.changePosition = function(oldHSV, newHSV) {
	var canvasRect = this.canvas.getBoundingClientRect();
	var minEdge = Math.min(canvasRect.width, canvasRect.height);
	var centerX = canvasRect.width / 2;
	var centerY = canvasRect.height / 2;


	this.render(oldPx, oldPy, newPx, newPy);
}
*/
function inSquare(x, y, cX, cY, halfEdge) {
	var dX = x - cX;
	var dY = y - cY;
	
	return -halfEdge <= dX && dX <= halfEdge &&
	-halfEdge <= dY && dY <= halfEdge;
}

HSVSlice.prototype.render = function(oldHSV) {
	ctx = this.canvas.getContext('2d');

	var canvasRect = this.canvas.getBoundingClientRect();
	var minEdge = Math.min(canvasRect.width, canvasRect.height);
	var centerX = canvasRect.width / 2;
	var centerY = canvasRect.height / 2;

	var angle = this.color.h * Math.PI / 128 ;
	var radius = this.color.s * minEdge / 512;
	var pX = radius * Math.cos(angle) + centerX;
	var pY = radius * -Math.sin(angle) + centerY;
	
	if (oldHSV) {
		var oldAngle = oldHSV.h * Math.PI / 128;
		var oldRadius = oldHSV.s * minEdge / 512;
		var oldPx = oldRadius * Math.cos(oldAngle) + centerX;
		var oldPy = oldRadius * -Math.sin(oldAngle) + centerY;
	}

	ctx.save();

	for ( var y = 0; y < canvasRect.height; y++) {
		for ( var x = 0; x < canvasRect.width; x++) {
			if (oldHSV) {
				if (!inSquare(x, y, pX, pY, 4) && !inSquare(x, y, oldPx, oldPy, 4))
					continue;
			} 
			
			var rX = x - centerX;
			var rY = centerY - y;
			var pointRadius = Math.sqrt(rX * rX + rY * rY);

			if (pointRadius > minEdge / 2) {
				ctx.fillStyle="white";
			} else {
				var hsv = {};
				var angle = Math.atan2(rY, rX) * 180 / Math.PI;
				if (angle < 0)
					angle += 360;
				
				hsv.h = angle * 256 / 360;
				hsv.s = (pointRadius / minEdge) * 256;
				hsv.v = 255;
	
				rgb = hsv_to_rgb(hsv);
				ctx.fillStyle = "rgb(" + Math.floor(rgb.r) + ","
						+ Math.floor(rgb.g) + "," + Math.floor(rgb.b)
						+ ")";
			}
			ctx.fillRect(x, y, 1, 1);
		}
	}
	ctx.restore();

	
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(pX, pY, 3, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	
}
