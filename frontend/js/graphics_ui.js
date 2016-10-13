var GraphicsUI = GraphicsUI || {}

GraphicsUI.svgNS = "http://www.w3.org/2000/svg";
GraphicsUI.xlinkNS = "http://www.w3.org/1999/xlink";

GraphicsUI.DecorationElement =  function(ui, element) {
	this.ui = ui;
	this.element = element;
	this.visible = true;
}


GraphicsUI.DecorationElement.prototype.layout = function() {}
GraphicsUI.DecorationElement.prototype.name = function() { return "Undefined"; }
GraphicsUI.DecorationElement.prototype.viewChanged = function() {  }

GraphicsUI.Background = function(ui, element) {
	GraphicsUI.DecorationElement.call(this, ui, element);
}
GraphicsUI.Background.prototype = Object.create(GraphicsUI.DecorationElement.prototype);

GraphicsUI.Background.prototype.layout = function() 
{
	this.element.width.baseVal.value = this.ui.svg_width;
	this.element.height.baseVal.value = this.ui.svg_height;
}

GraphicsUI.Background.prototype.name = function() {
	return "Background";
}

GraphicsUI.Scrollbars = function(ui, element) {
	GraphicsUI.DecorationElement.call(this, ui, element);
	
	this.horizontalScrollbar = getChildByIndexes(element, 0);
	this.verticalScrollbar = getChildByIndexes(element, 1);
	this.horizontalScroller = getChildByIndexes(element, 2);
	this.verticalScroller = getChildByIndexes(element, 3);
}
GraphicsUI.Scrollbars.prototype = Object.create(GraphicsUI.DecorationElement.prototype);

GraphicsUI.Scrollbars.prototype.layout = function()
{
	this.horizontalScrollbar.y.baseVal.value = this.ui.svg_height - this.horizontalScrollbar.height.baseVal.value;
	this.horizontalScrollbar.width.baseVal.value = this.ui.svg_width - this.verticalScrollbar.width.baseVal.value;
	
	this.horizontalScroller.y.baseVal.value = this.horizontalScrollbar.y.baseVal.value +
		(this.horizontalScrollbar.height.baseVal.value - this.horizontalScroller.height.baseVal.value) / 2;
	
	this.verticalScrollbar.x.baseVal.value = this.ui.svg_width - this.verticalScrollbar.width.baseVal.value;
	this.verticalScrollbar.height.baseVal.value = this.ui.svg_height - this.horizontalScrollbar.height.baseVal.value;

	this.verticalScroller.x.baseVal.value = this.verticalScrollbar.x.baseVal.value +
		(this.verticalScrollbar.width.baseVal.value - this.verticalScroller.width.baseVal.value) / 2;

}

GraphicsUI.Scrollbars.prototype.viewChanged = function() {
	this.verticalScroller.height.baseVal.value = this.verticalScrollbar.height.baseVal.value * this.ui.heightAspect;
	this.horizontalScroller.width.baseVal.value = this.horizontalScrollbar.width.baseVal.value * this.ui.widthAspect;
	
	this.verticalScroller.y.baseVal.value = this.verticalScrollbar.y.baseVal.value - this.verticalScrollbar.height.baseVal.value * this.ui.worldRec.y1 / this.ui.worldHeight;
	this.horizontalScroller.x.baseVal.value = this.horizontalScrollbar.x.baseVal.value - this.horizontalScrollbar.width.baseVal.value * this.ui.worldRec.x1 / this.ui.worldWidth;
	
	this.verticalScrollerPixelScale = this.ui.worldHeight / this.verticalScrollbar.height.baseVal.value;
	this.horizontalScrollerPixelScale = this.ui.worldWidth / this.horizontalScrollbar.width.baseVal.value;
}

