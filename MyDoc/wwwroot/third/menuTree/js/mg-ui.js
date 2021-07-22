/**
 * swagger-mg-ui是swagger-ui的一个前端实现，使用简单、解析速度快、走心的设计
 * 支持多项目同时展示，多种文档目录的展示方案，多种自定义配置，满足各种使用习惯。
 * 使用中您有任何的意见和建议都可到源码地址处反馈哦！
 * git地址：https://gitee.com/zyplayer/swagger-mg-ui
 * @author 暮光：城中城
 * @since 2018年5月20日
 */

// 参数说明对于的map全局对象
var definitionsDataMap = new Map();
// 依据目录树存储的map全局对象
var treePathDataMap = new Map();

var globalLoadingMessager;
// 树的下表
var projectTreeIdIndex = 1;
// 文档url加载的下标
var projectLoadingIndex = 0;
// 请求到的文档列表
var documentJsonArr = [];
// 用户的配置对象
var userSettings = {};
// 默认用户的配置对象
var defaultUserSettings = {
	autoFillParam : 1,// 自动填充参数
	onlyUseLastParam : 0,// 是否仅使用上次请求参数
	showParamType : 1,// 是否展示字段的类型
	catalogShowType : 2,// 目录的展示方式，1=url分成一层一层的展示、2=整个url显示为一层展示
	treeShowType : 1,// 树形菜单展示方式，1=tree-angles、2=tree-menu、3=默认，4=tree-folders、5=tree-chevrons
	projects : [],// 所有的项目列表
	removedProjects : [],// 被移除的项目列表
	prevWNow : 360
};

var swaggerApiDocsArr = [];

/**
 * 网页加载完毕后的处理
 */
$(document).ready(function(){
	userSettings = defaultUserSettings;
	changeContentWidth(userSettings.prevWNow);
	updateTreeShowType();
	updateUserSettingsUi();
	
	//globalLoadingMessager = new $.zui.Messager({type: 'primary', close: false, time: 0}).show();
	//showGlobalLoadingMessage('文档解析中，请稍候...', true);
	if(isEmptyObject(mgUiDataArr)) {
		Toast.error("文档数据错误，请检查！");
		return;
	}
	for (var i = 0; i < mgUiDataArr.length; i++) {
		//showGlobalLoadingMessage('解析第'+(i+1)+'份文档，请稍候...', true);
		var tempDoc = mgUiDataArr[i];
		console.log(tempDoc);
		documentJsonArr.push(tempDoc);// 加到所有文档
		addHomePageDashboard(tempDoc, tempDoc.fullUrl);
		createDefinitionsMapByJson(tempDoc);
		if(userSettings.catalogShowType == 1) {
			createTreeViewByTree(tempDoc);// url分成一层一层的展示
		} else if(userSettings.catalogShowType == 2){
			createTreeViewByTag(tempDoc);// tag方式，整个url显示为一层
		} else {
			createTreeViewByTree(tempDoc);// url分成一层一层的展示
		}
	}
	documentLoadFinish();
});

/**
 * 自由拖动改变左右框架的宽度
 */
$("#resizebleLeftRight").mgResizebleWidth({
	prev:"#leftContent",
	prevWtMin: 120, prevWtMax: 999999,
	nextWtMin: 360, nextWtMax: 999999,
	onresize:function(prevWNow, nextWNow){
		changeContentWidth(prevWNow);
	},
	onstart:function(){
		$("body").addClass("unselect");
	},
	onfinish:function(){
		$("body").removeClass("unselect");
		storeUserSettings();
	}
});

/**
 * 切换导航栏的宽度到最小或最大
 */
$("#changeContentWidth").click(function(){
	var isMinWidth = ($("#leftContent").width() == 120);
	changeContentWidth(isMinWidth ? 360 : 120);
});

/**
 * 修改tree的class
 */
$("input[name='treeShowType']").change(function() {
	userSettings.treeShowType = $("input[name='treeShowType']:checked").val();
	updateTreeShowType();
	storeUserSettings();
});

/**
 * 切换url分成一层一层的展示、整个url显示为一层展示
 */
