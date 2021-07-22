/**
 * 提示工具类
 * @author 暮光：城中城
 * @since 2017年5月7日
 */
var Toast = {
	notOpen:function(){
		var data = {
			message:"该功能暂未开放，敬请期待！",
			icon: 'heart',type:"warning",
		};
		this.show(data);
	},
	warn:function(msg, time){
		var data = {
			message:msg,time:time,
			icon: 'heart',type:'warning',
		};
		this.show(data);
	},
	error:function(msg, time){
		var data = {
			message:msg,time:time,
			icon: 'exclamation-sign',type:'danger',
		};
		this.show(data);
	},
	show:function(data){
		data.time = isEmpty(data.time)?2000:data.time;
		data.placement = isEmpty(data.placement)?'top':data.placement;
		new $.zui.Messager(data.message, data).show();
	}
}