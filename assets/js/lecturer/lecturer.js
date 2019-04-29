var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var lecturerUrl = lecturerUrls(),//ajax请求地址
			ajax_url = ajaxUrl(),
			isClickSelect = false,
			currPages = 1,//分页
			parentId = '',
			title = '',
			urlId = '',
			param = {};
		var location_url = window.location.search.substr(1).split('&');
		if(location_url.length == 1){//列表页
            title = decodeURI(location_url[0].split('=')[1]);
		}else{//内容页
			title = decodeURI(location_url[1].split('=')[1]);
			parentId = decodeURI(location_url[2].split('=')[1]);
			urlId = location_url[0].split('=')[1];
		}
		//区分讲师风采与讲师库以及内容的参数
		switch (title){
			case '讲师风采':
				lecturerUrl += 'getlecturerstyle';
				param = {
					Title:'',
					PageIndex:1,
					PageSize:9
				};
				if(!IsPC()){
					$(".sideBarTitle").html(title);
				}
				break;
			case '讲师库':
				lecturerUrl += 'getlecturerlibrarylist';
				param = {
					Name:'',
					GraduateSchool:'',
					GraduateMajor:'',
					Specialty:'',
					Education:'',
					PageIndex:1,
					PageSize:10
				};
				if(!IsPC()){
					$(".sideBarTitle").html(title);
				}
				$(".teacherSelectBtn").on('click',function(){
					currPages = 1;
					param.PageIndex = 1;
					lecturerBtn();
				})
				break;
			default :
				lecturerUrl += 'getlecturerdetail';
				param = {
					Id : urlId
				}
				break;
		}
		//左侧导航及右侧内容
		var lecturer = function() {
			var html = '',isActive = '';
			$.ajax({
				type: 'POST',
				data: param,
				url: lecturerUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function(data, type) {
					//console.log(data.data);
					if(data.data){
						switch (title){
							case '讲师风采':
								$.each(data.data.lst_lecturerstyle, function(index, item) {
									if(Number(index%3) == 0){
										isActive = 'active';
									}else{
										isActive = '';
									}
									html += '<li class="lecturerlist cursor '+isActive+'"><img src="'+item.StyleImage+'" alt=""></li>';
								});
								$(".lecturerLists").html(html);
								/*页码*/
								page(Math.ceil(data.data.lecturerstylecount/9));
								break;
							case '讲师库':
								$.each(data.data.lst_vlecturerlib, function(index, item) {
									var url = '/compoents/lecturer/lecturer_show.html?id='+item.Id+'&title=&parentId='+title;

									if(Number(index%5) == 0){
										isActive = 'active';
									}else{
										isActive = '';
									}
									html += '<li class="'+isActive+'"><a href="'+url+'"><img src="'+item.PhotoGraph+'" alt=""><p>'+item.Name+'</p></a></li>';
								});
								$(".teachers").html(html);
								/*页码*/
								page(Math.ceil(data.data.lecturercount/10));
								break;
							default :
								$(".article_title").html(data.data.Name);
								$(".teacherName").html(data.data.Name);
								$(".teacherImg").attr('src',data.data.PhotoGraph);
								if(data.data.Gender ==1){
									$(".teacherSex").html('男');
								}else{
									$(".teacherSex").html('女');
								}
								$(".teacherAges").html(data.data.Age+'岁');
								$(".teacherSchool").html('毕业学校：'+data.data.GraduateSchool);
								$(".teacherGraduate").html('专业：'+data.data.GraduateMajor);
								$(".teacherPositional").html('职称：'+data.data.PositionalTitle);
								$(".teacherEducation").html('教龄：'+data.data.Seniority+'年');
								$(".teacherSpecialty").html('教授专业：'+data.data.Specialty);
								var education = '';
								switch (Number(data.data.Education)){
									case 1:
										education = '小学';
										break;
									case 2:
										education = '初中';
										break;
									case 3:
										education = '高中';
										break;
									case 4:
										education = '中专';
										break;
									case 5:
										education = '大专';
										break;
									case 6:
										education = '本科';
										break;
									case 7:
										education = '硕士';
										break;
									case 8:
										education = '博士';
										break;
									default :
										education = '其他';
										break;
								}
							$(".teacherMajor").html(education);
							break;
						}
					}
				}
			});
		};
		//初始讲师库选择按钮
		var lecturerBtn = function(){
			var Name = $.trim($(".Name").val());
			var GraduateSchool = $.trim($(".GraduateSchool").val());
			var GraduateMajor = $.trim($(".GraduateMajor").val());
			var Specialty = $.trim($(".Specialty").val());
			var Education = $.trim($("#Education").val());
			param.Name = Name;
			param.GraduateSchool = GraduateSchool;
			param.GraduateMajor = GraduateMajor;
			param.Specialty = Specialty;
			param.Education = Education;
			var html = '',isActive = '';
			//console.log(param);
			$.ajax({
				type: 'POST',
				data: param,
				url: lecturerUrl,
				dataType: 'json',
				crossDomain: true == !(document.all),
				success: function (data, type) {
					//console.log(data);
					if(data.data){
						$.each(data.data.lst_vlecturerlib, function(index, item) {
							var url = '/compoents/lecturer/lecturer_show.html?id='+item.Id+'&title=&parentId='+title;

							if(Number(index%5) == 0){
								isActive = 'active';
							}else{
								isActive = '';
							}
							html += '<li class="'+isActive+'"><a href="'+url+'"><img src="'+item.PhotoGraph+'" alt=""><p>'+item.Name+'</p></a></li>';
						});
						$(".teachers").html(html);
						/*页码*/
						$("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.lecturercount/10));
					}
					isClickSelect = true;
				}
			})
		}
		//导航渲染
		var navDom = function(data) {
			var html='',url = '',isActive,className = '',num = '';
			$.each(data, function(index, item) {
				if(Number(item.ShowMark)) {
					//设定href值
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
					//拼接dom;
					html += '<li class="' + isActive + ' ' + className + '" id_num="' + num + '"><a href="' + url + '">' + item.Name + '</a></li>';
				}
			});
			$('.nav').html(html);
			$(".mobileNavLists").html(html);
			$(".nav_teacher").addClass('active');
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
					//console.log('isClickSelect:'+isClickSelect);
					if(!isClickSelect){
						lecturer();
					}else{
						lecturerBtn();
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
			lecturer();
			seachFun();
			seachMobileFun();
			$('.footer').load('/compoents/common/footer.html');
			Friendlink();
		};
		init();
	})
})(window, jQuery);