GraphicsUI.Scrollbars.prototype.handleEvent = function(evt) {
	if (evt.clickAndDragTarget) {
		switch (evt.clickAndDragTarget) {
		case this.verticalScroller:
			switch (evt.type) {
			case "mousedown":
				this.dragOriginX = this.ui.pan.x;
				this.dragOriginY = this.ui.pan.y;
				this.top = this.ui.worldRec.y1;
				this.bottom = this.ui.worldRec.y2 - this.ui.svg_height + this.horizontalScrollbar.height.baseVal.value;
				break;
			default:
				var deltaY = evt.moveY * this.verticalScrollerPixelScale;
				deltaY = Math.max(this.top, deltaY);
				deltaY = Math.min(this.bottom, deltaY);
				
				this.ui.pan = {x: this.dragOriginX,  y: this.dragOriginY - deltaY};
				break;
			}
			
			break;
		case this.horizontalScroller:
			switch (evt.type) {
			case "mousedown":
				this.dragOriginX = this.ui.pan.x;
				this.dragOriginY = this.ui.pan.y;
				this.left = this.ui.worldRec.x1;
				this.right = this.ui.worldRec.x2 -  this.ui.svg_width + + this.verticalScrollbar.width.baseVal.value;
				break;
			default:
				var deltaX = evt.moveX * this.horizontalScrollerPixelScale;
				deltaX = Math.max(this.left, deltaX);
				deltaX = Math.min(this.right, deltaX);
				
				this.ui.pan = {x: this.dragOriginX - deltaX,  y: this.dragOriginY};
				break;
			}
			break;
		default:
			//console.log(evt.type + " on unexpected element");
			break;
		}
		
		return;
	}
	
	switch (evt.type) {
	case "click":
		switch (evt.currentTarget) {
		case this.horizontalScrollbar:
			var evtX = evt.clientX -  this.ui.svg_element.getBoundingClientRect().left - this.horizontalScrollbar.x.baseVal.value;
			var currentPan = this.ui.pan;

			var deltaX; 
			if (evtX >= this.horizontalScroller.x.baseVal.value + this.horizontalScroller.width.baseVal.value) {
				deltaX = Math.min(this.ui.svg_width - this.verticalScrollbar.width.baseVal.value,
						this.ui.worldRec.x2 - this.ui.svg_width + this.verticalScrollbar.width.baseVal.value); 
			}

			if (evtX < this.horizontalScroller.x.baseVal.value)  {
				deltaX =  -Math.min(this.ui.svg_width - this.verticalScrollbar.width.baseVal.value ,
						- this.ui.worldRec.x1);
			}
			if (deltaX)
				this.ui.pan = {x: currentPan.x - deltaX, y:currentPan.y };
			
			break;
		case this.verticalScrollbar:
			var evtY = evt.clientY -  this.ui.svg_element.getBoundingClientRect().top - this.verticalScrollbar.y.baseVal.value;
			var currentPan = this.ui.pan;

			var deltaY; 
			if (evtY >= this.verticalScroller.y.baseVal.value + this.verticalScroller.height.baseVal.value) {
				deltaY = Math.min(this.ui.svg_height - this.horizontalScrollbar.height.baseVal.value,
						this.ui.worldRec.y2 - this.ui.svg_height + this.horizontalScrollbar.height.baseVal.value); 
			}

			if (evtY < this.verticalScroller.y.baseVal.value)  {
				deltaY =  -Math.min(this.ui.svg_height - this.horizontalScrollbar.height.baseVal.value ,
						- this.ui.worldRec.y1);
			}
			if (deltaY)
				this.ui.pan = {x: currentPan.x, y:currentPan.y - deltaY};
			break;
		}
	}
}

GraphicsUI.Grid = function(ui, element) {
	GraphicsUI.DecorationElement.call(this, ui, element);
	
	this.gridClipRect = getChildByIndexes(element, 0, 0, 0);
	this.clippedGrid = getChildByIndexes(element, 1, 0);
	this.gridVerticalLines = getChildByIndexes(this.clippedGrid,  0);
	this.gridHorizontalLines = getChildByIndexes(this.clippedGrid, 1);

	var gridPair;

	var x = 0;
	this.gridVerticalSet = [];
	var opacity;

	while (x < window.screen.availWidth + 200) {
		opacity = (x % 50) ? "0.1" : "0.2";

		gridPair = {black: this.createGridVerticalLine(x, "black", opacity),
				white: this.createGridVerticalLine(x+1, "white", opacity)};
		
		this.gridVerticalLines.appendChild(gridPair.black);
		this.gridVerticalLines.appendChild(gridPair.white);
		this.gridVerticalSet.push(gridPair);
		
		x += 10;
	}

	var y = 0;
	this.gridHorizontalSet = [];
	
	while (y < window.screen.availHeight + 200) {
		opacity = (y % 50) ? "0.1" : "0.2";
		
		gridPair = {black: this.createGridHorizontalLine(y, "black", opacity),
				white: this.createGridHorizontalLine(y+1, "white", opacity)};

		this.gridHorizontalLines.appendChild(gridPair.black);
		this.gridHorizontalLines.appendChild(gridPair.white);
		this.gridHorizontalSet.push(gridPair);

		y += 10;
	}	
}
GraphicsUI.Grid.prototype = Object.create(GraphicsUI.DecorationElement.prototype);

