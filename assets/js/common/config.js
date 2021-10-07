// var api_domain = 'http://mlearning.api.milisx.com/';
// var api_domain = 'http://localhost:52118/';
var api_domain = 'http://kxny.learn-api.milisx.com/';

function ajaxUrl(){ //导航列表url
    var url = api_domain + 'api/content/';
    return url;
};
function lecturerUrls(){ //导航列表url
    var url = api_domain + 'api/lecturer/';
    return url;
};
function isLoginUrl(){ //是否登陆
    var url = api_domain + 'api/user/islogin';
    return url;
};
function courseUrl(){ //课件
    var url = api_domain + 'api/course/';
    return url;
};
function favoritecourseUrl(){ //赞，收藏
    var url = api_domain + 'api/user/';
    return url;
};
function practiseUrl(){ //分项练习
    var url = api_domain + 'api/practise/';
    return url;
};
function examUrl(){ //考试
    var url = api_domain + 'api/exam/';
    return url;
};

function redisUrl(){ //清除缓存
    var url = api_domain + 'api/common/';
    return url;
};