
/**
 * 两个元素上下、左右拖动动态改变大小
 * @author 暮光：城中城
 * @since 2017年5月7日
 */
(function($){
	$.fn.mgResizebleHeight = function(options) {
		var defaults = {prev:this,next:this, prevHtMin:0, prevHtMax:999, nextHtMin:0, nextHtMax:999};
		var opts = $.extend(defaults, options);
		var disY = 0, prevH = 0, nextH = 0, isStart = false;
		var prev, next, thisObj = this;
		$(document).mousemove(function(ev){
			if(!isStart){return;}
			var ev = ev || window.event;
			var H = ev.clientY - disY;
			var prevHNow = prevH+H, nextHNow = nextH-H;
			if(opts.prevHtMin >= prevHNow) {
				prevHNow = opts.prevHtMin;
				nextHNow = next.outerHeight();
			}
			if(opts.nextHtMin >= nextHNow) {
				nextHNow = opts.nextHtMin;
				prevHNow = prev.outerHeight();
			}
			if(opts.prevHtMax <= prevHNow) {
				prevHNow = opts.prevHtMax;
				nextHNow = next.outerHeight();
			}
			if(opts.nextHtMax <= nextHNow) {
				nextHNow = opts.nextHtMax;
				prevHNow = prev.outerHeight();
			}
			//prev.css("height", prevHNow + 'px');
			//next.css("height", nextHNow + 'px');
			if(typeof opts.onresize == 'function') {
				opts.onresize(prevHNow, nextHNow);
			}
		}).mouseup(function(ev){
			isStart = false;
		});
		$(this).mousedown(function(ev){
			var ev = ev || window.event;
			disY = ev.clientY;
			prev = (opts.prev == thisObj)?$(opts.prev).prev():$(opts.prev);
			next = (opts.next == thisObj)?$(opts.next).next():$(opts.next);
			prevH = prev.outerHeight();
			nextH = next.outerHeight();
			isStart = true;
		});
	}
	/**
	 * 改变宽度的功能，只是实现各种消息的通知，实际改变大小需要在回调里面自己操作
	 */
	$.fn.mgResizebleWidth = function(options) {
		var defaults = {prev:this,next:this, prevWtMin:0, prevWtMax:999, nextWtMin:0, nextWtMax:999};
		var opts = $.extend(defaults, options);
		var disX = 0, prevW = 0, nextW = 0, isStart = false;
		var prev, next, thisObj = this;
		$(document).mousemove(function(ev){
			if(!isStart){return;}
			var ev = ev || window.event;
			var W = ev.clientX - disX;
			var prevWNow = prevW+W, nextWNow = nextW-W;
			if(opts.prevWtMin >= prevWNow) {
				prevWNow = opts.prevWtMin;
				nextWNow = next.outerWidth();
			}
			if(opts.nextWtMin >= nextWNow) {
				nextWNow = opts.nextWtMin;
				prevWNow = prev.outerWidth();
			}
			if(opts.prevWtMax <= prevWNow) {
				prevWNow = opts.prevWtMax;
				nextWNow = next.outerWidth();
			}
			if(opts.nextWtMax <= nextWNow) {
				nextWNow = opts.nextWtMax;
				prevWNow = prev.outerWidth();
			}
			//prev.css("width", prevWNow + 'px');
			//next.css("width", nextWNow + 'px');
			if(typeof opts.onresize == 'function') {
				opts.onresize(prevWNow, nextWNow);
			}
		}).mouseup(function(ev){
			if(!isStart){return;}
			isStart = false;
			if(typeof opts.onfinish == 'function') {
				opts.onfinish();
			}
		});
		$(this).mousedown(function(ev){
			var ev = ev || window.event;
			disX = ev.clientX;
			prev = (opts.prev == thisObj)?$(opts.prev).prev():$(opts.prev);
			next = (opts.next == thisObj)?$(opts.next).next():$(opts.next);
			prevW = prev.outerWidth();
			nextW = next.outerWidth();
			isStart = true;
			if(typeof opts.onstart == 'function') {
				opts.onstart();
			}
		});
	}
})(jQuery);