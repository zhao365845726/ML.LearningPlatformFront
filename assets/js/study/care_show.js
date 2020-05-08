var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var favorite_courseUrl = favoritecourseUrl(),//ajax请求地址
            ajax_url = ajaxUrl();
        var getid = window.location.search.substr(1).split('=')[1];//获取？后面的参数，并防止乱码
        //是否登录
        var isLogin = function(){
            var falg = $.cookie('userId');
            if(falg){
                $.ajax({
                    type: "POST",
                    data: {userId:falg},
                    dataType: 'json',
                    url: isLoginUrl(),
                    crossDomain: true == !(document.all),
                    success: function(data, type) {
                        if(data.status_code == 200){
                            careShow();
                        }else{
                            window.location.href = '/index.html';
                        }
                    }
                })
            }else{
                window.location.href = '/index.html';
            }
        }
        //证件详情页
        var careShow = function(){
            var url = "getcertificatesdetail";
            var param = { Id:getid}
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: favorite_courseUrl + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    if (data.data) {
                        //var parentId = $(".nav_study").attr('id_num');
                        var parentId = '6f8fded1-7613-4a0c-945f-ad16df733443';
                        $(".article_title1 a").attr('href','/compoents/study/study.html?id='+parentId+'&title=我的证件');
                        var mydata = eval('(' + $.cookie('myData') + ')');
                        if(mydata) {
                            $(".CompanyName").html(mydata.CompanyName);
                            $(".DeptName").html(mydata.DeptName);
                            $(".Account").html(mydata.Account);
                            $(".RealName").html(mydata.RealName);
                            $(".Gender").html(mydata.Gender);
                            $(".IDCard").html(mydata.IDCard);
                        }
                        $(".article_title").html(data.data.CertificationWork);
                        $(".cardShow h3").html(data.data.CertificationWork);
                        $(".IDNumber").html(data.data.IDNumber);
                        $(".CertificationWork").html(data.data.CertificationWork);
                        $(".StartTrainingTime").html(data.data.StartTrainingTime);
                        $(".StopTrainingTime").html(data.data.StopTrainingTime);
                        $(".TrainingInstitution").html(data.data.TrainingInstitution);
                        $(".ClassHour").html(data.data.ClassHour);
                        $(".TheoryScore").html(data.data.TheoryScore);
                        $(".PracticalOperationScore").html(data.data.PracticalOperationScore);
                        $(".TrainingResult").html(data.data.TrainingResult);
                        $(".IssuingUnit").html(data.data.IssuingUnit);
                        $(".IssuingDate").html(data.data.IssuingDate);
                        $(".TakeEffectDate").html(data.data.TakeEffectDate);
                        $(".InvaildDate").html(data.data.InvaildDate);
                        $(".CreateTime").html(data.data.CreateTime);
                        var typeCon = '';
                        switch (data.data.Type){
                            case 1:
                                typeCon = '初训';
                                break;
                            case 2:
                                typeCon = '复训';
                                break;
                            case 3:
                                typeCon = '再培训';
                                break;
                            default :
                                break;
                        }
                        $(".type").html(typeCon);
                    }
                }
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
