/**
 * 以每个Tag方式生成并展示：
 * 核心信息控制器
 *   /api/data/getDataList
 *   /api/data/getDataDetail
 * 跟进控制器
 *   /api/track/getTrackList
 *   /api/track/getTrackDetail
 * 
 * 先把树形的写完了再写这个,,
 * 
 * @author 暮光：城中城
 * @since 2018年5月26日
*/

function createTreeViewByTag(json, keywords) {
	var pathIndex = {};
	var paths = json.paths;
	var domain = json.domainUrl;// 服务器代理会返回此属性
	if(isEmpty(domain)) {
		domain = "http://" + json.host + json.basePath;
	}
	if(domain.endWith("/")) {
		domain = domain.substring(0, domain.length - 1);
	}
	if (isEmptyObject(paths)) {
		return;
	}
	//console.log(paths);
	Object.keys(paths).forEach(function(key){
		//console.log(key, paths[key]);
		if(!findInPathsValue(key, paths[key], keywords)) {
			return;
		}
		setRequestMethodForTag(domain, paths[key], pathIndex, key, "get");
		setRequestMethodForTag(domain, paths[key], pathIndex, key, "head");
		setRequestMethodForTag(domain, paths[key], pathIndex, key, "post");
		setRequestMethodForTag(domain, paths[key], pathIndex, key, "put");
		setRequestMethodForTag(domain, paths[key], pathIndex, key, "patch");
		setRequestMethodForTag(domain, paths[key], pathIndex, key, "delete");
		setRequestMethodForTag(domain, paths[key], pathIndex, key, "options");
		setRequestMethodForTag(domain, paths[key], pathIndex, key, "trace");
	});
	//console.log(pathIndex);
	var htmlStr = '<li>';
	htmlStr += '<a href="#">'+json.info.title+'</a>';
	htmlStr += '<ul>';
	htmlStr += getTreeHtmlForTag(pathIndex, projectTreeIdIndex);
	htmlStr += '</ul>';
	htmlStr += '</li>';
	$('#apiPathTree .projects').append(htmlStr);
	projectTreeIdIndex++;
}

/**
 * 设置对象的各种请求方式，存在则复制
 * @param source 资源，原始json的paths的指定对象
 * @param pathObj 当前的待赋值对象
 * @param url url绝对路径
 * @param method 请求方式，post、get...
 * @returns
 */
function setRequestMethodForTag(domain, source, pathObj, url, method) {
	if (isEmpty(source[method])) {
		return;
	}
	source[method].tags.forEach(function(val, index) {
		var tempObj = pathObj[val];
		if(isEmpty(tempObj)) {
			tempObj = pathObj[val] = {};
		}
		var tempUrlObj = tempObj[url];
		if(isEmpty(tempUrlObj)) {
			tempUrlObj = tempObj[url] = {};
		}
		var tempPath = projectTreeIdIndex + url + "." + method;
		tempUrlObj[method] = source[method];
		tempUrlObj[method].path = tempPath;
		tempUrlObj[method].url = url;
		tempUrlObj[method].method = method;
		tempUrlObj[method].domain = domain;
		treePathDataMap.set(tempPath, source[method]);
	});
}

/**
 * 将对象列表递归的方式转换成文档格式html字符串
 * @param pathData 处理后的对象列表
 * @returns 生成的html字符串
 */
function getTreeHtmlForTag(pathData, treeIdStr) {
	var tempStr = "";
	var indexNow = 1;
	// get, head, post, put, patch, delete, options, trace
	var actionArrays = ["get", "head", "post", "put", "patch", "delete", "options", "trace"];
	Object.keys(pathData).forEach(function(key){
		var tempNode = pathData[key];
		var tempTreeId = treeIdStr + "_" + indexNow;
		// 只有一个子元素，而且有method元素，说明是只有一个节点
		var nodeSub = getObjectFirstAttributeIfOnly(tempNode);
		if(nodeSub != null && isNotEmpty(nodeSub.method)) {
			var summary = isEmpty(nodeSub.summary) ? "" : "(" + nodeSub.summary + ")";
			if(summary.length > 10){
				summary = summary.substring(0, 10)+"...)";// 防止被撑得太长，只显示10个字
			}
			nodeSub.treeId = tempTreeId;
			tempStr += '<li m-id="'+tempTreeId+'"><a href="#" class="show-doc" path="'+nodeSub.path+'">'+key+'<span>'+summary+'</span></a></li>';
		} else if(haveString(actionArrays, key)) {
			//console.log(tempTreeId);
			tempNode.treeId = tempTreeId;
			var summary = isEmpty(tempNode.summary) ? "" : "("+tempNode.summary+")";
			if(summary.length > 10){
				summary = summary.substring(0, 10)+"...)";// 防止被撑得太长，只显示10个字
			}
			tempStr += '<li m-id="'+tempTreeId+'"><a href="#" class="show-doc" path="'+tempNode.path+'">'+key+'<span>'+summary+'</span></a></li>';
		} else {
			tempStr += '<li>';
			tempStr += '<a href="#">'+key+'</a>';
			tempStr += '<ul>';
			tempStr += getTreeHtmlForTag(tempNode, tempTreeId);
			tempStr += '</ul>';
			tempStr += '</li>';
		}
		indexNow++;
	});
	return tempStr;
}

