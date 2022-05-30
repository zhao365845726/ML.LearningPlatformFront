var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var favorite_courseUrl = favoritecourseUrl(),//ajax请求地址
			course_Url = courseUrl(),
			exam_Url = examUrl(),
			ajax_url = ajaxUrl(),
			firstPage = true,//第一次初始分页
			navTitle = '',//左侧导航的值
		    currPages = 1,//分页
			html_con = '',//总内容
			zoomUrl = '',
			monitorexamBtnType = "1";//模拟练习题库的标准（1按顺序，2随机，3错题，4分类）
		var title = decodeURI(window.location.search.split('=')[2]);//获取？后面的参数，并防止乱码
		var urlId = window.location.search.substr(1).split('&')[0].split('=')[1];
		var param = {
				navid : urlId,
			    PageIndex : 1,
				pagesize : 8
			};
		//是否登录
		var isLogin = function(){
			//var falg = $.cookie('Token');
			//debugger
			BreadCrumbs();
			sildeNav();
			// if(falg){
			// 	$.ajax({
			// 		type: "POST",
			// 		data: {Token:falg},
			// 		dataType: 'json',
			// 		url: isLoginUrl(),
			// 		crossDomain: true == !(document.all),
			// 		success: function(data, type) {
			// 			debugger
			// 			if(data.status_code == 200){
			// 				BreadCrumbs();
			// 				sildeNav();
			// 			}else{
			// 				if(title == '在线学习'){
			// 					window.location.href = '/index.html';
			// 				}else{
			// 					window.location.href = '/index.html?title='+title;
			// 				}
			// 			}
			// 		}
			// 	})
			// }else{
			// 	if(title == '在线学习'){
			// 		window.location.href = '/index.html';
			// 	}else{
			// 		window.location.href = '/index.html?title='+title;
			// 	}

			// }
		}
		//面包屑
		var BreadCrumbs = function(){
			var mydata = eval('(' + $.cookie("myData") + ')');
			if(mydata.Photograph){
				$(".person_img").attr('src',mydata.Photograph);
			}
			$(".person_Company").html(mydata.CompanyName);
			$(".person_Dept").html(mydata.DeptName);
			$(".person_Account").html(mydata.Account);
			$(".person_Name").html(mydata.RealName);
			$(".person_Gender").html(mydata.Gender);
			$(".person_IDCard").html(mydata.IDCard);
			$(".person_Mobile").html(mydata.Mobile);
		}
		//左侧导航及右侧内容
		var sildeNav = function() {
			var html_l = '',isActive = '';
			var url = "getnavcategorylist";
			var leftName = '';
			if(title == '在线学习' || title == '我的课程'){
				leftName = '我的课程';
			}else{
				leftName = title;
			}
			$.ajax({
				type: 'POST',
				data: param,
				url: ajax_url + url,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					/*左侧*/
					html_l ='<li class="displayNone mycards"><a href="/compoents/study/personalinfo.html">我的资料</a></li>';
					$.each(data.data.lst_viewnavcategory, function(index, item) {
						isActive = item.Name == leftName ? 'active' : '';
						html_l += '<li class="'+isActive+' " data-id="'+item.CourseId+'"><a href="javascript:;">'+item.Name+'</a></li>';
					});
					$('.sideBar_l').html(html_l);
					/*右侧--我的课程*/
					handle(leftName);
					/*初始左侧导航点击事件*/
					sildeNavClick();
					/*初始课件园地的按条件查询事件*/
					StudyOptionClick();
					/*初始模拟练习的分类*/
					simulationPracticeClassification();
					/*初始模拟练习的按条件查询事件*/
					monitorexamClick();
				}
			});

		};
		var sildeNavClick = function() {
			var ele = $('.sideBar_l li');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
				$(_t).on('click', function() {
					$(_t).addClass('active').siblings().removeClass('active');
					currPages = 1;
					navTitle = $(_t).find('a').html();
					$(".myCAISearch").hide();
					$(".simulationExerciseSearch").hide();
					$(".specialPractice").hide();
					handle(navTitle);
				});
			});
		};
		//调动事件
		var handle = function(navTitle){
			if (!IsPC()) {
				$(".studyTitle").html(navTitle);
				$(".sideBar_l").hide();
			}
			$('.myCourse').html('');
			$('.errorCenterQuestion').html('');
			html_con = '';
			switch (navTitle){
				case '我的课程':
					var url = 'minecourselist';
					zoomUrl = favorite_courseUrl + url;
					param = {
						Token : $.cookie("Token"),
						PageIndex : 1,
						PageSize : 8
					};
					minecourselist();
					break;
				case '我的考试':
					var url = 'formalexamlist';
					zoomUrl = exam_Url + url;
					param = {
						Token : $.cookie("Token"),
						PageIndex : 1,
						PageSize : 8
					};
					formalexamlist();
					break;
				case '模拟练习':
					url = 'monitorexamlist';
					zoomUrl = exam_Url + url;
					param = {
						Token : $.cookie("Token"),
						PageIndex : 1,
						PageSize : 8
					};
					$(".simulationExerciseSearch #selectSystem").val('');
					$(".simulationExerciseSearch #selectSystem").attr('data-num','');
					$(".simulationExerciseSearch").show();
					monitorexamlist();
					break;
				case '每日一题':
					var url = 'mineeverydayquestionlist';
					zoomUrl = favorite_courseUrl + url;
					param = {
						Token : $.cookie("Token"),
						PageIndex : 1,
						PageSize : 8
					};
					everydayquestionlist();
					break;
				case '课件园地':
					var url = 'getcourselist';
					zoomUrl = course_Url+url;
					param = {
						ClassifyId:'',
						StudyOption:'',
						tag:1,
						PageIndex:1,
						PageSize:8
					};
					$(".myCAISearch #selectSystem").val('');
					$(".myCAISearch #selectSystem").attr('data-num','');
					$(".myCAISearch").show();
					countcourselist();

					break;
				case '我的证件':
					url = 'minecertificateslist';
					zoomUrl = favorite_courseUrl + url;
					param = {
						Token : $.cookie("Token"),
						PageIndex : 1,
						PageSize : 8
					};
					minecertificateslist();
					break;
				case '查看成绩':
					var url = 'lookresult';
					zoomUrl = exam_Url + url;
					param = {
						Token : $.cookie("Token"),
						PageIndex : 1,
						PageSize : 8
					};
					lookexamlist();
					break;
				case '专项练习':
					var url = 'speciallist';
					zoomUrl = practiseUrl() + url;
					param = {
						Token : $.cookie("Token"),
						"CategoryName": "",
						PageIndex : 1,
						PageSize : 20
					};
					$(".specialPractice").show();
					specialPracticelist();
					break;	
				default :
					break;
			}
		}
		//我的课程
		var minecourselist = function(){
			html_con = '<li class="course_title"><span class="courselist1"><i></i>课件名称</span><span class="courselist2">课件体系</span><span class="courselist3">进修选项</span><span class="courselist4">上传时间</span><span class="courselist5">开始学习</span></li>';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if(data.data.lst_favoritecourse) {
						$.each(data.data.lst_favoritecourse, function (index, item) {
							 if(item.Name && item.ClassifyName && item.CreateTime){
								 var state = '<a href="/compoents/study/course_show.html?id=' + item.CourseId + '">开始学习</a>';
								 var typeCon = '';
								 switch (Number(item.Type)){
									 case 1:
										 typeCon = '必修';
										 break;
									 case 4:
										 typeCon = '选修';
										 break;
									 default :
										 break;
								 }
								 html_con += '<li><span class="courselist1"><i></i>' + item.Name + '</span><span class="courselist2">' + item.ClassifyName + '</span><span class="courselist3">'+typeCon+'</span><span class="courselist4">' + item.CreateTime + '</span><span class="courselist5">' + state + '</span></li>';
							 }
						})
					}
					$('.myCourse').html(html_con);
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.data.favoritecoursecount/8));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.favoritecoursecount / 8));
					}
				}
			})
		}
		//我的考试
		var formalexamlist = function(){
			html_con = '<li class="course_title"><span class="mytest1"><i></i>试卷名称</span><span class="mytest5">考试开始时间</span><span class="mytest5">考试结束时间</span><span class="mytest6">用时</span><span class="mytest2">成绩</span><span class="mytest4">考试状态</span></li>';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					console.log(JSON.stringify(data));
					var curDate1 = new Date(Date.parse(data.obj.CurrentTime.replace(/-/g,"/"))); //当前时间
					if(data.data) {
						$.each(data.data, function (index, item) {
							if(item.Name && item.ExamDuration && item.NumberOfTopics) {
								var state = '';
								var yclass = '';
								var IsFingerprintLogin = '';
								if(item.IsFingerprintLogin){
									IsFingerprintLogin = "1";
								}else{
									IsFingerprintLogin = "0";
								}

                               if(item.TestState == 2){
                                  state = '<a href="/compoents/study/testLook.html?UserTPLibId=' + item.Id + '" class="test_href" target="_blank">查看试卷</a>';
                               }else{
	                                 var statusTest = true;//开始考试时间大于现在时间，或者开考时间没值
                                      if(item.StartTestTime){
                                        var StartTestTime1 = new Date(Date.parse(item.StartTestTime.replace(/-/g,"/")));
	                                  	
	                                  	if(StartTestTime1 > curDate1){
	                                  		state = '考试未开始';
	                                  		statusTest = false;
	                                  	}
						              }
						              if(statusTest){
						              	var statusV = statusVal(item.TestState);
		                                  if(item.StopTestTime){
		                                  	var stopTestTime = new Date(Date.parse(item.StopTestTime.replace(/-/g,"/")));
	                                        if(stopTestTime > curDate1){
												state = '<a href="javascript:;" data-href="/compoents/study/test_show.html?UserTPLibId=' + item.Id + '&title='+statusV.title+'&testType=2" class="test_href" data-Finger="' + IsFingerprintLogin + '" onclick="isFinger(this);">'+statusV.name+'</a>';
			                                }else{
			                                     state = '考试过期';
			                                }
		                                  }else{
											state = '<a href="javascript:;" data-href="/compoents/study/test_show.html?UserTPLibId=' + item.Id + '&title='+statusV.title+'&testType=2" class="test_href" data-Finger="' + IsFingerprintLogin + '" onclick="isFinger(this);">'+statusV.name+'</a>';
		                                }
		                            }
		                        }
								var StartTestTimeP = '--';
								var StopTestTimeP = '--';
								if(item.StartTestTime){
                                   StartTestTimeP = item.StartTestTime;
								}
								if(item.StopTestTime){
                                   StopTestTimeP = item.StopTestTime;
								}
                                var whentime = 0;
                                if(item.ExamDuration*60 <= item.TimeConsuming){
                                	whentime = item.ExamDuration+'分0秒';
                                }else{
                                	var timeM = parseInt(item.TimeConsuming / 60);
									var timeS = item.TimeConsuming % 60;
									whentime = timeM+'分'+timeS+'秒';
                                }
								html_con += '<li><span class="js-mytooltip mytest1" data-mytooltip-custom-class="align-center" data-mytooltip-offs et="-20" data-mytooltip-direction="right" data-mytooltip-template="' + item.Name + '"><i></i>' + item.Name + '</span><span class="mytest5">' + StartTestTimeP + '</span><span class="mytest5">' + StopTestTimeP + '</span><span class="mytest6">'+whentime+'</span><span class="mytest2">'+item.SumScore+'</span><span class="mytest4">' + state + '</span></li>';
							}
						})
					}
					$('.myCourse').html(html_con);
					$('.js-mytooltip').myTooltip();
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.data.TotalCount/8));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.obj.TotalCount / 8));
					}
				}
			})
		}
		var statusVal = function(status){
			var str = {'name':'','title':0};
			switch(status){
				case 0:
				  str.name = '进入考试';
				  str.title = 1;
				  return str;
				break;
				case 1:
				  str.name = '继续考试';
				  str.title = 0;
				  return str;
				break;
			}
		}
		//模拟练习[按顺序]
		var monitorexamlist = function(){
			html_con = '<li class="course_title"><span class="monitest1"><i></i>试卷名称</span><span class="monitest2">时长</span><span class="monitest3">题量</span><span class="monitest4">次数</span><span class="monitest6">考试开始时间</span><span class="monitest6">考试结束时间</span><span class="monitest7">用时</span><span class="monitest2">成绩</span><span class="monitest5">考试状态</span></li>';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					var curDate1 = new Date(Date.parse(data.obj.CurrentTime.replace(/-/g,"/"))); //当前时间
					if(data.data) {
						$.each(data.data, function (index, item) {
							if(item.Name && item.ExamDuration && item.NumberOfTopics && item.AttemptNumber) {
								var state = '';
								var yclass = '';
								var IsFingerprintLogin = '';
								if(item.IsFingerprintLogin){
									IsFingerprintLogin = "1";
								}else{
									IsFingerprintLogin = "0";
								}
								if(item.TestState == 2){
                                  state = '<a href="/compoents/study/testLook.html?UserTPLibId=' + item.Id + '" class="test_href" target="_blank">查看试卷</a>';
                               }else{
                                   var statusTest = true;//开始考试时间大于现在时间，或者开考时间没值
                                  if(item.StartTestTime){
                                    var StartTestTime1 = new Date(Date.parse(item.StartTestTime.replace(/-/g,"/")));
                                  	if(StartTestTime1 > curDate1){
                                  		state = '考试未开始';
                                  		statusTest = false;
                                  	}
					              }
					              if(statusTest){  
					                  var statusV = statusVal(item.TestState);
	                                   if(item.StopTestTime){
	                                   	var stopTestTime = new Date(Date.parse(item.StopTestTime.replace(/-/g,"/")));
		                                if(stopTestTime > curDate1){
											state = '<a href="javascript:;" data-href="/compoents/study/test_show.html?UserTPLibId=' + item.Id + '&title='+statusV.title+'&testType=1" onclick="isFinger(this);">'+statusV.name+'</a>';
		                                }else{
		                                     state = '考试过期';
		                                }
	                                   }else{
                                          state = '<a href="javascript:;" data-href="/compoents/study/test_show.html?UserTPLibId=' + item.Id + '&title='+statusV.title+'&testType=1" onclick="isFinger(this);">'+statusV.name+'</a>';
	                                   }
	                                }   
                               }
                                var StartTestTimeP = '--';
								var StopTestTimeP = '--';
								if(item.StartTestTime){
                                   StartTestTimeP = item.StartTestTime;
								}
								if(item.StopTestTime){
                                   StopTestTimeP = item.StopTestTime;
								}
                                var whentime = 0;
                                if(item.ExamDuration*60 <= item.TimeConsuming){
                                	whentime = item.ExamDuration+'分0秒';
                                }else{
                                	var timeM = parseInt(item.TimeConsuming / 60);
									var timeS = item.TimeConsuming % 60;
									whentime = timeM+'分'+timeS+'秒';
                                }
								html_con += '<li><span class="monitest1"><i></i>' + item.Name + '</span><span class="monitest2">' + item.ExamDuration + '分</span><span class="monitest3">' + item.NumberOfTopics + '</span><span class="monitest4">' + item.AttemptNumber + '</span><span class="monitest6">' + StartTestTimeP + '</span><span class="monitest6">' + StopTestTimeP + '</span><span class="monitest7">'+whentime+'</span><span class="monitest2">'+item.SumScore+'</span><span class="monitest5">' + state + '</span></li>';
							}
						})
					}
					$('.myCourse').html(html_con);
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.data.TotalCount/8));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.obj.TotalCount / 8));
					}
				}
			})
		}
		//模拟练习[随机]
		var monitorexamRandomlist = function(){
			html_con = '<li class="course_title"><span class="monitest1"><i></i>试卷名称</span><span class="monitest2">时长</span><span class="monitest3">题量</span><span class="monitest4">次数</span><span class="monitest6">考试开始时间</span><span class="monitest6">考试结束时间</span><span class="monitest7">用时</span><span class="monitest2">成绩</span><span class="monitest5">考试状态</span></li>';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					var curDate1 = new Date(Date.parse(data.obj.CurrentTime.replace(/-/g,"/"))); //当前时间
					if(data.data) {
						$.each(data.data, function (index, item) {
							if(item.Name && item.ExamDuration && item.NumberOfTopics && item.AttemptNumber) {
								var state = '';
								var yclass = '';
								var IsFingerprintLogin = '';
								if(item.IsFingerprintLogin){
									IsFingerprintLogin = "1";
								}else{
									IsFingerprintLogin = "0";
								}
								if(item.TestState == 2){
                                  state = '<a href="/compoents/study/testLook.html?UserTPLibId=' + item.Id + '" class="test_href" target="_blank">查看试卷</a>';
                                }else{
	                                var statusTest = true;//开始考试时间大于现在时间，或者开考时间没值
                                  if(item.StartTestTime){
                                    var StartTestTime1 = new Date(Date.parse(item.StartTestTime.replace(/-/g,"/")));
                                  	if(StartTestTime1 > curDate1){
                                  		state = '考试未开始';
                                  		statusTest = false;
                                  	}
					              }
					               if(statusTest){  
					                  var statusV = statusVal(item.TestState);
	                                   if(item.StopTestTime){
	                                   	var stopTestTime = new Date(Date.parse(item.StopTestTime.replace(/-/g,"/")));
		                                if(stopTestTime > curDate1){
											state = '<a href="javascript:;" data-href="/compoents/study/test_show.html?UserTPLibId=' + item.Id + '&title='+statusV.title+'&testType=1" onclick="isFinger(this);">'+statusV.name+'</a>';
		                                }else{
		                                     state = '考试过期';
		                                }
	                                   }else{
                                          state = '<a href="javascript:;" data-href="/compoents/study/test_show.html?UserTPLibId=' + item.Id + '&title='+statusV.title+'&testType=1" onclick="isFinger(this);">'+statusV.name+'</a>';
	                                   }
	                                }   
                                }
                                var StartTestTimeP = '--';
								var StopTestTimeP = '--';
								if(item.StartTestTime){
                                   StartTestTimeP = item.StartTestTime;
								}
								if(item.StopTestTime){
                                   StopTestTimeP = item.StopTestTime;
								}
                                var whentime = 0;
                                if(item.ExamDuration*60 <= item.TimeConsuming){
                                	whentime = item.ExamDuration+'分0秒';
                                }else{
                                	var timeM = parseInt(item.TimeConsuming / 60);
									var timeS = item.TimeConsuming % 60;
									whentime = timeM+'分'+timeS+'秒';
                                }
								html_con += '<li><span class="monitest1"><i></i>' + item.Name + '</span><span class="monitest2">' + item.ExamDuration + '分</span><span class="monitest3">' + item.NumberOfTopics + '</span><span class="monitest4">' + item.AttemptNumber + '</span><span class="monitest6">' + StartTestTimeP + '</span><span class="monitest6">' + StopTestTimeP + '</span><span class="monitest7">'+whentime+'</span><span class="monitest2">'+item.SumScore+'</span><span class="monitest5">' + state + '</span></li>';
							}
						})
					}
					$('.myCourse').html(html_con);
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.data.TotalCount/8));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.obj.TotalCount / 8));
					}
				}
			})
		}
		//模拟练习按钮
		var monitorexamClick = function(){
			var ele = $('.monitorexamClick');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this,url = '';
				$(_t).on('click', function() {
					$(_t).addClass('active').siblings().removeClass('active');

					currPages = 1;
					html_con = '';
					var typeBtn = $(_t).attr('data-num');
					switch(typeBtn){
						case "1":
						    monitorexamBtnType = "1";
						    url = 'monitorexamlist';
			                zoomUrl = exam_Url + url;
			                $('.myCourse').html('');
			                $('.errorCenterQuestion').html('');
						    monitorexamlist();
							break;
						case "2":
						    monitorexamBtnType = "2";
						    url = 'monitorexamrandomlist';
			                zoomUrl = exam_Url + url;
			                 $('.myCourse').html('');
			                $('.errorCenterQuestion').html('');
						    monitorexamRandomlist();
							break;
						case "3":
						    monitorexamBtnType = "3";
						    url = 'errorquestionlist';
			                zoomUrl = ajax_url + url;
						     $('.myCourse').html('');
			                $('.errorCenterQuestion').html('');
						   $("#pageBar").whjPaging("setPage", 0, 0);
						    errorcenterlist();
							break;
						case "4":
							 if($(".classifyQuestionBank #selectSystem").val()){
							 	monitorexamBtnType = "4";
							 	url = 'paperclassificationlist';
							 	zoomUrl = exam_Url + url;
							 	$('.myCourse').html('');
			                    $('.errorCenterQuestion').html('');
								param.Id = $(".classifyQuestionBank #selectSystem").val();
				                simulationPracticeClassificationList();
							 }
							break;
					}
				});
			});
		}
		//模拟练习分类
		var simulationPracticeClassification = function(){
			var html = '';
			html = '<option value="">==请选择==</option>';
			$.ajax({
				type: 'POST',
				data: {},
				url: exam_Url + 'paperclassification',
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
                    if(data) {
						$.each(data, function (index, item) {
                           html += '<option value="' + item.Id + '">' + item.Name + '</option>';
						})
					}
					$(".classifyQuestionBank #selectSystem").html(html);	
				}
			})
		}
		//模拟练习分类列表
		 var simulationPracticeClassificationList = function(){
			html_con = '<li class="course_title"><span class="monitest1"><i></i>试卷名称</span><span class="monitest2">时长</span><span class="monitest3">题量</span><span class="monitest4">次数</span><span class="monitest6">考试开始时间</span><span class="monitest6">考试结束时间</span><span class="monitest7">用时</span><span class="monitest2">成绩</span><span class="monitest5">考试状态</span></li>';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					var curDate1 = new Date(Date.parse(data.obj.CurrentTime.replace(/-/g,"/"))); //当前时间
					if(data.data) {
						$.each(data.data, function (index, item) {
							if(item.Name && item.ExamDuration && item.NumberOfTopics && item.AttemptNumber) {
								var state = '';
								var yclass = '';
								var IsFingerprintLogin = '';
								if(item.IsFingerprintLogin){
									IsFingerprintLogin = "1";
								}else{
									IsFingerprintLogin = "0";
								}
								if(item.TestState == 2){
                                  state = '<a href="/compoents/study/testLook.html?UserTPLibId=' + item.Id + '" class="test_href" target="_blank">查看试卷</a>';
                                }else{
	                               var statusTest = true;//开始考试时间大于现在时间，或者开考时间没值
                                  if(item.StartTestTime){
                                    var StartTestTime1 = new Date(Date.parse(item.StartTestTime.replace(/-/g,"/")));
                                  	if(StartTestTime1 > curDate1){
                                  		state = '考试未开始';
                                  		statusTest = false;
                                  	}
					              }
					              if(statusTest){  
					                  var statusV = statusVal(item.TestState);
	                                   if(item.StopTestTime){
	                                   	var stopTestTime = new Date(Date.parse(item.StopTestTime.replace(/-/g,"/")));
		                                if(stopTestTime > curDate1){
											state = '<a href="javascript:;" data-href="/compoents/study/test_show.html?UserTPLibId=' + item.Id + '&title='+statusV.title+'&testType=1" onclick="isFinger(this);">'+statusV.name+'</a>';
		                                }else{
		                                     state = '考试过期';
		                                }
	                                   }else{
                                          state = '<a href="javascript:;" data-href="/compoents/study/test_show.html?UserTPLibId=' + item.Id + '&title='+statusV.title+'&testType=1" onclick="isFinger(this);">'+statusV.name+'</a>';
	                                   }
	                                }   
                                }
                                 
                                var StartTestTimeP = '--';
								var StopTestTimeP = '--';
								if(item.StartTestTime){
                                   StartTestTimeP = item.StartTestTime;
								}
								if(item.StopTestTime){
                                   StopTestTimeP = item.StopTestTime;
								}
                                var whentime = 0;
                                if(item.ExamDuration*60 <= item.TimeConsuming){
                                	whentime = item.ExamDuration+'分0秒';
                                }else{
                                	var timeM = parseInt(item.TimeConsuming / 60);
									var timeS = item.TimeConsuming % 60;
									whentime = timeM+'分'+timeS+'秒';
                                }
								html_con += '<li><span class="monitest1"><i></i>' + item.Name + '</span><span class="monitest2">' + item.ExamDuration + '分</span><span class="monitest3">' + item.NumberOfTopics + '</span><span class="monitest4">' + item.AttemptNumber + '</span><span class="monitest6">' + StartTestTimeP + '</span><span class="monitest6">' + StopTestTimeP + '</span><span class="monitest7">'+whentime+'</span><span class="monitest2">'+item.SumScore+'</span><span class="monitest5">' + state + '</span></li>';
							}
						})
					}
					$('.myCourse').html(html_con);
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.data.TotalCount/8));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.obj.TotalCount / 8));
					}
				}
			})
		}
		//错误中心
		var errorcenterlist= function(){
			$.ajax({
				type: 'POST',
				data: {Token: $.cookie('Token')},
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if(data.data) {
						errorCenterQuestions.init(data);
					}
				}
			})
		}
		//每日一题
		var everydayquestionlist = function(){
			html_con = '<li class="course_title"><span class="everydaytest1"><i></i>日期</span><span class="everydaytest2">完成状况</span><span class="everydaytest3">试卷状态</span></li>';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if(data.data.lst_everydayquestion) {
						$.each(data.data.lst_everydayquestion, function (index, item) {
							if(item.QuestionTime) {
								var state = '';
								var stateType = '';
								if (!Number(item.IsAnswer)) {
									state = '<a href="/compoents/study/day_show.html?EverydayQuestionId=' + item.Id + '&title=0">进入答题</a>';
									stateType = '未完成';
								} else {
									state = '<a href="/compoents/study/day_show.html?EverydayQuestionId=' + item.Id + '&title=1">查看结果</a>';
									stateType = '已完成';
								}
								html_con += '<li><span class="everydaytest1"><i></i>' + item.QuestionTime + '</span><span class="everydaytest2">' + stateType + '</span><span class="everydaytest3">' + state + '</span></li>';
							}
						})
					}
					$('.myCourse').html(html_con);
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.data.everydayquestioncount/8));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.everydayquestioncount / 8));
					}
				}
			})
		}
		//课件园地
		var countcourselist = function(){
			html_con = '<li class="course_title"><span class="coursecount1"><i></i>课件名称</span><span class="coursecount2">课程量</span><span class="coursecount3">进修项</span><span class="coursecount4">下载</span><span class="coursecount5">开始学习</span></li>';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if(data.data.lst_course) {
						$.each(data.data.lst_course, function (index, item) {
							if(item.Name && item.CourseCount && item.StudyOption) {
								var state = '<a href="/compoents/study/course_show.html?id=' + item.Id + '">开始学习</a>';
								var StudyOption = '';
								if (item.StudyOption == 1) {
									StudyOption = '必修';
								} else {
									StudyOption = '选修';
								}
								var isLoad = '';
								if (item.IsSupportDownload == 1) {
									isLoad = '<div class="yesLoad cursor blue" data-id="'+item.Id+'">下载</div>';
								} else {
									isLoad = '未提供';
								}
								html_con += '<li><span class="coursecount1"><i></i>' + item.Name + '</span><span class="coursecount2">' + item.CourseCount + '</span><span class="coursecount3">' + StudyOption + '</span><span class="coursecount4">' + isLoad + '</span><span class="coursecount5">' + state + '</span></li>';
							}
						})
					}
					$('.myCourse').html(html_con);
					/*下载*/
					yesLoadCourse();
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.data.coursecount/8));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.coursecount/ 8));
					}
				}
			})
		}
		//课件园地(进修选项)
		var StudyOptionClick = function(){
			$("#CAIBtn").click(function() {
				var StudyOptionNum = $.trim($(".myCAISearch #selectSystem").val());
				var dataNum = $.trim($(".myCAISearch #selectSystem").attr('data-num'));
				if (StudyOptionNum !== dataNum) {
					param.StudyOption = Number(StudyOptionNum);
					currPages = 1;
					$(".myCAISearch #selectSystem").attr('data-num', StudyOptionNum);
					countcourselist();
				}
			})
		}
		//课程下载
		var yesLoadCourse = function(){
			var ele = $('.yesLoad');
			ele && ele.length > 0 && $.each(ele, function(index, item) {
				var _t = this;
				$(_t).on('click', function() {
					var id = $(_t).attr('data-id');
					var loadParam = {
						"Id": id
					};
					var url = 'coursedownloadtozip';
					$.ajax({
						type: "POST",
						data: loadParam,
						dataType: 'json',
						url: course_Url + url,
						crossDomain: true == !(document.all),
						success: function(data, type) {
							if (data.status_code == 200) {
                                  var loadhref = data.data;
								$("#downloadtozip").attr('href',loadhref);
								document.getElementById("downloadtozip").click();
							}
						}
					})
				});
			});

		}
		//我的证件
		var minecertificateslist = function(){
			html_con += '<li class="course_title"><span class="cates1"><i></i>日期</span><span class="cates2">证件名称</span><span class="cates3">查看</span></li>';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if(data.data.lst_certificates) {
						$.each(data.data.lst_certificates, function (index, item) {
							if(item.IssuingDate && item.CertificationWork) {
								var state = '<a href="/compoents/study/care_show.html?id=' + item.Id + '">查看</a>';
								html_con += '<li><span class="cates1"><i></i>' + item.IssuingDate + '</span><span class="cates2">' + item.CertificationWork + '</span><span class="cates3">' + state + '</span></li>';
							}
						})
					}
					$('.myCourse').html(html_con);
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.data.certificatescount/8));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.certificatescount / 8));
					}
				}
			})
		}
		//查看成绩
		var lookexamlist = function(){
			html_con = '<li class="course_title"><span class="mytests1"><i></i>试卷名称</span><span class="mytests2">考试类型</span><span class="mytests3">开始考试时间</span><span class="mytests4">结束考试时间</span><span class="mytests2">分数</span><span class="mytests2">用时</span><span class="mytests5">查看试卷</span></li>';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					if(data.data) {
						$.each(data.data, function (index, item) {
							if(item.Name && item.StartTestTime && item.StopTestTime) {
								var examType = item.ExamType;
								if(examType == 2){
									examType = '正式考试';
								}else{
									examType = '模拟考试';
								}
								var state = '<a href="/compoents/study/testLook.html?UserTPLibId=' + item.Id + '" target="_blank">查看试卷</a>';
								var whentime = 0;
                                if(item.ExamDuration*60 <= item.TestTime){
                                	whentime = item.ExamDuration+'分0秒';
                                }else{
                                	var timeM = parseInt(item.TestTime / 60);
									var timeS = item.TestTime % 60;
									whentime = timeM+'分'+timeS+'秒';
                                }
								html_con += '<li><span class="mytests1"><i></i>' + item.Name + '</span><span class="mytests2">'+examType+'</span><span class="mytests3">' + item.StartTestTime + '</span><span class="mytests4">' + item.StopTestTime + '</span><span class="mytests2">' + item.SumScore + '</span><span class="mytests2">'+whentime+'</span><span class="mytests5">' + state + '</span></li>';
							}
						})
					}
					$('.myCourse').html(html_con);
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.obj.TotalCount / 8));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.obj.TotalCount / 8));
					}
				}
			})
		}
		//专项练习
		var specialPracticelist = function(){
			html_con = '';
			$.ajax({
				type: 'POST',
				data: param,
				url: zoomUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					console.log(data.data);
					if(data.data) {
						$.each(data.data, function (index, item) {
							html_con += '<div class="specialPracticelist"><a href="/compoents/study/practice_show.html?CategoryId=' + item.CategoryId + '&num='+item.Total+'">'+item.Name+'('+item.Total+')</a></div>';
						})
					}
					$('.myCourse').html(html_con);
					if(firstPage){
						/*初始页码*/
						page(Math.ceil(data.obj.TotalCount/20));
						firstPage = false;
					}else{
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.obj.TotalCount / 20));
					}
				}
			})
		}
		//课件园地(进修选项)
		var StudyOptionClick = function(){
			$("#specialPracticeButton").click(function() {
				var specialPracticeInput = $.trim($("#specialPracticeInput").val());
				if (specialPracticeInput !== undefined) {
					currPages = 1;
					param.CategoryName = specialPracticeInput
					specialPracticelist();
				}
			})
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
					param.PageIndex = currPage;
					currPages = currPage;
					switch (navTitle){
						case '我的考试':
							formalexamlist();
							break;
						case '模拟练习':
							switch(monitorexamBtnType){
								case "1":
								   monitorexamlist();
									break;
								case "2":
								    monitorexamRandomlist();
									break;
								case "3":
									break;
								case "4":
								    simulationPracticeClassificationList();
									break;
							}
							break;
						case '每日一题':
							everydayquestionlist();
							break;
						case '课件园地':
							countcourselist();
							break;
						case '我的证件':
							minecertificateslist();
							break;
						case '查看成绩':
							lookexamlist();
							break;
						case '专项练习':
							specialPracticelist();
							break;	
						default :
							minecourselist(); //我的课程
							break;
					}
				}
			});
		};
        //导航渲染
		var navDom = function(data) {
			var html='',url = '',isActive,className = '',num = '';
			$.each(data, function(index, item) {
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
				isActive = item.Name == '在线学习' ? 'active' : '';
				/*拼接dom*/
				html +='<li class="'+isActive+' '+className+'" id_num="'+num+'"><a href="'+url+'">' + item.Name + '</a></li>';
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
			isLogin();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
//正式考试指纹登录
function isFinger(obj){
	if(IsPC()){
		var href = $(obj).attr('data-href');
		var locationStr = href.split('?')[1].split('&');
		var status = locationStr[1].split('=')[1];
		var isMockExamination = locationStr[2].split('=')[1];
		if(status == 1){
			var UserTPLibId = locationStr[0].split('=')[1];
			window.localStorage.removeItem("saveAnswers"+$.cookie('Token')+UserTPLibId); 
		}
		if(Number(isMockExamination) == 1){ //模拟考试
	      window.location.href = href;
	      return true;
		}
		var isFingerParam = $(obj).attr('data-finger');
	    $(".myCourse li .test_href").removeClass('isFinger');
	    if(isFingerParam == "1"){
	    	var param = href.split("?")[1];
	    	window.location.href = '/compoents/study/testLogin.html?' + param;
	    	return false;
	    }
	   window.location.href = href;
	}
}