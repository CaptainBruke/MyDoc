﻿$(function () {
    GetBookTree();

});

function GetBookTree() {

    $.ajax({
        type: "post",
        url: "/Book/GetBookTree",
        dataType: "json",
        success: function (data) {
            var treeHtml = FirstTreeHtml(data);
            $ul = $("#apiPathTree>ul");
            $ul.html(treeHtml);
            if ($ul.children().length <= 0) {
                noDataHtml = `<h2 style="text-align: center;">没有数据😀~</h2>
                              <h3 style="text-align: center;">右键添加笔记或笔记本</h3>`;
                $ul.html(noDataHtml);
            }
            OpenMenu();
        }

    });
}

function FirstTreeHtml(data) {
    if (data == undefined) {
        return "";
    }
    var html = ""
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var firstIndex = i + 1;
        html += `
                <li data-idx="${firstIndex}" data-id="${item.id}" class="has-list">
                    <i class="list-toggle icon"></i>
                    <a href="#" data-type="${item.type}" data-id="${item.id}">${item.name}</a>
                    <ul>
                        ${SecondTreeHtml(firstIndex, item.children)}
                        ${ArticleTreeHtml(firstIndex, 0, item.children)}
                    </ul>
                </li>
`;
    }
    return html;

}

function SecondTreeHtml(firstIndex, data2) {
    var html = "";
    data2 = data2.filter(w => w.type == 2);
    for (var i = 0; i < data2.length; i++) {
        var item = data2[i];
        var secondIndex = i + 1;
        html += `
                  <li data-idx="${secondIndex}" data-id="${firstIndex}-${secondIndex}" class="has-list">
                      <i class="list-toggle icon"></i>
                      <a href="#" data-type="${item.type}" data-id="${item.id}">${item.name}</a>
                      <ul data-idx="${secondIndex}">${ArticleTreeHtml(firstIndex, secondIndex, item.children)}</ul>
                  </li>
`;
    }
    return html;

}

function ArticleTreeHtml(firstIndex, secondIndex, data3) {
    var html = "";
    data3 = data3.filter(w => w.type == 3);
    for (var i = 0; i < data3.length; i++) {
        var item = data3[i];
        var articleIndex = i + 1;
        html += `
              <li m-id="${firstIndex}_${secondIndex}_${articleIndex}" data-idx="${articleIndex}" data-id="${firstIndex}-${secondIndex}-${articleIndex}">
                  <a style="color:red;" href="#" class="show-doc" data-type="${item.type}" data-id="${item.id}">${item.name}<span></span></a>
              </li>
`;
    }
    return html;
}



/**
 * api文档最后的节点点击，展示文档页面
 */
$("#apiPathTree").on("click", ".show-doc", function () {
    $(".tab-page").hide();
    $(".tab-document").show();
    var id = $(this).data("id");
    $.ajax({
        type: "post",
        url: `/Article/Get/${id}`,
        dataType: "json",
        success: function (result) {
            if (result.status == 0) {
                $("#docTitleInput").val(result.data.title);
                ue.setContent(`${result.data.content}`);
                $("#articleId").val(id);
                $("#bookId").val(result.data.book_id);
            }
            else {
                spop({
                    template: `<h4 class="spop-title">获取不到数据：${result.message}</h4>`,
                    position: 'top-center',
                    style: 'warning',
                    autoclose: 5000,
                    onOpen: function () {
                    },
                    onClose: function () {
                    }
                });
            }
        }

    });
});


