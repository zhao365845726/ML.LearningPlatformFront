var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var ajax_url = ajaxUrl(),//统一的ajax请求地址
            exam_Url = examUrl(),
            oldData = [],//全部数据
            noData = [],//做错的数据
            yesData = [],//做对的数据
            nullData = [],//未做的数据
            nowData = [];//当前展示的数据
        var locationUrl = window.location.search.substr(1);
        var UserTPAchievementId = locationUrl.split('=')[1];
        var param = {
            UserTPAchievementId:UserTPAchievementId
        };
        var JudgeScore = 0;//判断
        var MultipleScore = 0;//多选
        var RadioScore = 0;//单选
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
                            lookresultdetail();
                            $(".lookTestRight").on('click',function(){
                                var urlId = $(".nav_study").attr('id_num');
                                window.location.href = '/compoents/study/study.html?id='+urlId+'&title=在线学习';
                            })
                        }else{
                            window.location.href = '/compoents/study/studyLogin.html';
                        }
                    }
                })
            }else{
                window.location.href = '/compoents/study/studyLogin.html';
            }
        }
        //获取成绩
        var lookresultdetail = function(){
            var url = "lookresultdetail";
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: exam_Url + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    // console.log(data.data);
                    if (data.data) {
                        var mydata = eval('(' + $.cookie('myData') + ')');
                        if(mydata.Photograph){
                         $(".personHeadImg").attr('src',mydata.Photograph);
                        }
                        $(".personal_name").html('考生：'+mydata.RealName);
                        $(".personal_num").html('账户：'+mydata.Account);
                        
                        var time = countTime(data.data.ConsumingTime);
                        $(".lookTestOverN").html('分数：'+data.data.SumScore);
                        $(".lookTestOverT").html('用时：'+time);
                        $(".lookTestTitle").html(data.data.TestPageName);
                        $(".mobile_now_testTitle").html(data.data.TestPageName);

                        JudgeScore = data.data.JudgeScore;//判断
                        MultipleScore = data.data.MultipleScore;//多选
                        RadioScore = data.data.RadioScore;//单选

                        processData(data.data.lst_vtpquestions);
                    }
                }
            })
        }
         //计算时间
        function countTime(time){
             var a = time;
             var d = parseInt(a/86400);
             var h = parseInt((a%86400)/3600);
             var m = parseInt((a%86400%3600)/60);
             var s = a%86400%360%60;
             var str= '';
             if(d > 0){
                str = d + '天'+ h + '小时'+ m +'分钟' + s + '秒';
             }else{
                if(h > 0){
                    str = h + '小时'+ m +'分钟' + s + '秒';
                 }else{
                    if(m > 0){
                        str = m +'分钟' + s + '秒';
                     }else{
                        str = s + '秒';
                     }
                 }
             }
             return str;
        }
        //处理数据
        var processData = function(data){
            oldData = data;
            console.log(oldData);
            $.each(data, function(index, item) {

                    if(item.Type == 1 || item.Type == 3){
                        if(!item.UserAnswerId){
                            nullData.push(item);
                        }else
                        if(item.UserAnswerId !== item.AnswerId){
                            noData.push(item);
                        }else{
                            yesData.push(item);
                        }
                        // console.log(item)
                    }
                    if(item.Type == 2){
                        if(!item.UserAnswerId){
                            nullData.push(item);
                        }else{
                            var AnswerID = item.AnswerId.split('|');
                            var UserID = item.UserAnswerId.split('|');
                            // console.log(UserID);
                            if(AnswerID.sort().toString()!==UserID.sort().toString()){
                                noData.push(item);
                            }else {
                                yesData.push(item);
                            }
                        }
                    }


                // if(!item.UserAnswerId){
                //     nullData.push(item);
                //     // console.log(nullData);
                // }else
                //     // var UserID = item.UserAnswerId.split('|');
                //     // // console.log(item.UserID);
                //     // var AnswerID = item.UserAnswerId.split('|');
                //
                // if(item.UserAnswerId !== item.AnswerId){
                //     noData.push(item);
                //     // console.log(noData);
                // }else{
                //     yesData.push(item);
                // }


            })
            nowData = oldData;
            //总数
            $(".zoomNum").html('( '+data.length+' )');
            //错题数
            $(".errorNum").html('( '+noData.length+' )');
            //未做题数
            $(".noNum").html('( '+nullData.length+' )');
            //左侧百分比
             chart(yesData.length,noData.length,nullData.length);
            //右侧试题
             rightTest(nowData);
            //初始点击事件
            lookClick();
        }


        //初始点击事件
        var lookClick = function(){
            var ele = $('.lookTestLeft li');
            ele && ele.length > 0 && $.each(ele, function(index, item) {
                var _t = this;
                $(_t).on('click', function() {
                    $(_t).addClass('active').siblings().removeClass('active');
                    var num = Number($(_t).attr('data-num'));
                    switch (num){
                        case 1:
                            nowData = oldData;
                            break;
                        case 2:
                            nowData = noData;
                            break;
                        case 3:
                            nowData = nullData;
                            break;    
                        default :
                            break;
                    }
                    rightTest(nowData);
                })
            })
        }
        //左侧百分比
        var chart = function(a,b,c){
            /*初始化echarts实例*/
            var myChart = echarts.init(document.getElementById('myChart'));
            var option = {
                title : {
                    text: '',
                    subtext: '',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}题 ({d}%)"
                },
                legend: {
                    bottom: 10,
                    left: 30,
                    data: ['做对','做错','未做']
                },
                series : [{
                    name: '',
                    type: 'pie',
                    radius : '40%',
                    center: ['40%', '50%'],
                    data:[
                        {value:a,
                            name:'做对',
                            itemStyle:{
                                normal:{
                                    color:'rgb(45,173,108)',
                                    shadowBlur:'90',
                                    shadowColor:'rgba(45,173,108,0.8)',
                                    shadowOffsetY:'10'
                                }
                            }
                        },
                        {value:b,
                            name:'做错',
                            itemStyle:{
                                normal:{
                                    color:'rgb(227,57,70)'
                                }
                            }
                        },
                        {value:c,
                            name:'未做',
                            itemStyle:{
                                normal:{
                                    color:'rgb(3,67,134)'
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
            /*使用刚指定的配置项和数据显示图表。*/
            myChart.setOption(option);
        }
        //右侧试题
        var rightTest = function(data){
            var zoomCon = '';
            $.each(data, function(index, item) {
                var html = initquestions(index,item);
                zoomCon += html;
            })
            $('.lookTestQuestions').html(zoomCon);
        }
        //初始题库
        var initquestions = function(key,data){
            var key = Number(key)+1;
            if(data){
                var selectCon = '';
                var thisScore = 0;
                switch (data.Type){
                    case 1:
                        selectCon = '<i>单选</i>';
                        thisScore = RadioScore;
                        break;
                    case 2:
                        selectCon = '<i>多选</i>';
                        thisScore = MultipleScore;
                        break;
                    case 3:
                        selectCon = '<i>判断</i>';
                        thisScore = JudgeScore;
                        break;
                    default :
                        break;

                }
                var isActive = '';
                var UserAnswerIdArr = '';
                if(data.Type == 1 || data.Type == 3){
                    if(!data.UserAnswerId){
                        isActive = 'null';
                    }else
                    if(data.UserAnswerId !== data.AnswerId){
                        isActive = 'no';
                    }else{
                        isActive = 'yes';
                    }
                }
                if(data.Type == 2){
                    if(!data.UserAnswerId){
                        isActive = 'null';
                    }else{
                        var AnswerID = data.AnswerId.split('|');
                        var UserID = data.UserAnswerId.split('|');
                        // console.log(UserID);
                        if(AnswerID.sort().toString()!==UserID.sort().toString()){
                            isActive = 'no';
                        }else {
                            isActive = 'yes';
                        }
                    }
                }
                if(!data.UserAnswerId){
                    // isActive = 'null';
                }else if(data.AnswerId != data.UserAnswerId){
                    // isActive = 'no';
                    UserAnswerIdArr = data.UserAnswerId.split('|');
                }else{
                    // isActive = 'yes';
                    UserAnswerIdArr = data.UserAnswerId.split('|');
                }
                var title = '<div class="lookTestQuestionsTitle">'+selectCon+'<span><strong>'+key+'.</strong>'+data.Title+' ['+thisScore+'分]</span></div>';
                var orderA = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                var orderCon = '';
                var yesAnswers = '';
                var isSelectActive = '';
                $.each(data.ListViewTPQuesionOptions, function(index, item){
                    // console.log(item);
                    if(item.IsAnswer == 1){
                        yesAnswers += orderA[index]+',';

                    }
                    for(var j=0;j<UserAnswerIdArr.length;j++){

                        if(item.Id == UserAnswerIdArr[j]){
                            isSelectActive = 'checked';
                            break;
                        }else{
                            isSelectActive = '';
                        }
                    }
                    orderCon += '<li data-id="'+item.Id+'"><label class="cursor '+isSelectActive+'"><b>'+orderA[index]+'</b><span>'+item.OptionName+'</span></label></li>';
                });
                yesAnswers = yesAnswers.slice(0,-1);
                // console.log(yesAnswers);
                orderCon = '<ul class="container lookTestQuestions_answer">'+orderCon+'</ul><div class="lookTestQuestionsVal">答案：'+yesAnswers+'</div>';
                var html = '<li class="lookTestQuestionsList '+isActive+'">'+title+orderCon+'</li>';
                return html;
            }
        }
        //导航渲染
        var navDom = function(data) {
            var html='',url = '',isActive,className = '',num = '';
            $.each(data, function(index, item) {
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
                isActive = item.Name == '在线学习' ? 'active' : '';
                //拼接dom;
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
            $('.footer').load('/compoents/common/footer.html');
            Friendlink();
        };
        init();
    })
})(window, jQuery);
