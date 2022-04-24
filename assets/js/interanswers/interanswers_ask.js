var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var favoriteUrl = favoritecourseUrl(),
            ajax_url = ajaxUrl();
        var param = {
            Token:'',
            QuestionTitle:'',
            QuestionContent:''
        };
        //问题
        var interanswersAsk = function(){
            $("#submitAsk").on('click',function(){
                submitAsk();
            })
        }
       var submitAsk = function(){
           var url = "askaquestion";
           var askTitle = $.trim($("#interanswersAskTag").val());
           var askCon = $.trim($("#interanswersAskCon").val());
           if(!askTitle){
               alert('请写入标题！');
               return false;
           }
           if(!askCon){
               alert('请写入内容！');
               return false;
           }
           if($.cookie("token")){
               if($(".nimingLabel").hasClass('active')){//匿名
                   param.Token = '';
               }else{
                   param.Token = $.cookie("token");
               }
           }else{
               param.Token = '';
           }
           param.QuestionTitle = askTitle;
           param.QuestionContent = askCon;
           $.ajax({
               type: "POST",
               data: param,
               dataType: 'json',
               url: favoriteUrl + url,
               crossDomain: true == !(document.all),
               success: function(data, type) {
                   //console.log(data);
                   if (data.data) {
                       alert('提交成功！');
                       window.location.href = '/compoents/interanswers/interanswers.html';
                   }
               }
           })
       }
        //导航渲染
        var navDom = function(data) {
            var html='',url = '',isActive,className = '',num = '';
            $.each(data, function(index, item) {
                if (Number(item.ShowMark)){
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
            interanswersAsk();
            seachFun();
            seachMobileFun();
            $('.footer').load('/compoents/common/footer.html');
            Friendlink();
        };
        init();
    })
})(window, jQuery);
