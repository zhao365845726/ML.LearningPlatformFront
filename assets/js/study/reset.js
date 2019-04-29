var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var favorite_Url = favoritecourseUrl(),//ajax请求地址
            ajax_url = ajaxUrl();
        //是否登录
        var isLogin = function(){
            var falg = $.cookie("userId");
            if(falg){
                $.ajax({
                    type: "POST",
                    data: {userId:falg},
                    dataType: 'json',
                    url: isLoginUrl(),
                    crossDomain: true == !(document.all),
                    success: function(data, type) {
                        if(data.status_code == 200){
                            var mydata = eval('(' + $.cookie('myData') + ')');
                            $(".Account").html(mydata.Account);
                            $(".RealName").html(mydata.RealName);
                            reset();
                        }else{
                            window.location.href = '/compoents/study/studyLogin.html';
                        }
                    }
                })
            }else{
                window.location.href = '/compoents/study/studyLogin.html';
            }

        }
        //重置密码
        var reset = function(){
            $(".resetBtny").on('click',function(){
                var oldPass = $.trim($(".oldPass").val());
                var newPass = $.trim($(".newPass").val());
                var newPass2 =$.trim( $(".newPass2").val());
                $(".oldPassTag").hide();
                $(".newPassTag").hide();
                $(".newPass2Tag").hide();

                if(!oldPass){
                    $(".oldPassTag").html('当前密码不能为空！');
                    $(".oldPassTag").show();
                    return false;
                }
                if(!newPass){
                    $(".newPassTag").html('新密码不能为空！');
                    $(".newPassTag").show();
                    return false;
                }
                if(!newPass2){
                    $(".newPass2Tag").html('重复密码不能为空！');
                    $(".newPass2Tag").show();
                    return false;
                }
                if(newPass != newPass2){
                    $(".newPass2Tag").html('两次密码不一致！');
                    $(".newPass2Tag").show();
                    return false;
                }
                var url = "modifypassword";
                var param = {
                    UserId:$.cookie("userId"),
                    NewPassword:newPass2
                }
                $.ajax({
                    type: "POST",
                    data: param,
                    dataType: 'json',
                    url: favorite_Url + url,
                    crossDomain: true == !(document.all),
                    success: function(data, type) {
                        //console.log(data);
                        if (data.status_code == 200) {
                            $.cookie('userId', null,{path: '/'});
                            $.cookie('myData', null,{path: '/'});
                            window.location.href = '/compoents/study/studyLogin.html';
                        }
                    }
                })
            })
            $(".resetBtnn").on('click',function(){
                $(".oldPass").val('');
                $(".newPass").val('');
                $(".newPass2").val('');
                $(".oldPassTag").hide();
                $(".newPassTag").hide();
                $(".newPass2Tag").hide();
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
