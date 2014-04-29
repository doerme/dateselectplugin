/*
* JeremyDateSelect 1.0
* Copyright (c) 2014 JeremyLiang http://www.xwarrant.com/ 
* Date: 2014-03-27 
* 绘制日历插件 
*/
(function($){ 
$.fn.jdateselect = function(options){ 
	
	var opts = $.extend({},$.fn.jdateselect.defaults, options);
	
	return this.each(function(){

	pj=$(this);
	var nowaday=new Date();/*客户端日期*/
	var o = $.meta ? $.extend({}, opts, pj.data()) : opts;
	var FullYear=o.today.getFullYear(); /*年*/
	var m=o.today.getMonth(); /*月*/
	var month=o.today.getMonth()+1<10?"0"+parseInt(o.today.getMonth()+1):parseInt(o.today.getMonth()+1); /*月份*/
	var date=o.today.getDate(); /*日期*/
	var day=o.today.getDay(); /*星期*/
	var monthsNum=[31,28,31,30,31,30,31,31,30,31,30,31];
	var weekFont=["日","一","二","三","四","五","六"];
	
	var nextmonth=new Date();
	nextmonth.setFullYear(o.today.getFullYear());
	nextmonth.setMonth(parseInt(o.today.getMonth())+1); /*上一个月*/
	var prevmonth=new Date();
	prevmonth.setFullYear(o.today.getFullYear());
	prevmonth.setMonth(parseInt(o.today.getMonth())-1); /*下一个月*/
	
	/*绘制月历*/
	pj.html("");/*清空标签内容*/
	/*创建月历框体*/
	
	pj.attr({"y":FullYear,"m":m});
	var isleapyear=FullYear%4; /*闰年*/
	var firstDay=day-(date%7-1); /*月初星期*/	
	if(isleapyear==0){ monthsNum[1]=29; }
	if(day==0){ day = 7; }
	if(firstDay==7){ firstDay =0; }
	if(firstDay<=0){ firstDay +=7; }
	$("<ul class=month-body></ul>").appendTo(pj);
	for(var i=0;i<42;i++){
	$("<li><span></span></li>").appendTo(".month-body").addClass("month-cell");
	}
	var f = firstDay;
	/*填充日历数据*/
	var array_mark="";
	var array_content=[];
	/*日历主体*/
	for(var j=1;j<=monthsNum[m];f++,j++){
	  array_mark=FullYear+pad(m)+pad(j);
	  $("li.month-cell > span").eq(f).text(j).parent().addClass("pink").attr({"ymd":array_mark});
	  if(isset(o.jsondata.daydata[array_mark])){
	   $("li.month-cell > span").eq(f).parent(),drawdata(o.jsondata.daydata[array_mark],f);
	   markdata(o.jsondata.daydata[array_mark],f);
	  }
	}
	
	/*填充后空白*/
	for(var n=1;f<42;f++,n++){
	array_mark=nextmonth.getFullYear()+pad(nextmonth.getMonth())+pad(n);
	$("li.month-cell > span").eq(f).text(n).parent().addClass("future").attr({"ymd":array_mark});	
	  
	  if(isset(o.jsondata.daydata[array_mark])){
	   $("li.month-cell > span").eq(f).parent(),drawdata(o.jsondata.daydata[array_mark],f)	  
	   markdata(o.jsondata.daydata[array_mark],f);
	  }
	}
	
	/*填充前空白*/
	var tmp_max_day=0;
	if(m-1<0){tmp_max_day=monthsNum[11]}else{tmp_max_day=monthsNum[m-1]}
	for(var n=firstDay-1;n>=0;n--,tmp_max_day--){
	     array_mark=prevmonth.getFullYear()+pad(prevmonth.getMonth())+pad(tmp_max_day);
		$("li.month-cell > span").eq(n).text(tmp_max_day).parent().addClass("past").attr({"ymd":array_mark});
		
		  if(isset(o.jsondata.daydata[array_mark])){
		   $("li.month-cell > span").eq(n).parent(),drawdata(o.jsondata.daydata[array_mark],n);
		   markdata(o.jsondata.daydata[array_mark],n);
		}
	}

	/*选中已选择的日期*/
	var had_select=$.trim($("#selected-day").val())==''?[]:$.parseJSON($("#selected-day").val());
	if(had_select.length>0){
	$.each($(".month-cell"),function(){
		if($.inArray($(this).attr("ymd"),had_select)>-1){$(this).addClass("selected");}
		});
	}
	
	/*标出当天*/
	if(Math.abs(nowaday.getTime()-o.today.getTime())<3600){
	$("li.month-cell > span").eq(firstDay-1+date).parent().addClass("red");
	}
	
	$("<div class=month-head><span></span></div>").prependTo(pj);
	$(".month-head > span").text(FullYear+"年"+month+"月");
	
	/*星期数title*/
	for(var n=0;n<weekFont.length;n++){
		$("<div class=month-cell><span>"+weekFont[n]+"</span></div>").prependTo(".month-body").addClass("week");
	}
		
	
	
	/*绑定点击事件*/
	pj.undelegate(".month-cell","click");
	pj.delegate(".month-cell","click",function(){
		monthcellclick($(this));
	});
	
	});
  };/*end jdateselect*/
  
  /*根据jsondata内容绘制日期格中的内容*/
    function drawdata(array_content,f){
	  for(items in array_content){
		  $("li.month-cell > span").eq(f).append("<p>"+items+""+array_content[items]+"</p>")
	  }
	}

  /* 为日期标签标上属性 */
	function markdata(array_content,f){
	 var tmp_subscript=0;
	 for(items in array_content){
		  $("li.month-cell > span").eq(f).parent().attr("v"+tmp_subscript++,array_content[items]);
	  }
	}
	
  /* 日历点击 选择事件 >>>>>按需要改动<<<<<  */
  	function monthcellclick(cell){
	    if(cell.hasClass("week")){return;}
		var selected_point_1=cell.index();
		var selected_point_2=cell.index();
		console.log($(".month-cell.selected").size());
		if($(".month-cell.selected").size()==1){selected_point_1=$(".month-cell.selected").eq(0).index();}
		if($(".month-cell.selected").size()>1){
		/*大于一说明已经选择了开始于结束 重新选择逻辑*/
		$(".month-cell.selected").removeClass("selected");
		}else{
		for(var n=gomin(selected_point_1,selected_point_2);n<=gomax(selected_point_1,selected_point_2);n++){
			$(".month-cell").eq(n).addClass("selected");
		}
		}
		/*保存已经选择的日期*/
		savestate();
	}
	
	/*记录选中的日期
	param 删除指定的排期
	*/
	function savestate(){
		var tmp_json_value=$.trim($("#selected-day").val())==''?[]:$.parseJSON($("#selected-day").val());
		var total_period=[];
		var tmp_array=[];
		$.each($(".month-cell.selected"),function(){
		total_period.push($(this).attr("ymd"));
		});
		tmp_json_value=tmp_json_value.concat(total_period)
		tmp_json_value.sort();
        tmp_array=uniqueArray(tmp_json_value);
		$("#selected-day").val(JSON.stringify(tmp_array));
	}
	
	/*去除数组重复元素*/
	function uniqueArray(a){
    temp = new Array();
    for(var i = 0; i < a.length; i ++){
        if(!contains(temp, a[i])){
            temp.length+=1;
            temp[temp.length-1] = a[i];
        }
    }
    return temp;
    }
	
	/*判断数组a是否含有元素e*/
	function contains(a, e){
		for(j=0;j<a.length;j++)if(a[j]==e)return true;
		return false;
	}
  
  /*isset*/
	function isset(variable){
	  	return typeof(variable)=='undefined' ? false : true;
	}

  /*返回2个数之中的最大值*/
    function gomax(a,b){
	return a>b?a:b;
	}
  /*返回2个数之中的最小值*/	
    function gomin(a,b){
	return a<b?a:b;
	}
  /*2位数补0*/
	function pad(num) {
		var len = num.toString().length;
		 while(len < 2) {
		 num = "0" + num;
		 len++;
		 }
		 return num;
	}

  /* 插件的defaults     */
  $.fn.jdateselect.defaults = {    
       today:new Date(),/*绘制月历月份所属的当前日期*/
	   jsondata:{} /*日历之中填写的数据*/
  };  

})(jQuery); 