GraphicsUI.Grid.prototype.createGridVerticalLine = function(x, color, opacity)
{
	var vLine = document.createElementNS(GraphicsUI.svgNS, "line");

	vLine.setAttribute("x1", x);
	vLine.setAttribute("y1", 0);
	vLine.setAttribute("x2", x);
	vLine.setAttribute("y2", window.screen.availWidth);
	vLine.style.stroke = color;
	vLine.style.strokeWidth = 2;
	vLine.style.strokeOpacity = opacity;
	
	return vLine;
}

GraphicsUI.Grid.prototype.createGridHorizontalLine = function(y, color, opacity)
{
	var hLine;

	hLine = document.createElementNS(GraphicsUI.svgNS, "line");
	hLine.setAttribute("x1", 0);
	hLine.setAttribute("y1", y);
	hLine.setAttribute("x2", window.screen.availWidth);
	hLine.setAttribute("y2", y);
	hLine.style.strokeWidth = 2;
	hLine.style.stroke = color;
	hLine.style.strokeOpacity = opacity;

	
	return hLine;
	
}

GraphicsUI.Grid.prototype.viewChanged = function() {
	
	var i, x, y;
	
	if (this.ui.z != this.z) {
		for (i = 0; i < this.gridHorizontalSet.length; i++) {
			y = this.ui.z * i * 10 / this.ui.scale;
	
			this.gridHorizontalSet[i].black.y1.baseVal.value = y; 
			this.gridHorizontalSet[i].black.y2.baseVal.value = y;
	
			this.gridHorizontalSet[i].white.y1.baseVal.value = y + 1; 
			this.gridHorizontalSet[i].white.y2.baseVal.value = y + 1;
		}

		for (i = 0; i < this.gridVerticalSet.length; i++) {
		    x = this.ui.z * i * 10 / this.ui.scale;
		    
		    this.gridVerticalSet[i].black.x1.baseVal.value = x; 
		    this.gridVerticalSet[i].black.x2.baseVal.value = x;
	
		    this.gridVerticalSet[i].white.x1.baseVal.value = x + 1; 
		    this.gridVerticalSet[i].white.x2.baseVal.value = x + 1;
		}
		this.z = this.ui.z;
	}
	
	
	var hShift = this.ui.pan.x;
	
	
	hShift %= 50 * this.ui.z / this.ui.scale;
	hShift -= 50 * this.ui.z  / this.ui.scale;
	
	this.clippedGrid.transform.baseVal.getItem(0).matrix.e = hShift;
	
	var vShift = this.ui.pan.y;

	vShift %= 50 * this.ui.z / this.ui.scale;
	vShift -= 50 * this.ui.z / this.ui.scale;
	
	this.clippedGrid.transform.baseVal.getItem(0).matrix.f = vShift;
}

GraphicsUI.Grid.prototype.layout = function() {
	var gridWidth = this.ui.svg_width;
	if (this.ui.decorations.scrollbars.visible)
		gridWidth -= this.ui.decorations.scrollbars.verticalScrollbar.getBBox().width;
	if (this.ui.decorations.rulers.visible)
		gridWidth -= this.ui.decorations.rulers.vRulerGroup.getBBox().width;
	
	this.gridClipRect.width.baseVal.value = gridWidth;
	
	var gridHeight = this.ui.svg_height;
	if (this.ui.decorations.scrollbars.visible)
		gridHeight -= this.ui.decorations.scrollbars.horizontalScrollbar.getBBox().height;
	if (this.ui.decorations.rulers.visible)
		gridHeight -= this.ui.decorations.rulers.hRulerGroup.getBBox().height;
	
	this.gridClipRect.height.baseVal.value = gridHeight;
	
	
}

