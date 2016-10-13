/**
 * 
 */

var Tabs = Tabs || {}

Tabs.Tab = function() {
	this.ll = new ChangeListenersList(this);
	this.tabsArray = [];

}

Tabs.Tab.prototype.setTitle = function(parentElement) {}
Tabs.Tab.prototype.setContent = function(parentElement) {}
Tabs.Tab.prototype.getIndex = function() {
	return (this.stacked && this.stacked.index) ? this.stacked.index : 0;
}




Tabs.HTabManager = function(parentElement) {
	Tabs.Tab.call(this);
	
	parentElement.innerHTML = 
		"<div class=\"tabs\">" 
		+ "<div class=\"tabsTitleHolder\"></div>"  
	    + "<div class=\"tabContentHolder\"></div>"
		+ "</div>";
	
	this.tabContentHolder = getChildByIndexes(parentElement, 0, 1);
	this.tabTitleHolder = getChildByIndexes(parentElement, 0, 0);
	this.stacked = new Tabs.Stacked(this.tabContentHolder, this);
}

Tabs.HTabManager.prototype = Object.create(Tabs.Tab.prototype);

Tabs.HTabManager.prototype.handleEvent = function(evt) {
	var index = evt.currentTarget._tabIndex;
	if (index == null || index == undefined)
		return;
	
	for (var i = 0; i < this.tabsArray.length; i++) {
		if (i == index) {
			this.tabsArray[i].titleElement.className = "tab  selected";
		} else {
			this.tabsArray[i].titleElement.className = "tab";
		}
	}
	this.stacked.setIndex(evt.currentTarget._tabIndex)
}

Tabs.HTabManager.prototype.addTab = function(tab) {
	if (! tab instanceof Tabs.Tab)
		throw new TypeError("Invalid argument class");
	
	var tabTitleElement = document.createElement("span");
	if (this.tabsArray.length)
		tabTitleElement.setAttribute("class", "tab");
	else
		tabTitleElement.setAttribute("class", "tab selected");
	
	tab.titleElement = tabTitleElement;
	
	tabTitleElement._tabIndex = this.tabsArray.length;
	
	tabTitleElement.addEventListener("click", this, false);
	
	this.tabTitleHolder.appendChild(tabTitleElement)
	tab.setTitle(tabTitleElement);

	
	this.tabsArray.push(tab);

	this.stacked.addTab(tab);
	
	this.tabTitleHolder.style.width = (this.tabContentHolder.clientWidth + 4 ) + "px"; 
			
}

Tabs.VTabManager = function(parentElement) {
	Tabs.Tab.call(this);
	
	parentElement.innerHTML = "<table style=\"margin:0; padding:0;\" cellspacing=\"0px\" cellpadding=\"0px\">" 
		+ "</table>";
	this.table = getChildByIndexes(parentElement, 0);
}

Tabs.VTabManager.prototype = Object.create(Tabs.Tab.prototype);

Tabs.VTabManager.prototype.addTab = function(tab) {
	if (! tab instanceof Tabs.Tab)
		throw new TypeError("Invalid argument class");
	
	
	var rowElement = document.createElement("tr");
	
	if (this.tabsArray.length == 0) {
		var td0 = document.createElement("td");
		td0.className = "vTabTitle";
		td0.innerHTML = "<span class=\"vTitle\"></span>";

		var td1 = document.createElement("td");
		td1.innerHTML = "<div class=\"vTabContentHolder\"></div>";

	    rowElement.appendChild(td0);
	    rowElement.appendChild(td1);

	    this.contentCell = getChildByIndexes(rowElement, 1);
		this.contentHolder = getChildByIndexes(rowElement, 1, 0);
		this.stacked =  new Tabs.Stacked(this.contentHolder, this);
	} else {
		var td = document.createElement("td");
		td.className = "vTabTitle";
		td.innerHTML = "<span class=\"vTitle\"></span>";
		rowElement.appendChild(td);
	}
	
	var titleSpan = getChildByIndexes(rowElement, 0, 0);
	tab.setTitle(titleSpan);
	
	if (this.tabsArray.length == 0) {
		titleSpan.className += " selected";
	}
	titleSpan._tabIndex = this.tabsArray.length;
	tab.titleHolder = titleSpan;

	this.table.appendChild(rowElement);
	

	this.tabsArray.push(tab);
	this.contentCell.setAttribute("rowspan", this.tabsArray.length);
	this.stacked.addTab(tab);
	
	titleSpan.addEventListener("click", this, true);

}


Tabs.VTabManager.prototype.handleEvent = function(evt) {
	for (var i = 0; i < this.tabsArray.length; i++) {
		if (i == evt.currentTarget._tabIndex) 
			this.tabsArray[i].titleHolder.className = "vTitle selected";
		else
			this.tabsArray[i].titleHolder.className = "vTitle";
	}
	this.stacked.setIndex(evt.currentTarget._tabIndex)
}

Tabs.CTabManager = function(parentElement)
{
	Tabs.Tab.call(this);

	parentElement.innerHTML = "<div><select></select></div><div class=\"cTabContentHolder\"></div>";
	this.select = getChildByIndexes(parentElement, 0, 0);
	this.contentHolder = getChildByIndexes(parentElement, 1);
	this.stacked = new Tabs.Stacked(this.contentHolder, this);
	
	this.select.addEventListener("change", this, true);
}

Tabs.CTabManager.prototype = Object.create(Tabs.Tab.prototype);

Tabs.CTabManager.prototype.addTab = function(tab) {
	var option = document.createElement("option");
	tab.setTitle(option);
	option.setAttribute("value", this.tabsArray.length);
	this.select.appendChild(option);
	
	this.stacked.addTab(tab);
	this.tabsArray.push(tab);
}

Tabs.CTabManager.prototype.handleEvent = function(evt) {
	this.stacked.setIndex(this.select.selectedIndex);
}

Tabs.Stacked = function(parentElement, tabManager) {
	parentElement.innerHTML = "<div></div";
	this.tabContentHolder = getChildByIndexes(parentElement, 0);
	this.tabContents = [];
	this.index = 0;
	this.tabManager = tabManager;
	
}

Tabs.Stacked.prototype.addTab = function(tab) {
	this.tabContentHolder.style.width = "";
	this.tabContentHolder.style.height = "";
	
	var div = document.createElement("div");
	this.tabContentHolder.appendChild(div);
	tab.setContent(div);
	tab.stacked_content = div;
	this.tabContents.push(tab);
	
	this.width = 0, this.height = 0;
	for (var i = 0; i < this.tabContents.length; i++) {
		this.tabContents[i].stacked_content.style.display = "inline-block";
		
		this.width = Math.max(this.width, this.tabContents[i].stacked_content.getBoundingClientRect().width);
		this.height = Math.max(this.height, this.tabContents[i].stacked_content.getBoundingClientRect().height);
		
		this.tabContents[i].stacked_content.style.display = (i == this.index) ? "inline-block" : "none";
	}
	this.tabContentHolder.style.width  = this.width + "px";
	this.tabContentHolder.style.height  = this.height + "px";
}

Tabs.Stacked.prototype.setIndex = function(index) {
	this.index = index;
	for (var i = 0; i < this.tabContents.length; i++) {
		this.tabContents[i].stacked_content.style.display = (i == this.index) ? "inline-block" : "none";
	}
	if (this.tabManager) 
		this.tabManager.ll.fire();
	
}
