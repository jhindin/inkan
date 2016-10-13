var Dialogs = Dialogs || {}
Dialogs.list = Dialogs.list || {}


Dialogs.Dialog = function(title) {
	this.dialog_window = window;
	this.external_window = null;
	this.document = this.dialog_window.document;

	this.dialog_root = this.document.createElement("div");
	this.dialog_root.setAttribute("class", "dialog");
	this.dialog_root.onmousedown = Dialogs.onMouseDown;

	closeContent = "<span style=\"float: right;"
			+ "margin:0;  padding: 0; width: 1em;\">"
			+ "<div style=\"display:inline-block; width: 1em; height: 1em;\">"
			+ "<svg class=\"svg_icon close\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"  viewBox=\"0 0 100 100\" style=\"width:1em; height:1em;\">"
			+ "<g  transform=\"rotate(45, 50, 50)\">"
			+ "<path d=\"M40,40 l0,-40 a10,10 0 0,1 20,0 l0,40  l40,0 a10,10 0 0,1 0,20 l-40,0 l0,40 a10,10 0 0,1 -20,0 l0,-40 l-40,0  a10,10 0 0,1 0,-20 Z\"/>"
			+ "</g></svg>"			
			+ "</div></span>"

	var dialogHTML = "<div class=\"unselectable\" style=\"display: block\">"
			+ closeContent
			+ "<span class=\"dialogTitle\" style=\"display: block; margin-right: "
			+ "1.2em"
			+ ";\">"
			+ title
			+ "</span>"
			+ "</div>"
			+ "<div class=\"dialogContentHolder\">"
			+ "</div>"
			+ "<div class=\"dialogFooter unselectable\"><span class=\"dialogButton\">OK</span>"
			+ (this.constructor.prototype.apply ? "<span class=\"dialogButton\">Apply</span>"
					: "") + "<span class=\"dialogButton\">Cancel</span></div>";

	this.dialog_root.innerHTML = dialogHTML;

	this.document.body.appendChild(this.dialog_root);
	
	this.dialog_root.dialog = this;
	this.moveElement = getChildByIndexes(this.dialog_root, 0,  1);

	this.dialog_root.addEventListener("click", this, false);

	this.closeButton = getChildByIndexes(this.dialog_root, 0, 0);
	this.closeButton.addEventListener("click", this, true);

	this.setDialogElements();

	this.click_and_drag = new ClickAndDrag(this.dialog_window,
			this.moveElement, this);

	this.dialog_root.style.left = ((this.document.body.clientWidth - this.dialog_root.clientWidth) / 2)
			+ "px";
	this.dialog_root.style.top = ((this.document.body.clientHeight - this.dialog_root.clientHeight) / 2)
			+ "px";
	this.internal = true;
}

Dialogs.Dialog.prototype.setDialogElements = function() {
	this.okButton = this.dialog_root.children[2].children[0];
	this.okButton.addEventListener("click", this, false);

	if (this.constructor.prototype.apply) {
		this.applyButton = this.dialog_root.children[2].children[1];
		this.cancelButton = this.dialog_root.children[2].children[2];

		this.applyButton.addEventListener("click", this, false);
		this.cancelButton.addEventListener("click", this, false);
	} else {
		this.cancelButton = this.dialog_root.children[2].children[1];

		this.cancelButton.addEventListener("click", this, false);
	}

	this.contentElement = this.dialog_root.children[1];
	this.content(this.contentElement);

	if (this.forceSize) {
		var size = this.forceSize();
		this.contentElement.style.width = size.width  + "px";
		this.contentElement.style.height = (size.height + 24) + "px";
	}
	

}

Dialogs.setRemovedProperty = function(element) {
	element.removed = true;

	for ( var i = 0; i < element.childNodes.length; i++) {
		var child = element.childNodes[i];
		Dialogs.setRemovedProperty(child);
	}
}

Dialogs.Dialog.prototype.cancel = function() {
	this.document.body.removeChild(this.dialog_root);
}

Dialogs.Dialog.prototype.ok = function() {
	this.document.body.removeChild(this.dialog_root);
}

Dialogs.Dialog.prototype.handleEvent = function(evt) {
	if (evt.target.removed)
		return;

	switch (evt.type) {
	case "mousedown":
		this.document.body.removeChild(this.dialog_root);
		this.document.body.appendChild(this.dialog_root);

		this.mouseX = evt.screenX;
		this.mouseY = evt.screenY;

		this.dialogX = this.dialog_root.offsetLeft;
		this.dialogY = this.dialog_root.offsetTop;
		break;
	case "mousemove":
	case "mousedown":
		var newLeft = this.dialogX + evt.screenX - this.mouseX;
		var newTop = this.dialogY + evt.screenY - this.mouseY;
		if (newLeft + this.dialog_root.clientWidth < (this.document.documentElement.clientWidth - 2)
				&& newTop + this.dialog_root.clientHeight < (this.document.documentElement.clientHeight - 2)
				&& newLeft > 2 && newTop > 2) {
			this.dialog_root.style.left = newLeft + "px";
			this.dialog_root.style.top = newTop + "px";
		}
		break;
	case "click":
		if (this.internal) {
			this.document.body.removeChild(this.dialog_root);
			this.document.body.appendChild(this.dialog_root);
		}

		switch (evt.currentTarget) {
		case this.okButton:
			console.log("Ok");
			this.ok();
			evt.stopPropagation();
			break;
		case this.applyButton:
			console.log("Apply");
			this.apply();
			evt.stopPropagation();
			break;
		case this.cancelButton:
			console.log("Cancel");
			this.cancel();
			evt.stopPropagation();
			break;
		case this.closeButton:
			this.cancel();
			evt.stopPropagation();
			break;
		default:
			break;
		}
	}
}

Dialogs.Dialog.prototype.content = function(contentRoot) {
	return "<div style=\"display:inline-block; width: 50em; height: 3em;\"> long dialog content</div>";
}
