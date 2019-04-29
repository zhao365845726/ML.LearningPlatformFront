var jQuery = $ || {};
(function(window, $, undefined) {

	$(document).ready(function() {
		var ajax_url = ajaxUrl(),//统一的ajax请求地址
			navTitle = '',//左侧导航的值
			secondTitle = '',
			firstIndex = 0,
			currPages = 1,//分页
			title = '';
		var id = decodeURI(window.location.search.substr(1).split('=')[1]);//获取？后面的参数，并防止乱码
		var param = {
			ResourcesDownloadId	 : id,
			pageindex : 1,
			pagesize : 10
		};
		//左侧导航及右侧内容
		var loadNav = function() {
			var isActive = '',
				html_l = '',
				html_r = '',
				num = 0;
			var url = "getresourcesdownloadlist";
			$.ajax({
				type: 'POST',
				data: param,
				url: ajax_url + url,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					//console.log(data);
					/*左侧*/
					$.each(data.data.lst_viewnavcategory, function(index, item) {
						isActive = item.Name == title ? 'active' : '';
						html_l += '<li><a class="firstNav '+isActive+' "  data-id="'+item.Id+'" href="javascript:;" index="'+num+'">'+item.Name+'</a><ul class="container secondNav displayNone"> </ul></li>';
						num++;
					});
					$('.sideBar_l').html(html_l);
					/*右侧*/
					$.each(data.data.lst_viewresources, function(index, item) {
						//var url = '/compoents/file/file_show.html?id='+item.Id+'&title='+title+'&navTitle='+navTitle;
						html_r += '<li class="fileList"><a href="javascript:;" class="loadTitle">'+item.Title+'</a><a href="'+item.Enclosure+'" class="loadImg"><img src="../../assets/images/load.png" alt=""></a><b>'+item.UploadTime+'</b></li>';
					});
					$('.fileLists').html(html_r);
					/*页码*/
					page(Math.ceil(data.data.resourcescount/10));
					/*初始左侧一级导航点击事件*/
					firstNavClick();
				}
			});
		};
		var firstNavClick = function() {
			var ele = $('.sideBar_l .firstNav');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
				$(_t).on('click', function() {
					ele.removeClass('active');
					$(_t).addClass('active');
					param = {
						ResourcesDownloadId	 : $(_t).attr('data-id'),
						pageindex : 1,
						pagesize : 10
					};
					currPages = 1;
					navTitle = $(_t).html();
					firstIndex = $(_t).attr('index');
					firstNewsList(param,firstIndex);
					if(IsPC()){
						$($('.secondNav')[firstIndex]).toggle();
					}
				});
			});
		};
		var firstNewsList = function(param,index){
			var url = "getresourcesdownloadlist",
				html_l = '',
				index = index,
				html_r = '';
			$.ajax({
				type: 'POST',
				data: param,
				url: ajax_url + url,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					//console.log(data.data);
					/*左侧*/
					$.each(data.data.lst_viewnavcategory, function(index, item) {
						html_l += '<li class="secondNavList"  data-id="'+item.Id+'">'+item.Name+'</li>';
					});
					if(!IsPC()){
						$('.secondNavMobile').html(html_l);
						if(html_l){
							$('.secondNavMobile').show();
						}else{
							$('.secondNavMobile').hide();
						}
					}else{
						$($(".secondNav")[index]).html(html_l);
					}
					/*右侧对应内容*/
					$.each(data.data.lst_viewresources, function(index, item) {
						//var url = '/compoents/file/file_show.html?id='+item.Id+'&title='+title+'&navTitle='+navTitle;
						html_r += '<li class="fileList"><a href="javascript:;" class="loadTitle">'+item.Title+'</a><a href="'+item.Enclosure+'" class="loadImg"><img src="../../assets/images/load.png" alt=""></a><b>'+item.UploadTime+'</b></li>';
					});
					$('.fileLists').html(html_r);
					if(!IsPC()){
						$(".sideBarTitle").html(navTitle);
						$(".sideBar_l").hide();
					}
					$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.resourcescount/10));
					/*初始左侧二级导航点击事件*/
					secondNavClick();
				}
			});
		}
		var secondNavClick = function() {
			var ele = $('.secondNavList');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
				$(_t).on('click', function() {
					ele.removeClass('active');
					$(_t).addClass('active');
					param = {
						ResourcesDownloadId	 : $(_t).attr('data-id'),
						pageindex : 1,
						pagesize : 10
					};
					currPages = 1;
					secondTitle = $(_t).html();
					secondNewsList(param);
				});
			});
		};
		var secondNewsList = function(param){
			var url = "getresourcesdownloadlist",
				html_r = '';
			$.ajax({
				type: 'POST',
				data: param,
				url: ajax_url + url,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					/*右侧对应内容*/
					$.each(data.data.lst_viewresources, function(index, item) {
						//var url = '/compoents/file/file_show.html?id='+item.Id+'&title='+title+'&navTitle='+navTitle;
						html_r += '<li class="fileList"><a href="javascript:;" class="loadTitle">'+item.Title+'</a><a href="'+item.Enclosure+'" class="loadImg"><img src="../../assets/images/load.png" alt=""></a><b>'+item.UploadTime+'</b></li>';
					});
					$('.fileLists').html(html_r);
					if(!IsPC()){
						$(".sideBarTitle").html(navTitle);
						$(".sideBar_l").hide();
					}
					$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.resourcescount/10));
				}
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
                            url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
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
					param.pageindex=currPage;
					currPages = currPage;
					if(secondTitle){
						secondNewsList(param);
						return true;
					}
					if(navTitle){
						firstNewsList(param,firstIndex);
					}else{
						loadNav();
					}
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
			loadNav();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
