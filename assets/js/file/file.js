var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var fitId = '';
		var ajax_url = ajaxUrl(),//统一的ajax请求地址
			navTitle = '',//左侧导航的值
		    currPages = 1,//分页
			workIs = false;//用于判断大师工作室除去简介，其他导航是否点击过，默认false,需要初始page
		   
		var title = decodeURI(window.location.search.split('=')[2]);//获取？后面的参数，并防止乱码
		var urlId = window.location.search.substr(1).split('&')[0].split('=')[1];
		var param = {//统一的参数
			navid : urlId,
			pageindex : 1,
			pagesize : 10
		    };
		//左侧导航及右侧内容
		var sildeNav = function() {
			var html_l = '',
				isActive = '',
			    url = "getnavcategorylist",
				html = '';
			$.ajax({
				type: 'POST',
				data: param,
				url: ajax_url + url,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
                    // console.log(data);
                    /*左侧*/
					$.each(data.data.lst_viewnavcategory, function(index, item) {
						// switch(title){
						// 	case '机构简介':
						// 		isActive = item.Name == '机构概况' ? 'active' : '';
						// 		break;
						// 	case '大师工作室':
						// 		isActive = item.Name == '大师工作室简介' ? 'active' : '';
						// 		break;
						// 	default :
						// 		isActive = item.Name == title ? 'active' : '';
						// 		break;
						// }
						html_l += '<li class="'+isActive+' " data-id="'+item.Id+'"><a href="javascript:;">'+item.Name+'</a></li>';
					});
					$('.sideBar_l').html(html_l);
					$('.sideBarTitle').html(title);
					/*右侧*/

					/*初始左侧导航点击事件*/
					sildeNavClick();
                    sildeNavRight(data);
				}
			});

		};
		var sildeNavRight = function(data){

			fileNavData(data);

		};
		//机构简介&&大师工作室简介右侧内容
		var introductionNavData = function(cateId){
			var intro_param = {
				Categoryid : cateId
			};
			var intro_url = 'getlastonearticledetail';
			var article_all = '';

			$.ajax({
				type: 'POST',
				data: intro_param,
				url: ajax_url + intro_url,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
                     if(data.data){
                     	var html = '';
                        if(data.data.Enclosure){
							var accessory= data.data.Enclosure.split('/');
							var accessoryLength = accessory.length;
                           html = data.data.Body + '<div>附件：<a href="'+data.data.Enclosure+'">' + accessory[accessoryLength - 1] + '</a></div>'
						}else{
							html = data.data.Body;
						}
						 $('.introduction_con').html(html);
					 }
				}
			});
			if(!IsPC()){
				navTitle = navTitle ? navTitle : title;
				$(".sideBarTitle").html(navTitle);
				$(".sideBar_l").hide();
			}
			$("#pageBar").hide();
		}
		// 除机构简介&&大师工作室简介右侧内容
		 var fileNavData = function(data){
             $(".introduction_con").hide();
             $(".fileLists").show();
			var html = '';
			$.each(data.data.lst_navarticlelist, function(index, item) {
				var navName = $(".sideBar_l li.active a").html();
				var url = '/compoents/file/file_show.html?id='+item.Id+'&title='+title+'&parentId='+urlId+'&navName='+navName;
				html += '<li class="fileList"><a href="'+url+'">'+item.Title+'</a><b>'+item.CreateTime+'</b></li>';
			});
			$('.fileLists').html(html);
			/*页码*/
			$("#pageBar").show();
			page(Math.ceil(data.data.articlecount/10));
		}
		//初始左侧导航点击事件
		var sildeNavClick = function() {
			var ele = $('.sideBar_l li');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
                // console.log(ele.attr('data-id'));

                $(_t).on('click', function() {
					$(_t).addClass('active').siblings().removeClass('active');
					navTitle = $(_t).find('a').html();
					param = {
						categoryid : $(_t).attr('data-id'),
						pageindex : 1,
						pagesize : 10
					};
					currPages = 1;
					// switch(title){
					// 	case '机构简介':
					// 		introductionNavData($(_t).attr('data-id'));
					// 		break;
					// 	case '大师工作室':
					// 		switch(navTitle){
					// 			case '大师工作室简介':
					// 				introductionNavData($(_t).attr('data-id'));
					// 				break;
					// 			case '师资情况':
					// 				introductionNavData($(_t).attr('data-id'));
					// 				break;
					// 			default :
					// 			//console.log(workIs);
					// 				if(workIs){
					// 					newsList(param);
					// 				}else{
					// 					workNavData();
					// 				}
					// 				break;
					// 		}
					// 		break;
					// 	default :
					// 		newsList(param);
					// 		break;
					// }
					listClick(param)
				});
			});
            // console.log(fitId)
		};

		var listClick = function(param){
            var url = "getcategoryarticlelist",
                html = '';
            $(".introduction_con").show();
            $(".fileLists").hide();
            $(".introduction_con").empty();
            $.ajax({
                type: 'POST',
                data: param,
                url: ajax_url + url,
                dataType: 'json',
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    // console.log(data);
                    /*右侧对应内容*/
                    if(data.data.lst_categoryarticlelist){
                        $.each(data.data.lst_categoryarticlelist, function(index, item) {
                        	var navName = $(".sideBar_l li.active a").html();

                        	var url = '/compoents/file/file_show.html?id='+item.Id+'&title='+title+'&parentId='+urlId+'&navName='+navName;
                        	html += '<li class="fileList"><a href="'+url+'">'+item.Title+'</a><b>'+item.CreateTime+'</b></li>';
                        });
                    }
                    $('.introduction_con').html(html);
                    if(!IsPC()){
                        $(".sideBarTitle").html(navTitle);
                        $(".sideBar_l").hide();
                    }
                    /*页码*/
                    // $("#pageBar").show();
                    // $("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.articlecount/10));
                }
            });
		}



		//左侧-大师工作室（除大师工作室简介）导航第一次点击事件
		var workNavData = function() {
			workIs = true;
			$(".fileLists").show();
			$(".introduction_con").hide();
			var url = "getcategoryarticlelist",
				html = '';
			$.ajax({
				type: 'POST',
				data: param,
				url: ajax_url + url,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if(data.data.lst_categoryarticlelist){
						$.each(data.data.lst_categoryarticlelist, function(index, item) {
							var navName = $(".sideBar_l li.active a").html();
							var url = '/compoents/file/file_show.html?id='+item.Id+'&title='+title+'&parentId='+urlId+'&navName='+navName;
							html += '<li class="fileList"><a href="'+url+'">'+item.Title+'</a><b>'+item.CreateTime+'</b></li>';
						});
					}
					$('.fileLists').html(html);
					if(!IsPC()){
						$(".sideBarTitle").html(navTitle);
						$(".sideBar_l").hide();
					}
					/*页码*/
					$("#pageBar").show();
					page(Math.ceil(data.data.articlecount/10));
				}
			});
		}
		//除机左侧导航-构简介&&大师工作室简介点击事件
		var newsList = function(param){
			var url = "getcategoryarticlelist",
			    html = '';
			$(".fileLists").show();
			$(".introduction_con").hide();
			$.ajax({
				type: 'POST',
				data: param,
				url: ajax_url + url,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
                    console.log(data);
                    /*右侧对应内容*/
					if(data.data.lst_categoryarticlelist){
						$.each(data.data.lst_categoryarticlelist, function(index, item) {
							switch(title){
								case '机构简介':
									html += item.Title;
									break;
								default :
								    var navName = $(".sideBar_l li.active a").html();
									var url = '/compoents/file/file_show.html?id='+item.Id+'&title='+title+'&parentId='+urlId+'&navName='+navName;
									html += '<li class="fileList"><a href="'+url+'">'+item.Title+'</a><b>'+item.CreateTime+'</b></li>';
									break;
							}
						});
					}
					$('.fileLists').html(html);
					if(!IsPC()){
						$(".sideBarTitle").html(navTitle);
						$(".sideBar_l").hide();
					}
					/*页码*/
					// $("#pageBar").show();
					// $("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.articlecount/10));
				}
			});
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
					if(navTitle){
						newsList(param);
					}else{
						sildeNav();
					}
				}
			});
		};

		//导航渲染
		var navDom = function(data) {
			var html='',url = '',isActive,className = '',num = '';
			$.each(data, function(index, item) {
				if (Number(item.ShowMark)){
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
                    case "素质提升":
                        className = 'nav_work';
                        num = item.Id;
                        url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
                        break;
                    default :
                        break;
					}
				isActive = item.Name == title ? 'active' : '';
				/*拼接dom*/
				html += '<li class="' + isActive + ' ' + className + '" id_num="' + num + '"><a href="' + url + '">' + item.Name + '</a></li>';
			    }
			});
			$('.nav').html(html);
			$(".mobileNavLists").html(html);
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
			sildeNav();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();

	})

})(window, jQuery);
