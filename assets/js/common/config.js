function ajaxUrl(){ //导航列表url
    var url = 'http://localhost:52118/api/content/';
    return url;
};
function lecturerUrls(){ //导航列表url
    var url = 'http://localhost:52118/api/lecturer/';
    return url;
};
function isLoginUrl(){ //是否登陆
    var url = 'http://localhost:52118/api/user/islogin';
    return url;
};
function courseUrl(){ //课件
    var url = 'http://localhost:52118/api/course/';
    return url;
};
function favoritecourseUrl(){ //赞，收藏
    var url = 'http://localhost:52118/api/user/';
    return url;
};
function practiseUrl(){ //分项练习
    var url = 'http://localhost:52118/api/practise/';
    return url;
};
function examUrl(){ //考试
    var url = 'http://localhost:52118/api/exam/';
    return url;
};

function redisUrl(){ //清除缓存
    var url = 'http://localhost:52118/api/common/';
    return url;
};