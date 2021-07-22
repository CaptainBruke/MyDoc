/**
 * 一些公用方法
 * @author 暮光：城中城
 * @since 2017年5月7日
*/

function serialize(value) {
	if (typeof value === 'string') {
		return value;
	}
	return JSON.stringify(value);
}

function deserialize(value) {
	if (typeof value !== 'string' || isEmpty(value)) {
		return undefined;
	}
	try {
		return JSON.parse(value);
	} catch (e) {
		try {
			return eval('(' + value + ')');// 处理变态的单双引号共存字符串
		} catch (e) {
			return value || undefined;
		}
	}
}

function validateResult(result) {
	if(result.errCode == 200) {
		return true;
	} else {
		Toast.error(result.errMsg);
	}
	return false;
}

function getNowDate() {
	var date = new Date();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + "-" + month + "-" + strDate;
	return currentdate;
}

function getNowTime() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	if (hours >= 1 && hours <= 9) {
		hours = "0" + hours;
	}
	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	if (seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;
	}
	var currentdate = hours + ":" + minutes + ":" + seconds;
	return currentdate;
}

function getNowDateTime() {
	var currentdate = getNowDate() + " " + getNowTime();
	return currentdate;
}

/**
 * 返回不为空的字符串，为空返回def
 */
function getNotEmptyStr(str, def) {
	if (isEmpty(str)) {
		return isEmpty(def) ? "" : def;
	}
	return str;
}

/**
 * 是否是空对象
 * @param obj
 * @returns
 */
function isEmptyObject(obj){
	return $.isEmptyObject(obj);
}

/**
 * 是否是空字符串
 * @param str
 * @returns
 */
function isEmpty(str){
	return (str == "" || str == null || str == undefined);
}

/**
 * 是否不是空字符串
 * @param str
 * @returns
 */
function isNotEmpty(str){
	return !isEmpty(str);
}

/**
 * 数组转字符串，使用空格分隔
 * @param array
 * @returns
 */
function arrToString(array){
	var temStr = "";
	if(isEmpty(array)){
		return temStr;
	}
	array.forEach(function(e){
		if(isNotEmpty(temStr)) {
			temStr += " ";
		}
		temStr += e;
	});
	return temStr;
}

/**
 * 数组array中是否包含str字符串
 * @param array
 * @param str
 * @returns
 */
function haveString(array, str){
	if(isEmpty(array)) {
		return false;
	}
	for (var i = 0; i < array.length; i++) {
		if(array[i] == str) {
			return true;
		}
	}
	return false;
}

/**
 * 直接返回对象的第一个属性
 * @param data
 * @returns
 */
function getObjectFirstAttribute(data) {
	for ( var key in data) {
		return data[key];
	}
}

/**
 * 如果对象只有一个属性则返回第一个属性，否则返回null
 * @param data
 * @returns
 */
function getObjectFirstAttributeIfOnly(data) {
	var len = 0, value = "";
	for ( var key in data) {
		if (++len > 1) {
			return null;
		}
		value = data[key];
	}
	return value;
}

/**
 * ajax处理事件模板
 * 
 * @url 后台处理的url，即action
 * @dataSentType 数据发送的方式，有post，get方式
 * @dataReceiveType 数据接收格式，有html json text等
 * @paramsStr 传入后台的参数
 * @successFunction ajax成功后执行的函数名 ajaxTemp("", "GET", "html", {}, function(){},
 *                  function(){}, "");
 */
function ajaxTemp(url, dataSentType, dataReceiveType, paramsStr, successFunction, errorFunction, completeFunction, id) {
	$.ajax({
		url : url, // 后台处理程序
		sync : false,
		type : dataSentType, // 数据发送方式
		dataType : dataReceiveType, // 接受数据格式
		data : eval(paramsStr),
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		success : function(msg) {
			if(typeof successFunction == "function") {
				successFunction(msg,id);
			}
		},
		beforeSend : function() {
			
		},
		complete : function(msg) {
			if(typeof completeFunction == "function") {
				completeFunction(msg,id);
			}
		},
		error : function(msg) {
			if(typeof errorFunction == "function") {
				errorFunction(msg,id);
			}
		}
	});
}

/**
 * 获取cookie
 * @param name
 * @returns
 */
function getCookie(name) {
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return unescape(arr[2]);
	}
	return null;
}

/**
 * 字符串格式化
 */
String.prototype.format = function(args) {
	if (arguments.length > 0) {
		var result = this;
		if (arguments.length == 1 && typeof (args) == "object") {
			for ( var key in args) {
				var reg = new RegExp("({" + key + "})", "g");
				result = result.replace(reg, args[key]);
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] == undefined) {
					return "";
				} else {
					var reg = new RegExp("({[" + i + "]})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
		return result;
	} else {
		return this;
	}
}

String.prototype.endWith = function(str) {
	if (str == null || str == "" || this.length == 0 || str.length > this.length) {
		return false;
	}
	return (this.substring(this.length - str.length) == str);
};

String.prototype.startWith = function(str) {
	if (str == null || str == "" || this.length == 0 || str.length > this.length) {
		return false;
	}
	return (this.substr(0, str.length) == str);
};


