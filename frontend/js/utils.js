/**
 * 
 */

function getChildByIndexes(node) {
	var i;
	for (i = 1; i < arguments.length && node; i++) {
		var arg = arguments[i];
		if (typeof arg != "number")
			return null;
		if (i < 0)
			return null;

		if ('children' in node) {
			var children = node.children;
			if (!children)
				return null;

			if (arg >= children.length)
				return null;
			node = children[arg];
			if (!node)
				return null;
		} else if ('childNodes' in node) {
			var j = 0, k = 0;
			while (k <= arg && j < node.childNodes.length) {
				var nodeName = node.childNodes[j].nodeName
				if (nodeName != "#text" && nodeName != "#comment")
					k++;
				j++;
			}
			if (j == node.childNodes.length)
				node = null;
			else
				node = node.childNodes[j - 1];
		}
	}
	return node;
}
