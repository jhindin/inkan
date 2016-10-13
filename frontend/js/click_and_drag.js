/**
 * 
 */

AbstractClickAndDrag = function(window, element, callback, callbackArg) {
	this.element = element;
	this.window = window;
	this.callback = callback;
	this.callbackArg = callbackArg;
}

AbstractClickAndDrag.currentFocus = null;

AbstractClickAndDrag.prototype.rearrangeEvent = function(evt) {
	evt.clickAndDragTarget = this.element;

	evt.elementX = evt.clientX - this.element.getBoundingClientRect().left;
	evt.elementY = evt.clientY - this.element.getBoundingClientRect().top;

	if (this.pageX) { /* Dragging */
		evt.moveX = evt.pageX - this.pageX;
		evt.moveY = evt.pageY - this.pageY;
		evt.dragging = true;
	} else {
		evt.moveX = 0;
		evt.moveY = 0;
	}
}

AbstractClickAndDrag.prototype.propagateEvent = function(evt) {
	if (typeof this.callback == "function") {
		this.callback(evt, this.callbackArg);
	} else {
		if (this.callbackArg)
			this.callback[callbackArg](evt);
		else
			this.callback.handleEvent(evt);
	}
}

AbstractClickAndDrag.prototype.handleEvent = function(evt) {
	switch (evt.type) {
	case "mousedown":
		this.window.addEventListener("mousemove", this, false);
		this.window.addEventListener("mouseup", this, false);
		if (this.follow)
			this.element.removeEventListener("mousemove", this, false);

		this.pageX = evt.pageX;
		this.pageY = evt.pageY;

		this.clientX = evt.clientX;
		this.clientY = evt.clientY;
		this.window.document.documentElement.className += " unselectable";

		this.rearrangeEvent(evt);
		this.propagateEvent(evt);

		break;
	case "mousemove":
		this.rearrangeEvent(evt);
		this.propagateEvent(evt);
		break;
	case "mouseup":
		AbstractClickAndDrag.currentFocus = null;
		this.rearrangeEvent(evt);
		this.propagateEvent(evt);

		this.window.removeEventListener("mousemove", this, false);
		this.window.removeEventListener("mouseup", this, false);
		if (this.follow)
			this.element.addEventListener("mousemove", this, false);

		var classNames = this.window.document.documentElement.className
				.split(" ");
		classNames = classNames.filter(function(v) {
			return v != "unselectable"
		});
		this.window.document.documentElement.className = classNames.join(" ");

		this.pageX = undefined;
		this.pageY = undefined;
		this.clientX = undefined;
		this.clientX = undefined;
		this.elementX = undefined;
		this.elementY = undefined;

		break;
	}
	evt.stopPropagation();
	evt.preventDefault();
}

ClickAndDrag = function(window, element, callback, callbackArg) {
	AbstractClickAndDrag.call(this, window, element, callback, callbackArg);

	this.element.addEventListener("mousedown", this, false);
	this.follow = false;

}

ClickAndDrag.prototype = Object.create(AbstractClickAndDrag.prototype);

FollowClickAndDrag = function(window, element, callback, callbackArg) {
	AbstractClickAndDrag.call(this, window, element, callback, callbackArg);

	this.element.addEventListener("mousedown", this, false);
	this.element.addEventListener("mousemove", this, false);
	this.follow = true;

}
FollowClickAndDrag.prototype = Object.create(AbstractClickAndDrag.prototype);
