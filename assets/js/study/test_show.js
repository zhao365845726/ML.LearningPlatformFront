var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
    	var ajax_url,exam_Url,redis_Url,locationUrl,UserTitle,UserTPLibId,testType,storage = '',zoomArr = [],question = '',FillBlankScore=0,JudgeScore = 0,MultipleScore = 0,RadioScore = 0,questionType,orders,radios,checks,judges,fillblanks,nowCons,hh = 0,mm = 0,ss = 0,idt,next_prv_index = 0,setData = '',noZuo = 0,loadSetInterval,loadTime = 3,loadNum = 0;

	        ajax_url = ajaxUrl();
            exam_Url = examUrl();
            redis_Url = redisUrl();
		    locationUrl = window.location.search.substr(1).split('&');
	        UserTPLibId = locationUrl[0].split('=')[1];
	        UserTitle = locationUrl[1].split('=')[1];
	        testType = locationUrl[2].split('=')[1]; 
	        storage = window.localStorage;
	        questionType = 2;//1代表部分试题，2代表全部试题
	        orders = [];//区分考试题，总题
            radios = [];//单选题
            checks = [];//多选题
            judges = [];//判断题
            fillblanks = [];//填空题
            nowCons = [];//当前的试题  
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
                    isActive = item.Name == '在线学习' ? 'active' : '';
                    //拼接dom;
                    html += '<li class="' + isActive + ' ' + className + '" id_num="' + num + '"><a href="' + url + '">' + item.Name + '</a></li>';
                }
            });
            $('.nav').html(html);
            $(".mobileNavLists").html(html);
        };
        var init_second = function(){
            // console.log(UserTitle);
            // if(Number(UserTitle)){ //1代表是进入考试
            // 	//清除保存的答案
            //     storage.removeItem("saveAnswers"+$.cookie('userId')+UserTPLibId); 
            //     //修改考试状态
            //     innerTest();
            // }else{
            //     testCon();
            // }
            testCon();
            if(IsPC()){
             funWindowScroll();   
            }
            $('.footer').load('/compoents/common/footer.html');
            Friendlink();
        };
        //修改考试状态
        // var innerTest = function(){
        //     var url = "startexam";
        //     var param = {
        //         UserTPLibId:UserTPLibId
        //     }
        //     $.ajax({
        //         type: "POST",
        //         data: param,
        //         dataType: 'json',
        //         url: exam_Url + url,
        //         crossDomain: true == !(document.all),
        //         success: function(data, type) {
        //             if (data.data) {
        //                 testCon();
        //             }
        //         }
        //     })
        // }
        //清空缓存
        var clearRedis = function(UserTPLibId_p){
            var UserTPLibId1 = UserTPLibId_p || '';
             $.ajax({
                type: "POST",
                data: {"UserTPAchievementId":UserTPLibId1},
                dataType: 'json',
                url:  redis_Url + 'clearredis',
                crossDomain: true == !(document.all),
                success: function(data, type) {
                   // console.log(data);
                    if(data.data == 1){
                       loadNum++;
                        if(loadNum > 3){
                            clearInterval(loadSetInterval);
                            $(".loadShade span").html("请联系管理员");
                            return false;
                        }
                        loadSetInterval = setInterval(function(){
                            if(loadTime < 0){
                             loadTime = 3;
                             clearInterval(loadSetInterval);
                             testCon();
                            }
                            $(".loadShade b").html(loadTime); 
                             loadTime--;
                        },1000)
                    }else{
                       clearRedis(UserTPLibId);
                    }
                    
                }
            })
             
        }
        //抽题
        var testCon = function(){
        	examineeInfo();
            initZoomArr();
            var url = "examdetail";
            var param = {
                UserTPLibId:UserTPLibId
            }
           // console.log(param);
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: exam_Url + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    console.log(data);
                    if (data.data.lst_vtpquestions.length > 0) {
                        $(".loadShade").css('display','none');
                        question = data.data;
                        FillBlankScore = question.vtestpaperlib.FillBlankScore;//填空
                        JudgeScore = question.vtestpaperlib.JudgeScore;//判断
                        MultipleScore = question.vtestpaperlib.MultipleScore;//多选
                        RadioScore = question.vtestpaperlib.RadioScore;//单选
                        $(".question_length").html('共'+question.vtestpaperlib.NumberOfTopics+'题');
                        $(".question_time").html('（'+question.vtestpaperlib.ExamDuration+'分钟）');

                        order(question);//顺序单选题，多选，判断, 填空
                        tpquestions(question.lst_vtpquestions);//题库
                        questionCards(question.lst_vtpquestions);//答题卡
                        countdown(question.vtestpaperlib.ExamDuration);
                        //保存答案
                        saveAnswers();
                        $("#questionSubmit").css('display','block');
                    }else{
                        clearRedis(UserTPLibId);
                        // loadNum++;
                        // if(loadNum > 3){
                        //     clearInterval(loadSetInterval);
                        //     $(".loadShade span").html("请联系管理员");
                        //     return false;
                        // }
                        // loadSetInterval = setInterval(function(){
                        //     if(loadTime < 0){
                        //      loadTime = 3;
                        //      clearInterval(loadSetInterval);
                        //      testCon();
                        //     }
                        //     $(".loadShade b").html(loadTime); 
                        //      loadTime--;
                        // },1000)
                    }
                }
            })
        }
        //考生信息
        var examineeInfo = function(){
        	var mydata = eval('(' + $.cookie('myData') + ')');
	        if(mydata.Photograph){
	            $(".personal_info_img").attr('src',mydata.Photograph);
	        }
	        $(".personal_name").html('考生：'+mydata.RealName);
	        $(".personal_num").html('账户：'+mydata.Account);
        }
        //开始时若有存储答案把答案付给zoomArr
        var initZoomArr = function(){
            var details = JSON.parse(storage.getItem("saveAnswers"+$.cookie('userId')+UserTPLibId));
            console.log(details);
            if(details){
                zoomArr = details.saveAnswersListData.split(",");
            }
        }
        //顺序单选题，多选，判断
        var order = function(data){
            var html = '<li class="cursor active" data-type="0">顺序</li><li class="cursor" data-type="1">单选题（'+data.SingleCount+')</li><li class="cursor" data-type="2">多选题（'+data.MultipleCount+')</li><li class="cursor" data-type="3">判断题（'+data.DecideCount+')</li><li class="cursor" data-type="4">填空题（'+data.FillBlankCount+')</li>';
            $('.start_test_order').html(html);
        }
        
        //处理考题数据
        var tpquestions = function(data){
            for(var i=0;i<data.length;i++){
                switch (data[i].Type){
                    case 1:
                        data[i].order = i+1;
                        radios.push(data[i]);
                        break;
                    case 2:
                        data[i].order = i+1;
                        checks.push(data[i]);
                        break;
                    case 3:
                        data[i].order = i+1;
                        judges.push(data[i]);
                        break;
                    case 4:
                        data[i].order = i+1;
                        fillblanks.push(data[i]);
                        break;
                    default :
                        break;

                }
                orders.push(data[i]);
            }
            console.log(orders);
            nowCons = orders;
            switch(questionType){
                case 1:
                  initquestions(nowCons[0]); 
                  break;
                case 2:
                  $(".example_show_x").hide();
                  $(".example_show_s").hide();
                  $(".Stick").show();
                  allQuestionsShow();
                  break;
                default:
                  break;
            }
            next();
            prv();
            orderClick();    
            sendAnswerClick(); 
            assignmentClick();  
            allQuestionsBtn();//全部试题 
            partQuestionsBtn();//部分试题
            stickBtn();//置顶
        }
        //全部试题展示
        var allQuestionsShow = function(){         
            $('.tpquestions').html('');
            for(var i =0;i< nowCons.length;i++){
               initquestions(nowCons[i]);
            }
            selectAnswer();
        }
         //初始题库
        var initquestions = function(data){
            if(data){
                var selectCon = '';
                var multiple = '';
                var thisScore = 0;
                switch (data.Type){
                    case 1:
                        selectCon = '<i>单选</i>';
                        thisScore = RadioScore;
                        break;
                    case 2:
                        selectCon = '<i>多选</i>';
                        multiple = 'multiple';
                        thisScore = MultipleScore;
                        break;
                    case 3:
                        selectCon = '<i>判断</i>';
                        thisScore = JudgeScore;
                        break;
                    case 4:
                        selectCon = '<i>填空</i>';
                        thisScore = FillBlankScore;
                        break;
                    default :
                        break;
                }
                var title = '<div class="example">'+selectCon+'<span><strong>'+data.order+'.</strong>'+data.Title+' ['+thisScore+'分]</span></div>';
                if(data.Type != 4){
                    var orderA = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                    var orderCon = '';
                    var isActive = '';
                    var classNum = '';
                    $.each(data.ListViewTPQuesionOptions, function(index, item){
                        if(zoomArr[data.order-1]){
                            var labelId = zoomArr[data.order-1].split('=')[1].split('|');
                                for(var i=0;i<labelId.length;i++){
                                    if(item.Id == labelId[i]){
                                        isActive = 'checked';
                                        break;
                                    }else{
                                        isActive = '';
                                    }
                                }
                        }else{
                            isActive = '';
                        }
                        orderCon += '<li data-id="'+item.Id+'"><label for="answer_a" class="'+multiple+' cursor '+isActive+'"><b>'+orderA[index]+'</b><span>'+item.OptionName+'</span></label></li>';
                    });
               }else{
                // 填空
                var orderCon = '';
                var textarea_val = '';
                // 判断是否已有值
                if(zoomArr[data.order-1] && zoomArr[data.order-1].split('=')[1]){
                   textarea_val = zoomArr[data.order-1].split('=')[1];
                }
                orderCon += '<textarea data-id="'+data.Id+'" data-num="'+data.order+'" data-type="'+data.Type+'" class="test_textarea" οninput="OnInput(event)" onpropertychange="OnPropChanged(event)" placeholder="禁止输特殊符号, ，= |" p>'+textarea_val+'</textarea>';
               }
                classNum = "tpquestionsList"+data.order;
                orderCon = '<ul class="container example_answer">'+orderCon+'</ul>';
                var zoomCom = '<li class="tpquestionsList '+classNum+'" data-id="'+data.Id+'" data-num="'+data.order+'" data-type="'+data.Type+'">'+title+orderCon+'</li>';
                switch(questionType){
                    case 1:
                        $('.tpquestions').html(zoomCom);
                        selectAnswer();
                        break;
                    case 2:
                      $('.tpquestions').append(zoomCom);
                      break;
                    default:
                      break;
                }              
            }else{
                $('.tpquestions').html('');
            }
        }
        //15s保存答案
        var saveAnswers = function(){ 
           setInterval(function(){
               saveAnswersFun();
           },15000);
        }
        function saveAnswersFun(){
            var saveAnswersListData = '';
            var saveAnswersListQuestions = question.lst_vtpquestions;
            $.each(saveAnswersListQuestions, function(index, item) {
                if(zoomArr[index]){
                    saveAnswersListData += zoomArr[index] +',';
                }else{
                    saveAnswersListData += item.Id +'=,';
                }
            })
            saveAnswersListData = saveAnswersListData.slice(0,-1);
            console.log(saveAnswersListData);
            var saveAnswersList = {"userId":$.cookie('userId'),"UserTPLibId":UserTPLibId,"saveAnswersListData":saveAnswersListData};
            storage.setItem("saveAnswers"+$.cookie('userId')+UserTPLibId,JSON.stringify(saveAnswersList));
        }
         //初始单，多，判点击事件
        var orderClick = function(){
            var ele = $('.start_test_order li');
            ele && ele.length > 0 && $.each(ele, function(index, item) {
                var _t = this;
                $(_t).on('click', function() {
                    $(_t).addClass('active').siblings().removeClass('active');
                    var type = $(_t).attr('data-type');
                    next_prv_index = 0;
                    switch (Number(type)){
                        case 0:
                            if(nowCons != orders){
                                nowCons = orders;
                            }
                            break;
                        case 1:
                            if(nowCons != radios){
                                nowCons = radios;
                            }
                            break;
                        case 2:
                            if(nowCons != checks){
                                nowCons = checks;
                            }
                            break;
                        case 3:
                            if(nowCons != judges){
                                nowCons = judges;
                            }
                            break;
                        case 4:
                            if(nowCons != fillblanks){
                                nowCons = fillblanks;
                            }
                            break;
                        default :
                            break;
                    }
                    switch(questionType){
                        case 1:
                            initquestions(nowCons[0]);
                            if(nowCons.length > 1){
                               $(".example_show_x").html('第一题');
                               $(".example_show_s").html('下一题');
                            }else if (nowCons.length == 1){
                               $(".example_show_x").html('第一题');
                               $(".example_show_s").html('最后一题');
                            }else{

                            }
                            break;
                        case 2:
                          allQuestionsShow();
                          break;
                        default:
                          break;
                    }
                   
                });
            });
        }
        //下一题
        var next = function(){
            $(".example_show_s").click(function(){
                next_prv_index++;
                $(".example_show_x").html('上一题');

                if(next_prv_index < nowCons.length - 1){

                    initquestions(nowCons[next_prv_index]);
                    $(".example_show_s").html('下一题');

                }else if(next_prv_index == nowCons.length - 1){

                     initquestions(nowCons[next_prv_index]);
                    $(".example_show_s").html('最后一题');

                }else{
                    next_prv_index = nowCons.length-1;
                }

            })
        }
        //上一题
        var prv = function(){
            $(".example_show_x").click(function(){
                next_prv_index--;
                $(".example_show_s").html('下一题');

                if(next_prv_index > 0){

                    initquestions(nowCons[next_prv_index]);
                    $(".example_show_x").html('上一题');

                }else if(next_prv_index == 0){

                   initquestions(nowCons[next_prv_index]);
                   $(".example_show_x").html('第一题');

                }else{
                    next_prv_index = 0;
                }
            })
        }
        //答题卡个数
        var questionCards = function(data){
            var html = '';
            for(var i=1;i <= data.length;i++){
                var class_ac = '';
                if(zoomArr[i - 1] && zoomArr[i - 1].split('=')[1]){
                    class_ac = 'active';
                }
               html += '<li class="cursor '+class_ac+'">'+i+'</li>';
            }
            $(".questionCardsNum").html(html);
            $(".questionCardsT span").html('[<b class="nowCareNum">1</b>/'+data.length+']');
            $(".mobilenumber").html('<b class="nowCareNum">1</b>/'+data.length);
            questionCardsClick();
        }
        //答题卡点击事件
        var questionCardsClick = function(){
            var ele2 = $('.questionCardsNum li');
            ele2 && ele2.length > 0 && $.each(ele2, function(index, item) {
                var _t = this;
                $(_t).on('click', function () {
                    var this_index = $(_t).index();
                    switch(questionType){
                        case 1:
                            next_prv_index = this_index;
                            nowCons = orders;
                            if(this_index == 0){
                                $(".example_show_x").html('第一题');
                                $(".example_show_s").html('下一题');

                            }else if(this_index == nowCons.length - 1){
                                $(".example_show_x").html('上一题');
                                $(".example_show_s").html('最后一题');
                            }else{
                                $(".example_show_x").html('上一题');
                                $(".example_show_s").html('下一题');
                            }
                            $(".start_test_order li.active").removeClass('active');
                            $(".start_test_order li:eq(0)").addClass('active');

                            $(".nowCareNum").html(this_index + 1);
                            initquestions(nowCons[this_index]);
                            break;
                        case 2:
                          var obj = $($(".tpquestionsList")[this_index]).offset();
                          funScrooll(obj.top);
                          break;
                        default:
                          break;
                    }
                    
                })
            })
        }
        //倒计时
        var countdown = function(time){
            /*换成秒*/
            ss = Number(time)*60;
            if(ss > 60) {
                mm = Math.floor(ss/60);
                ss = Math.floor(ss % 60);
            }
            if(mm > 60) {
                hh = Math.floor(mm/60);
                mm = Math.floor(mm%60);
            }
            $(".countdownTime").html(format(hh) + ":" + format(mm) + ":" + format(ss));
            idt = setInterval(ls, 1000);
        }
        var format = function(str){
            if(parseInt(str) < 10){
                return "0" + str;
            }
            return str;
        };
        var ls = function () {
            ss--;
            if(ss < 0){
                mm--;
                ss = 59;
            }
            if(mm < 0 && hh > 0){
                hh--;
                mm = 59;
            }
            //console.log(format(hh) + ":" + format(mm) + ":" + format(ss));
            $(".countdownTime").html(format(hh) + ":" + format(mm) + ":" + format(ss));
            if (hh == 0 && mm == 0 && ss == 0) {
                clearInterval(idt);
                $(".countdownTime").html('交卷时间到');
                $(".loadanswerBox p").html('考试时间到，自动交卷！');
                $(".loadanswer_n").hide();
                processAnswer();
                assignment();
            }
        }
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
             //console.log(str);
             return str;
        }  
        //选择答案
        var selectAnswer = function(){

            var ele = $('.tpquestions label');
            ele && ele.length > 0 && $.each(ele, function(index, item) {
                var _t = this;
                $(_t).on('click', function () {
                    var index2 = $(_t).parent().parent().parent().attr('data-num');
                    var type = $(_t).parent().parent().parent().attr('data-type');
                    var Ids = $(_t).parent().parent().parent().attr('data-id');
                    if($(_t).hasClass('checked')){
                        $(_t).removeClass('checked');
                    }else{
                        if(type == 1 || type == 3){
                            $(_t).parent().parent().parent().find('label').removeClass('checked');
                        }
                        $(_t).addClass('checked');
                    }
                    $($(".questionCardsNum li")[index2-1]).addClass('active');
                    $(".nowCareNum").html(index2);
                    if(!$(_t).parent().parent().parent().find("label.checked").length){
                        $($(".questionCardsNum li")[index2-1]).removeClass('active');
                    }
                   /*记录答案*/
                    writeAnswer((index2-1),Ids);
                })
            })
        }  
        //确认交卷点击事件
        var assignmentClick = function(){
            $(".loadanswer_y").click(function(){
                assignment();
            })
        }
        //记答案
        var writeAnswer = function(i,Id1){
            var ids = Id1+'=';
            var cheaked = '';
             // switch(questionType){
             //        case 1:
             //           cheaked = $($('.tpquestions .tpquestionsList')[0]).find('label.checked');
             //            break;
             //        case 2:
             //           cheaked = $('.tpquestions .tpquestionsList'+[i+1]).find('label.checked');
             //          break;
             //        default:
             //          break;
             //    }        
            cheaked = $('.tpquestions .tpquestionsList'+[i+1]).find('label.checked');
            cheaked.length > 0 && $.each(cheaked, function(index, item) {
                var parentId = $(item).parent().attr('data-id');
                ids += parentId+'|';
            })
            if(cheaked.length > 0){
                 zoomArr[i] = ids.slice(0,-1);
             }else{
                zoomArr[i] = ids;
             }
            saveAnswersFun();//本地保存
        }
         //交卷
        var sendAnswerClick = function(){
            $("#questionSubmit").click(function(){
                 processAnswer();
                 if(noZuo){
                     $(".loadanswerBox p").html('还有'+noZuo+'道题未做，是否交卷？');
                 }else{
                     $(".loadanswerBox p").html('是否交卷？');
                 }
                 $(".loadanswerBox").show();
            })
            $(".mobileQuestionSubmit").click(function(){
                processAnswer();
                if(noZuo){
                    $(".loadanswerBox p").html('还有'+noZuo+'道题未做，是否交卷？');
                }else{
                    $(".loadanswerBox p").html('是否交卷？');
                }
                $(".loadanswerBox").show();
            })
            $(".example_out").click(function(){
                $(".closeTestBox").show();
            })
            $(".closeTestDel").click(function(){
                $(".closeTestBox").hide();
            })
            $(".closeTest_n").click(function(){
                $(".closeTestBox").hide();
            })
            $(".closeTest_y").click(function(){
                //var urlId = $(".nav_study").attr('id_num');
                var urlId = '6f8fded1-7613-4a0c-945f-ad16df733443';
                window.location.href = '/compoents/study/study.html?id='+urlId+'&title=在线学习';
            })
            
            $(".loadanswerDel").click(function(){
                $(".loadanswerBox").hide();
            })
            $(".loadanswer_n").click(function(){
                $(".loadanswerBox").hide();
            })
        }
        //处理答案
        var processAnswer = function(){
            setData = '';
            noZuo = 0;
             var datas = question.lst_vtpquestions;
            $.each(datas, function(index, item) {
                if(zoomArr[index] && zoomArr[index].split('=')[1]){
                    setData += zoomArr[index] +',';
                }else{
                    setData += item.Id +'=,';
                    noZuo++;
                }
            })
            setData = setData.slice(0,-1);
        }
        //确认交卷
        var assignment = function(){
            $(".loadanswerBox").hide();
            $(".submit_answers").css('display','block');
            var url = "assignment";
            var param = {
                TestType:Number(testType),
                UserAnswerCollection:setData,
                UserTPAchievementId:question.vtestpaperlib.Id
            };
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: exam_Url + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    //console.log(data);
                    $(".submit_answers").css('display','none');
                    if (data.status_code == 200) {
                       storage.removeItem("saveAnswers"+$.cookie('userId')+UserTPLibId); //清除保存的答案
                        var urlId = $(".nav_study").attr('id_num');
                         $(".examTakingShadeCon1 span").html(data.data.SumScore);
                         var time = countTime(data.data.TestTime);
                         $(".examTakingShadeCon2").html(time); 
                         var href = '/compoents/study/testLook.html?UserTPLibId=' + data.data.Id;
                        $(".examTakingShadeHeft").attr('href',href);
                        $(".examTakingShade").css('display','block');
                        $(".examTaking").addClass('activeH');
                        $(".start_test").hide();
                    }else{
                        alert("交卷失败，请重新交卷。");
                    }
                }
            })
        }
         //全部试题按钮
        var allQuestionsBtn = function(){
            $(".allBtn").click(function(){
                $(".partBtn").removeClass('active');
                $(this).addClass('active');
                $(".example_show_x").hide();
                $(".example_show_s").hide();
                $(".Stick").show();
                questionType = 2;
                allQuestionsShow();
             })
        }
        //部分试题按钮
        var partQuestionsBtn = function(){
            $(".partBtn").click(function(){
                $(".allBtn").removeClass('active');
                $(this).addClass('active');
                $(".example_show_x").show();
                $(".example_show_s").show();
                $(".Stick").hide();
                questionType = 1;
               initquestions(nowCons[0]);
             })
        }
        //置顶
        var stickBtn = function(){
            $(".Stick").click(function(){
                funScrooll(0);
             })
        }
        //滚动
        var funScrooll = function(x){
            $('html, body').animate({
                    scrollTop: x
                }, 500);
        }
        //导入返回
       // $(".loadShade b").click(function(){
       //      var urlId = $(".nav_study").attr('id_num');
       //      window.location.href = '/compoents/study/study.html?id='+urlId+'&title=在线学习';
       //  })
       var funWindowScroll = function(){
        var maxScrollTop = $(".header").height();
        $(window).scroll( maxScrollTop, function(event){
            var $me = $(this);
            var fixed1 = $(".scrollFixed");
            var fixed2 = $(".scrollFixed2");
            if( $me.scrollTop() > event.data ){
                fixed1.addClass('fixed0');
                fixed2.addClass('fixed2');
            }else{
                fixed1.removeClass('fixed0');
                fixed2.removeClass('fixed2');
            }
        } );
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
        //初始数据
    	init();
 
        //填空监听输入
        $(document).on('input propertychange', '.test_textarea', function() {
            var textareaVal = $(this).val();
            var index = $(this).attr('data-num') - 1;
            var ids = $(this).attr('data-id');
            // 把值付给答案
            zoomArr[index] = ids + '=' + textareaVal;
            console.log(zoomArr);
            // 若有值答题卡选中，若无值，答题卡去掉active
            if(textareaVal){
              $($(".questionCardsNum li")[index]).addClass('active');
            }else{
              $($(".questionCardsNum li")[index]).removeClass('active');
            }
            saveAnswersFun();//本地保存
        });
    })
})(window, jQuery);
