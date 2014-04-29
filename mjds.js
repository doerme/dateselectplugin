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
	var array_mark="";
	var array_content=[];
	/*日历主体*/
	for(var j=1;j<=monthsNum[m];f++,j++){
	  $("li.month-cell > span").eq(f).text(j).attr({"y":FullYear,"m":m,"d":j}).parent().addClass("pink");
	  array_mark=FullYear+pad(m)+pad(j);
	  if(isset(o.jsondata.daydata[array_mark])){
	   drawdata(o.jsondata.daydata[array_mark],f);
	  }
	}
	
	/*填充后空白*/
	for(var n=1;f<42;f++,n++){
	$("li.month-cell > span").eq(f).text(n).attr({"y":nextmonth.getFullYear(),"m":nextmonth.getMonth(),"d":n}).parent().addClass("future");	
	  array_mark=nextmonth.getFullYear()+pad(nextmonth.getMonth())+pad(n);
	  if(isset(o.jsondata.daydata[array_mark])){
	   drawdata(o.jsondata.daydata[array_mark],f);
	  }
	}
	
	/*填充前空白*/
	var tmp_max_day=0;
	if(m-1<0){tmp_max_day=monthsNum[11]}else{tmp_max_day=monthsNum[m-1]}
	for(var n=firstDay-1;n>=0;n--,tmp_max_day--){
		$("li.month-cell > span").eq(n).text(tmp_max_day).attr({"y":prevmonth.getFullYear(),"m":prevmonth.getMonth(),"d":tmp_max_day}).parent().addClass("past");
		 array_mark=prevmonth.getFullYear()+pad(prevmonth.getMonth())+pad(tmp_max_day);
		  if(isset(o.jsondata.daydata[array_mark])){
		   drawdata(o.jsondata.daydata[array_mark],n);
		  }
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
	
  /*日历点击 选择事件*/
  	function monthcellclick(cell){
	    if(cell.hasClass("week")){return;}
		var selected_point_1=cell.index();
		var selected_point_2=cell.index();
		console.log($(".month-cell.selected").size());
		if($(".month-cell.selected").size()==1){selected_point_1=$(".month-cell.selected").eq(0).index();}
		if($(".month-cell.selected").size()>1){
		/*大于一说明已经选择了开始于结束 重新选择逻辑*/
		$(".month-cell.selected").removeClass("selected");
		}
		for(var n=gomin(selected_point_1,selected_point_2);n<=gomax(selected_point_1,selected_point_2);n++){
			$(".month-cell").eq(n).addClass("selected");
		}	
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
	   jsondata:{}, /*日历之中填写的数据*/
	   show_model:"month"
  };  

})(jQuery); 