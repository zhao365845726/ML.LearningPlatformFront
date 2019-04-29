var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var ajax_url = ajaxUrl(),//统一的ajax请求地址
            currPages = 1;
        var param = {
            Keywords:'',
            PageIndex:1,
            PageSize:10
        };
        //疑问疑答
        var interanswers = function(){
            var url = "getinterrogativeanswerlist";
            var html = '';
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: ajax_url + url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    //console.log(data);
                    if (data.data) {
                        $.each(data.data.lst_interrogativeanswerlist, function(index, item) {
                            /*拼接dom*/
                            var url2 = '/compoents/interanswers/interanswers_show.html?id='+item.Id;
                            html +='<li class="fileList"><a href="'+url2+'">'+item.QuestionTitle+'</a><b>'+item.QuestionTime+'</b></li>';
                        });
                        $('.fileLists').html(html);
                    }
                    page(Math.ceil(data.data.interrogativeanswercount/10));
                }
            })
        }
        //全部问题按钮
        var interanswersAll = function(){
            var url = 'getinterrogativeanswerlist';
            currPages = 1;
            $(".interanswersAll").click(function(){
                param.Keywords = '';
                var html = '';
                $("#sreachAnswerInput").val('');
                $.ajax({
                    type: "POST",
                    data: param,
                    dataType: 'json',
                    url: ajax_url + url,
                    crossDomain: true == !(document.all),
                    success: function(data, type) {
                        if (data.data) {
                            $.each(data.data.lst_interrogativeanswerlist, function(index, item) {
                                /*拼接dom*/
                                var url2 = '/compoents/interanswers/interanswers_show.html?id='+item.Id;
                                html +='<li class="fileList"><a href="'+url2+'">'+item.QuestionTitle+'</a><b>'+item.QuestionTime+'</b></li>';
                            });
                            $('.fileLists').html(html);
                        }
                        /*页码*/
                        $("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.interrogativeanswercount/10));
                    }
                })
            })
        }
        //搜索关键词事件
        var seachAnswersFun = function() {
            var inputVal;
            var url = 'getinterrogativeanswerlist';
            var html = '';
            inputVal = $.trim($('#sreachAnswerInput').val());
            $('#sreachAnswerInput').on('input propertychange', function() {
                inputVal = $.trim($(this).val());
            });
            $('.sreachAnswerBtn').on("click", function() {
                if(inputVal){
                    html = '';
                    currPages = 1;
                    param.Keywords = inputVal;
                    //console.log(param);
                    $.ajax({
                        type: "POST",
                        data: param,
                        dataType: 'json',
                        url: ajax_url + url,
                        crossDomain: true == !(document.all),
                        success: function(data, type) {
                            //console.log(data);
                            if (data.data) {
                                $.each(data.data.lst_interrogativeanswerlist, function(index, item) {
                                    /*拼接dom*/
                                    var url2 = '/compoents/interanswers/interanswers_show.html?id='+item.Id;
                                    html +='<li class="fileList"><a href="'+url2+'">'+item.QuestionTitle+'</a><b>'+item.QuestionTime+'</b></li>';
                                });
                                $('.fileLists').html(html);
                            }
                            /*页码*/
                            $("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.interrogativeanswercount/10));
                        }
                    })
                }
            });
            /*回车事件*/
            $("#sreachAnswerInput").keydown(function (event) {
                if(inputVal){
                    if (event.which == '13' || event.keyCode == '13') {
                        html = '';
                        currPages = 1;
                        param.Keywords = inputVal;
                        //console.log(param);
                        $.ajax({
                            type: "POST",
                            data: param,
                            dataType: 'json',
                            url: ajax_url + url,
                            crossDomain: true == !(document.all),
                            success: function(data, type) {
                                //console.log(data);
                                if (data.data) {
                                    $.each(data.data.lst_interrogativeanswerlist, function(index, item) {
                                        /*拼接dom*/
                                        var url2 = '/compoents/interanswers/interanswers_show.html?id='+item.Id;
                                        html +='<li class="fileList"><a href="'+url2+'">'+item.QuestionTitle+'</a><b>'+item.QuestionTime+'</b></li>';
                                    });
                                    $('.fileLists').html(html);
                                }
                                /*页码*/
                                $("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.interrogativeanswercount/10));
                            }
                        })
                    }
                }
            });
        };
        //分页逻辑
        var page = function(i) {
            $('#pageBar').whjPaging({
                totalPage: i,
                showPageNum: 4,
                isShowFL: true,//首末页面
                isShowPageSizeOpt: false,
                isShowSkip: false,
                isShowRefresh: false,
                isShowTotalPage: false,
                isResetPage: true,
                callBack: function (currPage, pageSize) {
                    param.PageIndex=currPage;
                    interanswers();
                }
            });
        };
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
                    //拼接dom;
                    html += '<li class="' + isActive + ' ' + className + '" id_num="' + num + '"><a href="' + url + '">' + item.Name + '</a></li>';
                }
            });
            $('.nav').html(html);
            $(".mobileNavLists").html(html);
        }
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
            interanswers();
            seachAnswersFun();
            interanswersAll();
            seachFun();
            seachMobileFun();
            $('.footer').load('/compoents/common/footer.html');
            Friendlink();
        };
        init();
    })
})(window, jQuery);
