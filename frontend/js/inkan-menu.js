var currentSubmenu = null;

function closeSubmenu() {
	if (currentSubmenu) {
		currentSubmenu.style.display = "none";
		currentSubmenu = null;
	}
}

function initMenus() {
	window.onclick = function() {
		closeSubmenu();
	}

    /*
	this.root = new Graphics.Root(canvas, oc);
	this.rect = new Graphics.RectShape(root, 10, 10, 20, 20, null, "rgb(255,0,0)");
	this.circle = new Graphics.Circle(root, 40, 40, 20, "rgb(0, 255, 0)", null);
	this.root.render(); */	
}

function showSubmenu(event, submenu) {
	closeSubmenu();
	submenu.style.display = "block";
	currentSubmenu = submenu
	event.stopPropagation();
}

function menuover(event, submenu) {

	if (currentSubmenu && currentSubmenu != submenu) {
		currentSubmenu.style.display = "none";
		submenu.style.display = "block";
		currentSubmenu = submenu
	}
}

function save(event) {
	closeSubmenu();
	event.stopPropagation();

	alert("Save");
}

function export_content(event) {
	closeSubmenu();
	event.stopPropagation();

	alert("Export");
}

function showAll(event) {
	closeSubmenu();
	event.stopPropagation();

	alert("Show All");
}

function zoomDialog(event) {
	closeSubmenu();
	event.stopPropagation();

	alert("Show Zoom dialog");
}

function help(event) {
	closeSubmenu();
	event.stopPropagation();

	alert("No help yet");
}

function about(event) {
	closeSubmenu();
	event.stopPropagation();

	alert("Inkan\nWeb-based structured animated graphics\nv 0.0\n\u00A9 Joseph Hindin");
}