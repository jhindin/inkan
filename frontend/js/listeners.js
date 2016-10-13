ListenersList = function ListenersList(name, source) {
	if (typeof name != "string")
		throw new TypeError();
	
	this.name = name;
	this.source = source;
	this.objects = [];
	this.functions = [];
}

ListenersList.prototype.addListener = function(l) {
	if (typeof l == "function") {
		if (this.functions.indexOf(l) < 0)
			this.functions.push(l);
	} else if (typeof l == "object") {
		var f = l[this.name];
		if (f && typeof f == "function") {
			if (this.objects.indexOf(l) < 0) {
				this.objects.push(l);
			}
		} else {
			throw new TypeError();
		}
	}
}

ListenersList.prototype.removeListener = function(l) {
	if (typeof l == "function") {
		this.functions = this.functions.filter(function(v) { return v != l;});
	} else if (typeof l == "object") {
		this.objects = this.objects.filter(function(v) { return v != l;});
	}	
}

ListenersList.prototype.fire = function() {
	var functions = this.functions;
	var objects = this.objects;
	args = Array.prototype.slice.call(arguments);
	if (this.source)
		args.unshift(this.source);
	functions.map(function(f) { f.apply(null, args);});
	var cbName = this.name;
	objects.map(function(o) { var ff = o[cbName]; ff.apply(o, args);});
}

ChangeListenersList = function(source) {
	ListenersList.call(this, "changed", source);
}

ChangeListenersList.prototype = Object.create(ListenersList.prototype);