GraphicsUI.Rulers = function(ui, element) {
	GraphicsUI.DecorationElement.call(this, ui, element);
	
	this.hRulerGroup = getChildByIndexes(element, 1);
	this.hRulerAndNumbers = getChildByIndexes(this.hRulerGroup, 0);
	this.hNumbers = getChildByIndexes(this.hRulerAndNumbers, 0);
	this.hRuler = getChildByIndexes(this.hRulerAndNumbers, 1);
	this.hRulerClipRect = getChildByIndexes(element, 0, 2, 0);
	
	this.vRulerGroup = getChildByIndexes(element, 2)
	this.vRulerAndNumbers = getChildByIndexes(this.vRulerGroup, 0);
	this.vNumbers = getChildByIndexes(this.vRulerAndNumbers, 0);
	this.vRuler = getChildByIndexes(this.vRulerAndNumbers, 1);
	this.vRulerClipRect = getChildByIndexes(element, 0, 3, 0);

	
	var x = 0;
	this.hLabels = [];
	
	while (x < window.screen.availWidth + 200) {
		var hSegment = document.createElementNS(GraphicsUI.svgNS, "use");
		hSegment.setAttributeNS(null, "x", x);
		hSegment.setAttributeNS(null, "y", 0);
		hSegment.setAttributeNS(GraphicsUI.xlinkNS, "href", "#hSegment");
		this.hRuler.appendChild(hSegment);
		
		var hLabel = document.createElementNS(GraphicsUI.svgNS, "text");
		hLabel.setAttribute("y", -12);
		var textNode = document.createTextNode(x - 50);
		hLabel.appendChild(textNode);
		

		this.hNumbers.appendChild(hLabel);
		hLabel.setAttribute("x", x - hLabel.getBBox().width / 2 );
		this.hLabels.push(hLabel);

		x += 50;
	}
	
	var y = 0;
	this.vLabels = [];

	while (y < window.screen.availHeight + 200) {
		var vSegment = document.createElementNS(GraphicsUI.svgNS, "use");
		vSegment.setAttributeNS(null, "x", 0);
		vSegment.setAttributeNS(null, "y", y);
		vSegment.setAttributeNS(GraphicsUI.xlinkNS, "href", "#vSegment");
		this.vRuler.appendChild(vSegment);
		
		var vLabel = document.createElementNS(GraphicsUI.svgNS, "text");
		vLabel.setAttribute("x", 0);
		vLabel.setAttribute("y", 0 );
		var textNode = document.createTextNode(y - 50);
		vLabel.appendChild(textNode);

		this.vNumbers.appendChild(vLabel);
		vLabel.setAttribute("transform", "rotate(-90, 0 0) translate(" + (-y) + ", -12)");
		
		vLabel.transform.baseVal.getItem(1).matrix.e -=  vLabel.getBBox().width / 2;
		
		this.vLabels.push(vLabel);

		y += 50;
	}	
}
GraphicsUI.Rulers.prototype = Object.create(GraphicsUI.DecorationElement.prototype);

GraphicsUI.Rulers.prototype.viewChanged = function() {
	this.hRuler.transform.baseVal.getItem(0).matrix.a = this.ui.z / this.ui.scale;
	
	var hShift = this.ui.pan.x;
	
	
	hShift %= 50 * this.ui.z / this.ui.scale;
	hShift -= 50 * this.ui.z  / this.ui.scale;
	
	this.repositionHNumbers();

	this.hRulerAndNumbers.transform.baseVal.getItem(0).matrix.e = hShift;
	

	this.vRuler.transform.baseVal.getItem(0).matrix.d = this.ui.z / this.ui.scale;
	
	var vShift = this.ui.pan.y;

	vShift %= 50 * this.ui.z / this.ui.scale;
	vShift -= 50 * this.ui.z / this.ui.scale;
	
	this.repositionVNumbers();
	
	this.vRulerAndNumbers.transform.baseVal.getItem(0).matrix.f = vShift; 

	
}

GraphicsUI.Rulers.prototype.layout = function() {
	this.hRulerAndNumbers.transform.baseVal.getItem(0).matrix.f = this.ui.svg_height  -
	    (this.ui.decorations.scrollbars.visible ? this.ui.decorations.scrollbars.horizontalScrollbar.getBBox().height : 0);

    this.vRulerAndNumbers.transform.baseVal.getItem(0).matrix.e = this.ui.svg_width  -
        (this.ui.decorations.scrollbars.visible ? this.ui.decorations.scrollbars.verticalScrollbar.getBBox().width : 0);

    this.hRulerClipRect.x.baseVal.value = 0;
    this.hRulerClipRect.y.baseVal.value = this.hRulerGroup.getBBox().y;
    this.hRulerClipRect.width.baseVal.value = this.ui.svg_width -
	    this.vRulerGroup.getBBox().width - (this.ui.decorations.scrollbars.visible ? this.ui.decorations.scrollbars.verticalScrollbar.getBBox().width : 0);
    this.hRulerClipRect.height.baseVal.value = this.hRulerGroup.getBBox().height;

    this.vRulerClipRect.y.baseVal.value = 0;
    this.vRulerClipRect.x.baseVal.value = this.vRulerGroup.getBBox().x;
    this.vRulerClipRect.width.baseVal.value = this.vRulerGroup.getBBox().width;
    this.vRulerClipRect.height.baseVal.value = this.ui.svg_height -
	    this.hRulerGroup.getBBox().height - (this.ui.decorations.scrollbars.visible ? this.ui.decorations.scrollbars.horizontalScrollbar.getBBox().height : 0);
}

