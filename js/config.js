var config = (function () {
    var arr = window.location.hostname.split('.')[0];
    var isDebug = (arr == '192') || (arr == '127') || (arr == 'localhost') || (arr == '');
    var baseUrl = isDebug ? '' : 'http://q.letwx.com/app/touchtotouch-build/';
    var htmlUrl = isDebug ? '' : 'http://q.letwx.com/app/touchtotouch-build/';
    var cdnUrl = isDebug ? '' : 'http://qcdn.letwx.com/app/touchtotouch-build/';
    gameid = getUrlParam().uid != undefined ? getUrlParam().uid : 1;
    gp = getUrlParam().gp != undefined ? getUrlParam().gp : 'Wyzyy7CFUGPtdFlzhhrxwdP6X6l3P9CaGH3lhKg58K4';
    return {
        gameid: gameid,
        uid: gameid,
        gp: gp,
        touch: 'touchstart',
        click: 'click',
        isDebug: isDebug,
        htmlUrl: isDebug ? '' : htmlUrl,
        baseUrl: isDebug ? '' : baseUrl,
        baseCDNUrl: isDebug ? '' : cdnUrl,
        configUrl: (isDebug ? '' : baseUrl) + '../libs/require.config.js',
        scope: '',
        shareInfo: {
            title: '奇趣万圣夜，不给糖就捣蛋！',
            desc: '提着南瓜灯，“鬼混”哈咯喂，神秘魔幻礼物等你来领喔！',
            link: htmlUrl + 'index.html?uid=' + gameid + '&gp=' + gp,
            imgUrl: cdnUrl + 'images/share_show.jpg'
        }
    }
}());

//用于检测联通2G/3G环境下的广告条
//只重复一次，避免刷不出来时，始终停留
window.onload = function () {
    var checkLT = setTimeout(function () {
        if (document.getElementById('divShow')) {
            window.location.reload();
            return;
        }
    }, 300);
};

function check(oAuth, cb) {
    var gameid = config.gameid;
    oAuth.cfg(gameid, config.isDebug, config.scope);
    oAuth.checkToken(function (apiopenid, apitoken) {
        config.apiopenid = apiopenid;
        config.apitoken = apitoken;
        cb && cb(gameid, apiopenid, apitoken);
    }, function () {
        alert('checktoken错误！');
    });
}

function gotoUrl(url) {
    setTimeout(function () {
        window.location.href = url;
    }, 200);
}

function __uri(str) {
    return (config.baseCDNUrl + 'touchtotouch-build/../' + str);
}

function getUrlParam() {
    var str = window.location.search,
        arrTmp = [],
        obj = {};
    if (str.indexOf('?') > -1) {
        str = str.substr(1);
        arrTmp = str.split('&');
        for (var i = 0; i < arrTmp.length; i++) {
            var tempArr = arrTmp[i].split('=');
            obj[tempArr[0]] = decodeURIComponent(tempArr[1]);
        }
    }
    return obj;
}

//验证手机号码 - 返回值true/false
function testMobile(str) {
    var reg = /^1[34578]\d{9}$/;
    if (!str) {
        M.alert('手机号码不能为空');
        return false;
    } else if (!reg.test(str)) {
        M.alert('手机号码错误');
        return false;
    } else {
        return true;
    }
}

function textConvert(dom,str) {
    //dom-文本插入的dom元素  str-文本字符串
    //br表示换行
    dom.innerHTML = '';
    var textArr = str.split('br');
    for(var i=0;i<textArr.length;i++){
        var p = document.createElement('p');
        p.textContent = textArr[i];
        dom.appendChild(p);
    }
}
//textConvert($('#test')[0],str);

function scoreConvert(dom,str,score) {
    //dom-文本插入的dom元素  str-文本字符串
    //@表示成绩
    var newStr = str.replace(/@/g,'<span>' + score + '</span>');
    dom.innerHTML = newStr;
}
//scoreConvert($('#test')[0],str,score);