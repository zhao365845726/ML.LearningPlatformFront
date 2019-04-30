var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var ajax_url = ajaxUrl();
		var QuestionnaireId = window.location.search.split('=')[1];
		var surveyChart = function(){
			var url1 = $(".nav_investigation a").attr('href');
			$(".article_title1 a").attr('href',url1);
			var url = "getquestionnairedetail";
			var param = {
				"QuestionnaireId": QuestionnaireId
			};
			$.ajax({
				type: "POST",
				data: param,
				dataType: 'json',
				url: ajax_url + url,
				crossDomain: true == !(document.all),
				success: function(data, type) {
                     //console.log(data);
					if(data.status_code == 200){
						chart(data.data.Satisfied,data.data.BasicSatisfied,data.data.Dissatisfied);
					}
				}
			})
		}
		//初始化echarts实例
        var chart = function(a,b,c){
			var myChart = echarts.init(document.getElementById('myChart'));
			var option = {
				title : {
					text: '',
					subtext: '',
					x:'center'
				},
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					bottom: 0,
					left: 'center',
					data: ['满意','基本满意','不满意']
				},
				series : [{
					name: '满意度',
					type: 'pie',
					radius : '60%',
					center: ['50%', '50%'],
					data:[
						{value:a,
							name:'满意',
							itemStyle:{
								normal:{
									color:'rgb(2,5,109)',
									shadowBlur:'90',
									shadowColor:'rgba(2,5,109,0.8)',
									shadowOffsetY:'10'
								}
							}
						},
						{value:b,
							name:'基本满意',
							itemStyle:{
								normal:{
									color:'rgb(249,171,1)'
								}
							}
						},
						{value:c,
							name:'不满意',
							itemStyle:{
								normal:{
									color:'rgb(10,125,251)'
								}
							}
						}
					],
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}]
			};
			/* 使用刚指定的配置项和数据显示图表。*/
			myChart.setOption(option);
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
			surveyChart();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