GraphicsUI.Rulers.prototype.repositionHNumbers = function()
{
	var e = this.ui.pan.x  / this.ui.z;
	var d = 50 / this.ui.scale;
	var numberBase =  (-( e - e % d)  - d);
	
	for (var i = 0; i < this.hLabels.length; i++) {
		var hLabel = this.hLabels[i];
		
		hLabel.textContent = numberBase +  i * 50 / this.ui.scale;
		hLabel.x.baseVal.getItem(0).value =  this.ui.z * i * 50 / this.ui.scale  - hLabel.getBBox().width / 2;
	}
}

GraphicsUI.Rulers.prototype.repositionVNumbers = function()
{
	var f = this.ui.pan.y  / this.ui.z;
	var d = 50 / this.ui.scale;
	var numberBase =  (-( f - f % d)  - d);
	
	for (var i = 0; i < this.vLabels.length; i++) {
		var vLabel = this.vLabels[i];
		
		vLabel.textContent =  (numberBase +  i * 50 / this.ui.scale);
		vLabel.transform.baseVal.getItem(1).matrix.e = -this.ui.z * i * 50 / this.ui.scale + - vLabel.getBBox().width  / 2;
		
	}
}

GraphicsUI.Panner = function(ui, element) {
	GraphicsUI.DecorationElement.call(this, ui, element);
	
	this.pannerGroup = getChildByIndexes(element, 0);
	this.pannerDecorations = getChildByIndexes(this.pannerGroup, 0);
	this.pannerCloseIcon = getChildByIndexes(this.pannerGroup, 1);
	this.pannerContent = getChildByIndexes(this.pannerGroup, 2);
	this.pannerBackground =  getChildByIndexes(this.pannerContent, 0);
	this.pannerViewport = getChildByIndexes(this.pannerContent, 1);

	var fontSizeString = window.getComputedStyle(element, null).getPropertyValue("font-size");
	var fontSize = parseInt(fontSizeString);
	
	this.pannerDecorations.width.baseVal.value = fontSize * 8 + 8;
	this.pannerDecorations.height.baseVal.value = fontSize * 9 + 12;
	
	this.pannerContent.transform.baseVal.getItem(0).matrix.f = fontSize + 8;
	this.pannerContent.transform.baseVal.getItem(0).matrix.e = 4;
	this.pannerContent.transform.baseVal.getItem(0).matrix.a = fontSize * 8 / 100;
	this.pannerContent.transform.baseVal.getItem(0).matrix.d = fontSize * 8 / 100;
	
	var pannerCloseCross = getChildByIndexes(this.pannerCloseIcon, 1);
	this.pannerCloseBackground = getChildByIndexes(this.pannerCloseIcon, 0);

	this.pannerCloseIcon.transform.baseVal.getItem(1).matrix.a = fontSize / 100 ;
	this.pannerCloseIcon.transform.baseVal.getItem(1).matrix.d = fontSize / 100;
	
	this.pannerCloseIcon.transform.baseVal.getItem(0).matrix.f = 4;
	this.pannerCloseIcon.transform.baseVal.getItem(0).matrix.e = fontSize * 7 + 4;	
	
	this.pannerCloseBackground.addEventListener("click", this, true);
	this.pannerCD = new ClickAndDrag(window, this.pannerViewport, this); 
	
	this.pixelRatio =  fontSize * 8 / 100 ;
}

GraphicsUI.Panner.prototype = Object.create(GraphicsUI.DecorationElement.prototype);

GraphicsUI.Panner.prototype.layout = function() {
	var x = this.ui.svg_width - this.element.getBBox().width;
	var y = this.ui.svg_height - this.element.getBBox().height;

	if (this.ui.decorations.scrollbars.visible) {
		x -= this.ui.decorations.scrollbars.verticalScrollbar.getBBox().width;
		y -= this.ui.decorations.scrollbars.horizontalScrollbar.getBBox().height;
	}
	
	if (this.ui.decorations.rulers.visible) {
		x -= this.ui.decorations.rulers.vRulerGroup.getBBox().width;
		y -= this.ui.decorations.rulers.hRulerGroup.getBBox().height;
	}
	
	this.pannerGroup.transform.baseVal.getItem(0).matrix.e = x;
	this.pannerGroup.transform.baseVal.getItem(0).matrix.f = y;
}