$("input[name='catalogShowType']").change(function() {
	userSettings.catalogShowType = $("input[name='catalogShowType']:checked").val();
	regeneratePathTree();
	storeUserSettings();
});

/**
 * 是否展示参数类型
 */
$("input[name='showParamType']").change(function() {
	userSettings.showParamType = $("input[name='showParamType']:checked").val();
	storeUserSettings();
});

/**
 * 是否自动填充请求参数
 */
$("input[name='autoFillParam']").change(function() {
	userSettings.autoFillParam = $("input[name='autoFillParam']:checked").val();
	storeUserSettings();
});

/**
 * 搜索框回车事件
 */
$("#searchDocInput").keyup(function(e) {  
	if (e.keyCode == 13) {
		searchDoc();
	}
});

/**
 * 搜索按钮点击
 */
$("#searchDocBt").click(function(){
	searchDoc();
});

/**
 * 主页li点击事件，展示主页
 */
$("#homePageLi").click(function(){
	$(".tab-page").hide();
	$(".tab-home-page").show();
});

///**
// * api文档最后的节点点击，展示文档页面
// */
//$("#apiPathTree").on("click", ".show-doc", function(){
//	$(".tab-page").hide();
//	$(".tab-document").show();
//	var id = $(this).attr("path");
//	$("#docTitleInput").val(id);
//	ue.setContent(`<p>${id}</p>`);
//	/*$("#tabDocInfo").html(path);*/

//});

/**
 * 搜索文档
 * @returns
 */
function searchDoc() {
	var keywords = $("#searchDocInput").val();
	// 重新生成
	regeneratePathTree(keywords);
	if (isEmpty(keywords)){
		return;
	}
	$('#apiPathTree .projects').tree('expand');
}

// 重新生成文档
function regeneratePathTree(keywords){
	projectTreeIdIndex = 1;
	treePathDataMap = new Map();
	$('#apiPathTree').empty();
	$('#apiPathTree').append('<ul class="tree tree-lines projects"></ul>');
	for (var i = 0; i < documentJsonArr.length; i++) {
		var json = documentJsonArr[i];
		if(userSettings.catalogShowType == 1) {
			createTreeViewByTree(json, keywords);// url分成一层一层的展示
		} else if(userSettings.catalogShowType == 2){
			createTreeViewByTag(json, keywords);// tag方式，整个url显示为一层
		} else {
			createTreeViewByTree(json, keywords);// url分成一层一层的展示
		}
	}
	$('#apiPathTree .projects').tree();
	updateTreeShowType();
}

function findInPathsValue(key, pathsValue, keywords) {
	if(isEmpty(keywords) || isEmpty(key)) {
		return true;
	}
	key = key.toLowerCase();
	keywords = keywords.toLowerCase();
	// 路径中有就不用再去找了
	if(key.indexOf(keywords) >= 0) {
		return true;
	}
	for ( var subKey in pathsValue) {
		// 找路径和说明里面包含关键字的
		var tagsTmp = pathsValue[subKey].tags;
		var pathTmp = pathsValue[subKey].path;
		var summaryTmp = pathsValue[subKey].summary;
		var descriptionTmp = pathsValue[subKey].description;
		if(isNotEmpty(pathTmp) && pathTmp.toLowerCase().indexOf(keywords) >= 0) {
			return true;
		}
		if(isNotEmpty(summaryTmp) && summaryTmp.toLowerCase().indexOf(keywords) >= 0) {
			return true;
		}
		if(isNotEmpty(descriptionTmp) && descriptionTmp.toLowerCase().indexOf(keywords) >= 0) {
			return true;
		}
		if(isNotEmpty(tagsTmp) && arrToString(tagsTmp).toLowerCase().indexOf(keywords) >= 0) {
			return true;
		}
	}
	return false;
}

