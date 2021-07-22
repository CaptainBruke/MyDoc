
/**
 * 将对象处理成json格式化和着色的html
 * @author 暮光：城中城
 * @since 2017年5月7日
 */
var Formatjson = {
	// 需要在对象或列表后面添加注释的对象，例：{userList: "用户列表"}
	// 那么在名字为userList的对象或列表后面都会加上：“用户列表” 这个注释
	annotationObject: {},
	tabStr: "    ",
	isArray: function(obj) {
		return obj && typeof obj === 'object' && typeof obj.length === 'number'
				&& !(obj.propertyIsEnumerable('length'));
	},
	processObjectToHtmlPre: function(obj, indent, addComma, isArray, isPropertyContent, showAnnotation) {
		var htmlStr = this.processObject(obj, "", indent, addComma, isArray, isPropertyContent, showAnnotation);
		htmlStr = '<pre class="json">' + htmlStr + '</pre>';
		return htmlStr;
	},
	processObject: function(obj, keyName, indent, addComma, isArray, isPropertyContent, showAnnotation) {
		var html = "";
		var comma = (addComma) ? "<span class='comma'>,</span> " : "";
		var type = typeof obj;
		if (this.isArray(obj)) {
			if (obj.length == 0) {
				html += this.getRow(indent, "<span class='array-brace'>[ ]</span>" + comma, isPropertyContent);
			} else {
				var clpsHtml = '<span><img class="option-img" src="img/expanded.png" onClick="Formatjson.expImgClicked(this);" /></span><span class="collapsible">';
				var annotation = '';
				if(showAnnotation && isNotEmpty(keyName) && isNotEmpty(this.annotationObject[keyName])) {
					annotation = '<span class="annotation">// '+this.annotationObject[keyName]+'</span>';
				}
				html += this.getRow(indent, "<span class='array-brace'>[</span>"+clpsHtml+annotation, isPropertyContent);
				for (var i = 0; i < obj.length; i++) {
					html += this.processObject(obj[i], "", indent + 1, i < (obj.length - 1), true, false, showAnnotation);
				}
				clpsHtml = "</span>";
				html += this.getRow(indent, clpsHtml + "<span class='array-brace'>]</span>" + comma);
			}
		} else if (type == 'object' && obj == null) {
			html += this.formatLiteral("null", "", comma, indent, isArray, "null");
		} else if (type == 'object') {
			var numProps = 0;
			for ( var prop in obj) {
				numProps++;
			}
			if (numProps == 0) {
				html += this.getRow(indent, "<span class='object-brace'>{ }</span>" + comma, isPropertyContent);
			} else {
				var clpsHtml = '<span><img class="option-img" src="img/expanded.png" onClick="Formatjson.expImgClicked(this);" /></span><span class="collapsible">';
				var annotation = '';
				if(showAnnotation && isNotEmpty(keyName) && isNotEmpty(this.annotationObject[keyName])) {
					annotation = '<span class="annotation">// '+this.annotationObject[keyName]+'</span>';
				}
				html += this.getRow(indent, "<span class='object-brace'>{</span>"+clpsHtml+annotation, isPropertyContent);
				var j = 0;
				for ( var prop in obj) {
					var processStr = '<span class="property-name">"' + prop + '"</span>: ' + this.processObject(obj[prop], prop, indent + 1, ++j < numProps, false, true, showAnnotation);
					html += this.getRow(indent + 1, processStr);
				}
				clpsHtml = "</span>";
				html += this.getRow(indent, clpsHtml + "<span class='object-brace'>}</span>" + comma);
			}
		} else if (type == 'number') {
			html += this.formatLiteral(obj, "", comma, indent, isArray, "number");
		} else if (type == 'boolean') {
			html += this.formatLiteral(obj, "", comma, indent, isArray, "boolean");
		} else if (type == 'function') {
			obj = this.formatFunction(indent, obj);
			html += this.formatLiteral(obj, "", comma, indent, isArray, "function");
		} else if (type == 'undefined') {
			html += this.formatLiteral("undefined", "", comma, indent, isArray, "null");
		} else {
			html += this.formatLiteral(obj, "\"", comma, indent, isArray, "string");
		}
		return html;
	},
	expImgClicked: function(img){
		var container = img.parentNode.nextSibling;
		if(!container) return;
		var disp = "none";
		var src = "img/collapsed.png";
		if(container.style.display == "none"){
			disp = "inline";
			src = "img/expanded.png";
		}
		container.style.display = disp;
		img.src = src;
	},
	formatLiteral: function(literal, quote, comma, indent, isArray, style) {
		if (typeof literal == 'string') {
			literal = literal.split("<").join("&lt;").split(">").join("&gt;");
		}
		var str = "<span class='" + style + "'>" + quote + literal + quote + comma + "</span>";
		if (isArray) {
			str = this.getRow(indent, str);
		}
		return str;
	},
	formatFunction: function(indent, obj) {
		var tabs = "";
		for (var i = 0; i < indent; i++) {
			tabs += this.tabStr;
		}
		var funcStrArray = obj.toString().split("\n");
		var str = "";
		for (var i = 0; i < funcStrArray.length; i++) {
			str += ((i == 0) ? "" : tabs) + funcStrArray[i] + "\n";
		}
		return str;
	},
	getRow: function(indent, data, isPropertyContent) {
		var tabs = "";
		for (var i = 0; i < indent && !isPropertyContent; i++) {
			tabs += this.tabStr;
		}
		if (data != null && data.length > 0 && data.charAt(data.length - 1) != "\n") {
			data = data + "\n";
		}
		return tabs + data;
	}

}

