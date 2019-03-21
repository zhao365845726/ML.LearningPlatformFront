var IsPC = function() {//是否是pc端
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
var Isdate = function(){//计算日期,农历
    var mydate = new Date();
    var date_year = "" + mydate.getFullYear() + "年";
    date_year += (mydate.getMonth()+1) + "月";
    date_year += mydate.getDate() + "日 ";

    var date_time = mydate.getHours() + ":";
    if(Number(mydate.getMinutes())<10){
        date_time += "0"+mydate.getMinutes();
    }else{
        date_time += mydate.getMinutes();
    }
    $(".date_year").html(date_year);
    $(".date_time").html(date_time);
    $(".date_riqi").html(calendar());
    setInterval(function(){
        var mydate2 = new Date();
        var date_time2 = mydate2.getHours() + ":";
        if(Number(mydate2.getMinutes())<10){
            date_time2 += "0"+mydate2.getMinutes();
        }else{
            date_time2 += mydate2.getMinutes();
        }
        $(".date_time").html(date_time2);
    },6000)
}
var seachFun = function() {//搜索事件
    var inputVal;
    var params={
        "PageIndex": 1,
        "PageSize": 10
    };
    inputVal = $.trim($('#searchInput').val());
    $('#searchInput').on('input propertychange', function() {
        inputVal = $.trim($(this).val());
    });
    params.Title = inputVal;
    $('.searchBtn').on("click", function() {
        if(inputVal){
            inputVal ? location.href = '/compoents/common/search.html?title=' + inputVal + '' : '';
        }

    });
    //回车事件
    $("#searchInput").keydown(function (event) {
        if(inputVal){
            if (event.which == '13' || event.keyCode == '13') {
                inputVal ? location.href = '/compoents/common/search.html?title=' + inputVal + '' : '';
                window.event.returnValue=false;
            }
        }
    });
};
var seachMobileFun = function() {
    var inputVal;
    var params={
        "PageIndex": 1,
        "PageSize": 10
    };
    inputVal = $.trim($('#mobileSearch').val());
    $('#mobileSearch').on('input propertychange', function() {
        inputVal = $.trim($(this).val());
    });
    params.Title = inputVal;
    $('.mobileNavSearchBtn').on("click", function() {
        if(inputVal){
            inputVal ? location.href = '/compoents/common/search.html?title=' + inputVal + '' : '';
        }

    });
    //回车事件
    $("#mobileSearch").keydown(function (event) {
        if(inputVal){
            if (event.which == '13' || event.keyCode == '13') {
                inputVal ? location.href = '/compoents/common/search.html?title=' + inputVal + '' : '';
                window.event.returnValue=false;
            }
        }
    });
};
var Friendlink= function(){//获取友情链接
    var param = {
        "PageIndex": 1,
        "PageSize": 10
    };
    var ajax_url = ajaxUrl(); //统一的ajax请求地址
    var url = "getfriendlinklist";
    var html = '';
    $.ajax({
        type: "POST",
        data: param,
        dataType: 'json',
        url: ajax_url + url,
        crossDomain: true == !(document.all),
        success: function(data, type) {
            if (data.data) {
                $.each(data.data, function(index, item) {
                    html += '<a href="'+item.Url+'" target="_blank">'+item.Name+'</a>';
                });
                html = '友情链接： ' + html;
                $(".freadHref").html(html);
            }
        }
    })
}
/*移动端-登录*/
var favorite_Url = favoritecourseUrl();
function mobilelogin(){
    var userName = $.trim($(".mobileuserName").val());
    var userPas = $.trim($(".mobileuserPas").val());
    if(!userName){
        alert('请输入账号！');
        return false;
    }
    if(!userPas){
        alert('请输入密码！');
        return false;
    }
    mobilelogin1(userName,userPas);
}
function mobilelogin1(account,password){
    var param = {
        "Account":account,
        "Password":password
    }
    $.ajax({
        type: "POST",
        data: param,
        dataType: 'json',
        url: favorite_Url+'login',
        crossDomain: true == !(document.all),
        success: function(data, type) {
            //console.log(data);
            if(data.status_code == 200){
                $(".loginBox_mobile_out .login_Account span").html(data.data.Account);
                $(".loginBox_mobile_out .login_RealName span").html(data.data.RealName);
                $.cookie('userId', data.data.UserId,{path: '/'});
                $.cookie('myData', JSON.stringify(data.data),{path: '/'});
                //console.log($.cookie('userId'));
                $(".mobilelogin_err").css('visibility','hidden');
                $(".loginBox_mobile_in").hide();
                $(".loginBox_mobile_out").hide();
            }else{
                mobileidcardlogin(param.Account,param.Password);
            }
        }
    })
}
function mobileidcardlogin(IDCard,password){
    var param = {
        "IDCard":IDCard,
        "Password":password
    }
    $.ajax({
        type: "POST",
        data: param,
        dataType: 'json',
        url: favorite_Url+'idcardlogin',
        crossDomain: true == !(document.all),
        success: function(data, type) {
            //console.log(data);
            if(data.status_code == 200){
                $(".loginBox_mobile_out .login_Account span").html(data.data.Account);
                $(".loginBox_mobile_out .login_RealName span").html(data.data.RealName);
                $.cookie('userId', data.data.UserId,{path: '/'});
                $.cookie('myData', JSON.stringify(data.data),{path: '/'});
                //console.log($.cookie('userId'));
                $(".mobilelogin_err").css('visibility','hidden');
                $(".loginBox_mobile_in").hide();
                $(".loginBox_mobile_out").hide();
            }else{
                $(".mobilelogin_err").css('visibility','visible');
                $(".loginBox_mobile_out").hide();
                $(".loginBox_mobile_in").show();
            }
        }
    })
}
function moblieloginOut(){
    if(!$.cookie('userId')){
        return false;
    }
    $.ajax({
        type: "POST",
        data: {"userId":$.cookie('userId')},
        dataType: 'json',
        url: favorite_Url+'signout',
        crossDomain: true == !(document.all),
        success: function(data, type) {
            if(data.status_code == 200){
                $.cookie('userId', null,{path: '/'});
                $.cookie('myData', null,{path: '/'});
                window.location.href = '/compoents/study/studyLogin.html';
            }
        }
    })
}
function close(){
    $(".loginBox_mobile_in").hide();
    $(".loginBox_mobile_out").hide();
}
$(function(){
    /*pc端--日历*/
    if(IsPC()){
        Isdate();
    }
    /*指纹登录*/
    $(".FingerPrintBtn").click(function(){
        var falg = $.cookie('userId');
        if(falg){
            $.ajax({
                type: "POST",
                data: {userId:falg},
                dataType: 'json',
                url: isLoginUrl(),
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    if(data.status_code == 200){
                        $(".login_Account span").html(data.data.Account);
                        $(".login_RealName span").html(data.data.RealName);
                        $(".FingerPrint").hide();
                        $(".login_in").hide();
                        $(".login_out").show();
                    }else{
                        $(".login_in").hide();
                        $(".login_out").hide();
                        $(".FingerPrint").show();
                    }
                }
            })
        }else{
            $(".login_in").hide();
            $(".login_out").hide();
            $(".FingerPrint").show();
        }
    })
    /*账号登录*/
    $(".loginBtn").click(function(){
        var falg = $.cookie('userId');
        if(falg){
            $.ajax({
                type: "POST",
                data: {userId:falg},
                dataType: 'json',
                url: isLoginUrl(),
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    if(data.status_code == 200){
                        $(".login_Account span").html(data.data.Account);
                        $(".login_RealName span").html(data.data.RealName);
                        $(".FingerPrint").hide();
                        $(".login_in").hide();
                        $(".login_out").show();
                    }else{
                        $(".login_out").hide();
                        $(".FingerPrint").hide();
                        $(".login_in").show();
                    }
                }
            })
        }else{
            $(".login_out").hide();
            $(".FingerPrint").hide();
            $(".login_in").show();
        }
    })
    /*移动端--公共事件*/
       //导航
    $(".mobileNavL").click(function(){
        $(".mobileNavLists").toggle();
    })
       //登录显示
    $(".mobileNavR").click(function(){
        var falg = $.cookie('userId');
        if(falg){
            $.ajax({
                type: "POST",
                data: {userId:falg},
                dataType: 'json',
                url: isLoginUrl(),
                crossDomain: true == !(document.all),
                success: function(data, type) {
                    if(data.status_code == 200){
                        $(".loginBox_mobile_out .login_Account span").html(data.data.Account);
                        $(".loginBox_mobile_out .login_RealName span").html(data.data.RealName);
                        $(".loginBox_mobile_out").show();
                        $(".loginBox_mobile_in").hide();
                    }else{
                        $(".loginBox_mobile_in").show();
                        $(".loginBox_mobile_out").hide();
                    }
                }
            })
            $(".loginBox_mobile_out").show();
            $(".loginBox_mobile_in").hide();
        }else{
            $(".loginBox_mobile_in").show();
            $(".loginBox_mobile_out").hide();
        }
    })
      //登录隐藏
    $(".loginBox_mobile .login_del").click(function(){
        close();
    })
      //登录
    $("#submit_mobile").click(function(){
        mobilelogin();
    })
      //登出
    $("#mobilesubmit_out").click(function(){
        moblieloginOut();
    })
      //一级导航
    $(".mobileMore").click(function(){
        $(".sideBar_l").toggle();
    })
      //返回上一页
    $(".mobileBack").click(function(){
        window.history.back();
    })
})