//右键打开菜单
function OpenMenu() {
    var array = [];
    array.push($("#apiPathTree")[0]);
    for (var item of $("#apiPathTree a")) {
        array.push(item);
    }

    for (var item of array) {
        OpenOneMenu();
        function OpenOneMenu() {
            var menu = $('.menu')[0];
            var drawing = item;

            /*显示菜单*/

            LTEvent.addListener(drawing, "contextmenu", LTEvent.cancelBubble);
            LTEvent.addListener(drawing, "contextmenu", showMenu);
            LTEvent.addListener(document, "click", hideMenu);

            /*隐藏菜单*/
            function hideMenu() {
                menu.style.visibility = 'hidden';
            }

            function showMenu() {
                var dataType = drawing.getAttribute("data-type");
                var dataId = drawing.getAttribute("data-id");

                var menuHtml = GetOpenMenuHtml(dataType, dataId);
                $(menu).html(menuHtml);
                var evt = window.event || arguments[0];

                /*获取当前鼠标右键按下后的位置，据此定义菜单显示的位置*/
                var xedge = evt.clientX;
                var yedge = evt.clientY;

                menu.style.left = `${xedge}px`;
                menu.style.top = `${yedge}px`;
                /*设置菜单可见*/
                menu.style.visibility = "visible";
                LTEvent.addListener(menu, "contextmenu", LTEvent.cancelBubble);
            }
        }
    }

}

//获取右键菜单 html
//type:0-根节点，1-1级笔本，2-2级笔本 ，3-笔记
function GetOpenMenuHtml(type, id) {
    var openMenuHtml = ``;
    switch (type) {
        case "0":
            openMenuHtml = `	
                     <ul>
                    	   <li onclick="CreatBook(0);"><span class="iconfont icon-add-circle"></span>创建笔记本</li>
                     </ul>`;
            break;
        case "1":
            openMenuHtml = `	
                     <ul>
                    	   <li onclick="CreatBook(${id});"><span class="iconfont icon-add-circle"></span>创建笔记本</li>
                    	   <li onclick="CreatArticle(${id});"><span class="iconfont icon-add-circle"></span>添加笔记</li>
                    	   <li onclick="EditBook(${id});"><span class="iconfont icon-edit"></span>修改</li>
                    	   <li onclick="DeleteBook(${id});"><span class="iconfont icon-ashbin"></span>删除</li>
                     </ul>`;
            break;
        case "2":
            openMenuHtml = `	
                     <ul>
                    	   <li onclick="CreatArticle(${id});"><span class="iconfont icon-add-circle"></span>添加笔记</li>
                    	   <li onclick="EditBook(${id});"><span class="iconfont icon-edit"></span>修改</li>
                    	   <li onclick="DeleteBook(${id});"><span class="iconfont icon-ashbin"></span>删除</li>
                     </ul>`;
            break;
        case "3":
            openMenuHtml = `	
                     <ul>
                    	   <li onclick="DeleteArticle(${id});"><span class="iconfont icon-ashbin"></span>删除</li>
                     </ul>`;
            break;

        default: break;
    }
    return openMenuHtml;
}

function CreatBook(bookId) {
    layer.ready(function () {
        var index = layer.open({
            type: 0,
            title: '创建笔记本',
            maxmin: false,
            content: `<input id="bookName" type="text" placeholder="请输入笔记本名称" style="width:261px" />`,
            btn: ["确认创建", "取消"],
            yes: function () {
                var bookName = $("#bookName").val();
                if ($("#bookName").val() == "") {
                    layer.tips('不能为空', '#bookName', { tips: 1 });
                    return false;
                }
                $.ajax({
                    url: "/Book/Add",
                    type: "post",
                    dataType: "json",
                    data: { name: bookName, parent_id: bookId },
                    success: function (result) {
                        if (result.status == 0) {
                            GetBookTree();
                            layer.close(index);
                        }
                        else {
                            layer.tips(`${result.message}`, '#bookName', { tips: 1 });
                        }
                    }
                });
            }
        });
    });
}

