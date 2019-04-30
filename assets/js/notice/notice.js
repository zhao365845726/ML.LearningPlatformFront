var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var ajax_url = ajaxUrl(),//统一的ajax请求地址
			param = {};
		var title = decodeURI(window.location.search.split('=')[2]);//获取？后面的参数，并防止乱码
		
		$(".sideBarTitle").html(title);
		//导航渲染
		var navDom = function(data) {
			var html='',url = '',isActive,className = '',num = '';
			$.each(data, function(index, item) {
				if (Number(item.ShowMark)) {
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
					isActive = item.Name == title ? 'active' : '';
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
					switch (title){
						case '通知公告':
							notices();
							break;
						case '活动掠影':
							activities();
							break;
						default :
							break;
					}
				}
			});
		};
		//通知公告
		var notices = function() {
			var url = 'getnoticelist';
			var html = '';
			$.ajax({
				type: "POST",
				data: param,
				dataType: 'json',
				url: ajaxUrl()+url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
					//console.log(data);
					if (data.data) {
						$.each(data.data.lst_noticelist, function(index, item) {
							/*拼接dom*/
                            var url2 = '/compoents/notice/notice_show.html?id='+item.Id+'&title=通知公告&parentId=1';
							html +='<li class="fileList"><a href="'+url2+'">'+item.Title+'</a><b>'+item.CreateTime+'</b></li>';
						});
						$('.fileLists').html(html);
					}
					page(Math.ceil(data.data.noticecount/10));
				}
			})
		};
		//活动掠影
		var activities = function() {
			var url = 'getactivitylist';
			var html = '';
			$.ajax({
				type: "POST",
				data: param,
				dataType: 'json',
				url: ajaxUrl()+url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
					//console.log(data);
					if (data.data) {
						$.each(data.data.lst_activitylist, function(index, item) {
							/*拼接dom*/
							var renqi = 0;
							if(item.ClickRate){
								renqi = item.ClickRate;
							}else{
								renqi = 0;
							}
							var url2 = '/compoents/notice/notice_show.html?id='+item.Id+'&title=活动掠影&parentId=2';
							html +='<li><a href="'+url2+'"><img src="'+item.CoverPhoto+'" alt=""><div class="activityMain"><div class="activityTop">'+item.Title+'</div><div class="activityTime">'+item.CreateTime+'</div><div class="activityRenQi">人气：'+renqi+'</div></div></a></li>';
						});
						$('.activityCon').html(html);
					}
					page(Math.ceil(data.data.activitycount/4));
				}
			})
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
            switch (title){
				case '通知公告':
					param = {
						PageIndex:1,
						PageSize:10
					};
					notices();
					break;
				case '活动掠影':
					param = {
						PageIndex:1,
						PageSize:4
					};
					activities();
					break;
				default :
					break;
			}
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