function getResponsesJson(responsesObj, prevRef, isExample, recursiveCount) {
	var responsesJson = {};
	recursiveCount++;// 多层递归，最多递归10层，防止无限递归
	if(isEmpty(responsesObj) || isEmpty(responsesObj.properties) || recursiveCount > 10) {
		return responsesJson;
	}
	var requiredArr = responsesObj.required;
	Object.keys(responsesObj.properties).forEach(function(prop){
		var tmpData = responsesObj.properties[prop];
		if("array" == tmpData.type) {// 数组
			Formatjson.annotationObject[prop] = getNotEmptyStr(tmpData.description);
			if(prevRef != tmpData.items.$ref) {
				var tempObj = definitionsDataMap.get(tmpData.items.$ref);
				if(tempObj != null) {
					var tempArr = responsesJson[prop] = [];
					tempArr[0] = getResponsesJson(tempObj, tmpData.items.$ref, isExample, recursiveCount);
				} else {
					var responsesJsonSub = [];
					var bodyFor = responsesJsonSub;
					var items = tmpData.items;
					for (var i = 0; i < 10; i++) {
						if("array" == items.type) {
							bodyFor = bodyFor[0] = [];
							items = items.items;
						} else {
							tempObj = definitionsDataMap.get(items.$ref);
							if(tempObj != null) {
								bodyFor[0] = getResponsesJson(tempObj, items.$ref, isExample, recursiveCount);
							} else {
								if(items.type == "boolean") {
									bodyFor[0] = true;
								} else if(items.type == "integer") {
									bodyFor[0] = 0;
								} else {
									bodyFor[0] = "";
								}
							}
							break;
						}
					}
					responsesJson[prop] = responsesJsonSub;
				}
			} else {
				responsesJson[prop] = "{}" + getNotEmptyStr(tmpData.description);
			}
		} else if(isNotEmpty(tmpData.$ref)) {// 对象
			Formatjson.annotationObject[prop] = getNotEmptyStr(tmpData.description);
			if(prevRef != tmpData.$ref) {
				var tempObj = definitionsDataMap.get(tmpData.$ref);
				responsesJson[prop] = getResponsesJson(tempObj, tmpData.$ref, isExample, recursiveCount);
			} else {
				responsesJson[prop] = "{}" + getNotEmptyStr(tmpData.description);
			}
		} else {// 字段
			var enumExample = "";
			var enumObj = tmpData["enum"];
			if(!isEmptyObject(enumObj) && enumObj.length > 0) {
				enumExample = "枚举值：";
				for (var i = 0; i < enumObj.length; i++) {
					if(i > 0) {enumExample += "、";}
					enumExample += enumObj[i];
				}
			}
			var typeStr  = getNotEmptyStr(tmpData.format);
			if(isEmpty(typeStr)) {
				typeStr = getNotEmptyStr(tmpData.type);
			}
			if(isExample) {
				var tempVal = getNotEmptyStr(tmpData.example);
				if(isEmpty(tempVal)) {
					tempVal = getAutoFillValue(typeStr, prop);
				}
				if(isNotEmpty(tempVal) && isNotEmpty(enumExample)) {
					tempVal = tempVal + "，" + enumExample;
				}
				responsesJson[prop] = tempVal;
			} else {
				if(userSettings.showParamType == 1) {
					if(haveString(requiredArr, prop)) {
						typeStr = (isNotEmpty(typeStr) ? typeStr + "," : "") + "required";
					}
					if(isNotEmpty(typeStr)) {
						typeStr = "(" + typeStr + ")";
					}
				}
				var descriptionStr = typeStr + getNotEmptyStr(tmpData.description);
				if(isNotEmpty(descriptionStr) && isNotEmpty(enumExample)) {
					descriptionStr = descriptionStr + "，" + enumExample;
				}
				responsesJson[prop] = descriptionStr;
			}
		}
	});
	return responsesJson;
}

