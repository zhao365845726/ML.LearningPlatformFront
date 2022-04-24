// var api_domain = 'http://milisx.tpddns.cn:82/';
// var api_domain = 'http://mkcloud.api.milisx.com/';
var api_domain = 'https://kxny.learn-dev.milisx.com/';

function ajaxUrl(){ //导航列表url
    var url = api_domain + 'api/content/pc/';
    return url;
};
function lecturerUrls(){ //导航列表url
    var url = api_domain + 'api/lecturer/pc/';
    return url;
};
function isLoginUrl(){ //是否登陆
    var url = api_domain + 'api/user/islogin';
    return url;
};
function courseUrl(){ //课件
    var url = api_domain + 'api/course/pc/';
    return url;
};
function favoritecourseUrl(){ //赞，收藏
    var url = api_domain + 'api/user/pc/';
    return url;
};
function practiseUrl(){ //分项练习
    var url = api_domain + 'api/practise/pc/';
    return url;
};
function examUrl(){ //考试
    var url = api_domain + 'api/exam/pc/';
    return url;
};

function redisUrl(){ //清除缓存
    var url = api_domain + 'api/common/pc/';
    return url;
};