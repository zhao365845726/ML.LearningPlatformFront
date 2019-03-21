var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var ajax_url = ajaxUrl();//统一的ajax请求地址			
		var title = decodeURI(window.location.search.substr(1).split('=')[1]);//获取？后面的参数，并防止乱码
		//导航渲染
		var navDom = function(data) {
			var html='',url = '',isActive = '',className = '',num = '';
			$.each(data, function(index, item) {
				if (Number(item.ShowMark)) {
					switch (item.Name) {
						case '首页':
							url = '/index.html';
							break;
						case '机构简介':
							className = 'nav_intro';
							num = item.Id;
							url = '/compoents/file/introduction.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case '文件制度':
							className = 'nav_file';
							num = item.Id;
							url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case '安全培训':
							className = 'nav_safety';
							num = item.Id;
							url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case "素质提升":
							className = 'nav_quality';
							num = item.Id;
							url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case '在线学习':
							className = 'nav_study';
							num = item.Id;
							url = '/compoents/study/study.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case "讲师基地":
							className = 'nav_teacher';
							num = item.Id;
							url = '/compoents/lecturer/lecturer.html?title=讲师风采';
							break;
						case "调查评估":
							className = 'nav_investigation';
							num = item.Id;
							url = '/compoents/survey/survey.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case "大师工作室":
							className = 'nav_work';
							num = item.Id;
							url = '/compoents/file/file.html?id=' + item.Id + '&title=' + item.Name;
							break;
						case "联系我们":
							className = 'nav_contact';
							num = item.Id;
							url = '/compoents/contact/contact.html?title=' + item.Name;
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
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
