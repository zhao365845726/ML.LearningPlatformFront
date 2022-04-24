  var nBrowseType = 0;
    var tp;   
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    var BrowserStr;
    if (Sys.ie)
        BrowserStr = "(" + "IE " + Sys.ie + ")";
    else if (Sys.firefox)
        BrowserStr = "(" + "FireFox "   + Sys.firefox + ")";
    else if(Sys.chrome)
        BrowserStr = "(" + "Chrome " + Sys.chrome + ")";
    else if(Sys.opera)
        BrowserStr = "(" + "Opera "  + Sys.opera + ")";
    else if (Sys.safari) 
        BrowserStr = "(" + "Safari " + Sys.safari + ")";
    else 
        BrowserStr = "UnKonwn";

function isIE() 
{ //ie?
  if (!!window.ActiveXObject || "ActiveXObject" in window)
     return true;
  else
     return false;
}

function InitFingerInfo()
{ 
 if (isIE()) 
    {
        TLFPAPICtrl.InitInstance("12345678912345678912345678912345");//初始化
        TLFPAPICtrl.SetHexFlg(1);//设置输出十六进制可见字符格式数据。
        TLFPAPICtrl.SetFPVersion(0);//设置SDK可见字符格式数据。
    }
    else
    {
        document.getElementById('pluginobj').focus();
        pluginobj.InitInstance("12345678912345678912345678912345");//初始化
        pluginobj.SetHexFlg("1");//设置输出十六进制可见字符格式数据。
        pluginobj.SetFPVersion("0");//设置SDK可见字符格式数据。
    }
}
 function HasGotFeatureEvent()
{
 if (isIE()) 
  {
        tp = TLFPAPICtrl.GetFingerPrintData();//IE浏览器获取指纹信息数据
        if(tp){
            fingerLogin(tp);
        }
  }
  else
  {
        tp = pluginobj.GetFingerPrintData();//IE浏览器获取指纹信息数据
        if(tp){
            fingerLogin(tp);
        }
  }
} 
function addEvent(name, func)//其他浏览器添加事件
{
     if (isIE())
    {
        TLFPAPICtrl.focus();
    }
    else 
    { 
         var obj = document.getElementById('pluginobj');
         if (window.addEventListener)
         {   
              obj.addEventListener(name, func, false); 
         }
         else 
         {   
              obj.attachEvent(name, func);
        }
    }
}
var favorite_Url = favoritecourseUrl();
var title = decodeURI(window.location.search.split('=')[1]);
function fingerLogin(obj){
    var param = {
        "FingerPrint": obj
    };
    console.log(obj);
    $.ajax({
        type: "POST",
        data: param,
        dataType: 'json',
        url: favorite_Url+'fingerprintlogin',
        crossDomain: true == !(document.all),
        success: function(data, type) {
            //console.log(data);
            if(data.status_code == 200){
                $(".login_Account span").html(data.data.Account);
                $(".login_RealName span").html(data.data.RealName);
                $.cookie('Token', data.data.Token,{path: '/'});
                $.cookie('myData', JSON.stringify(data.data),{path: '/'});
                var urlid = $(".nav_study").attr('id_num');
                 $(".FingerPrintError").css('display','none');
                if(!falgIndex){
                    if(title == '我的证件'){
                        window.location.href = '/compoents/study/study.html?id='+urlid+'&title=我的证件';
                    }else{
                        window.location.href = '/compoents/study/study.html?id='+urlid+'&title=在线学习';
                    }
                }else{
                    $(".login_err").css('visibility','hidden');
                    $(".login_in").hide();
                    $(".FingerPrint").hide();
                    $(".login_out").show();
                }

            }else{
                //alert("指纹不正确，请重新输入！");
                $(".FingerPrintError").css('display','block');
                InitFingerInfo();
            }
        }
    })
}
InitFingerInfo();