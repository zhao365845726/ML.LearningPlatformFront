var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var favoriteUrl = favoritecourseUrl(),
            ajax_url = ajaxUrl();
        var param = {
            UserId:'',
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
           if($.cookie("userId")){
               if($(".nimingLabel").hasClass('active')){//匿名
                   param.UserId = '';
               }else{
                   param.UserId = $.cookie("userId");
               }
           }else{
               param.UserId = '';
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