GraphicsUI.Panner.prototype.viewChanged = function() {
	this.pannerViewport.width.baseVal.value = this.ui.widthAspect * 100;
	this.pannerViewport.height.baseVal.value = this.ui.heightAspect * 100;
	
	this.pannerViewport.x.baseVal.value = - 100 * this.ui.worldRec.x1 / this.ui.worldWidth;
	this.pannerViewport.y.baseVal.value =  - 100 * this.ui.worldRec.y1 / this.ui.worldHeight;
}


GraphicsUI.Panner.prototype.handleEvent = function(evt) {
	if (evt.target == this.pannerCloseBackground) {
		this.ui.hide("panner");
		return true;
	}
	
	var contentMatrix = this.pannerContent.transform.baseVal.getItem(0).matrix;

	if (evt.type == "mousedown") {
		this.pan = this.ui.pan;
		this.x = this.pannerViewport.x.baseVal.value;
		this.y = this.pannerViewport.y.baseVal.value;

		this.width = this.pannerViewport.width.baseVal.value;
		this.height = this.pannerViewport.height.baseVal.value;
		this.worldWidth = this.ui.worldWidth;
		this.worldHeight = this.ui.worldHeight;
	} else {
		var pannerX = this.x + evt.moveX / this.pixelRatio;
		var pannerY = this.y + evt.moveY/ this.pixelRatio;

		pannerX = Math.max(0, pannerX);
		pannerX = Math.min(100 - this.width, pannerX);
		
		pannerY = Math.max(0, pannerY);
		pannerY = Math.min(100 - this.height, pannerY);

		var moveX = pannerX - this.x;
		var moveY = pannerY - this.y;  
		
		var newPan = {}
		newPan.x =  this.pan.x - moveX  * (this.worldWidth / 100 );
		newPan.y =  this.pan.y - moveY  * (this.worldHeight / 100);
		
		this.ui.pan = newPan; 
	}
}

GraphicsUI.UI = function(svg_element) {
	
	this.svg_element = svg_element;
	this.interactive = null;
	this.parentElement = svg_element.parentElement;
	
	this.resize();

	this.decorations = {};

	this.backgroundElement = getChildByIndexes(svg_element, 1);
	this.decorations.background = new GraphicsUI.Background(this, this.backgroundElement);

	this.contentCanvas = getChildByIndexes(svg_element, 2);
	this.overlayCanvas = getChildByIndexes(svg_element, 3);
	this.decorationsRoot = getChildByIndexes(svg_element, 4);
	
	this.decorations.grid = new GraphicsUI.Grid(this, getChildByIndexes(this.decorationsRoot, 0));
	this.decorations.scrollbars = new GraphicsUI.Scrollbars(this, getChildByIndexes(this.decorationsRoot, 1));
	this.decorations.rulers = new GraphicsUI.Rulers(this, getChildByIndexes(this.decorationsRoot, 2));
	this.decorations.panner = new GraphicsUI.Panner(this, getChildByIndexes(this.decorationsRoot, 3));
	
	this.decorationVisibilityLL = new ListenersList("decorationVisibility", this);
	this.pannedLL = new ListenersList("panned", this);
	this.zoomedLL = new ListenersList("zoomed", this);
	this.viewChangedLL = new ListenersList("viewChanged", this);
	
	this.forDecorations("layout");
	
	this.viewChanged();
	
	this.contentCD = new FollowClickAndDrag(window, this.backgroundElement, this);

	if (BrowserID.browser == "ff")
		this.svg_element.addEventListener("wheel", this, false);
	else
		this.svg_element.addEventListener("mousewheel", this, false);
	
	window.addEventListener("keydown", this, false);
	
	this.decorations.scrollbars.verticalScrollbarCD = new ClickAndDrag(window, this.decorations.scrollbars.verticalScroller, this.decorations.scrollbars);
	this.decorations.scrollbars.horizontalScrollbarCD = new ClickAndDrag(window, this.decorations.scrollbars.horizontalScroller, this.decorations.scrollbars);
	this.decorations.scrollbars.horizontalScrollbar.addEventListener("click", this.decorations.scrollbars, false);
	this.decorations.scrollbars.verticalScrollbar.addEventListener("click", this.decorations.scrollbars, false);
	
	window.addEventListener("resize", this, false);
	
	
	this.upload = { ui:this, handleEvent:function(evt) { this.ui.exec_upload(evt); }};
	this.fullView = { ui:this, handleEvent:function(evt) { this.ui.exec_fullView(evt); }};
	this.style = { ui:this, handleEvent:function(evt) { this.ui.exec_style(evt); }};
	
	
	
	/* Temporary code - show content BB */
	var bb = this.contentCanvas.getBBox();
	bbRect = getChildByIndexes(this.overlayCanvas, 0);
	bbRect.x.baseVal.value = bb.x;
	bbRect.y.baseVal.value = bb.y;
	bbRect.width.baseVal.value = bb.width;
	bbRect.height.baseVal.value = bb.height;
	
}