function EditBook(bookId) {
    $.ajax({
        url: "/Book/Get",
        type: "post",
        dataType: "json",
        data: { id: bookId },
        success: function (result) {
            if (result.status == 0) {

                var data = result.data;

                layer.ready(function () {
                    var index = layer.open({
                        type: 0,
                        title: '修改笔记本',
                        maxmin: false,
                        content: `<input id="bookName" value="${data.name}" type="text" placeholder="请输入笔记本名称" style="width:261px" />`,
                        btn: ["确认创建", "取消"],
                        yes: function () {
                            var bookName = $("#bookName").val();
                            if ($("#bookName").val() == "") {
                                layer.tips('不能为空', '#bookName', { tips: 1 });
                                return false;
                            }
                            $.ajax({
                                url: "/Book/Edit",
                                type: "post",
                                dataType: "json",
                                data: { name: bookName, id: bookId, parent_id: data.parent_id },
                                success: function (result2) {
                                    if (result2.status == 0) {
                                        GetBookTree();
                                        layer.close(index);
                                    }
                                    else {
                                        layer.tips(`${result2.message}`, '#bookName', { tips: 1 });
                                    }
                                }
                            });
                        }
                    });
                });
            }
            else {
                layer.tips(`${result.message}`, '#bookName', { tips: 1 });
            }
        }
    });

}

function CreatArticle(bookId) {
    layer.ready(function () {
        var index = layer.open({
            type: 0,
            title: '添加笔记',
            maxmin: false,
            content: `<input id="title" type="text" placeholder="请输入标题" style="width:261px" />`,
            btn: ["确认添加", "取消"],
            yes: function () {
                var title = $("#title").val();
                if ($("#title").val() == "") {
                    layer.tips('不能为空', '#title', { tips: 1 });
                    return false;
                }
                $.ajax({
                    url: "/Article/Add",
                    type: "post",
                    dataType: "json",
                    data: { title: title, content: "", book_id: bookId },
                    success: function (result) {
                        if (result.status == 0) {
                            GetBookTree();
                            layer.close(index);
                        }
                        else {
                            layer.tips(`${result.message}`, '#title', { tips: 1 });
                        }
                    }
                });
            }
        });
    });
}

function DeleteBook(bookId) {
    layer.ready(function () {
        layer.confirm("确认删除？", function () {
            $.ajax({
                url: "/Book/Delete",
                type: "post",
                dataType: "json",
                data: { id: bookId },
                success: function (result) {
                    if (result.status == 0) {
                        GetBookTree();
                        layer.closeAll();
                    }
                    else {
                        layer.msg(`${result.message}`);
                    }
                }
            });
        });
    });
}

function DeleteArticle(articleId) {
    layer.ready(function () {
        layer.confirm("确认删除？", function () {
            $.ajax({
                url: "/Article/Delete",
                type: "post",
                dataType: "json",
                data: { id: articleId },
                success: function (result) {
                    if (result.status == 0) {
                        GetBookTree();
                        layer.closeAll();
                    }
                    else {
                        layer.msg(`${result.message}`);
                    }
                }
            });
        });
    });
}

function EditArticleButton() {

}

function SaveArticleButton() {
    //$("#docTitleInput").val(result.data.title);
    //ue.setContent(`${result.data.content}`);
    //$("#articleId").val(id);
    //$("#bookId").val(result.data.book_id);
    var data = { id: $("#articleId").val(), title: $("#docTitleInput").val(), content: ue.getContent(), book_id: $("#bookId").val() };
    if (data.id == "" || data.title == "" || data.book_id=="") {
        layer.msg(`未能正确保存`);
        return false;
    }

    $.ajax({
        url: "/Article/Edit",
        type: "post",
        dataType: "json",
        data: data,
        success: function (result) {
            if (result.status == 0) {
                layer.msg(`保存成功`);
            }
            else {
                layer.msg(`${result.message}`);
            }
        }
    });
}

document.onkeydown = function () {
    // 判断 Ctrl+S
    if (event.ctrlKey == true && event.keyCode == 83) {
        SaveArticleButton();
        // 或者 return false;
        event.preventDefault();
    }
}