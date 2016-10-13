/**
 * 
 */

ColorEditor = function(element, pair) {
	this.stroke = pair.stroke;
	this.fill = pair.fill;
	
	this.canvas = getChildByIndexes(element, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	
	this.colorsSVG = getChildByIndexes(element, 0, 0, 0, 0, 0, 1, 0, 0);
	this.strokeRect = getChildByIndexes(this.colorsSVG,  0);
	this.fillRect = getChildByIndexes(this.colorsSVG,  1);
	this.switchShape = getChildByIndexes(this.colorsSVG,  2, 2);
	this.switchShapeArea = getChildByIndexes(this.colorsSVG,  2);
	
	this.fillRect.editor = this;
	this.strokeRect.editor = this;
	this.switchShapeArea.editor = this;
	
	this.rSVG = getChildByIndexes(topEditorElement, 0, 0, 1, 0, 0, 0, 2, 0);
	this.gSVG = getChildByIndexes(topEditorElement, 0, 0, 1, 0, 0, 1, 2, 0);
	this.bSVG = getChildByIndexes(topEditorElement, 0, 0, 1, 0, 0, 2, 2, 0);
	this.hSVG = getChildByIndexes(topEditorElement, 0, 0, 1, 0, 0, 3, 2, 0);
	this.sSVG = getChildByIndexes(topEditorElement, 0, 0, 1, 0, 0, 4, 2, 0)
	this.vSVG = getChildByIndexes(topEditorElement, 0, 0, 1, 0, 0, 5, 2, 0)

	this.strokeRect.setAttribute("fill", "rgb(" + this.stroke.r + "," + this.stroke.g + "," + this.stroke.b +")")
	
	if (this.fill) {
		this.fillRect.setAttribute("fill", "rgb(" + this.fill.r + "," + this.fill.g + "," + this.fill.b +")");
		
		this.currentColor = this.fill;
		this.strokeRect.addEventListener("click", this.strokeRectClicked, false);
		this.fillRect.addEventListener("click", this.fillRectClicked, false);
		this.switchShapeArea.addEventListener("click", this.switchClicked, false);

		this.fill.ll.addListener(this);
	} else {
		this.currentColor = this.stroke;

		this.fillRect.setAttribute("fill", "lightgrey");
		this.fillRect.setAttribute("stroke", "lightgrey");
		this.switchShape.setAttribute("fill", "lightgrey");
		this.switchShape.setAttribute("stroke", "lightgrey");
		
		this.colorsSVG.removeChild(this.fillRect);
		this.colorsSVG.removeChild(this.switchShapeArea);
		this.colorsSVG.insertBefore(this.fillRect, this.colorsSVG.firstChild);
		this.colorsSVG.insertBefore(this.switchShapeArea, this.colorsSVG.firstChild);
	}
	
	this.hsvSlice = new HSVSlice(this.canvas,this.currentColor);
	this.rScroller = new ColorEditor.Scroller(this.rSVG, this.currentColor, "r", 255);
	this.gScroller = new ColorEditor.Scroller(this.gSVG, this.currentColor, "g", 255);
	this.bScroller = new ColorEditor.Scroller(this.bSVG, this.currentColor, "b", 255);
	
	this.hScroller = new ColorEditor.Scroller(this.hSVG, this.currentColor, "h", 255);
	this.sScroller = new ColorEditor.SatScroller(this.sSVG, this.currentColor, "s", 255);
	this.vScroller = new ColorEditor.Scroller(this.vSVG, this.currentColor, "v", 255);
	
	this.rText = new ColorEditor.Text(
			getChildByIndexes(element, 0, 0, 1, 0, 0, 0, 1, 0),
			this.currentColor, "r", 255);

	this.gText = new ColorEditor.Text(
			getChildByIndexes(element, 0, 0, 1, 0, 0, 1, 1, 0),
			this.currentColor, "g", 255);

	this.bText = new ColorEditor.Text(
			getChildByIndexes(element, 0, 0, 1, 0, 0, 2, 1, 0),
			this.currentColor, "b", 255);
	
	this.hText = new ColorEditor.Text(
			getChildByIndexes(element, 0, 0, 1, 0, 0, 3, 1, 0),
			this.currentColor, "h", 255);

	this.sText = new ColorEditor.Text(
			getChildByIndexes(element, 0, 0, 1, 0, 0, 4, 1, 0),
			this.currentColor, "s", 255);

	this.vText = new ColorEditor.Text(
			getChildByIndexes(element, 0, 0, 1, 0, 0, 5, 1, 0),
			this.currentColor, "v", 255);


	this.editors = [ this.hsvSlice, this.rScroller, this.gScroller, this.bScroller,
	                 this.hScroller, this.sScroller, this. vScroller, 
	                 this.rText, this.bText, this.gText,
	                 this.hText, this.sText, this.vText];

	this.stroke.ll.addListener(this);
}

ColorEditor.prototype.strokeRectClicked = function(evt)
{
	var editor = evt.currentTarget.editor;
	if (!editor)
		return;
	
	if (editor.currentColor == editor.stroke)
		return;
	
	editor.currentColor = editor.stroke;
	
	editor.setRectOrder(editor.fillRect, editor.strokeRect);
	
	for (i in editor.editors) {
		editor.editors[i].setColor(editor.currentColor);
	}
}

ColorEditor.prototype.fillRectClicked = function(evt)
{
	var editor = evt.currentTarget.editor;
	if (!editor)
		return;
	
	if (editor.currentColor == editor.fill)
		return;

	editor.currentColor = editor.fill;

	editor.setRectOrder(editor.strokeRect, editor.fillRect);
	
	for (i in editor.editors) {
		editor.editors[i].setColor(editor.currentColor);
	}
}

ColorEditor.prototype.switchClicked = function(evt)
{
	var editor = evt.currentTarget.editor;
	if (!editor)
		return;
	
	var tmp = editor.fill.rgb;
	editor.fill.rgb = editor.stroke.rgb;
	editor.stroke.rgb = tmp;
	
	editor.hsvSlice.color.rgb = editor.currentColor.rgb;
}

ColorEditor.prototype.setRectOrder = function(el1, el2)
{
	this.colorsSVG.removeChild(el1);
	this.colorsSVG.removeChild(el2);
	this.colorsSVG.insertBefore(el2, this.colorsSVG.firstChild);
	this.colorsSVG.insertBefore(el1, this.colorsSVG.firstChild);
}


ColorEditor.prototype.changed = function(src)
{
	if (src == this.fill) 
		this.fillRect.setAttribute("fill", "rgb(" + this.fill.r + "," + this.fill.g + "," + this.fill.b +")");
	else if (src == this.stroke)
		this.strokeRect.setAttribute("fill", "rgb(" + this.stroke.r + "," + this.stroke.g + "," + this.stroke.b +")");
}


ColorEditor.FieldEditor = function(element, color) {
	this.element = element;
	this.color = color;
	this.color.ll.addListener(this);
	this.changed();
}

ColorEditor.FieldEditor.prototype.setColor = function(color) {
	this.color.ll.removeListener(this);
	this.color = color;
	this.color.ll.addListener(this);
	this.changed()
}

ColorEditor.Text = function(text, color, component, range) {
	this.component = component;
	text.addEventListener("change", this, false)
	this.range = range;
	ColorEditor.FieldEditor.call(this, text, color);
}

ColorEditor.Text.prototype = Object.create(ColorEditor.FieldEditor.prototype);

ColorEditor.Text.prototype.changed = function() {
	this.element.value = this.color[this.component];
}

ColorEditor.Text.prototype.handleEvent = function(evt)
{
	if (!this.element.checkValidity()) {
		this.bg = this.element.style.background;
		this.element.style.background = "red";
		return;
	}
	this.element.style.background = this.bg;
	
	var v = parseInt(this.element.value);
	this.color[this.component] = v;
}

ColorEditor.Scroller = function(svg, color, component, range) {
	this.scroller = getChildByIndexes(svg, 2);
	this.component = component;
	this.range = range;
	ColorEditor.FieldEditor.call(this, svg, color);
	this.cd = new ClickAndDrag(window, svg, this);
}

ColorEditor.Scroller.prototype = Object.create(ColorEditor.FieldEditor.prototype);

ColorEditor.Scroller.prototype.changed = function() {
	this.scroller.transform.baseVal.getItem(0).matrix.e = this.color[this.component];
}

ColorEditor.Scroller.prototype.handleEvent = function(evt)
{
	var m = this.element.getScreenCTM();
	var p = this.element.createSVGPoint();
	
	
	p.x = evt.elementX;
	p.y = evt.elementY;
	p = p.matrixTransform(m.inverse());  
	

	p.x = evt.layerX;
	p.y = evt.layerY;
	p = p.matrixTransform(m.inverse());  
	
	
	var x = p.x;
	if (x < 0)
		x = 0;
	if (x > this.range)
		x = this.range;
	
	this.color[this.component] = Math.floor(x);

	this.scroller.transform.baseVal.getItem(0).matrix.e = x;
}

ColorEditor.SatScroller = function(svg, color, component, range)
{
	this.firstStop = getChildByIndexes(svg, 0, 1, 0);
	this.secondStop = getChildByIndexes(svg, 0, 1, 1);
	ColorEditor.Scroller.call(this, svg, color, component, range);
}

ColorEditor.SatScroller.prototype = Object.create(ColorEditor.Scroller.prototype);

ColorEditor.SatScroller.prototype.changed = function()
{
	ColorEditor.Scroller.prototype.changed.call(this);
	var hsv = this.color.hsv;
	var startRGB = hsv_to_rgb({h:hsv.h, s:0, v:255});
	var stopRGB = hsv_to_rgb({h:hsv.h, s:255, v:255});
	this.firstStop.setAttribute("stop-color", "rgb(" + startRGB.r + "," + startRGB.g + "," + startRGB.b +")");
	this.secondStop.setAttribute("stop-color", "rgb(" + stopRGB.r + "," + stopRGB.g + "," + stopRGB.b +")");
}

