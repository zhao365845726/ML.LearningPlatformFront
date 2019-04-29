var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var favorite_Url = favoritecourseUrl(),
            course_Url = courseUrl(),
            ajax_url = ajaxUrl(),//统一的ajax请求地址
            dataTpl = '';
        var locationUrl = window.location.search.substr(1).split('=');
        var Id = locationUrl[1];
        var param = { //课件详情参数
            Id : Id,
            UserId : $.cookie("userId"),
            commentPage : {
                pageindex : 1,
                pagesize : 5
            }
        };
        var param_course = { //赞，收藏参数
            UserId:'',
            CourseId:'',
            Type:0,
            SureOrCancel:0
        };
        var param_comment = { //提交评论,笔记参数
            UserId:'',
            CourseId:'',
            Content:''
        };
        //是否登录
        var isogin = function(){
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
                            courseShow();
                        }else{
                            window.location.href = '/compoents/study/studyLogin.html';
                        }
                    }
                })
            }else{
                window.location.href = '/compoents/study/studyLogin.html';
            }
        }
        //课件详情
        var courseShow = function(){
            var url = 'getcoursedetail';
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: course_Url+url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    console.log(data);
                    if(data.data){
                        BreadCrumbs();
                        var dataTpl2 = data.data;
                        $("#courseId").val(dataTpl2.course.Id);
                        $(".courseVideoLeft h3").html(dataTpl2.course.Name);
                        $('#myNotice').val(dataTpl2.coursenote.Content);

                        if(dataTpl2.lst_coursecatalog.length > 0 && dataTpl2.lst_coursecatalog[0].DocUrl){
                          $("#videoPlayUrl").attr('src',dataTpl2.lst_coursecatalog[0].DocUrl);
                        }
                        /*是否赞，踩，收藏*/
                        if(dataTpl2.IsZan){
                            $(".bravo_btny").addClass('active');
                        }
                        if(dataTpl2.IsCai){
                            $(".bravo_btnn").addClass('active');
                        }
                        if(dataTpl2.IsFav){
                            $(".bravo_btns").addClass('active');
                        }
                        /*初始点赞事件*/
                        favoritecourse();
                        /*初始评论，笔记,提交点击事件*/
                        commentNoticesClick();
                    }
                }
            })
        }
        //面包屑
        var BreadCrumbs = function(){
            var mydata = eval('(' + $.cookie('myData') + ')');
            $(".person_Company").html(mydata.CompanyName);
            $(".person_Dept").html(mydata.DeptName);
            $(".person_Account").html(mydata.Account);
            $(".person_Name").html(mydata.RealName);
            $(".person_Gender").html(mydata.Gender);
            $(".person_IDCard").html(mydata.IDCard);
            $(".person_Mobile").html(mydata.Mobile);
        }
        //赞，收藏
        var favoritecourse = function(){
            var UserId = $.cookie("userId");
            var CourseId = $('#courseId').val();
            param_course.UserId = UserId;
            param_course.CourseId = CourseId;
            var ele = $('.bravo label');
            ele && ele.length > 0 && $.each(ele, function(index, item) {
                var _t = this;
                $(_t).on('click', function() {
                    var Type = $(_t).attr('num');
                    param_course.Type = Number(Type);
                    if($(_t).hasClass('active')){
                        param_course.SureOrCancel = 0;
                    }else{
                        param_course.SureOrCancel = 1;
                    }
                    var url = "favoritecourse";
                    $.ajax({
                        type: "POST",
                        data: param_course,
                        dataType: 'json',
                        url: favorite_Url + url,
                        crossDomain: true == !(document.all),
                        success: function(data, type) {
                            if (data.data) {
                                if($(_t).hasClass('active')){
                                    $(_t).removeClass('active');
                                }else{
                                    $(_t).addClass('active');
                                }
                            }
                        }
                    })
                });
            });
        }
        //评论，笔记,提交点击事件
        var commentNoticesClick = function(){
            var ele = $('.writeEvaluate li');
                ele && ele.length > 0 && $.each(ele, function(index, item) {
                    var _t = this;
                    $(_t).on('click', function() {
                        $(_t).addClass('active').siblings().removeClass('active');
                        var num = $(_t).attr('data-num');
                        switch (Number(num)) {
                            case 1:
                                $("#evaluateCon").val('');
                                break;
                            default :
                                var con = $('#myNotice').val();
                                $("#evaluateCon").val(con);
                                break;
                        }
                    })
                })
           $("#videoSubmit").on('click',function(){
               var num = $('.writeEvaluate li.active').attr('data-num');
               //console.log(num);
               switch (Number(num)) {
                   case 1:
                       comment();
                       break;
                   default :
                       notes();
                       break;
               }
           })
        }
        //提交评论
        var comment = function(){
            var commentCon = $("#evaluateCon").val();
            if(!commentCon){
                return false;
            }
            var UserId = $.cookie("userId");
            var CourseId = $('#courseId').val();
            param_comment.UserId = UserId;
            param_comment.CourseId = CourseId;
            param_comment.Content = commentCon;
            var url = "commentcourse";
            //console.log(param_comment);
            $.ajax({
                type: "POST",
                data: param_comment,
                dataType: 'json',
                url: favorite_Url + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    if (data.status_code == 200) {
                        commentPage();
                        $(".videoEvaluate").hide();
                        $(".commentmore").show();
                    }
                }
            })
        }
        var commentPage = function(){
            var url = 'getcoursedetail';
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: course_Url+url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    //console.log(data);
                    if(data.data){
                        /*初始评论*/
                        displayComment(data.data.coursedetailcommentResponse);
                    }
                }
            })
        }
        //展示评论
        var displayComment = function(data){
            var html='';
            $.each(data.lst_coursecomment, function(index, item) {
                var src = '';
                if(item.PhotoGraph){
                    src = item.PhotoGraph;
                }else{
                    src = '../../assets/images/comment.png';
                }
                html +='<li class="container commentlist"><div class="container commentlistT"><img src="'+src+'" alt="" class="commentImg"><span class="commentName">'+item.RealName+'</span><b class="commentTime">'+item.CommentTime+'</b></div><p class="commentCon">'+item.Content+'</p></li>';
            });
            $('.commentLists').html(html);
            /*页码*/
            page(Math.ceil(data.commentcount/5));
        }
        //笔记
        var notes = function(){
            var commentCon = $("#evaluateCon").val();
            if(!commentCon){
                return false;
            }
            var UserId = $.cookie("userId");
            var CourseId = $('#courseId').val();
            param_comment.UserId = UserId;
            param_comment.CourseId = CourseId;
            param_comment.Content = commentCon;
            var url = "docoursenote";
            $.ajax({
                type: "POST",
                data: param_comment,
                dataType: 'json',
                url: favorite_Url + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    if (data.status_code == 200) {
                        $("#myNotice").val(commentCon);
                        alert('笔记提交成功！');
                    }else{
                        alert('笔记提交失败，请重新提交！');
                    }
                }
            })
        }
        //分页逻辑
        var page = function(i) {
            $('#pageBar').whjPaging({
                totalPage: i,
                showPageNum: 3,
                isShowFL: false,//首末页面
                isShowPageSizeOpt: false,
                isShowSkip: false,
                isShowRefresh: false,
                isShowTotalPage: false,
                isResetPage: true,
                callBack: function (currPage, pageSize) {
                    param.commentPage.pageindex=currPage;
                    commentPage();
                }
            });
        };
        //导航渲染
        var navDom = function(data) {
            var html='',url = '',isActive = '',className = '',num = '';
            $.each(data, function(index, item) {
                if (Number(item.ShowMark)) {
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
            isogin();
            seachFun();
            seachMobileFun();
            $('.footer').load('/compoents/common/footer.html');
            Friendlink();
        };
        init();
    })
})(window, jQuery);
