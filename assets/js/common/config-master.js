function ajaxUrl(){ //导航列表url
    var url = 'http://192.168.1.202:86/api/content/';
    return url;
};
function lecturerUrls(){ //导航列表url
    var url = 'http://192.168.1.202:86/api/lecturer/';
    return url;
};
function isLoginUrl(){ //是否登陆
    var url = 'http://192.168.1.202:86/api/user/islogin';
    return url;
};
function courseUrl(){ //课件
    var url = 'http://192.168.1.202:86/api/course/';
    return url;
};
function favoritecourseUrl(){ //赞，收藏
    var url = 'http://192.168.1.202:86/api/user/';
    return url;
};
function practiseUrl(){ //分项练习
    var url = 'http://192.168.1.202:86/api/practise/';
    return url;
};
function examUrl(){ //考试
    var url = 'http://192.168.1.202:86/api/exam/';
    return url;
};

function redisUrl(){ //清除缓存
    var url = 'http://192.168.1.202:86/api/common/';
    return url;
};