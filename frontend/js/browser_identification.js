BrowserID = {} || BrowserID

function identify_browser()
{
	var key_slash_version_regexp = /[a-zA-Z][a-zA-Z0-9]*\/[0-9\.]+/g;
	key_slash_version_regexp.compile(key_slash_version_regexp);
	
	function identify_netscape() {
		var useUserAgent = false;
		if (!navigator.appVersion) {
			useUserAgent = true;
		} else {
			var componentVersions = navigator.appVersion.match(key_slash_version_regexp);
			if (!componentVersions) {
				/* Firefox reports components version only on the user agent */
				useUserAgent = true;
			}
		}
		if (useUserAgent && !navigator.userAgent) {
			return;
		}
		if (useUserAgent)
			componentVersions = navigator.userAgent.match(key_slash_version_regexp);
		
		if (!componentVersions)	{
			return;
		}
		
		var found = false;
		var filtered = componentVersions.filter(function (keyValue) {
			var pair = keyValue.match(/([a-zA-Z][a-zA-Z0-9]*)\/([0-9]+)/);
			if (!pair || pair.length != 3)
				return false;
			
			switch (pair[1].toLowerCase()) {
			case "firefox":
				BrowserID.browser = "ff";
				BrowserID.version = pair[2];
				return true;
			case "chrome":
				BrowserID.browser = "chrome";
				BrowserID.version = pair[2];
				return true;
			}
			return false;
		});
		
		if (filtered.length != 1) {
			BrowserID.browser = "netscape";
			BrowserID.version = undefined;
			return;
		}
	}
	
	function identify_ie() {
		if (!navigator.appVersion) {
			BrowserID.browser = "ie";
			return;
		}
		r = /\(([^)]+)\)/g;
		
		inBrackets = r.exec(navigator.appVersion);
		if (!inBrackets || inBrackets.length != 2) {
			BrowserID.browser = "ie";
			return;
		}
		
		versionsList = inBrackets[1].split("; ");
		ieVersion = versionsList.filter(function(version) {
			versionFields = version.split(" ");
			if (versionFields.length==2 && versionFields[0] == "MSIE") {
				versionFields[1].split(".");
				BrowserID.browser = "ie";
				BrowserID.version = versionFields[1].split(".")[0];
				return true;
			}
			return false;
		});
		
		if (!ieVersion || ieVersion.length != 1) {
			BrowserID.browser = "ie";
			BrowserID.version = undefined;
		}
	}
	
	var appName = navigator.appName;
	
	if (appName.match(/Explorer/i)) {
		identify_ie(key_slash_version_regexp);
		return;
	}
	
	if (appName == "Netscape") {
		identify_netscape(key_slash_version_regexp);
		return;
	}
}

identify_browser();