GraphicsUI.UI.prototype.resize = function() {
	this.svg_element.style.width = "";
	this.svg_element.style.height = "";

	this.svg_width = this.svg_element.parentNode.clientWidth;
	this.svg_height = this.svg_element.parentNode.clientHeight;
	
	if (BrowserID.browser == "ie") {
		this.svg_width -= 30;
		this.svg_height -= 30;
	}
			


	this.svg_element.style.width = this.svg_width + "px";
	this.svg_element.style.height = this.svg_height + "px";

	this.svg_element.viewBox.baseVal.width = this.svg_width;
	this.svg_element.viewBox.baseVal.height = this.svg_height;
}

GraphicsUI.UI.prototype.insertShape = function(shape) {
	shape.create(this.contentCanvas);
}

GraphicsUI.UI.prototype.setWorldCoordinates = function(evt) {
	var m = this.overlayCanvas.transform.baseVal.getItem(0).matrix;
	var p = this.svg_element.createSVGPoint();
	
	p.x = evt.elementX;
	p.y = evt.elementY;
	p = p.matrixTransform(m.inverse()); 
	
	evt.worldX = p.x;
	evt.worldY = p.y;
}

GraphicsUI.UI.prototype.handleEvent = function(evt) {
	switch (evt.type) {
	case "mousedown":
		if (this.interactive) {
			this.setWorldCoordinates(evt);
			this.interactive.onMouse(evt, null);
		} else {
			this.dragStartPan = Object.create(this.pan);
		}
		break;
	case "mousemove":
	case "mouseup":
		if (this.interactive) {
			this.setWorldCoordinates(evt);
			this.interactive.onMouse(evt, null);
		} else {
			if (evt.dragging)
				this.pan = {x:this.dragStartPan.x + evt.moveX, y: this.dragStartPan.y + evt.moveY };
		}
		break;
	case "mousewheel":
		var d = evt.wheelDelta/120;
		this.z *= Math.pow(1.2, d);
		break;
	case "wheel":
		var d = evt.deltaY/3;
		this.z *= Math.pow(1.2, d);
		evt.stopPropagation();
		evt.preventDefault();
		break;
	case "keydown":
		if (this.interactive) {
			if (evt.keyCode == 27) {
				this.interactive.destroyElements();
				this.interactive = null;
			} else {
				this.interactive.onKey(evt, null);
			}
		}
		break;
	case "resize":
		this.resize();
		this.forDecorations("layout");
		this.forDecorations("viewChanged");
		break;
	}
}

GraphicsUI.UI.prototype.show = function(decoration)
{
	var decorationObject = this.decorations[decoration];
	if (!decorationObject)
		return;
	decorationObject.element.style.display = "inline";
	decorationObject.visible = true;
	
	this.forDecorations("layout");
	this.decorationVisibilityLL.fire();
}

GraphicsUI.UI.prototype.hide = function(decoration)
{
	var decorationObject = this.decorations[decoration];
	if (!decorationObject)
		return;
	decorationObject.element.style.display = "none";
	decorationObject.visible = false;

	this.forDecorations("layout");
	this.decorationVisibilityLL.fire();
}

GraphicsUI.UI.setInteractive = function(interactive) {
	this.interactive = interactive;
}

Object.defineProperties(GraphicsUI.UI.prototype, {
	pan: {
		set: function(value) {
			if (typeof value != "object")
				throw new TypeError("Argment is not an object");
			if (! ("x" in value) || ! ("y" in value))
				throw new TypeError("Argument is not a coordinate pair");

			this.contentCanvas.transform.baseVal.getItem(0).matrix.e = value.x;
			this.overlayCanvas.transform.baseVal.getItem(0).matrix.e = value.x;

			this.contentCanvas.transform.baseVal.getItem(0).matrix.f = value.y;
			this.overlayCanvas.transform.baseVal.getItem(0).matrix.f = value.y;
			
			this.viewChanged();
		},
		get: function() {
			return {x: this.contentCanvas.transform.baseVal.getItem(0).matrix.e,
				y:  this.contentCanvas.transform.baseVal.getItem(0).matrix.f};
			
		}
	},
	z: {
		set: function(value) {
			if (typeof value != "number")
				throw new TypeError("Argment is not a number");
			if (value == 0)
				throw new RangeError("Zoom can't be zero");
			
			var deltaZ = value/this.contentCanvas.transform.baseVal.getItem(0).matrix.a;
			
			var currentPan = this.pan;
			var centerX = (this.svg_width - 
				(this.decorations.scrollbars.visible ? this.decorations.scrollbars.verticalScrollbar.width.baseVal.value : 0))/2;
			var centerY = (this.svg_height - 
					(this.decorations.scrollbars.visible ? this.decorations.scrollbars.horizontalScrollbar.height.baseVal.value : 0))/2;
			
			this.pan = { x: centerX - (centerX - currentPan.x) * deltaZ, 
					y: centerY - (centerY - currentPan.y) * deltaZ}; 

			this.contentCanvas.transform.baseVal.getItem(0).matrix.a = value;
			this.contentCanvas.transform.baseVal.getItem(0).matrix.d = value;

			this.overlayCanvas.transform.baseVal.getItem(0).matrix.a = value;
			this.overlayCanvas.transform.baseVal.getItem(0).matrix.d = value;
			
			this.viewChanged();
			
		},
		get: function() {
			return this.contentCanvas.transform.baseVal.getItem(0).matrix.a;
		}
	}
	
});

