Dialogs.StyleDialog = function() {
	Dialogs.Dialog.call(this, "Style");
	
}

Dialogs.StyleDialog.prototype = Object.create(Dialogs.Dialog.prototype);

Dialogs.StyleDialog.prototype.content = function(contentRoot) {
	this.tabManager = new Tabs.HTabManager(contentRoot);
	this.tabManager.addTab(new Dialogs.StyleDialog.FillTab());
	this.tabManager.addTab(new Dialogs.StyleDialog.StrokeTab());
}

Dialogs.StyleDialog.prototype.forceSize = function () {
	return { width: this.tabManager.width, height: this.tabManager.height} ;
}



Dialogs.StyleDialog.FillTab = function() {
	Tabs.Tab.call(this);
}

Dialogs.StyleDialog.FillTab.prototype.setTitle = function(parentElement) {
	parentElement.innerHTML = "Fill";
}

Dialogs.StyleDialog.FillTab.prototype.setContent = function(parentElement) {
	this.fillVtab = new Tabs.VTabManager(parentElement);
	this.fillVtab.addTab(new Dialogs.StyleDialog.SolidTab());
	this.fillVtab.addTab(new Dialogs.StyleDialog.GradientTab());
	this.fillVtab.addTab(new Dialogs.StyleDialog.HatchingTab());
	this.fillVtab.ll.addListener(function(src) { console.log("tab changed to " + src.getIndex()); });
}

Dialogs.StyleDialog.SolidTab = function() {
	Tabs.Tab.call(this);
}

Dialogs.StyleDialog.SolidTab.colorTable = ["white", "black", "red", "blue", "green", "yellow", "cyan", "magenta",
                                           "brown", "grey", "lightgrey", "lightblue", "lightgreen", "orange",
                                            ];

Dialogs.StyleDialog.SolidTab.prototype.setTitle = function(parentElement) {
	parentElement.innerHTML = "Solid";
}

Dialogs.StyleDialog.SolidTab.prototype.handleEvent = function(evt) {
	if (evt.currentTarget.bound_color) {
		this.button.style.backgroundColor = evt.currentTarget.bound_color;
	}
	if (evt.currentTarget == this.button) {
		
	}
}
Dialogs.StyleDialog.SolidTab.prototype.setContent = function(parentElement) {
	parentElement.innerHTML = "<button></button>Use color<input type=\"checkbox\"/>"
		+ "<table border=\"1\">"
		+ "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"
		+ "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"
		+ "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"
		+ "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"
		+ "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"
		+ "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"
		+ "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"
		+ "<tr><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td><td><div></div></td></tr>"
		+ "</table>";
	
	
	this.button = getChildByIndexes(parentElement, 0);
	this.button.style.width="4em";
	this.button.style.marginRight="1em";
	this.button.addEventListener("click", this, true);
	
	this.check = getChildByIndexes(parentElement, 1);
	
	

	var i, j, n = 0;
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			var div = getChildByIndexes(parentElement, 2, 0, i, j, 0);
			div.style.width = "1em";
			div.style.height = "1em";
			div.addEventListener("click", this, true)
			
			if (n < Dialogs.StyleDialog.SolidTab.colorTable.length) {
				div.style.backgroundColor = Dialogs.StyleDialog.SolidTab.colorTable[n];
				div.title = Dialogs.StyleDialog.SolidTab.colorTable[n];
				div.bound_color = Dialogs.StyleDialog.SolidTab.colorTable[n];
				n++;
			}
		}
	}
}

Dialogs.StyleDialog.GradientTab = function() {
	Tabs.Tab.call(this);
}

Dialogs.StyleDialog.GradientTab.prototype.setTitle = function(parentElement) {
	parentElement.innerHTML = "Gradient";
}

Dialogs.StyleDialog.GradientTab.prototype.setContent = function(parentElement) {
	parentElement.innerHTML = "<div>Gradient  editor - TBD; long content</div>";
}

Dialogs.StyleDialog.HatchingTab = function() {
	Tabs.Tab.call(this);
}

Dialogs.StyleDialog.HatchingTab.prototype.setTitle = function(parentElement) {
	parentElement.innerHTML = "Hatching";
}

Dialogs.StyleDialog.HatchingTab.prototype.setContent = function(parentElement) {
	parentElement.innerHTML = "<div>Hatching  editor - TBD</div>";
}


Dialogs.StyleDialog.StrokeTab = function() {
	Tabs.Tab.call(this);
}

Dialogs.StyleDialog.StrokeTab.prototype.setTitle = function(parentElement) {
	parentElement.innerHTML = "Stroke";
}

Dialogs.StyleDialog.StrokeTab.prototype.setContent = function(parentElement) {
	parentElement.innerHTML = "Stroke editor";
}
