var Graphics = Graphics || {}

Graphics.svgNS = "http://www.w3.org/2000/svg";

Graphics.ShapeFactory = function() {

}

Graphics.ShapeFactory.prototype.createInteractiveInitializer = function(ui) {
}
Graphics.ShapeFactory.prototype.createIcon = function(parent) {
}

Graphics.ShapeFactoryIcon = function(parent) {
	this.parent = parent;
}
Graphics.Shape = function(ui) {
	this.ui = ui;
}

Graphics.Shape.prototype.create = function(parent) {
}

Graphics.Interactive = function(ui) {
	this.ui = ui;
}

Graphics.Interactive.prototype.onMouse = function(evt) {
}
Graphics.Interactive.prototype.onKey = function(evt) {
}
Graphics.Interactive.prototype.destroyElements = function() {
}

Graphics.InteractiveInitializer = function(ui) {
	Graphics.Interactive.call(this, ui);
}

Graphics.InteractiveInitializer.prototype = Object
		.create(Graphics.Interactive.prototype);

Graphics.InteractiveEditor = function(canvas, shape) {
	this.canvas = canvas;
	this.shape = shape;
}

Graphics.Shape.prototype.createInteractiveEditor = function(canvas) {

}

Graphics.Icon = function(factory) {
	this.factory = factory;
}

Graphics.Icon.create = function(parent) {
}

/* Circle */
Graphics.Circle = Graphics.Circle || {}

Graphics.Circle.Factory = function() {
	Graphics.ShapeFactory.call(this);
}

Graphics.Circle.Factory.prototype = Object
		.create(Graphics.ShapeFactory.prototype)

Graphics.Circle.Factory.prototype.createInteractiveInitializer = function(ui) {
	return new Graphics.Circle.InteractiveInitializer(ui);
}

Graphics.Circle.Icon = function(parent, factory) {
	Graphics.Icon.call(this, parent);

	this.element = document.createElementNS(Graphics.svgNS, "circle");
	this.element.cx.baseVal.value = 50;
	this.element.cy.baseVal.value = 50;
	this.element.r.baseVal.value = 50;
	this.element.factory = factory;

	parent.appendChild(this.element);
}

Graphics.Circle.Icon.prototype = Object.create(Graphics.Icon.prototype)

Graphics.Circle.Factory.prototype.createIcon = function(parent) {
	return new Graphics.Circle.Icon(parent, this);
}

Graphics.Circle.InteractiveEditorState = {
	beforeFirstPress : 1,
	afterFirstPress : 2,
	dragging : 3,
	shapeCreated : 4
};

Graphics.Circle.Shape =  function(ui, cx, cy, r) {
	Graphics.Shape.call(this, ui);

	this.cx = cx;
	this.cy = cy;
	this.r = r;
}

Graphics.Circle.Shape.prototype = Object.create(Graphics.Shape.prototype)


Graphics.Circle.Shape.prototype.create = function(parent) {
	this.element = document.createElementNS(Graphics.svgNS, "circle");
	this.element.cx.baseVal.value = this.cx;
	this.element.cy.baseVal.value = this.cy;
	this.element.r.baseVal.value = this.r;
	this.element.style.fill = "none";
	this.element.style.stroke = "black";

	this.element.shape = this;

	parent.appendChild(this.element)
}


Graphics.Circle.InteractiveInitializer = function(ui) {
	Graphics.InteractiveInitializer.call(this, ui);

	this.bb = document.createElementNS(Graphics.svgNS, "rect");
	this.bb.width.baseVal.value = 100;
	this.bb.height.baseVal.value = 100;
	this.bb.setAttribute("class", "interactive_bb");

	this.c = document.createElementNS(Graphics.svgNS, "circle");
	this.c.cx.baseVal.value = 50;
	this.c.cy.baseVal.value = 50;
	this.c.r.baseVal.value = 50;
	this.c.style.fill = "none";
	this.c.style.stroke = "black";

	ui.overlayCanvas.appendChild(this.bb);
	ui.overlayCanvas.appendChild(this.c);

	this.state = Graphics.Circle.InteractiveEditorState.beforeFirstPress;
}

Graphics.Circle.InteractiveInitializer.prototype = Object.create(Graphics.InteractiveInitializer.prototype);

Graphics.Circle.InteractiveInitializer.prototype.onMouse = function(evt) {
	switch (evt.type) {
	case "mousemove":
		switch (this.state) {
		case Graphics.Circle.InteractiveEditorState.beforeFirstPress:
			this.c.cx.baseVal.value = evt.worldX + this.c.r.baseVal.value;
			this.c.cy.baseVal.value = evt.worldY + this.c.r.baseVal.value;
			this.bb.x.baseVal.value = evt.worldX;
			this.bb.y.baseVal.value = evt.worldY;
			break;
		case Graphics.Circle.InteractiveEditorState.afterFirstPress:
			if (evt.moveX > 5 || evt.moveY > 5) {
				this.state = Graphics.Circle.InteractiveEditorState.dragging;
			}
			break;
		case Graphics.Circle.InteractiveEditorState.dragging:
			var bbX, bbY, bbWidth = 0, bbHeight = 0;

			if (evt.worldX > this.x) {
				bbX = this.x;
				bbWidth = evt.worldX - this.x;
			} else {
				bbX = evt.worldX;
				bbWidth = this.x - evt.worldX ;
			}

			if (evt.worldY > this.y) {
				bbY = this.y;
				bbHeight = evt.worldY - this.y;
			} else {
				bbY = evt.worldY;
				bbHeight = this.y - evt.worldY;
			}

			this.bb.x.baseVal.value = bbX;
			this.bb.y.baseVal.value = bbY;
			this.bb.width.baseVal.value = bbWidth;
			this.bb.height.baseVal.value = bbHeight;

			this.r = this.c.r.baseVal.value = Math.min(bbWidth, bbHeight) / 2;
			this.cx = this.c.cx.baseVal.value = bbX + Math.min(bbWidth, bbHeight) / 2;
			this.cy = this.c.cy.baseVal.value = bbY + Math.min(bbWidth, bbHeight) / 2;

			this.r = Math.min(bbWidth, bbHeight) / 2;

			break;
		}
		break;
	case "mousedown":
		switch (this.state) {
		case Graphics.Circle.InteractiveEditorState.beforeFirstPress:

			this.state = Graphics.Circle.InteractiveEditorState.afterFirstPress;
			this.x = evt.worldX;
			this.y = evt.worldY;

			this.r = 50;
			this.cx = this.x + this.r;
			this.cy = this.y + this.r;
			
			break;
		}
		break;
	case "mouseup":
		this.destroyElements();
		this.ui.insertShape(new Graphics.Circle.Shape(this.ui, this.cx, this.cy, this.r));
		this.ui.interactive = null;
		break;
	}
}

Graphics.Circle.InteractiveInitializer.prototype.onKey = function(evt) {
}

Graphics.Circle.InteractiveInitializer.prototype.destroyElements = function() {
	this.ui.overlayCanvas.removeChild(this.bb);
	this.ui.overlayCanvas.removeChild(this.c);
}

Graphics.circleFactory = new Graphics.Circle.Factory();