function getRequestParamObj(responsesObj, prevRef) {
	var responsesJson = {};
	if(isEmpty(responsesObj) || isEmpty(responsesObj.properties)) {
		return responsesJson;
	}
	var requiredArr = responsesObj.required;
	Object.keys(responsesObj.properties).forEach(function(prop){
		var tmpData = responsesObj.properties[prop];
		if("array" == tmpData.type) {// 数组
			if(prevRef != tmpData.items.$ref) {
				var tempObj = definitionsDataMap.get(tmpData.items.$ref);
				if(tempObj != null) {
					var tempArr = responsesJson[prop] = [];
					tempArr[0] = getRequestParamObj(tempObj, tmpData.items.$ref);
				} else {
					var responsesJsonSub = [];
					var bodyFor = responsesJsonSub;
					var items = tmpData.items;
					for (var i = 0; i < 10; i++) {
						if("array" == items.type) {
							bodyFor = bodyFor[0] = [];
							items = items.items;
						} else {
							tempObj = definitionsDataMap.get(items.$ref);
							if(tempObj != null) {
								bodyFor[0] = getRequestParamObj(tempObj, items.$ref);
							} else {
								if(items.type == "boolean") {
									bodyFor[0] = true;
								} else if(items.type == "integer") {
									bodyFor[0] = 0;
								} else {
									bodyFor[0] = "";
								}
							}
							break;
						}
					}
					responsesJson[prop] = responsesJsonSub;
				}
			} else {
				var required = haveString(requiredArr, prop);
				var paramType = getNotEmptyStr(tmpData.format);
				var paramDesc = getNotEmptyStr(tmpData.description);
				var example = getNotEmptyStr(tmpData.example, tmpData.default);
				if(isEmpty(paramType)) {
					paramType = getNotEmptyStr(tmpData.type);
				}
				addRequestParamObj(responsesJson, prop, paramType, "", required, paramDesc, example);
			}
		} else if(isNotEmpty(tmpData.$ref)) {// 对象
			if(prevRef != tmpData.$ref) {
				var tempObj = definitionsDataMap.get(tmpData.$ref);
				responsesJson[prop] = getRequestParamObj(tempObj, tmpData.$ref);
			} else {
				var required = haveString(requiredArr, prop);
				var paramType = getNotEmptyStr(tmpData.format);
				var paramDesc = getNotEmptyStr(tmpData.description);
				var example = getNotEmptyStr(tmpData.example, tmpData.default);
				if(isEmpty(paramType)) {
					paramType = getNotEmptyStr(tmpData.type);
				}
				addRequestParamObj(responsesJson, prop, paramType, "", required, paramDesc, example);
			}
		} else {// 字段
			var required = haveString(requiredArr, prop);
			var paramType = getNotEmptyStr(tmpData.format);
			var paramDesc = getNotEmptyStr(tmpData.description);
			var example = getNotEmptyStr(tmpData.example, tmpData.default);
			if(isEmpty(paramType)) {
				paramType = getNotEmptyStr(tmpData.type);
			}
			addRequestParamObj(responsesJson, prop, paramType, "", required, paramDesc, example);
		}
	});
	return responsesJson;
}

/**
 * 通过原始json生成引用的字典Map
 * @param json swagger的原始json
 * @returns
 */
function createDefinitionsMapByJson(json) {
	var pathIndex = {};
	var definitions = json.definitions;
	//console.log(paths);
	if(isNotEmpty(definitions)) {
		Object.keys(definitions).forEach(function(key){
			//console.log(key);
			definitionsDataMap.set("#/definitions/" + key, definitions[key]);
		});
	}
}

/**
 * 修改左右框架的宽度
 * @param width 左侧导航栏的宽度
 * @returns
 */
function changeContentWidth(width) {
	$("#leftContent").css("width", width + 'px');
	$("#resizebleLeftRight").css("left", width + 'px');
	$("#rightContent").css("left", width + 'px');
	var logoText = "MyDoc 文档系统";
	if(width < 270 && width > 140){
		logoText = "Doc 文档";
	} else if(width < 140){
		logoText = "Doc";
	}
	$("#logoText").text(logoText);
	userSettings.prevWNow = width;
}

/**
 * 增加项目文档
 * @param json
 * @returns
 */
