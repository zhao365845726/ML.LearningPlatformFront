var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var ajax_url = ajaxUrl(),//统一的ajax请求地址
		    nowArr = [];

        var locations = window.location.search.substr(1).split('&');
		var QuestionnaireId = locations[0].split('=')[1];
		var type = locations[1].split('=')[1];
		var className = decodeURI(locations[2].split('=')[1]);
		var time = decodeURI(locations[3].split('=')[1]);

		var attrs = [['课程设置合理，符合循序渐进的规律','学时安排适当，重点难点有充分时间掌握','除日常授课外的其他课程丰富活跃了学习生活','整体课程安排能够更贴近实际工作，对工作有促进作用，很重要','逻辑层次分明，条理清理，结构严谨，概念清楚','各章节由浅到深，衔接较好，教学内容充实、实用','教材能反映本学科国内外科学研究和教学，具有学科发展的先进性','文字规范、简练，图文配合恰当，语言流畅、通俗易懂、叙述生动','按时上下课，不随便调课，缺课','作业安排适当，批改及时、认真','有责任感，能够经常耐心辅导学生，帮助解决实际问题','尊重学生意见，能够改进教学','班主任态度热情，有亲和力','教师讲授生动，富有启发性，课堂气氛活跃，互动性强','教学方法灵活，活动安排有序，行动效率较高','培训过程中的问题能够得到及时有效地解决','学习环境整洁、安静，学习氛围浓厚','食堂卫生干净，饭菜香甜可口','工作人员服务热情，态度和蔼','住宿安全、卫生、舒适、热水有保障','有丰富的课外生活'],['按时上下课，不随便调课，缺课','作业安排适当，批改及时、认真','有责任感，能够经常耐心辅导学生，帮助解决实际问题','尊重学生意见，能够改进教学','班主任态度热情，有亲和力','教师讲授生动，富有启发性，课堂气氛活跃，互动性强','教学方法灵活，活动安排有序，行动效率较高','培训过程中的问题能够得到及时有效地解决','逻辑层次分明，条理清理，结构严谨，概念清楚','各章节由浅到深，衔接较好，教学内容充实、实用','教材能反映本学科国内外科学研究和教学，具有学科发展的先进性','文字规范、简练，图文配合恰当，语言流畅、通俗易懂、叙述生动','通过一段时间的现场作业，你对课程安排是否满意','通过一段时间的现场作业，你对教师的教学能力和水平是否满意']];
		var surveyShow = function(){
			var url1 = $(".nav_investigation a").attr('href');
			$(".article_title1 a").attr('href',url1);
			var html = '班级名称：'+className+'<span>培训时间：'+time+'</span>';
			$(".classInto").html(html);
			switch (Number(type)){
				case 1:
					$(".article_title").html('学员满意度');
					$(".intro_show h3").html('学员满意度');
					nowArr = attrs[0];
                    break;
				case 2:
					$(".article_title").html('教学质量反馈');
					$(".intro_show h3").html('教学质量反馈');
					nowArr = attrs[1];
					break;
			}
			var html = '';
			$.each(nowArr, function(index, item) {
				html += '<li class="container intro_show_ask1"><b class="ask1_head">'+(index+1)+'. '+item+'</b><div class="ask1_con"><label for="y'+index+'_1" class="manyi1 cursor"><input type="radio" name="ask'+index+'" id="y'+index+'_1"/> A 满意</label> <label for="y'+index+'_2" class="manyi2 cursor"><input type="radio" name="ask'+index+'" id="y'+index+'_2"/> B 基本满意</label><label for="y'+index+'_3" class="manyi3 cursor"><input type="radio" name="ask'+index+'" id="y'+index+'_3"/> C 不满意</label></div></li>';
			})
			$(".introCons").html(html);
			labelClick();
			submitClick();
		}
		var labelClick = function(){
			var ele = $('label');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
				$(_t).on('click', function() {
					var parentTitle = $(_t).parent().parent().find('.ask1_head');
					$(parentTitle).css('background','#F5C4CE');
				});
			});
		}
		var submitClick = function(){
			$("#submit_ask").click(function(){
				var manyi1Length = $(".manyi1 input:checked").length;
				var manyi2Length = $(".manyi2 input:checked").length;
				var manyi3Length = $(".manyi3 input:checked").length;
				var sum = manyi1Length+manyi2Length+manyi3Length;
				if(sum != nowArr.length){
					alert('未做完请继续！');
					return false;
				}
				var url = "commitquestionnaire";
				var param = {
					"QuestionnaireId": QuestionnaireId,
					"SatisfiedCount": manyi1Length,
					"BasicSatisfiedCount": manyi2Length,
					"DissatisfiedCount": manyi3Length
				};
				$.ajax({
					type: "POST",
					data: param,
					dataType: 'json',
					url: ajax_url + url,
					crossDomain: true == !(document.all),
					success: function(data, type) {
						//console.log(data);
						if (data.status_code == 200) {
							window.location.href = '/compoents/survey/survey_chart.html?id='+QuestionnaireId;
						}else{
							alert('提交未成功，请重新提交！');
						}
					}
				})
			})
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
					default:
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
			surveyShow();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
