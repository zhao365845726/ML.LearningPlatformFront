var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var course_Url = courseUrl(),//ajax请求地址
			ajax_url = ajaxUrl(),//ajax请求地址
			currPages = 1,//分页
			navTitle = '';//左侧导航的值
			
		var param = {
			ClassifyId:'',
			StudyOption:'',
			tag:1,
			PageIndex:1,
			PageSize:8
		};
		//初始选课中心
		var selectCourse = function(){
			var url = 'getcourselist';
			var html = '';
			var typeHtml = '';
			var isActive = '';
			navTitle = '选课中心';
			$.ajax({
				type: "POST",
				data: param,
				dataType: 'json',
				url: course_Url+url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if (data.data) {
						/*右侧*/
						$.each(data.data.lst_course, function(index, item) {
							/*拼接dom*/
							if(Number(index%4) == 0){
								isActive = 'active';
							}else{
								isActive = '';
							}
							if(data.data.StudyOption == 1){
								typeHtml = '<i></i>';
							}else{
								typeHtml = '';
							}
							var url2 = '/compoents/study/course_show.html?id='+item.Id;
							html += '<li class="'+isActive+'"><a href="'+url2+'"><img src="'+item.CoverMap+'" alt=""><p><span>'+item.Name+'</span></p>'+typeHtml+'</a></li>';
						});
						$('.courseLists').html(html);
						/*页码*/
						page(Math.ceil(data.data.coursecount/8));
					}
				}
			})
		}
        //左侧导航
		var leftNav = function(){
			var url = 'getcourseclassifylist';
			var html = '';
			var isActive = '';
			$.ajax({
				type: "POST",
				dataType: 'json',
				url: course_Url+url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if (data) {
						$.each(data, function(index, item) {
							html += '<li class="'+isActive+' " data-id="'+item.Id+'"><a href="javascript:;">'+item.Name+'</a></li>';
						});
						$('.sideBar_l').html(html);
						/*初始左侧导航点击事件*/
						sildeNavClick();
						/*初始课程分类点击事件*/
						courseClassClick();
						/*初始精品，推荐点击事件*/
						courseTagClick();
					}
				}
			})
		}
		//左侧导航点击事件
		var sildeNavClick = function() {
			var ele = $('.sideBar_l li');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
				$(_t).on('click', function() {
					$(_t).addClass('active').siblings().removeClass('active');
					navTitle = $(_t).find('a').html();
					param.ClassifyId = $(_t).attr('data-id');
					param.PageIndex=1;
					currPages = 1;
					courseList(param);
				});
			});
		};
		var courseList = function(param){
			var url = 'getcourselist';
			var html = '';
			var typeHtml = '';
			var isActive = '';
			//console.log(param);
			$.ajax({
				type: "POST",
				data: param,
				dataType: 'json',
				url: course_Url+url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
					/*右侧*/
					//console.log(data);
					$.each(data.data.lst_course, function(index, item) {
						/*拼接dom*/
						if(Number(index%4) == 0){
							isActive = 'active';
						}else{
							isActive = '';
						}
						if(item.StudyOption == 1){
							typeHtml = '<i></i>';
						}else{
							typeHtml = '';
						}
						var url2 = '/compoents/study/course_show.html?id='+item.Id;
						html += '<li class="'+isActive+'"><a href="'+url2+'"><img src="'+item.CoverMap+'" alt=""><p><span>'+item.Name+'</span></p>'+typeHtml+'</a></li>';
					});
					$('.courseLists').html(html);
					if(!IsPC()){
						$(".sideBarTitle").html(navTitle);
						$(".sideBar_l").hide();
					}
					/*页码*/
					$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.coursecount/8));
				}
			});
		}
        //课程分类点击事件
		var courseClassClick = function(){
			var ele = $('.courseSelect label');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
				$(_t).on('click', function() {
					$(_t).addClass('checked').siblings().removeClass('checked');
					var val = $(_t).attr('val');
					param.StudyOption = val;
					param.PageIndex=1;
					currPages = 1;
					courseList(param);
				});
			});
		}
		//精品,推荐点击事件
		var courseTagClick = function(){
			var ele = $('.courseBtns li');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
				$(_t).on('click', function() {
					$(_t).addClass('active').siblings().removeClass('active');
					var num = $(_t).attr('num');
					param.tag = num;
					param.PageIndex=1;
					currPages = 1;
					courseList(param);
				});
			});
		}
		//导航渲染
		var navDom = function(data) {
			var html='',url = '',isActive = '',className = '',num = '';
			$.each(data, function(index, item) {
				if (Number(item.ShowMark)) {
					switch (item.Name) {
                        case '首页':
                            url = '/index.html';
                            break;
                        case '通知公告':
                            className = 'nav_intro';
                            num = item.Id;
                            url = '/compoents/file/introduction.html?id=' + item.Id + '&title=' + item.Name;
                            break;
                        case '安全信息':
                            className = 'nav_file';
                            num = item.Id;
                            url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
                            break;
                        case '文件精神':
                            className = 'nav_safety';
                            num = item.Id;
                            url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
                            break;
                        case "警示教育":
                            className = 'nav_quality';
                            num = item.Id;
                            url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
                            break;
                        case '在线学习':
                            className = 'nav_study';
                            num = item.Id;
                            url = '/compoents/study/study.html?id=' + item.Id + '&title=' + item.Name;
                            break;
                        case "素质提升":
                            className = 'nav_work';
                            num = item.Id;
                            url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
                            break;

						default :
							break;
					}
					//拼接dom;
					html += '<li class="' + isActive + ' ' + className + '" id_num="' + num + '"><a href="' + url + '">' + item.Name + '</a></li>';
				}
			});
			$('.nav').html(html);
			$(".mobileNavLists").html(html);
		}
		//分页逻辑
		var page = function(i) {
			$('#pageBar').whjPaging({
				totalPage: i,
				showPageNum: 4,
				isShowFL: true,//首末页面
				isShowPageSizeOpt: false,
				isShowSkip: false,
				isShowRefresh: false,
				isShowTotalPage: false,
				isResetPage: true,
				callBack: function (currPage, pageSize) {
					param.PageIndex=currPage;
					currPages = currPage;
					courseList(param);
				}
			});
		};
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
			selectCourse();
			leftNav();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
