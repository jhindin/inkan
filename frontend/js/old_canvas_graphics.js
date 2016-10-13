var Graphics = Graphics || {}

Graphics.Utils = Graphics.Utils || {}

Graphics.Utils.copy = function(o) {
	ret = {};
	for (v in o)
		ret[v] = o[v];
	return ret;
}

Graphics.Point = function(x, y) {
	this.x = x;
	this.y = y;

}

Graphics.Point.prototype.distance = function(p1) {
	return Math.sqrt((p1.x - this.x) * (p1.x - this.x) + (p1.y - this.y)
			* (p1.y - this.y));
}

Graphics.Point.prototype.toString = function() {
	return this.x + "x" + this.y;
}

Graphics.distance = function(p1, p2) {
	return p1.distance(p2);
}

Graphics.Rect = function(x, y, w, h) {
	this.x = x;
	this.y = y;

	this.w = w;
	this.h = h;

	this.halfWidth = w / 2;
	this.halfHeight = h / 2;

	this.centerX = x + this.halfWidth;
	this.centerY = y + this.halfHeight
}

Graphics.Rect.prototype.toString = function() {
	return (this.x + "x" + this.y + "+" + this.w + "x" + this.h);
}

Graphics.Rect.prototype.move = function(x, y) {
	this.centerX = (x - this.x);
	this.centerY = (y - this.y);

	this.x = x;
	this.y = y;
}

Graphics.Rect.prototype.intersection = function(r1) {
	if (Math.abs(this.centerX - r1.centerX) > (this.halfWidth + r1.halfWidth)
			|| Math.abs(this.centerY - r1.centerY) > (this.halfHeight + r1.halfHeight)) {
		return null;
	}

	var iX = Math.max(this.x, r1.x);
	var iY = Math.max(this.y, r1.y);

	var iRight = Math.min(this.x + this.w, r1.x + r1.w);
	var iBottom = Math.min(this.y + this.h, r1.y + r1.h);

	return new Graphics.Rect(iX, iY, iRight - iX, iBottom - iY);
}
Graphics.Rect.prototype.union = function(r1) {
	var uX = Math.min(this.x, r1.x);
	var uY = Math.min(this.y, r1.y);
	var uRight = Math.max(this.x + this.w, r1.x + r1.w);
	var uBottom = Math.max(this.y + this.h, r1.y + r1.h);
	return new Graphics.Rect(uX, uY, uRight - uX, uBottom - uY);
}

Graphics.Rect.prototype.inRect = function(p) {
	return this.x <= p.x && p.x <= (this.x + this.w) && this.y <= p.y
			&& p.y <= (this.x + this.h);
}

Graphics.intersection = function(r1, r2) {
	return r1.intersection(r2);
}
Graphics.union = function(r1, r2) {
	return r1.union(r2);
}

Graphics.Shape = function(root, x, y, fillStyle, strokeStyle) {
	this.root = root;
	this.x = x;
	this.y = y;
	this.fillStyle = fillStyle;
	this.strokeStyle = strokeStyle;
	if (root)
		root.addShape(this);
}

Graphics.Shape.prototype.move = function(x, y) {
	if (this.root)
		this.root.addDirty(this.bb);

	this.bb.move(x, y);
	if (this.movePoints)
		this.movePoints(x - this.x, y - this.y);
	this.x = x;
	this.y = y;

	if (this.root)
		this.root.addDirty(this.bb);
}

Graphics.Shape.prototype.render = function(ctx) {
	ctx.save();
	ctx.strokeStyle = this.strokeStyle;
	ctx.fillStyle = this.fillStyle;
	this.renderCurentStyle(ctx);
	ctx.restore();
}

Graphics.Shape.prototype.isHollow = function()
{
	return !this.fillStyle;
}

Graphics.Shape.prototype.hasOutline = function()
{
	return this.strokeStyle;
}

Graphics.RectShape = function(root, x, y, w, h, fillStyle, strokeStyle) {
	this.bb = new Graphics.Rect(x, y, w, h);

	Graphics.Shape.call(this, root, x, y, fillStyle, strokeStyle);

	this.w = w;
	this.h = h;
}

Graphics.RectShape.prototype = Object.create(Graphics.Shape.prototype);

Graphics.RectShape.prototype.renderCurentStyle = function(ctx) {
	if (this.hasOutline())
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	if (!this.isHollow())
		ctx.fillRect(this.x, this.y, this.w, this.h);
}

Graphics.Circle = function(root, centerX, centerY, radius, fillStyle,
		strokeStyle) {
	var left = centerX - radius;
	var top = centerY - radius;
	this.bb = new Graphics.Rect(left, top, radius * 2, radius * 2);

	Graphics.Shape.call(this, root, left, top, fillStyle, strokeStyle);

	this.centerX = centerX;
	this.centerY = centerY;
	this.radius = radius;
}

Graphics.Circle.prototype = Object.create(Graphics.Shape.prototype);

Graphics.Circle.prototype.renderCurentStyle = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
	ctx.closePath();
	if (this.hasOutline())
		ctx.stroke();
	if (!this.isHollow())
		ctx.fill();
}

Graphics.Circle.prototype.movePoints = function(deltaX, deltaY) {
	this.centerX += deltaX;
	this.centerY += deltaY;
}

