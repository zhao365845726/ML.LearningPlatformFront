var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var favorite_courseUrl = favoritecourseUrl(),//ajax请求地址
            ajax_url = ajaxUrl(),
            question = '',
            checkedLength = '',//被选择的答案数
            yesAnswers = '',//正确答案
            yesData = [];//正确答案id
        var hrefTitle = Number(decodeURI(window.location.search.split('=')[2]));//获取？后面的参数，并防止乱码
        var EverydayQuestionId = window.location.search.substr(1).split('&')[0].split('=')[1];
        //是否登录
        var isLogin = function(){
            var falg = $.cookie('userId');
            //console.log($.cookie('userId'));
            if(falg){
                $.ajax({
                    type: "POST",
                    data: {userId:falg},
                    dataType: 'json',
                    url: isLoginUrl(),
                    crossDomain: true == !(document.all),
                    success: function(data, type) {
                        //console.log(data);
                        if(data.status_code == 200){
                            //console.log(hrefTitle);
                            if(!hrefTitle){
                                $(".example_show").show();
                                $(".example_showAnswer").show();
                            }
                            EverydayTest();
                        }else{
                            window.location.href = '/compoents/study/studyLogin.html';
                        }
                    }
                })
            }else{
                window.location.href = '/compoents/study/studyLogin.html';
            }
        }
        //题库
        var EverydayTest = function(){
            var url = "everydayquestiondetail";
            var param = {
                EverydayQuestionId:EverydayQuestionId
            }
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: favorite_courseUrl + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    //console.log(data);
                    if (data.data) {
                        question = data.data;
                        initquestions(question);
                        allClick();
                        if(!hrefTitle){
                            selectAnswer();
                        }
                    }
                }
            })
        }
        //初始题库
        var initquestions = function(data){
            if(data){
                var selectCon = '';
                switch (data.veqdEntity.QuestionType){
                    case 1:
                        selectCon = '<i>单选</i>';
                        break;
                    case 2:
                        selectCon = '<i>多选</i>';
                        break;
                    case 3:
                        selectCon = '<i>判断</i>';
                        break;
                    default :
                        break;
                }
                var UserAnswerIdArr = '';
                if(data.veqdEntity.UserSelect){
                    UserAnswerIdArr = data.veqdEntity.UserSelect.split('|');
                }
                //console.log(UserAnswerIdArr);
                var title = '<div class="example" data-id="'+data.veqdEntity.QuestionId+'" data-type="'+data.veqdEntity.QuestionType+'">'+selectCon+'<span><strong></strong>'+data.veqdEntity.QuestionTitle +'( )</span></div>';
                var orderA = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                var orderCon = '';
                var isSelectActive = '';
                $.each(data.lst_questionoptions, function(index, item){
                    if(item.IsAnswer){
                        yesAnswers += orderA[index]+',';
                        yesData.push(item.Id);
                    }
                    for(var j=0;j<UserAnswerIdArr.length;j++){

                        if(item.Id == UserAnswerIdArr[j]){
                            isSelectActive = 'checked';
                            break;
                        }else{
                            isSelectActive = '';
                        }
                    }
                    orderCon += '<li data-id="'+item.Id+'"><label class="cursor '+isSelectActive+'"><b>'+orderA[index]+'</b><span>'+item.Name+'</span></label></li>';
                });
                orderCon = '<ul class="container example_answer">'+orderCon+'</ul>';
                yesAnswers = yesAnswers.slice(0,-1);
                var zoomCom = title+orderCon;
                //console.log(yesAnswers);

                $('.study_day_head').html(zoomCom);
                $(".analysis1").html('正确答案：'+'<b class="example_analysis_show">'+yesAnswers+'</b>');
            }else{
                $('.study_day_head').html('');
                $(".analysis1").html('正确答案：');
            }
            if(hrefTitle){
                $(".example_analysis").show();
            }
        }
        //初始点击事件
        var allClick = function(){
            /*退出*/
            $(".example_out").click(function(){
                $(".closeTestBox").show();
            });
            /*取消*/
            $(".closeTest_n").click(function(){
                $(".closeTestBox").hide();
            });
            /*X*/
            $(".closeTestDel").click(function(){
                $(".closeTestBox").hide();
            });
            /*确定*/
            $(".closeTest_y").click(function(){
                var urlId = $(".nav_study").attr('id_num');
                window.location.href = '/compoents/study/study.html?id='+urlId+'&title=在线学习';
            });
            /*查看答案*/
            $(".example_showAnswer").click(function(){
                $(".example_analysis").toggle();
            })
            /*提交*/
            $(".example_show").click(function(){
                checkedLength = $('.example_answer label.checked').length;
                if(!checkedLength){
                    $(".loadanswerBox p").html('还未做题，无法提交!');
                    $(".loadanswerBox").show();
                }else{
                    isYesAnswer();
                }
            });
            /*判断答案是否正确*/
            isYesAnswer = function(){
                var checkedCon = '';
                var checkedList = $('.example_answer label.checked');
                for(var i=0;i<checkedLength;i++) {
                    var parentId = $(checkedList[i]).parent().attr('data-id');
                    checkedCon += parentId + '|';
                }
                var checkedConArr = checkedCon.slice(0,-1).split('|');
               if(yesData.sort().toString() == checkedConArr.sort().toString()){
                  submitAnswer(checkedCon.slice(0,-1));
               }else{
                   $(".loadanswerBox p").html('答案不正确，请重做！');
                   $(".loadanswerBox").show();
               }
            }
            /*取消提交*/
            $(".loadanswer_n").click(function(){
                $(".loadanswerBox").hide();
            })
            /*X*/
            $(".loadanswerDel").click(function(){
                $(".loadanswerBox").hide();
            })
        }
        //提交答案
        var submitAnswer = function(data){
            var url = "commiteverydayquestionresult";
            var param = {
                EverydayQuestionId:EverydayQuestionId,
                SelectResult:data
            };
            //console.log(param);
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: favorite_courseUrl + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    //console.log(data);
                    if (data.status_code == 200) {
                      var urlId = $(".nav_study").attr('id_num');
                      window.location.href = '/compoents/study/study.html?id='+urlId+'&title=在线学习';
                    }
                }
            })
        }
        //选择答案
        var selectAnswer = function(){
            var ele = $('.example_answer label');
            ele && ele.length > 0 && $.each(ele, function(index, item) {
                var _t = this;
                $(_t).on('click', function () {
                    var type = $(".example").attr('data-type');
                    if($(_t).hasClass('checked')){
                        $(_t).removeClass('checked');
                    }else{
                        if(type == 1 || type == 3){
                            ele.removeClass('checked');
                        }
                        $(_t).addClass('checked');
                    }
                })
            })

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
                            url = '/compoents/file/introduction.html?id=' + item.Id + '&title=' + item.Name;
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
                    isActive = item.Name == '在线学习' ? 'active' : '';
                    //拼接dom;
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
            isLogin();
            seachFun();
            seachMobileFun();
            $('.footer').load('/compoents/common/footer.html');
            Friendlink();
        };
        init();
    })
})(window, jQuery);
