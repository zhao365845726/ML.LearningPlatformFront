var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var ajax_url = ajaxUrl();
		var param = {
				pageindex : 1,
				pagesize : 6
			};
		//班级渲染
		var surveyClass = function() {
			var zoomHtml = '';
			var url = "getclasslist";
			$.ajax({
				type: 'POST',
				data: param,
				url: ajax_url + url,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					//console.log(data.data);
					$.each(data.data.lst_viewclass, function(index, item) {
						var html = '';
						html += '<div class="introductionListTop cursor"><div class="introductionListTop_l"><span class="introduction_title">'+item.Name+'</span><span class="introduction_time">'+item.StartTime+' - '+item.StopTime+'</span><span class="introduction_type">'+item.HeadMaster+'</span></div><b class="Dropdown cursor">> </b></div>';
						html += surveyClassShow(item.Name, item.lst_viewquestionnaire, item.StartTime+' - '+item.StopTime);
						html = '<li class="introductionList">'+html+'</li>';
						zoomHtml += html;
					});
					$(".introductionLists").html(zoomHtml);
					page(Math.ceil(data.data.classcount/6));
				}
			});
		};
		//班级下的问卷调查
		var surveyClassShow = function(name, data, time){
			console.log(name);
			var html = '';
			$.each(data, function(index, item) {
				var url = '/compoents/survey/survey_show.html?id='+item.Id+'&type='+item.Type+'&className='+name+'&time='+time;
				html += '<li><a href="'+url+'"><span class="introductionList_lists_l">'+item.Name+'</span><span class="introductionList_lists_r">'+item.StartTime+' - '+item.StopTime+'</span></a></li>';
			});
			html = '<ul class="container introductionList_lists displayNone">'+html+'</ul>';
			return html;
		}
		//导航渲染
		var navDom = function(data) {
			var html='',url = '',isActive,className = '',num = '';
			$.each(data, function(index, item) {
				switch (item.Name) {
                    case '首页':
                        url = '/index.html';
                        break;
                    case '通知公告':
                        className = 'nav_intro';
                        num = item.Id;
                        url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
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
                        url = '/compoents/file/introduction.html?id=' + item.Id + '&title=' + item.Name;
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
				isActive = item.Name == '调查评估' ? 'active' : '';
				//拼接dom;
				html +='<li class="'+isActive+' '+className+'" id_num="'+num+'"><a href="'+url+'">' + item.Name + '</a></li>';
			});
			$('.nav').html(html);
			$(".mobileNavLists").html(html);
			$(".sideBarTitle").html('调查评估');
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
					param.pageindex=currPage;
					surveyClass();
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
			surveyClass();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