Graphics.mouseDownHandler = function(evt) {
	this.renderingRoot.onMouseDown(this, evt);
}

Graphics.mouseMoveHandler = function(evt) {
	this.renderingRoot.onMouseMove(this, evt);
}

Graphics.mouseUpHandler = function(evt) {
	this.renderingRoot.onMouseUp(this, evt);
}



Graphics.CanvasRenderable = function(canvas, root) {
	this.root = root;
	Renderable.call(this, canvas);
}

Graphics.CanvasRenderable.prototype = Object.create(Renderable.prototype);

Graphics.CanvasRenderable.prototype.render = function() {
	this.root.render();
}

Graphics.CanvasRenderable.prototype.onSetCanvasSize = function() {
	this.root.canvasRect = this.canvas.getBoundingClientRect();
}

Graphics.OverlayCanvasRenderable = function(canvas, root) {
	Renderable.call(this, canvas);
}

Graphics.OverlayCanvasRenderable.prototype = Object.create(Renderable.prototype);

Graphics.OverlayCanvasRenderable.prototype.render = function() {
}

Graphics.Root = function(canvas, overlayCanvas) {
	
	this.shapes = [];
	this.canvas = canvas;
	this.overlayCanvas = overlayCanvas;

	this.createFillStyle = "rgb(0, 0, 0)";
	this.createStrokeStyle = "rgb(0, 0, 0)";

	canvas.renderingRoot = this;
	overlayCanvas.renderingRoot = this;


	this.canvasClick = new ClickAndDrag(window, canvas, this);

	this.dirtyRectangles = [];

	this.canvasRenderable = new Graphics.CanvasRenderable(canvas, this);
	this.overlayCanvasRenderable = new Graphics.OverlayCanvasRenderable(overlayCanvas);

	if (overlayCanvas) {
		this.eraseOverlay();

		this.overlayCanvasClick = new ClickAndDrag(window, overlayCanvas, this);
	}
}

Graphics.Root.prototype.render = function() {
	var ctx = this.canvas.getContext('2d');

	for (dirtyIndex in this.dirtyRectangles) {
		ctx.clearRect(this.dirtyRectangles[dirtyIndex].x,
				this.dirtyRectangles[dirtyIndex].y,
				this.dirtyRectangles[dirtyIndex].w,
				this.dirtyRectangles[dirtyIndex].h);
	}

	this.dirtyRectangles = [];

	this.shapes.forEach(function(shape) {
		shape.render(ctx);
	});

}

Graphics.Root.prototype.addDirty = function(bb) {
	if (bb)
		this.dirtyRectangles.push(Graphics.Utils.copy(bb));
}

Graphics.Root.prototype.addShape = function(shape) {
	this.shapes.push(shape);
	this.dirtyRectangles.push(shape.bb);
}

Graphics.Root.prototype.onMouseMove = function(evt) {
	var ctx = this.overlayCanvas.getContext("2d");
	ctx.save();

	if (this.overlayShape) {
		this.eraseOverlay();
	}
	var mouseX = evt.clientX - this.canvas.getBoundingClientRect().left;
	var mouseY = evt.clientY - this.canvas.getBoundingClientRect().top;

	var x = Math.min(mouseX, this.mouseOrigX);
	var y = Math.min(mouseY, this.mouseOrigY);

	this.overlayShape = new Graphics.RectShape(null, x, y, Math.abs(mouseX
			- this.mouseOrigX), Math.abs(mouseY - this.mouseOrigY), null, "rgb(0,0,0)");

	ctx.globalAlpha = 1;
	ctx.strokeStyle = "rgb(0, 0, 0)";
	this.overlayShape.renderCurentStyle(ctx);
	ctx.restore();
}

Graphics.Root.prototype.onMouseUp = function(evt) {
	this.overlayShape = null;
	this.eraseOverlay();

	var mouseX = evt.clientX - this.canvas.getBoundingClientRect().left
	var mouseY = evt.clientY - this.canvas.getBoundingClientRect().top;

	var x = Math.min(mouseX, this.mouseOrigX);
	var y = Math.min(mouseY, this.mouseOrigY);

	new Graphics.RectShape(this, x, y, Math.abs(mouseX - this.mouseOrigX), Math
			.abs(mouseY - this.mouseOrigY), this.createFillStyle, this.createStrokeStyle);
	this.render();

}


Graphics.Root.prototype.onMouseDown = function(evt) {
	this.mouseOrigX = evt.clientX - this.canvas.getBoundingClientRect().left;
	this.mouseOrigY = evt.clientY - this.canvas.getBoundingClientRect().top;
}

Graphics.Root.prototype.eraseOverlay = function() {
	var ctx = this.overlayCanvas.getContext("2d");

	ctx.save();

	ctx.globalAlpha = 0;
	ctx.fillStyle = "rgb(0, 0, 0, 0)";
	ctx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);

	ctx.restore();
}

Graphics.Root.prototype.handleEvent = function(evt) {
	switch (evt.type) {
	case "mousedown":
		this.onMouseDown(evt)
		break;
	case "mousemove":
		this.onMouseMove(evt)
		break;
	case "mouseup":
		this.onMouseUp(evt);
		break;
	}
}
