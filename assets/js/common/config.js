// var api_domain = 'http://mlearning.api.milisx.com/';
// var api_domain = 'http://localhost:52118/';
var api_domain = 'http://kxny.learn-api.milisx.com/';

function ajaxUrl(){ //导航列表url
    var url = api_domain + 'api/content/v1/';
    return url;
};
function lecturerUrls(){ //导航列表url
    var url = api_domain + 'api/lecturer/v1/';
    return url;
};
function isLoginUrl(){ //是否登陆
    var url = api_domain + 'api/user/v1/getuserinfo';
    return url;
};
function courseUrl(){ //课件
    var url = api_domain + 'api/course/v1/';
    return url;
};
function favoritecourseUrl(){ //赞，收藏
    var url = api_domain + 'api/user/v1/';
    return url;
};
function practiseUrl(){ //分项练习
    var url = api_domain + 'api/practise/v1/';
    return url;
};
function examUrl(){ //考试
    var url = api_domain + 'api/exam/v1/';
    return url;
};

function redisUrl(){ //清除缓存
    var url = api_domain + 'api/common/v1/';
    return url;
};

function errorUrl(){ //清除缓存
    var url = api_domain + 'api/practise/v1/errorquestionlist';
    return url;
};