var StyleAttributes = StyleAttributes || {}

StyleAttributes.ComponentColor = function() {
	this.ll = new ChangeListenersList(this);

	if (arguments.length == 1) {
		var arg = arguments[0];
		if (typeof arg != "object") 
			throw new TypeError("Argument is not an object");
		
		if (arg["r"] != null && arg["g"] != null && arg["b"] != null) {
			this._rgb = arg;
		}

		if (arg["h"] != null && arg["s"] != null && arg["v"] != null) {
			this._hsv = arg;
		}
	} else if (arguments.length == 0) {
		this._rgb = { r: 127, g: 255, b: 255};
	}
	if (!this._rgb && !this._hsv) 
		throw new TypeError("Argument is not a color triplet");
}

StyleAttributes.ComponentColor.prototype.getHSVProperty = function() {
	if (!this._hsv)
		this._hsv = rgb_to_hsv(this._rgb);
	
	if (arguments.length == 0)
		return this._hsv;

	return this._hsv[arguments[0]];
}

StyleAttributes.ComponentColor.prototype.getRGBProperty = function() {
	if (!this._rgb)
		this._rgb = hsv_to_rgb(this._hsv);
	
	if (arguments.length == 0)
		return this._rgb;

	return this._rgb[arguments[0]];
}

StyleAttributes.ComponentColor.prototype.setHSVProperty = function(key, value) {
	if (!this._hsv)
		this._hsv = rgb_to_hsv(this._rgb);
	
	if (this._hsv[key] == value)
		return;
	
	this._hsv[key] = value;
	this._rgb = null;
	
	this.fireChange();
}

StyleAttributes.ComponentColor.prototype.setRGBProperty = function(key, value) {
	if (!this._rgb)
		this._rgb = hsv_to_rgb(this._hsv);
	
	if (this._rgb[key] == value)
		return;
	
	this._rgb[key] = value;
	this._hsv = null;
	
	this.fireChange();
}

StyleAttributes.ComponentColor.prototype.fireChange = function() {
	this.ll.fire();
}

Object.defineProperties(StyleAttributes.ComponentColor.prototype, {
	h: { 
		set: function(value) {
			this.setHSVProperty("h", value);
		},
		get: function() {
			return this.getHSVProperty("h");
		}
	},

	s: { 
		set: function(value) {
			this.setHSVProperty("s", value);
		},
		get: function() {
			return this.getHSVProperty("s");
		}
	},

	v: { 
		set: function(value) {
			this.setHSVProperty("v", value);
		},
		get: function() {
			return this.getHSVProperty("v");
		}
	},
	
	r: { 
		set: function(value) {
			this.setRGBProperty("r", value);
		},
		get: function() { 
			return this.getRGBProperty("r");
		}
	},

	g: { 
		set: function(value) {
			this.setRGBProperty("g", value);
		},
		get: function() { 
			return this.getRGBProperty("g");
		}
	},
	
	b: { 
		set: function(value) {
			this.setRGBProperty("b", value);
		},
		get: function() { 
			return this.getRGBProperty("b");
		}
	},

	rgb: {
		set: function(value) { 
			if (value["r"] == null || value["g"] == null || value["b"] == null) 
				throw new TypeError("The value is not RGB triplet");
			
			if (this._rgb && value.r == this._rgb.r && value.g == this._rgb.g &&
					value.b == this._rgb.b)
				return;
			
			this._rgb = value;
			this._hsv = null;
			this.fireChange();
		},
		get: function() { return  this.getRGBProperty(); }
	},

	hsv: {
		set: function(value) { 
			if (value["h"] == null || value["s"] == null || value["v"] == null)
				throw new TypeError("The value is not HSV triplet");
			
			if (this._hsv && value.h == this._hsv.h && value.s == this._hsv.s &&
					value.v == this._hsv.v)
				return;

			this._hsv = value;
			this._rgb = null;
			this.fireChange();
		},
		get: function() { return this.getHSVProperty();}
	}
})

function rgb_to_hsv(rgb) {
	var hsv = {};
	
	var M = Math.max(rgb.r, rgb.g, rgb.b);
	var m = Math.min(rgb.r, rgb.g, rgb.b);
	var c = M - m;
	
	if (c) {
		switch (M) {
		case rgb.r:
			hsv.h = ((rgb.g - rgb.b)/c) % 6;
			break;
		case rgb.g:
			hsv.h = ((rgb.b - rgb.r)/c) + 2;
			break;
		case rgb.b:
			hsv.h = ((rgb.r - rgb.g)/c) + 4;
			break;
		}
		hsv.s = Math.floor(c/M * 255);
		hsv.h = Math.floor(hsv.h * 255 / 6);
	} else {
		hsv.h = 0;
		hsv.s = 0;
	}
	
	hsv.v = M;
	return hsv;
}

function hsv_to_rgb(hsv) {
	var hh = hsv.h * 360 / 255;
    if(hh >= 360.0) hh = 0.0;
    
    hh /= 60.0;
    
    var i = Math.floor(hh);
    
    var ff = hh - i;
    var p = hsv.v * (1.0 - hsv.s / 255);
    var q = hsv.v * (1.0 - (hsv.s * ff / 255));
    var t = hsv.v * (1.0 - (hsv.s * (1.0 - ff) / 255));

    var out = {};
    
    switch(i) {
    case 0:
        out.r = hsv.v;
        out.g = t;
        out.b = p;
        break;
    case 1:
        out.r = q;
        out.g = hsv.v;
        out.b = p;
        break;
    case 2:
        out.r = p;
        out.g = hsv.v;
        out.b = t;
        break;
    case 3:
        out.r = p;
        out.g = q;
        out.b = hsv.v;
        break;
    case 4:
        out.r = t;
        out.g = p;
        out.b = hsv.v;
        break;
    case 5:
    default:
        out.r = hsv.v;
        out.g = p;
        out.b = q;
        break;
    }
    
    out.r = Math.floor(out.r);
    out.g = Math.floor(out.g);
    out.b = Math.floor(out.b);
    
    return out;
}