function addHomePageDashboard(json, fullUrl) {
	//var info = json.info||{};
	//var contactName = "";
	//if(isNotEmpty(info.contact)) {
	//	contactName = "昵称：" + getNotEmptyStr(info.contact.name, "-");
	//	contactName += "<br/>邮箱：" + getNotEmptyStr(info.contact.email, "-");
	//	contactName += "<br/>网站：" + getNotEmptyStr(info.contact.url, "-");
	//}
	//$("#homePageDashboard section").append(
	//	'<div class="col-md-6 col-sm-6">'
	//		+'<div class="panel" data-id="'+fullUrl+'">'
	//			+'<div class="panel-heading">'
	//				+'<div class="title">'+info.title+'</div>'
	//				+'<div class="panel-actions"></div>'
	//			+'</div>'
	//			+'<div class="panel-body">'
	//				+'<div class="content">'
	//					+'<table class="table table-bordered setting-table">'
	//						+'<tr>'
	//							+'<td class="info">简介</td>'
	//							+'<td>'+info.description+'</td>'
	//						+'</tr>'
	//						+'<tr>'
	//							+'<td class="info">作者</td>'
	//							+'<td>'+contactName+'</td>'
	//						+'</tr>'
	//						+'<tr>'
	//							+'<td class="info">版本</td>'
	//							+'<td>'+info.version+'</td>'
	//						+'</tr>'
	//						//+'<tr>'
	//						//	+'<td class="info">地址</td>'
	//						//	+'<td>'+fullUrl+'</td>'
	//						//+'</tr>'
	//					+'</table>'
	//				+'</div>'
	//			+'</div>'
	//		+'</div>'
	//	+'</div>'
	//);
}

/**
 * 初始化用户的设置
 * @param 
 * @returns
 */
function documentLoadFinish() {
	//showGlobalLoadingMessage('文档解析完成！', false);
	//setTimeout(function() {
	//	globalLoadingMessager.hide();
	//}, 1000);
	$('#apiPathTree .projects').tree();
	$('#homePageDashboard').dashboard({draggable: true});
}

/**
 * 修改用户的选项的显示
 * @param 
 * @returns
 */
function updateUserSettingsUi() {
	$("input[name='treeShowType'][value='"+userSettings.treeShowType+"']").prop("checked",true);
	$("input[name='catalogShowType'][value='"+userSettings.catalogShowType+"']").prop("checked",true);
	$("input[name='showParamType'][value='"+userSettings.showParamType+"']").prop("checked",true);
	$("input[name='onlyUseLastParam'][value='"+userSettings.onlyUseLastParam+"']").prop("checked",true);
	$("input[name='autoFillParam'][value='"+userSettings.autoFillParam+"']").prop("checked",true);
}

/**
 * 修改树形菜单展示类型
 * @param 
 * @returns
 */
function updateTreeShowType() {
	$('#apiPathTree .projects').removeClass("tree-angles tree-menu tree-folders tree-chevrons");
	//tree-angles、2=tree-menu、3=默认，4=tree-folders、5=tree-chevrons
	$('#apiPathTree .projects').addClass("tree-lines");
	var treeShowType = "tree-angles";

	treeShowType = "tree-menu";
	$('#apiPathTree .projects').removeClass("tree-lines");
	//if(userSettings.treeShowType == 1) {
	//	treeShowType = "tree-angles";
	//} else if(userSettings.treeShowType == 2) {
	//	treeShowType = "tree-menu";
	//	$('#apiPathTree .projects').removeClass("tree-lines");
	//} else if(userSettings.treeShowType == 3) {
	//	treeShowType = "";
	//} else if(userSettings.treeShowType == 4) {
	//	treeShowType = "tree-folders";
	//} else if(userSettings.treeShowType == 5) {
	//	treeShowType = "tree-chevrons";
	//} else {
	//	userSettings.treeShowType = 1;
	//}
	if(isNotEmpty(treeShowType)) {
		$('#apiPathTree .projects').addClass(treeShowType);
	}
}

function showGlobalLoadingMessage(text, loading) {
	if(loading) {
		text += '<i class="icon icon-spin icon-spinner-snake hide"></i>';
	}
	globalLoadingMessager.$.find(".messager-content").html(text);
}
