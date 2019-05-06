//轮播图
var silde = {

	marquee:function (box,list,left,right,num,movetime){
		var num=num||1;
		var aa=list;
		var leng=list.outerWidth()+parseInt(list.css("marginRight"));
		var nus=list.length;
		box.css("width",nus*leng);
		function move () {
			box.animate({left:num*-leng},function  () {
				for (var i=0; i<num; i++) {
					box.append($(".slideLists>li").eq(0));
				}
				box.css("left",0);
			})
		}
		var t=setInterval(move,movetime);
		left.hover(function  () {
			clearInterval(t)
		},function  () {
			t=setInterval(move,movetime);
		})
		right.hover(function  () {
			clearInterval(t)
		},function  () {
			t=setInterval(move,movetime);
		})
		left.click(function  () {
			move();
		})
		right.click(function  () {
			box.css("left",-num*leng);
			for (var i=0; i<num; i++) {
				box.prepend($(".slideLists>li").last());
			}
			box.animate({left:0});
		})
	}//底部的轮播效果
};
var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var course_Url = courseUrl(),//ajax请求地址
			ajax_url = ajaxUrl(), //ajax请求地址
			safetytrain_navid = '',
			quality_navid = '',
			file_navid = '',
			dataTpl = '',
			data_p = {
                "remmendnews": {
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "notices": {
                    "navid": "e7e1b186-1e3e-480b-b495-1d310ccef9da",
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "safetyinfo": {
                    "navid": "a9ca415e-41b2-4662-9129-d580753d123f",
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "filespirit": {
                    "navid": "09a92fda-6732-4f02-9665-34adc1a8729b",
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "excellentcourse": {
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "activities": {
                    "navid": "",
                    "PageIndex": 1,
                    "PageSize": 6
                }
			};//[轮播，通知公告，安全培训，素质提升，精品课程，竞赛鉴定，文件制度，疑问解答，活动掠影]
		//导航渲染
		var navDom = function(data) {
			var html='',url = '',isActive,className = '',num = '',more1 ='',more2='',more3='',more4='';
			$.each(data, function(index, item) {
				if(Number(item.ShowMark)) {
					switch (item.Name) {
						case '首页':
							url = '/index.html';
							break;
						case '通知公告':
							className = 'nav_intro';
							num = item.Id;
                            url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
                            more1= '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case '安全信息':
							className = 'nav_file';
							num = item.Id;
							url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							more2 = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case '文件精神':
							className = 'nav_safety';
							num = item.Id;
							url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							more3 = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case "警示教育":
							className = 'nav_quality';
							num = item.Id;
							url = '/compoents/file/introduction.html?id=' + item.Id + '&title=' + item.Name;
							more4= '/compoents/file/introduction.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case '在线学习':
							className = 'nav_study';
							num = item.Id;
							url = '/compoents/study/study.html?id=' + item.Id + '&title=' + item.Name;
							break;
                        case "安全培训":
                            className = 'nav_quality';
                            num = item.Id;
                            url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
                            break;
						case "素质提升":
                            className = 'nav_work';
                            num = item.Id;
                            url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							break;
						default :
							break;
					}
					isActive = item.Name == '首页' ? 'active' : '';
					//拼接dom;
					html += '<li class="' + isActive + ' ' + className + '" id_num="' + num + '"><a href="' + url + '">' + item.Name + '</a></li>';
                    $(".safety_more").attr('href',more2);$(".quality_more").attr('href',more3);$(".nore1").attr('href',more1);$('.warnmore').attr('href',more4)

				}else{
					//拼接dom;
					switch (item.Name) {
						case "资料下载":
							className = 'nav_load';
							num = item.Id;
							html += '<li class="displayNone ' + className + '" id_num="' + num + '"></li>';
							break;
						case "活动掠影":
							className = 'nav_activity';
							num = item.Id;
							html += '<li class="displayNone ' + className + '" id_num="' + num + '"></li>';
							break;
						default :
							break;
					}

				}
			});
			$('.nav').html(html);
			$(".mobileNavLists").html(html);
			fnAddHref();
		};
		//banner,通知，安全培训，素质提升，大师工作，制度文件渲染
		var temlDom = function(){
			var url = "gethomedata";

			// console.log(data_p);
			$.ajax({
				type: "POST",
				data: data_p,
				dataType: 'json',
				url: ajax_url + url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
					console.log(data);
					if (data.data) {
						dataTpl = data.data;
						temlDomList(dataTpl);
					}
				}
			})
		};
		var temlDomList = function(data){
			remmendnews(data.lst_recommendnews);
			notices(data.lst_notices);
			safetytraining(data.lst_safetytraining);
			qualityimprovement(data.lst_qualityimprovement);
            excellentcourse(data.lst_excellentcourse)
		};
		//最新消息banner
		var remmendnews = function(data) {
			var url,html = '';
			data && $.each(data, function(index, item) {
				/*拼接dom*/
				url = '/compoents/notice/notice_show.html?id='+item.Id+'&title=最新消息&parentId=';
				html += '<li class="carousel-item"><a href="'+url+'"><img src="'+item.CoverPhoto+'" alt=""><div class="shade">'+item.Title+'</div></a></li>';
			});
			$('.m_unit').html(html);
		};
		//通知公告
		var notices = function(data) {
			var url,html = '';
			data && $.each(data, function(index, item) {
				/*拼接dom*/
				url = '/compoents/notice/notice_show.html?id='+item.Id+'&title=最新消息&parentId=';
				html +='<li><a href="'+url+'">'+item.Title+'</a></li>';
			});
			$('.noticeMsg').html(html);
		};
		//安全信息
		var safetytraining = function(data) {
			var url,html = '';
			data && $.each(data, function(index, item) {
				/*拼接dom*/
				url = '/compoents/notice/notice_show.html?id='+item.Id+'&title=最新消息&parentId=';
				html += '<li><a href="'+url+'">'+item.Title+'</a><b>'+item.CreateTime+'</b></li>';
			});
			$('.column_safety').html(html);
			var more_href = $(".nav_file a").attr('href');
			// $(".safety_more").attr('href',more_href);
		};
		//文件精神
		var qualityimprovement = function(data) {
			var url,html = '';
			data && $.each(data, function(index, item) {
				/*拼接dom*/
				url = '/compoents/notice/notice_show.html?id='+item.Id+'&title=最新消息&parentId=';
				html += '<li><a href="'+url+'">'+item.Title+'</a><b>'+item.CreateTime+'</b></li>';
			});
			$('.column_quality').html(html);
			// var more_href = $(".nav_safety a").attr('href');
			// $(".quality_more").attr('href',more_href);
		};
		//精品课程
		var excellentcourse = function (data) {
				var url,html ='';
            data && $.each(data, function(index, item) {
                /*拼接dom*/
                url = '/compoents/study/course_show.html?id='+item.Id;
                if(item.StudyOption == 1){
                   						typeHtml = '<i></i>';
                  				}else{
                 					typeHtml = '';
                   				}
                html += '<li><a href="'+url+'"><img src="'+item.CoverMap+'" alt=""><p><span>'+item.Name+'</span></p>'+typeHtml+'</a></li>';
            });
            $('.excellentcourse').html(html);
        };
		//活动掠影
		// var activities = function() {
		// 	var param = {
		// 		pageindex : 1,
		// 		pagesize : 6
		// 	};
		// 	var url = "getactivitylist";
		// 	var html = '';
		// 	$.ajax({
		// 		type: 'POST',
		// 		data: param,
		// 		url: ajax_url + url,
		// 		crossDomain: true == !(document.all),
		// 		dataType: 'json',
		// 		success: function(data, type) {
		// 			data.data.lst_activitylist && $.each(data.data.lst_activitylist, function(index, item) {
		// 				/*拼接dom*/
		// 				url = '/compoents/notice/notice_show.html?id='+item.Id+'&title=活动掠影&parentId=2';
		// 				html += '<li class="swiper-slide"><a href="'+url+'"><img src="'+item.CoverPhoto+'" alt=""><p>'+item.Title+'</p></a></li>';
		// 			});
		// 			$('.activities').html(html);
		// 			   /*若是PC端（活动掠影）轮播，否不轮播*/
		// 			if(IsPC()){
		// 				silde.marquee($(".slideLists"),$(".slideLists>li"),$(".btnLeft"),$(".btnRight"),1,3000);
		// 			}else{
		// 				var slideLists_h = $(".slideLists>li").height() + parseInt($(".slideLists>li").css("marginBottom"));
		// 				$(".activitySlide").css('height',slideLists_h*2);
		// 			}
		// 		}
		// 	});
		// };
		//警示教育
		// var excellentcourse = function() {
		// 	var url = 'getcourselist';
		// 	var html = '';
		// 	var param = {
		// 		ClassifyId:'',
		// 		StudyOption:'',
		// 		PageIndex:1,
		// 		PageSize:4
		// 	};
		// 	var typeHtml = '';
		// 	$.ajax({
		// 		type: "POST",
		// 		data: param,
		// 		dataType: 'json',
		// 		url: course_Url+url,
		// 		crossDomain: true == !(document.all),
		// 		success: function(data, type) {
		// 			if (data.data) {
		// 				data.data.lst_course && $.each(data.data.lst_course, function(index, item) {
		// 					/*拼接dom*/
		// 					url = '/compoents/study/course_show.html?id='+item.Id;
		// 					if(item.StudyOption == 1){
		// 						typeHtml = '<i></i>';
		// 					}else{
		// 						typeHtml = '';
		// 					}
		// 					html += '<li><a href="'+url+'"><img src="'+item.CoverMap+'" alt=""><p><span>'+item.Name+'</span></p>'+typeHtml+'</a></li>';
		// 				});
		// 				$('.excellentcourse').html(html);
		// 			}
		// 		}
		// 	})
		// };





		//获取友情链接
		var Friendlink = function(){
			var param = {
				"PageIndex": 1,
				"PageSize": 10
			};
			var url = "getfriendlinklist";
			var html = '';
			$.ajax({
				type: "POST",
				data: param,
				dataType: 'json',
				url: ajax_url + url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if (data.data) {
						data.data && $.each(data.data, function(index, item) {
							html += '<a href="'+item.Url+'" target="_blank">'+item.Name+'</a>';
						});
						html = '友情链接： ' + html;
						$(".freadHref").html(html);
					}
				}
			})
		}
		//是否登录
		var isLogin = function(){
			var falg = $.cookie('userId');
			if(falg){
				$.ajax({
					type: "POST",
					data: {userId:falg},
					dataType: 'json',
					url: isLoginUrl(),
					crossDomain: true == !(document.all),
					success: function(data, type) {
						if(data.status_code == 200){
							if(IsPC()){
								$(".login_Account span").html(data.data.Account);
								$(".login_RealName span").html(data.data.RealName);
								$(".login_err").css('visibility','hidden');
								$(".login_in").hide();
								$(".FingerPrint").hide();
								$(".login_out").show();
							}else{
								$(".loginBox_mobile_out .login_Account span").html(data.data.Account);
								$(".loginBox_mobile_out .login_RealName span").html(data.data.RealName);
								$.cookie('userId', data.data.UserId);
								$.cookie('myData', JSON.stringify(data.data));
							}
						}
					}
				})
			}
		}
		// 登录后给按钮加链接
		function fnAddHref() {
			var url = $(".nav_study a").attr('href');
            $(".simulationExercise").attr('href',url);
            $(".myTest").attr('href',url.split("&")[0]+'&title=每季一考');
            $(".aDailyTopic").attr('href',url.split("&")[0]+'&title=每日一题');
            $(".achievements").attr('href',url.split("&")[0]+'&title=查看成绩');
		}
		//初始数据请求
		var init = function() {
			var url = "homenavigation";
			$.ajax({
				type: "POST",
				data: "",
				dataType: 'json',
				url: ajax_url + url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if (data.status_code == 200) {
						navDom(data.data);
						init_second();
					}
				}
			})
		};
		var init_second = function(){
			isLogin();
			// studySubnaudioVideo();
			temlDom();
			// activities();
			excellentcourse();
			// work();
			// dataLoad();
			// interrogativeanswers();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})

})(window, jQuery);