GraphicsUI.UI.prototype.viewChanged = function()
{
	var bb = this.contentCanvas.getBBox();
	var viewMatrix = this.contentCanvas.transform.baseVal.getItem(0).matrix;
	var topLeft = main_svg_area.createSVGPoint();
	topLeft.x = bb.x;
	topLeft.y = bb.y;
	
	topLeft = topLeft.matrixTransform(viewMatrix);
	
	var bottomRight = this.svg_element.createSVGPoint();
	bottomRight.x = bb.x + bb.width;
	bottomRight.y = bb.y + bb.height;
	bottomRight = bottomRight.matrixTransform(viewMatrix);
	
	this.worldRec = {x1: Math.min(topLeft.x, 0), y1: Math.min(0, topLeft.y),
			x2: Math.max(bottomRight.x, this.svg_width), y2: Math.max(bottomRight.y, this.svg_height) };
	this.worldWidth = this.worldRec.x2 - this.worldRec.x1;
	this.worldHeight = this.worldRec.y2 - this.worldRec.y1;
	
	this.widthAspect = Math.min(1, this.svg_width / this.worldWidth  );
	this.heightAspect = Math.min(1, this.svg_height / this.worldHeight );
	
	this.factor = Math.floor(Math.log(viewMatrix.a) / Math.log(5));
	this.scale =  Math.pow(5, this.factor);
	
	this.forDecorations("viewChanged");
}

GraphicsUI.UI.prototype.forDecorations = function(f) {
	for (var p in this.decorations) {
		var decoration = this.decorations[p];
		if (!decoration.visible)
			continue;
		var ff = decoration[f];
		ff.apply(decoration);
	}
}



GraphicsUI.UI.prototype.exec_fullView = function(ui)
{
	var bbox = this.contentCanvas.getBBox();
	
	var matrix = this.svg_element.createSVGMatrix();
	
	var width = this.svg_width;
	if (this.decorations.scrollbars.visible)
		width -= this.decorations.scrollbars.verticalScrollbar.getBBox().width;
	if (this.decorations.rulers.visible)
		width -= this.decorations.rulers.vRulerGroup.getBBox().width;
	
	var height = this.svg_height;
	if (this.decorations.scrollbars.visible)
		height -= this.decorations.scrollbars.horizontalScrollbar.getBBox().height;
	if (this.decorations.rulers.visible)
		height -= this.decorations.rulers.hRulerGroup.getBBox().height;
	
	var widthRatio = width / bbox.width;
	var heightRatio = height / bbox.height;
	var ratio = matrix.a = matrix.d = Math.min(widthRatio, heightRatio);
	matrix.e = -bbox.x * ratio;
	matrix.f = -bbox.y * ratio;
	
	this.contentCanvas.transform.baseVal.getItem(0).setMatrix(matrix);
	this.overlayCanvas.transform.baseVal.getItem(0).setMatrix(matrix);
	
	this.viewChanged();
	
}


GraphicsUI.UI.prototype.fillLowToolbar = function(lowToolbarElement)
{
	this.lowToolbarElement = lowToolbarElement;
	
}


GraphicsUI.UI.prototype.exec_upload = function(evt)
{
	alert("Upload not yet implemented");
}

GraphicsUI.UI.prototype.exec_style = function(evt)
{
	this.styleDialog = new Dialogs.StyleDialog();
}
/* Temporary code - create circle */

GraphicsUI.UI.factories = [ { name:"Shapes", factories:[GraphicsUI.circleFactory]}];

	


