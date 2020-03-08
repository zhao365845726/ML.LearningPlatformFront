var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var favorite_Url = favoritecourseUrl(),//的ajax请求地址
            ajax_url = ajaxUrl();
        //导航渲染
        var navDom = function(data) {
            var html='',url = '',isActive,className = '',num = '';
            $.each(data, function(index, item) {
                //设定href值
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
                html +='<li class="'+isActive+' '+className+'" id_num="'+num+'"><a href="'+url+'">' + item.Name + '</a></li>';
            });
            $('.nav').html(html);
            $(".mobileNavLists").html(html);
        }
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
                            personalreset();
                            $('.rsetPersonaly').click(function(){
                                subimtBtn();
                            })
                        }else{
                            window.location.href = '/index.html';
                        }
                    }
                })
            }else{
                window.location.href = '/index.html';
            }
        }
        //获取个人数据
        var personalreset = function(){
            var mydata = eval('(' + $.cookie('myData') + ')');
            //console.log(mydata);
            $(".CompanyName").val(mydata.CompanyName);
            $(".DeptName").val(mydata.DeptName);
            $(".Account").val(mydata.Account);
            $(".RealName").val(mydata.RealName);
            $(".Gender").val(mydata.Gender);
            $(".IDCard").val(mydata.IDCard);
            $(".Mobile").val(mydata.Mobile);
            $("#UserId").val($.cookie('userId'));
            var src1 = '';
            if(mydata.Photograph){
                src1 = mydata.Photograph;
            }
            $("#imghead").attr('src',src1);
            $("#personalImgUrl").val(src1);
        }
        //完善个人信息
        var subimtBtn = function () {
            var url = 'perfectinfo';
            var form = $("form[name=fileForm]");
            var options = {
                url:favorite_Url+url, /*上传文件的路径*/
                type:'post',
                success:function(data){
                    //console.log(data);
                    if(data.status_code == 200){ /*异步上传成功之后的操作*/
                        window.location.href = '/compoents/study/personalinfo.html';
                    }
                }
            };
            form.ajaxSubmit(options);
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
