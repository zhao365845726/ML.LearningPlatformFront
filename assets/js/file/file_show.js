var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var ajax_url = ajaxUrl(),//ajax请求地址
			dataTpl = '';
		var title = decodeURI(window.location.search.substr(1).split('&')[1].split('=')[1]);//获取？后面的参数，并防止乱码
		var windowL = window.location.search.substr(1).split('&');
		var urlId = windowL[0].split('=')[1];
		var parentId = windowL[2].split('=')[1];
		var navName = decodeURI(windowL[3].split('=')[1]);
		//左侧导航及右侧内容
		var sildeNav = function() {
			var html_l = '',
				isActive = '',
			    url = "getnavcategorylist";
			    param = {
			    	navid : parentId,
					pageindex : 1,
					pagesize : 10
			    };
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
						isActive = item.Name == navName ? 'active' : '';
						html_l += '<li class="'+isActive+' " data-id="'+item.Id+'"><a href="javascript:;">'+item.Name+'</a></li>';
					});
					$('.sideBar_l').html(html_l);
					$('.sideBarTitle').html(title);

					/*初始左侧导航点击事件*/
					sildeNavClick();
				}
			});
		};
		//初始左侧导航点击事件
		var sildeNavClick = function() {
			var ele = $('.sideBar_l li');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
				$(_t).on('click', function() {
					var title = $(_t).find('a').html();
					// title = title == '大师工作室简介' ? '大师工作室' : title;
					window.location.href = '/compoents/file/file.html?id='+parentId+'&title='+title;
				});
			});
		};

		//内容
		var showContent = function(){
			var url = "getarticledetail";
			var param = {ArticleId : urlId};
			var article_all = '';
			$.ajax({
				type: "POST",
				data: param,
				dataType: 'json',
				url: ajax_url + url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
                    // console.log(data);
                    if (data.data) {
						dataTpl = data.data;
                         $(".article_title").html(dataTpl.Title);
						 $(".article_time").html(dataTpl.CreateTime);
						 $(".article_source").html(dataTpl.Source);
						 $('.content_con .keyword').show();
						// if(parentId){
                        // 						// 	/*文章内容页*/
                        // 						// 	$(".article_title1 a").attr('href','/compoents/file/file.html?id='+parentId+'&title='+title).html(title);
                        // 						// }else{
                        // 						// 	$(".article_title1").hide();
                        // 						// }
						// if(dataTpl.Enclosure){
						// 	var accessory= dataTpl.Enclosure.split('/');
						// 	var accessoryLength = accessory.length;
                        //    article_all = dataTpl.Body + '<div>附件：<a  target="_blank"  href="'+dataTpl.Enclosure+'" download="' + accessory[accessoryLength - 1] + '">' + accessory[accessoryLength - 1] + '</a></div>'
						// }else{
						// 	article_all = dataTpl.Body;
						// }
						var a = dataTpl.Body;
						var arring = [];
						var prefix = 'http://jmta.admin.milisx.com';
						var newarring ='';
						var newarrings = [];
                        a.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                            arring.push(capture);
                            for (let i =0; i< arring.length;i ++ ) {
                                newarring = prefix+arring[i];
                                newarrings.push(newarring);
                                a = a.replace(new RegExp(capture, 'g'), newarrings[i])
                            }
                        });
                        

                        $(".content_decoration").html(a);
						var navName = $(".sideBar_l li.active a").html();
						if(data.obj.PreviousArticleId){
							$(".article_prev").attr('href','/compoents/file/file_show.html?id='+data.obj.PreviousArticleId+'&title='+title+'&parentId='+parentId+'&navName='+navName).html(data.obj.PreviousArticleTitle);
							$('.pageT').show();
						}
						if(data.obj.NextArticleId){
							$(".article_next").attr('href','/compoents/file/file_show.html?id='+data.obj.NextArticleId+'&title='+title+'&parentId='+parentId+'&navName='+navName).html(data.obj.NextArticleTitle);
							$('.pageB').show();
						}

					}
				}
			})
		}
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
			showContent();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
