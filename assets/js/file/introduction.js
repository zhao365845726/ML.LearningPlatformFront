var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        var ajax_url = ajaxUrl(),//统一的ajax请求地址
            navTitle = '',//左侧导航的值
            currPages = 1,//分页
            workIs = false;//用于判断大师工作室除去简介，其他导航是否点击过，默认false,需要初始page

        var title = decodeURI(window.location.search.split('=')[2]);//获取？后面的参数，并防止乱码
        var urlId = window.location.search.substr(1).split('&')[0].split('=')[1];


        var excellentcourse = function() {
            var course_Url = courseUrl();
            var url = "gethomedata";
            var html = '';
            var data_p = {
                "remmendnews": {
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "notices": {
                    "navid": "e7e1b186-1e3e-480b-b495-1d310ccef9da",
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "safetyinfo": {
                    "navid": "a9ca415e-41b2-4662-9129-d580753d123f",
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "filespirit": {
                    "navid": "09a92fda-6732-4f02-9665-34adc1a8729b",
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "excellentcourse": {
                    "PageIndex": 1,
                    "PageSize": 6
                },
                "activities": {
                    "navid": "",
                    "PageIndex": 1,
                    "PageSize": 6
                }
            };
            var typeHtml = '';
            $.ajax({
                type: "POST",
                data: data_p,
                dataType: 'json',
                url: ajax_url+url,
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    if (data.data) {
                        data.data.lst_excellentcourse && $.each(data.data.lst_excellentcourse, function(index, item) {
                            /*拼接dom*/
                            url = '/compoents/study/course_show.html?id='+item.Id;
                            if(item.StudyOption == 1){
                                typeHtml = '<i></i>';
                            }else{
                                typeHtml = '';
                            }
                            html += '<li><a href="'+url+'"><img src="'+item.CoverMap+'" alt=""><p><span>'+item.Name+'</span></p>'+typeHtml+'</a></li>';
                        });
                        $(".sideBarTitle").text('警示教育')
                        $('.excellentcourse').html(html);
                    }
                }
            })
        };

        //分页逻辑
        excellentcourse();

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
                    isActive = item.Name == title ? 'active' : '';
                    /*拼接dom*/
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
            seachFun();
            seachMobileFun();
            $('.footer').load('/compoents/common/footer.html');
            Friendlink();
        };
        init();

    })

})(window, jQuery);
