/**
 * 以树形方式生成并展示：
 * /api
 *   /data
 *     /getDateList
 *       post
 *       get
 * @author 暮光：城中城
 * @since 2018年5月26日
*/

/**
 * 把原始的json字符串转换成对象列表的方式，方便后续使用
 * @param json swagger的原始对象
 * @returns
 */
function createTreeViewByTree(json, keywords) {
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
		var keyArr = key.split("/");
		var nowPathObj = null;
		keyArr.forEach(function(val, index) {
			//console.log(val, index);
			if(isEmpty(val) && index == 0) {
				return;
			}
			var nowPath = "/" + val;
			if(nowPathObj == null) {
				nowPathObj = {};
				nowPathObj[nowPath] = pathIndex[nowPath];
				if(nowPathObj[nowPath] == null) {
					nowPathObj[nowPath] = {};
					pathIndex[nowPath] = nowPathObj[nowPath];
				}
			}
			var tempPathObj = nowPathObj[nowPath];
			if(isEmpty(tempPathObj)) {
				tempPathObj = nowPathObj[nowPath] = {};
			}
			nowPathObj = tempPathObj;
			if(index == keyArr.length - 1) {
				//get, head, post, put, patch, delete, options, trace
				setRequestMethodForTree(domain, paths[key], tempPathObj, key, "get");
				setRequestMethodForTree(domain, paths[key], tempPathObj, key, "head");
				setRequestMethodForTree(domain, paths[key], tempPathObj, key, "post");
				setRequestMethodForTree(domain, paths[key], tempPathObj, key, "put");
				setRequestMethodForTree(domain, paths[key], tempPathObj, key, "patch");
				setRequestMethodForTree(domain, paths[key], tempPathObj, key, "delete");
				setRequestMethodForTree(domain, paths[key], tempPathObj, key, "options");
				setRequestMethodForTree(domain, paths[key], tempPathObj, key, "trace");
			}
		});
	});
	var htmlStr = '<li>';
	htmlStr += '<a href="#">'+json.info.title+'</a>';
	htmlStr += '<ul>';
	htmlStr += getTreeHtmlForTree(pathIndex, projectTreeIdIndex);
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
function setRequestMethodForTree(domain, source, pathObj, url, method) {
	if (isEmpty(source[method])) {
		return;
	}
	var tempPath = projectTreeIdIndex + url + "." + method;
	pathObj[method] = source[method];
	pathObj[method].path = tempPath;
	pathObj[method].url = url;
	pathObj[method].method = method;
	pathObj[method].domain = domain;
	treePathDataMap.set(tempPath, source[method]);
}

/**
 * 将对象列表递归的方式转换成文档格式html字符串
 * @param pathData 处理后的对象列表
 * @returns 生成的html字符串
 */
function getTreeHtmlForTree(pathData, treeIdStr) {
	var tempStr = "";
	var indexNow = 1;
	Object.keys(pathData).forEach(function(key){
		var tempNode = pathData[key];
		var tempTreeId = treeIdStr + "_" + indexNow;
		var nodeSub = getObjectFirstAttributeIfOnly(tempNode);
		if(nodeSub != null && isNotEmpty(nodeSub.method)) {
			//console.log(nodeSub);
			nodeSub.treeId = tempTreeId;
			var summary = isEmpty(nodeSub.summary) ? "" : "("+nodeSub.summary+")";
			if(summary.length > 10){
				summary = summary.substring(0, 10)+"...)";// 防止被撑得太长，只显示10个字
			}
			tempStr += '<li m-id="'+tempTreeId+'"><a href="#" class="show-doc" path="'+nodeSub.path+'">'+key+'<span>'+summary+'</span></a></li>';
		} else if(key.indexOf("/") < 0) {
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
			tempStr += getTreeHtmlForTree(tempNode, tempTreeId);
			tempStr += '</ul>';
			tempStr += '</li>';
		}
		indexNow++;
	});
	return tempStr;
}

