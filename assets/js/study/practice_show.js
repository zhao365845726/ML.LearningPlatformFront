var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var ajax_url = ajaxUrl(),//统一的ajax请求地址
            question = '',
            orders = [],//区分考试题，总题
            radios = [],//单选题
            checks = [],//多选题
            judges = [],//判断题
            nowCons = [],//当前的试题
            hh = 0,mm = 0,ss = 0,idt,next_prv_index = 0,zoomArr = [],setData = '',noZuo = 0;
           
        var locationUrl = window.location.search.substr(1).split('=');
        // console.log(window.location.search.substr(1).split('&')[0].split('=')[1]);
        // var UserTPLibId = locationUrl[0].split('=')[1];
        // var UserTitle = locationUrl[1].split('=')[1];
        // var testType = locationUrl[2].split('=')[1];
        var CategoryId = window.location.search.substr(1).split('&')[0].split('=')[1];
         // console.log(CategoryId);
        var PageSize = Number(window.location.search.substr(1).split('&')[1].split('=')[1]);
        // console.log(PageSize);
        var Type = Number(window.location.search.substr(1).split('&')[2].split('=')[1]);
        // console.log(Type);
        var storage = window.localStorage;
        // console.log($.cookie());
        var questionType = 1;//1代表部分试题，2代表全部试题
        var JudgeScore = 0;//判断
        var MultipleScore = 0;//多选
        var RadioScore = 0;//单选
        //storage.removeItem("saveAnswers"+$.cookie('userId')+UserTPLibId); //清除保存的答案

        //开始考试
        // var innerTest = function(id){
        //     var url = "startexam";
        //     var param = {
        //         UserTPLibId:id
        //     }
        //     $.ajax({
        //         type: "POST",
        //         data: param,
        //         dataType: 'json',
        //         url: ajax_url + url,
        //         crossDomain: true == !(document.all),
        //         success: function(data, type) {
        //             if (data.data) {
        //                 testCon();
        //             }
        //         }
        //     })
        // }

        //15s保存答案
        var saveAnswers = function(){ 
           setInterval(function(){
               saveAnswersFun();
           },15000);
        };
        function saveAnswersFun(){
            var saveAnswersListData = '';
            var saveAnswersListQuestions = question.lst_vtpquestions;
            //console.log(zoomArr);
            $.each(saveAnswersListQuestions, function(index, item) {
                if(zoomArr[index]){
                    saveAnswersListData += zoomArr[index] +',';
                }else{
                    saveAnswersListData += item.Id +'=,';
                }
            })
            saveAnswersListData = saveAnswersListData.slice(0,-1);
            var saveAnswersList = {"userId":$.cookie('userId'),"UserTPLibId":UserTPLibId,"saveAnswersListData":saveAnswersListData};
            storage.setItem("saveAnswers"+$.cookie('userId')+UserTPLibId,JSON.stringify(saveAnswersList));
            //var details = JSON.parse(storage.getItem("saveAnswers"+$.cookie('userId')+UserTPLibId));
            //console.log(details);
        }
        //开始时若有存储答案把答案付给zoomArr
        var initZoomArr = function(){
            var details = JSON.parse(storage.getItem("saveAnswers"+$.cookie('userId')+UserTPLibId));
            console.log(details);
            if(details){
                //console.log(details.saveAnswersListData);
                zoomArr = details.saveAnswersListData.split(",");
                
            }
            //console.log(zoomArr);
        }
        var testCon = function(){
            //initZoomArr();
            
            var url = "special";
            // var param = {
            //     UserTPLibId:UserTPLibId
            // }
            var param = {
                  "UserId": $.cookie("userId"),
                  "CategoryId": CategoryId,
                    "type":Type,
                  "PageIndex": 1,
                  "PageSize": PageSize
                };
             // console.log(param);
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: practiseUrl() + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    // console.log(data);
                    if (data.data.lst_vquestions.length > 0) {
                        $(".loadShade").css('display','none');
                        question = data.data;
                        // JudgeScore = question.vtestpaperlib.JudgeScore;//判断
                        // MultipleScore = question.vtestpaperlib.MultipleScore;//多选
                        // RadioScore = question.vtestpaperlib.RadioScore;//单选

                        //order(question);//顺序单选题，多选，判断
                        tpquestions(question.lst_vquestions);//题库
                        questionCards(question.lst_vquestions.length);//答题卡
                        $(".question_length").html('共'+question.lst_vquestions.length+'题');
                        //$(".question_time").html('（'+question.vtestpaperlib.ExamDuration+'分钟）');
                        var mydata = eval('(' + $.cookie('myData') + ')');
                        if(mydata.Photograph){
                            $(".personal_info_img").attr('src',mydata.Photograph);
                        }
                        $(".personal_name").html('考生：'+mydata.RealName);
                        $(".personal_num").html('账户：'+mydata.Account);
                        //countdown(question.vtestpaperlib.ExamDuration);
                        //保存答案
                        //saveAnswers();
                        //$("#questionSubmit").css('display','block');
                    }
                }
            })
        }
        //顺序单选题，多选，判断
        var order = function(data){
            var html = '<li class="cursor active" data-type="0">顺序</li><li class="cursor" data-type="1">单选题（'+data.SingleCount+')</li><li class="cursor" data-type="2">多选题（'+data.MultipleCount+')</li><li class="cursor" data-type="3">判断题（'+data.DecideCount+')</li>';
            $('.start_test_order').html(html);
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
                    default :
                        break;

                }
                orders.push(data[i]);
            }
            nowCons = orders;
            initquestions(nowCons[0]);
            next();
            prv();
            orderClick();
            sendAnswerClick();
            assignmentClick();

            allQuestionsBtn();//全部试题 
            partQuestionsBtn();//部分试题
            stickBtn();//置顶
        }
        //初始题库
        var initquestions = function(data){
            if(data){
                var selectCon = '';
                var multiple = '';
                var multipleSubmitShow = '';
                var label1Class = '';
               // var thisScore = 0;
                switch (data.Type){
                    case 1:
                        selectCon = '<i>单选</i>';
                     //   thisScore = RadioScore;
                        break;
                    case 2:
                        selectCon = '<i>多选</i>';
                        multiple = 'multiple';
                        multipleSubmitShow = '<div class="multipleSubmit">提交答案</div>';
                       // thisScore = MultipleScore;
                        break;
                    case 3:
                        selectCon = '<i>判断</i>';
                       // thisScore = JudgeScore;
                        break;
                    default :
                        break;
                }
                var title = '<div class="example">'+selectCon+'<span><strong>'+data.order+'.</strong>'+data.Title+'</span></div>';
                var orderA = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                var orderCon = '';
                var isActive = '';
                var showClass = 'displayNone';
                var showClass_y = 'displayNone';
                var answer = '';
                var answer_y = '';
                var yesAnswers = '';
                var yesAnswersStr = '';
                $.each(data.ListViewTPQuesionOptions, function(index, item){
                    if(item.IsAnswer === 1){
                        yesAnswers += orderA[index]+',';
                        // console.log(yesAnswers);
                        yesAnswersStr += item.Id+'|';
                    }
                     if(zoomArr[data.order-1]){
                        var labelId = zoomArr[data.order-1].split('=')[1].split('|');
                            for(var i=0;i<labelId.length;i++){
                                if(item.Id === labelId[i]){
                                    isActive = 'checked';
                                    break;
                                }else{
                                    isActive = '';
                                }
                            }
                        multipleSubmitShow = '' ;
                        label1Class = 'label1'; 
                        if(zoomArr[data.order-1].split('=')[1] === yesAnswersStr.slice(0,-1)){
                           showClass = 'displayNone'; 
                           showClass_y = '';
                        }else{
                           showClass = ''; 
                           showClass_y = 'displayNone';
                        }
                    }else{
                        isActive = '';
                    }

                    orderCon += '<li data-id="'+item.Id+'"><label for="answer_a" class="label '+label1Class+' '+multiple+' cursor '+isActive+'"><b>'+orderA[index]+'</b><span>'+item.OptionName+'</span></label></li>';
                });
                yesAnswers = yesAnswers.slice (0,-1);
                orderCon = '<ul class="container example_answer example_answer_practice"  data-answer="'+yesAnswersStr+'">'+orderCon+'</ul>';
                answer = '<div class="showAnswer '+showClass+'"> <p>错误！</p>正确答案: <b>'+yesAnswers+'</b> </div>';
                answer_y = '<div class="showAnswer_y '+showClass_y+'"><p>正确！</p></div>';
                var zoomCom = '<li class="tpquestionsList" data-id="'+data.Id+'" data-num="'+data.order+'" data-type="'+data.Type+'">'+title+orderCon+multipleSubmitShow+answer+answer_y+'</li>';
                $('.tpquestions').html(zoomCom);
                selectAnswer();   
                multipleBtn();                     
            }else{
                $('.tpquestions').html('');
            }
        }
        //下一题/上一题
        var next = function(){
            $(".example_show_s").click(function(){
                next_prv_index++;
                $(".example_show_x").html('上一题');

                if(next_prv_index < nowCons.length - 1){

                    initquestions(nowCons[next_prv_index]);
                    $(".example_show_s").html('下一题');

                }else if(next_prv_index === nowCons.length - 1){

                     initquestions(nowCons[next_prv_index]);
                    $(".example_show_s").html('最后一题');

                }else{
                    next_prv_index = nowCons.length-1;
                }

            })
        };
        var prv = function(){
            $(".example_show_x").click(function(){
                next_prv_index--;
                $(".example_show_s").html('下一题');

                if(next_prv_index > 0){

                    initquestions(nowCons[next_prv_index]);
                    $(".example_show_x").html('上一题');

                }else if(next_prv_index === 0){

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
            //console.log(zoomArr);
            for(var i=1;i <= data;i++){
                var class_ac = '';
                if(zoomArr[i - 1] && zoomArr[i - 1].split('=')[1]){
                    class_ac = 'active';
                }
               html += '<li class="cursor '+class_ac+'">'+i+'</li>';
            }
            $(".questionCardsNum").html(html);
            $(".questionCardsT span").html('[<b class="nowCareNum">1</b>/'+data+']');
            $(".mobilenumber").html('<b class="nowCareNum">1</b>/'+data);
            questionCardsClick();
        }
        //答题卡点击事件
        var questionCardsClick = function(){
            var ele2 = $('.questionCardsNum li');
            ele2 && ele2.length > 0 && $.each(ele2, function(index, item) {
                var _t = this;
                $(_t).on('click', function () {
                    var this_index = $(_t).index();
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
                })
            })
        }
        
        //选择答案
        // var selectAnswer = function(){
        //     var ele = $('.tpquestions label');
        //     ele && ele.length > 0 && $.each(ele, function(index, item) {
        //         var _t = this;
        //         $(_t).on('click', function () {
        //             var index2 = $(".tpquestionsList").attr('data-num');
        //             var type = $(".tpquestionsList").attr('data-type');
        //             var Ids = $(".tpquestionsList").attr('data-id');
        //             if($(_t).hasClass('checked')){
        //                 $(_t).removeClass('checked');
        //             }else{
        //                 if(type == 1 || type == 3){
        //                     ele.removeClass('checked');
        //                 }
        //                 $(_t).addClass('checked');
        //             }
        //             $($(".questionCardsNum li")[index2-1]).addClass('active');
        //             $(".nowCareNum").html(index2);
        //             if(!$(".tpquestions label.checked").length){
        //                 $($(".questionCardsNum li")[index2-1]).removeClass('active');
        //             }
        //            /*记录答案*/
        //             writeAnswer((index2-1),Ids);
        //         })
        //     })
        // }
        //选择答案
        // var selectAnswer = function(){
        //     var ele = $('.tpquestions .label');
        //     //console.log(ele.length);
        //     ele && ele.length > 0 && $.each(ele, function(index, item) {
        //         var _t = this;
        //         $(_t).on('click', function () {
        //             var index2 = $(_t).parent().parent().parent().attr('data-num');
        //             var type = $(_t).parent().parent().parent().attr('data-type');
        //             var Ids = $(_t).parent().parent().parent().attr('data-id');
        //             if($(_t).hasClass('checked')){
        //                 $(_t).removeClass('checked');
        //             }else{
        //                 if(type == 1 || type == 3){
        //                     $(_t).parent().parent().parent().find('label').removeClass('checked');
        //                 }
        //                 $(_t).addClass('checked');
        //             }
        //             $($(".questionCardsNum li")[index2-1]).addClass('active');
        //             $(".nowCareNum").html(index2);
        //             if(!$(_t).parent().parent().parent().find("label.checked").length){
        //                 $($(".questionCardsNum li")[index2-1]).removeClass('active');
        //             }
        //            /*记录答案*/
        //             writeAnswer((index2-1),Ids);
        //         })
        //     })
        // }
         //选择答案
        var selectAnswer = function(){
            var ele = $('.tpquestions .label');
            ele && ele.length > 0 && $.each(ele, function(index, item) {
                var _t = this;
                // console.log(_t);
                $(_t).on('click', function () {
                    if(!$(_t).hasClass('label1')){
                        var index2 = $(_t).parent().parent().parent().attr('data-num');
                        var type = $(_t).parent().parent().parent().attr('data-type');
                        var Ids = $(_t).parent().parent().parent().attr('data-id');

                        if(type == 1 || type == 3){
                          $(_t).addClass('checked');
                          $(_t).parent().parent().find('label').addClass('label1');
                          var thisId = $(_t).parent().attr('data-id')+'|';
                          var thisAnswerId = $(_t).parent().parent().attr('data-answer');
                          if(thisId != thisAnswerId){
                            $(".showAnswer").removeClass('displayNone');
                            $($(".questionCardsNum li")[index2-1]).addClass('erroractive');
                            doerrors(Ids);
                          }else{
                            $(".showAnswer_y").removeClass('displayNone');
                            $($(".questionCardsNum li")[index2-1]).addClass('active');
                            // if(type == 3){
                            //     deleteerrordata(Ids);
                            // }
                          }
                          $(".nowCareNum").html(index2);
                          /*记录答案*/
                          writeAnswer((index2-1),Ids,thisId);
                        }else{
                           if($(_t).hasClass('checked')){
                                $(_t).removeClass('checked');
                            }else{
                                $(_t).addClass('checked');
                            } 
                        }
                    }
                })
            })
        }
        //多选按钮
        var multipleBtn = function(){
             $('.multipleSubmit').on('click', function () {

                 var index2 = $($(".tpquestionsList")[0]).attr('data-num');
                  var Ids = $($(".tpquestionsList")[0]).attr('data-id');

                var checkeds = $(".example_answer label.checked").length;
                if(checkeds < 2){
                    alert('请至少选择两个答案');
                }else{
                   $(this).hide();
                   $(".example_answer label").addClass('label1'); 
                   var thisId = '';
                   for(var i = 0;i < checkeds;i++){
                      thisId += $($(".example_answer label.checked")[i]).parent().attr('data-id')+'|';
                   }
                   var thisAnswerId = $(".example_answer").attr('data-answer');
                  if(thisId != thisAnswerId){
                    $(".showAnswer").removeClass('displayNone');
                    $($(".questionCardsNum li")[index2-1]).addClass('erroractive');
                    doerrors(Ids);
                  }else{
                    $(".showAnswer_y").removeClass('displayNone');
                    $($(".questionCardsNum li")[index2-1]).addClass('active');
                    // if(type == 3){
                    //     deleteerrordata(Ids);
                    // }
                  }
                  $(".nowCareNum").html(index2);
                  /*记录答案*/
                  writeAnswer((index2-1),Ids,thisId);
                }
            })
        }
         //错题，提交
        var doerrors = function(Id1){
            $.ajax({
                type: 'POST',
                data: {UserId: $.cookie('userId'),QuestionId:Id1},
                url: practiseUrl() + 'doerror',
                dataType: 'json',
                crossDomain: true == !(document.all),
                success: function(data, type) {
                }
            })
        }

       
        //记答案
        // var writeAnswer = function(i,Id1){
        //     var ids = Id1+'=';
        //     var cheaked = '';
        //      switch(questionType){
        //             case 1:
        //                cheaked = $($('.tpquestions .tpquestionsList')[0]).find('label.checked');
        //                 break;
        //             case 2:
        //                cheaked = $($('.tpquestions .tpquestionsList')[i]).find('label.checked');
        //               break;
        //             default:
        //               break;
        //         }            
        //     //console.log(cheaked.length);
        //     cheaked.length > 0 && $.each(cheaked, function(index, item) {
        //         var parentId = $(item).parent().attr('data-id');
        //         ids += parentId+'|';
        //     })
        //     //console.log(ids);
        //     if(cheaked.length > 0){
        //          zoomArr[i] = ids.slice(0,-1);
        //      }else{
        //         zoomArr[i] = ids;
        //      }
        //     saveAnswersFun();//本地保存
        // }
         var writeAnswer = function(i,Id1,answers){
            zoomArr[i] = Id1+'='+answers.slice(0,-1);
        }

/*********************无用内容*********************************/
         //确认交卷点击事件
        var assignmentClick = function(){
            $(".loadanswer_y").click(function(){
                assignment();
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
         //交卷
        var sendAnswerClick = function(){
            $("#questionSubmit").click(function(){
                 processAnswer();
                 //console.log(noZuo);
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
                var urlId = $(".nav_study").attr('id_num');
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
            //console.log(datas);
            $.each(datas, function(index, item) {
               // console.log(zoomArr[index].split('=')[1]);
                if(zoomArr[index] && zoomArr[index].split('=')[1]){
                    setData += zoomArr[index] +',';
                }else{
                    setData += item.Id +'=,';
                    noZuo++;
                }
            })
            setData = setData.slice(0,-1)
            //console.log(setData);
            //console.log(noZuo);
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
            //console.log(param);
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: ajax_url + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    //console.log(data);
                    $(".submit_answers").css('display','none');
                    storage.removeItem("saveAnswers"+$.cookie('userId')+UserTPLibId); //清除保存的答案
                    //console.log(storage.getItem("saveAnswers"+$.cookie('userId')+UserTPLibId));
                    if (data.status_code == 200) {
                       // storage.removeItem("saveAnswers"+$.cookie('userId')+UserTPLibId); //清除保存的答案
                       // console.log(storage.getItem("saveAnswers"+$.cookie('userId')+UserTPLibId));
                        var urlId = $(".nav_study").attr('id_num');
                         //$(".loadanswerBox").hide();
                        // var timeM = parseInt(data.data.TestTime / 60);
                        // var timeS = data.data.TestTime % 60;
                         $(".examTakingShadeCon1 span").html(data.data.SumScore);
                         var time = countTime(data.data.TestTime);
                         // $(".examTakingShadeCon2").html('<span>'+timeM+'</span>分<span>'+timeS+'</span>秒'); 
                         $(".examTakingShadeCon2").html(time); 
                         var href = '/compoents/study/testLook.html?UserTPLibId=' + data.data.Id;
                        $(".examTakingShadeHeft").attr('href',href);
                        $(".examTakingShade").css('display','block');
                        //window.location.href = '/compoents/study/study.html?id='+urlId+'&title=查看成绩';
                    }else{
                        $(".loadShadeError").css('display','block');
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
                //$(".questionCardsBOX").css('height','auto');
                //$(".questionCardsNum").css('position','static');
                questionType = 2;
                allQuestionsShow();
             })
        }
        //全部试题展示
        var allQuestionsShow = function(){         
            $('.tpquestions').html('');
            for(var i =0;i< nowCons.length;i++){
               initquestions(nowCons[i]);
            }
            selectAnswer();
        }
        //部分试题按钮
        var partQuestionsBtn = function(){
            $(".partBtn").click(function(){
                $(".allBtn").removeClass('active');
                $(this).addClass('active');
                $(".example_show_x").show();
                $(".example_show_s").show();
                $(".Stick").hide();
                 //$(".questionCardsBOX").css('height','250px');
                 //$(".questionCardsNum").css('position','absolute');
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
             //console.log(str);
             return str;
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
            // if(Number(UserTitle)){
            //     //console.log('开始考试');
            //     storage.removeItem("saveAnswers"+$.cookie('userId')+UserTPLibId); //清除保存的答案
            //     innerTest(UserTPLibId);
            // }else{
            //     testCon();
            // }
            testCon();
            $('.footer').load('/compoents/common/footer.html');
            Friendlink();
        };
        init();
        
        //导入返回
       $(".loadShade b").click(function(){
            var urlId = $(".nav_study").attr('id_num');
            window.location.href = '/compoents/study/study.html?id='+urlId+'&title=在线学习';
        })
    })
})(window, jQuery);
