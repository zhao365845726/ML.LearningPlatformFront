/**
 * PC端
 */
var favorite_Url = favoritecourseUrl();
function login(){
    var userName = $.trim($(".userName").val());
    var userPas = $.trim($(".userPas").val());
    var title = decodeURI(window.location.search.split('=')[1]);
    if(!userName){
        alert('请输入账号！');
        return false;
    }
    if(!userPas){
        alert('请输入密码！');
        return false;
    }
    login1(userName,userPas,title);

}
function login1(account,password){
    var param = {
        "Account":account,
        "Password":password
    };
    console.log(param);
    $.ajax({
        type: "POST",
        data: param,
        dataType: 'json',
        url: favorite_Url+'login',
        crossDomain: true == !(document.all),
        success: function(data, type) {
            debugger
            console.log(data);
            if(data.status_code == 200){
                $(".login_Account span").html(data.data.Account);
                $(".login_RealName span").html(data.data.RealName);
                $.cookie('userId', data.data.UserId,{path: '/'});
                $.cookie('myData', JSON.stringify(data.data),{path: '/'});
                //var urlid = $(".nav_study").attr('id_num');
               //  console.log(titles);
               // if(titles != '在线学习'){
                  //window.location.href = '/compoents/study/study.html?id='+urlid+'&title='+titles;
               // }else{
                   window.location.href = '/compoents/study/study.html?id=6f8fded1-7613-4a0c-945f-ad16df733443&title=在线学习';
                //}
            }else{
                idcardlogin(param.Account,param.Password);
            }
        }
    })
}
function idcardlogin(IDCard,password){
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
                $(".login_Account span").html(data.data.Account);
                $(".login_RealName span").html(data.data.RealName);
                $.cookie('userId', data.data.UserId,{path: '/'});
                $.cookie('myData', JSON.stringify(data.data),{path: '/'});
                //var urlid = $(".nav_study").attr('id_num');
                 //if(titles != '在线学习'){
                 // window.location.href = '/compoents/study/study.html?id='+urlid+'&title='+titles;
                //}else{
                   window.location.href = '/compoents/study/study.html?id=6f8fded1-7613-4a0c-945f-ad16df733443&title=在线学习';
                //}

            }else{
                $(".login_err").css('visibility','visible');
            }
        }
    })
}
function loginOut(){
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
                window.location.href = '/index.html';
            }
        }
    })
}
