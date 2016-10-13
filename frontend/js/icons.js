

Icon = function(canvas) {
	Renderable.call(this, canvas);
}

Icon.prototype = Object.create(Renderable.prototype);


Icon.prototype.render = function() {
	var ctx = this.canvas.getContext('2d');
	
	var colors = {};
	this.setIconColors(ctx, colors);
	var canvasRect = this.canvas.getBoundingClientRect();

	ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);
	
	ctx.moveTo(0, 0);
	ctx.lineTo(canvasRect.width, canvasRect. height);
	ctx.stroke();

	ctx.moveTo(canvasRect.width, 0);
	ctx.lineTo(0, canvasRect. height);
	ctx.stroke();
	
	ctx.strokeRect(2, 2, canvasRect.width - 4, canvasRect.height - 4);
} 


Icon.prototype.setIconColors = function(ctx, colors) {
	var s = window.getComputedStyle(this.canvas);
	var htmlBackgroundColor = s.backgroundColor;
	if (!htmlBackgroundColor || htmlBackgroundColor == "")
		htmlBackgroundColor = null;
	
	var htmlForegroundColor = s.color;
	if (!htmlForegroundColor || htmlForegroundColor == "")
		htmlForegroundColor = "rgb(0,0,0)";
	
	ctx.fillStyle = htmlBackgroundColor;
	ctx.strokeStyle = htmlForegroundColor;
	colors.color = htmlForegroundColor;
	colors.backgroundColor = htmlBackgroundColor;
}

RectShapeIcon = function(canvas) {
	Icon.call(this, canvas);
}

RectShapeIcon.prototype = Object.create(Icon.prototype);

RectShapeIcon.prototype.render = function()
{
	var ctx = this.canvas.getContext('2d');
	
	var colors = {};
	this.setIconColors(ctx, colors);

	var canvasRect = this.canvas.getBoundingClientRect();
	
	ctx.clearRect(0, 0, canvasRect.width, canvas.height);
	ctx.lineWidth = 0;
	
	var widthMargin = canvasRect.width * 0.1;
	var heightMargin = canvasRect.height * 0.1;
	
	if (colors.backgroundColor) {
		ctx.fillRect(Math.floor(widthMargin), Math.floor(heightMargin),
				Math.floor(canvasRect.width - 2 * widthMargin),
				Math.floor(canvasRect.height - 2 * heightMargin));
	}
		
	
	ctx.strokeRect(Math.floor(widthMargin), Math.floor(heightMargin),
			Math.floor(canvasRect.width - 2 * widthMargin),
			Math.floor(canvasRect.height - 2 * heightMargin));
}

CircleShapeIcon = function(canvas) {
	Icon.call(this, canvas);
}

CircleShapeIcon.prototype = Object.create(Icon.prototype);


CircleShapeIcon.prototype.render = function()
{
	var ctx = this.canvas.getContext('2d');
	
	var colors = {};
	this.setIconColors(ctx, colors);

	var canvasRect = this.canvas.getBoundingClientRect();

	ctx.clearRect(0, 0, canvasRect.width, canvas.height);
	ctx.lineWidth = 0;

	var radius = canvasRect.width > canvasRect.height ? canvasRect.height : canvasRect.width;
	radius *= 0.4;
	
	var centerX = canvasRect.width / 2;
	var centerY = canvasRect.height / 2;
	
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.stroke();

	if (colors.backgroundColor)
		ctx.fill();
}

