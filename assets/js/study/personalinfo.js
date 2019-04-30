var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var ajax_url = ajaxUrl();//ajax请求地址
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
                        //console.log(data);
                        if(data.status_code == 200){
                            $.cookie('userId', data.data.UserId,{path: '/'});
                            $.cookie('myData', JSON.stringify(data.data),{path: '/'});
                            personalinfo();
                        }else{
                            window.location.href = '/compoents/study/studyLogin.html';
                        }
                    }
                })
            }else{
                window.location.href = '/compoents/study/studyLogin.html';
            }
        }
        //获取个人数据
        var personalinfo = function(){
            var mydata = eval('(' + $.cookie('myData') + ')');
            //console.log(mydata);
            $(".CompanyName").html(mydata.CompanyName);
            $(".DeptName").html(mydata.DeptName);
            $(".Account").html(mydata.Account);
            $(".RealName").html(mydata.RealName);
            $(".Gender").html(mydata.Gender);
            $(".IDCard").html(mydata.IDCard);
            $(".Mobile").html(mydata.Mobile);
            var src1 = '';
            if(mydata.Photograph){
                src1 = mydata.Photograph;
            }
            $("#imghead").attr('src',src1);
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
