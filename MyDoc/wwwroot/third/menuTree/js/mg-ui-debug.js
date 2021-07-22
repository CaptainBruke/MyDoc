/**
 * 在线调试页面js
 * @author 暮光：城中城
 * @since 2018年7月20日
*/

/**
 * 获取自动填充的值
 * @param paramType
 * @returns
 */
function getAutoFillValue(paramType, paramName) {
	if(userSettings.autoFillParam == 0 || isEmpty(paramType)) {
		return "";
	}
	paramName = getNotEmptyStr(paramName).toLowerCase();
	var isTimeColumn = (paramType.indexOf("date-time") >= 0
			|| paramName.endWith("date") || paramName.endWith("time"));
	var isTypeColumn = (paramName.endWith("type") || paramName.endWith("status")
			|| paramName.endWith("level") || paramName.endWith("num"));
	var isPriceColumn = (paramName.endWith("money") || paramName.endWith("price")
			|| paramName.endWith("cash") || paramName.endWith("coin"));
	var isBooleanColumn = (paramName.startWith("is"));
	var resultValue = "";
	if(paramType.indexOf("int") >= 0){
		if(isTypeColumn) {
			resultValue = Math.ceil(Math.random() * 5);
		} else if(paramName.endWith("age")) {
			resultValue = Math.ceil(Math.random() * 100);
		} else {
			resultValue = Math.ceil(Math.random() * 100);
		}
	} else if(paramType.indexOf("double") >= 0){
		resultValue = Math.ceil(Math.random() * 1000);
	} else if(paramType.indexOf("float") >= 0){
		resultValue = parseFloat(Math.random() * 1000).toFixed(2);
	} else if(paramType.indexOf("byte") >= 0){
		if(isTypeColumn) {
			resultValue = Math.ceil(Math.random() * 5);
		} else {
			resultValue = Math.ceil(Math.random() * 127);
		}
	} else if(paramType.indexOf("boolean") >= 0){
		resultValue = Math.random() > 0.5;
	} else if(isTimeColumn){
		resultValue = getNowDateTime();
	} else {
		if(paramName.endWith("id")) {
			resultValue = Math.ceil(Math.random() * 1000);
		} else if(paramName.endWith("age")) {
			resultValue = Math.ceil(Math.random() * 100);
		} else if(isPriceColumn){
			resultValue = parseFloat(Math.random() * 1000).toFixed(2);
		} else if(isTypeColumn){
			resultValue = Math.ceil(Math.random() * 5);
		} else if(isBooleanColumn){
			resultValue = (Math.random() > 0.5) ? 0 : 1;
		} else if(paramName.endWith("phone") || paramName.endWith("mobile")){
			var arr = ["15226645814", "15226645815", "15226645816", "15226645817", "15226645818"];
			resultValue = arr[Math.ceil(Math.random() * 5) - 1];
		} else if(paramName.endWith("md5")){
			resultValue = "5082079d92a8ef985f59e001d445ff20";
		} else if(paramName.endWith("photo")){
			resultValue = "http://www.zyplayer.com/freeplay/img/headIcon/myhead.jpg";
		} else if(paramName.endWith("url")){
			var arr = ["http://www.zyplayer.com", "http://www.kongjianzhou.com"];
			resultValue = arr[Math.ceil(Math.random() * 2) - 1];
		} else if(paramName.endWith("username")){
			var arr = ["张三", "李四", "王二", "暮光：城中城", "海贼王"];
			resultValue = arr[Math.ceil(Math.random() * 5) - 1];
		} else if(userSettings.autoFillParam == 2){
			//var arr = ["您好！","请！","对不起。","谢谢！","再见！","您早！","晚安！","请问您贵姓？","请原谅！","不用谢！","没关系！","欢迎您光临！","请坐！","请喝茶！","请多关照！","请多指教！","谢谢您的合作！","对不起，让您久等了。","没关系，我刚到。","给您添麻烦了。","我能为您做什么？","您好，请问您需要帮助吗？","您走好。","请慢走！"];
			//resultValue = arr[Math.ceil(Math.random() * 24) - 1];
			resultValue = "我是默认字符串";
		}
		//console.log(paramType);
	}
	return resultValue;
}
