var sysdomain = location.hostname;
var sys = {
    istest: 1	//1=測試版中，0=正式上線與采用緩存方式
    , log: []
    , rootdir: "/app/html/"
    , webname: "28"
    , domain: location.hostname
    , jqpath: "/app/html/js/loadpack.js" //加载jq
    , dataapi: "/app/dataapi.php"  //数据接口
    , userapi: "/app/userapi.php"  //用户接口
    , geturlapi: "/app/geturl.php" //获取支付链接接口
    , sendcodeapi: "/app/getcodeapi.php" //获取验证码接口
    , offlinetransferapi: "/app/offlinetransferapi.php"  //充值接口
    , webconfigapi: "/app/webconfig.php"//配置文件地址
    , upavatarapi: "https://" + sysdomain + "/app/upavatarapi.php"//头像上传地址
    , truntableapi: "/app/truntableapi.php" //抽奖接口
    , onlineconfirmapi: "/app/onlineconfirm.php" //线上支付确认接口
    , checkordersnstatusapi: "/app/checkordersnstatus.php" //检查订单接口
    , zindex_num: 100
    , getzindex: function () {
        sys.zindex_num++;
        return sys.zindex_num;
    } //Z轴			sys.getzindex();
    , cookie_config: {expires: 86400000, path: '/', domain: '', secure: false}					//cookie 配置
}
var addlog = null;
var sysinit = function () {
    var a = location.hostname.split('.');
    switch (a.length) {
        case 1:
            sys.domain = a[0];
            break;
        case 2:
            sys.domain = a[0] + "." + a[1];
            break;
        case 3:
            sys.domain = a[1] + "." + a[2];
            break;
        case 4:
            sys.domain = a[1] + "." + a[2] + "." + a[3];
            break;
        default:
            return;
    }
    //document.domain=sys.domain;//JS Iframe POST 主要。
    sys.cookie_config.domain = sys.domain;

    if (self == top) {
        addlog = function (s) {
            sys.log.push(s);
            if (sys.istest) console.log("[" + sys.log.length + "]=>" + s);
        }
    } else {
        addlog = top.addlog;
    }


};
sysinit();

window.onerror = function (sMsg, sUrl, sLine) {
    var s = "";
    s = "<b>An error was thrown and caught.</b><p>";
    s += "Error: " + sMsg + "<br>";
    s += "Line: " + sLine + "<br>";
    s += "URL: " + sUrl + "<br>";

    if (sys.istest) {
        //$.alert("代碼錯誤提示",s)
    } else {
        addlog(s);
    }
    return false;
}

var _run = {
    log: [],
    loadtask: [],
    init: function (a) {
        var runs = null, types = 'undefined', url = sys.rootdir + 'js/';
        _run.log.push([a[0]]);
        var b = a[0].split(".");
        var ta = a[0].toString().toLowerCase().split("."), fn = "";
        switch (b.length) {
            case 3:
                runs = b[1] + "." + b[2];
                url += "" + ta[0] + "/" + ta[1] + ".js";
                fn = b[1];
                break;
            case 4:
                if (ta[0] == "oss") ta[0] = sys.oss

                url = ta[0] + "/js/" + b[1] + "/" + b[2] + ".js";
                runs = b[2] + "." + b[3];
                fn = b[2];
                break;
            default:
                alert("run运行出错[" + a[0] + "]");
                return;
                break;
        }
        if (sys.istest) url += "?t=" + Math.random();

        //alert(url)

        try {
            types = typeof (eval(runs));
        } catch (e) {
        }
        ;
        if (types != 'undefined') {
            eval(runs)(a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
            return;
        }
        ;


        if (!_run.loadtask[fn]) {
            _run.addtask(fn, runs, a);
            if (url.substr(0, 2) == "//") url = location.protocol + url;
            $.getScript(url, function () {
                addlog("" + runs + "=>loaded,runtask")
                _run.runtask(fn);
            });
        } else {
            _run.addtask(fn, runs, a);
        }
    },

    addtask: function (fn, runs, a) {
        var t = "[addtask]=>" + runs + "=>[";
        for (var i in a) if (i > 0) if (typeof a[i] == "string") {
            t += a[i] + "|";
        } else {
            t += typeof (a[i]) + "|";
        }
        addlog(t + "]")
        if (_run.loadtask[fn]) {
            if (_run.loadtask[fn][runs]) {
                for (var i in _run.loadtask[fn][runs]) {
                    if (_run.loadtask[fn][runs][i] == a) {
                        return;
                    }
                }
            }
        }
        if (!_run.loadtask[fn]) _run.loadtask[fn] = [];
        if (!_run.loadtask[fn][runs]) _run.loadtask[fn][runs] = [];
        _run.loadtask[fn][runs].push(a)
    },
    runtask: function (fn) {
        var c = _run.loadtask[fn], a, runs;
        var cb = window[fn + '_load_cb'], types = null;
        for (var i in c) {
            runs = i;
            for (var j in c[i]) {
                a = c[i][j];
                try {
                    types = typeof (eval(runs));
                } catch (e) {
                }
                ;
                if (types != 'undefined') {

                    eval(runs)(a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
                    if (typeof cb == 'function') cb(0);
                } else {
                    if (typeof cb == 'function') {
                        cb(1);
                    } else {
                        addlog('不存在相关的类和方法[' + runs + ']');
                    }
                }

            }
            _run.loadtask[fn][runs] = [];
        }
    },

    end: ""
}
var run = function () {
    _run.init(arguments);
};
var readyarr = new Array(), ready = function (readyCall) {
    readyarr.push(readyCall);
};
eval("var $" + "$" + "=function(s){return document.getElementById(s);};");


/*
请求
rq(url,data,cb,datatype);
*/
if (typeof _rq == 'undefined') var _rq = {
    isinit: false, log: [],
    init: function () {
        if (_rq.isinit) return;
        /*if (!$$('jqui')) $("body").append("<div id=jqui ></div>");
        if (!$$('rqloadbar')) {
        var t = "";
        t += "<div style=\"position:fixed;bottom:2px;left:2px;display:none;line-height:20px;border:1px solid #dcdcdc;background-color:#f1f1f1;padding:0px 6px;z-index:999;font-size:12px;\" "
        t += " id=rqloadbar >Loading...</div>"
        $('#jqui').append(t);
        }
        if (!$$('rqpostform')) {
        $('#jqui').append("<iframe src='' name=postformframe style='display:none;'  ></iframe><form id=rqpostform method=post style='display:none;' target='postformframe'></form>");
        }*/
        _rq.isinit = true;
    },
    config: {},
    upsurl: "",
    rqtime: 0, rqtime_n: 0,
    send: function () {
        _rq.init();
        var a = arguments, d = _rq.config, url = "", datatype = 'get', data = null, cb, errorcb;
        switch (a.length) {
            case 5:
                url = a[0];
                data = a[1];
                cb = a[2];
                datatype = a[3];
                errorcb = a[4];
                break;
            case 4:
                url = a[0];
                data = a[1];
                cb = a[2];
                datatype = a[3];
                break;
            case 3:
                url = a[0];
                if (typeof a[2] == 'string') {
                    cb = a[1];
                    datatype = a[2];
                } else if (typeof a[2] == 'function') {
                    data = a[1];
                    cb = a[2];
                }
                ;
                break;
            case 2:
                url = a[0];
                if (typeof a[1] == 'object') {
                    data = a[1];
                } else if (typeof a[1] == 'function') {
                    cb = a[1];
                }
                ;
                break;
            case 1:
                url = a[0];
                break;
            default:
                alert("RQ参数出错,请输入正确的参数");
                break;
        }
        ;
        var surl = _rq.url(url, data);
        if (surl == "") return;
        if (_rq.upsurl == surl) return;
        _rq.log.push(surl);
        _rq.upsurl = surl;
        if ((datatype != 'post' && surl.length > 2000) || datatype == "post") {
            datatype = "post";
        }
        ;
        clearInterval(_rq.rqtime);
        if (typeof cb == 'function') {
            $('#rqloadbar').show();
            _rq.rqtime = setInterval(function () {
                _rq.rqtime_n++;
                var t = "", t2 = "Loading...".split('');
                for (var i = 0; i <= Math.floor(_rq.rqtime_n % t2.length); i++) t += t2[i];
                $('#rqloadbar').html(t);
            }, 100);
            d.success = function (_cb) {
                _rq.upsurl = "";
                if (typeof _cb == 'string') eval('var _cb=' + _cb);
                _rq.rqtime_n = 0;
                clearInterval(_rq.rqtime);
                $('#rqloadbar').hide(50);
                cb(sortcbdata(_cb));
            };
            d.error = function (s) {
                _rq.upsurl = "";
                _rq.rqtime_n = 0;
                clearInterval(_rq.rqtime);
                $('#rqloadbar').hide(50);
                if (typeof errorcb == 'function') {
                    errorcb();
                } else { /*alert('加载数据出错，请检查连接问题:' + surl.substr(0, 200));*/
                }
            };
        }
        ;

        if (datatype == 'get') {
            d.url = surl;
            _rq.send_get(d);
        } else {
            if (data) d = copy(d, data);
            _rq.send_post(url, d);
        }
    },
    showlog: function () {
        var t = "", c = "";
        t += "<div>"
        t += "<h2>请求连接</h2>"
        for (var i in _rq.log) {
            c = _rq.log[i];
            t += "<a href=\"" + c + "\" target=\"_blank\" >" + c + "</a>"
        }
        t += "</div>"
        t += "<div>"
        t += "<h2>JS运行</h2>"
        for (var i in _run.log) {
            c = _run.log[i];
            t += "<a href=\"" + c + "\" target=\"_blank\" >" + c + "</a>"
        }
        t += "</div>"
        $('body').append(t);
    },

    send_get: function (d) {


        $.ajax(copy(d, {dataType: 'jsonp', jsonp: 'jsoncallback', type: 'get'}));
    },
    send_post: function (url, d) {
        if (!$$('rqpostform')) {//无缘无故又被删除了，再检查一次
            _rq.isinit = false;
            _rq.init();
        }


        d[user.keyname] = $.cookie(user.keyname);
        d['jscallback'] = 'jscallback_' + gettime();
        d['jsdomain'] = document.domain;
        window['jscallback'] = window[d['jscallback']] = function (cb) {
            var _cb = _rq.postsuccess(cb);
            if (d.success) {
                d.success(_cb);
            }
        };
        var o = $('#rqpostform');
        o.attr('action', url).html('');
        o.append(_rq.ot(d));
        o.submit();
    },
    ot: function (_o, _fn) {
        var _t = "";
        _fn = _fn ? _fn : '';
        for (var i in _o) {
            if (typeof _o[i] == 'function') {

            } else if (typeof _o[i] == 'object') {
                _t += _rq.ot(_o[i], _fn == '' ? i : _fn + '[' + i + ']');
            } else if (i) {
                _t += "<textarea name=";
                if (_fn) {
                    _t += _fn + "[" + i + "]";
                } else {
                    _t += "" + i + "";
                }
                ;
                _t += " >" + _o[i] + "</textarea>";
            }
        }
        ;
        return _t;
    },
    postsuccess: function (_cb) {
        $('#postform').html('');
        _rq.upsurl = "";
        _rq.rqtime_n = 0;
        clearInterval(_rq.rqtime);
        $('#rqloadbar').hide(50);
        if (typeof _cb == 'string') {
            try {
                eval('var _cb=' + _cb);
            } catch (e) {
            }
        }
        ;
        return _cb;
    },
    url: function (url, d) {
        if (typeof url != 'string') {
            alert('你输入的请求连接不正确');
            return "";
        }
        var surl = url;
        surl += surl.indexOf('?') == -1 ? "?" : '';
        surl += _rq.url_encode(d, '');
        //alert(surl)
        return surl;
    },
    url_encode: function (d, _efn) {
        var t = "";
        for (var i in d) {
            switch (Object.prototype.toString.call(d[i])) {
                case "[object Array]":
                case "[object Object]":
                    t += _rq.url_encode(d[i], _efn == "" ? i : _efn + "[" + i + "]");
                    break;
                case "[object String]":
                case "[object Number]":
                    if (_efn) {
                        t += "&" + _efn + "[" + i + "]=" + encodeURIComponent(d[i]);
                    } else {
                        t += "&" + i + "=" + encodeURIComponent(d[i]);
                    }
                    break;
            }
        }
        return t;
    },
    end: ""
}, rq = _rq.send;


var sortcbdata = function (cb) {
    var f = function (d) {
        var v = "", nv;
        for (var i in d) {
            v = d[i];
            switch (typeof v) {
                case 'string':
                    nv = parseInt(v.replace(/[^\d\-\.]+/i, "") + ".0");
                    nv += "";
                    if (v + "" == nv) d[i] = parseInt(v);
                    break;
                case 'object':
                    d[i] = f(v);
                    break;
            }
        }
        return d;
    }
    return f(cb);
}


/*读取路径参数 var a=request.a?parseInt(request.a):0;*/
var request = {}, _request = function () {
    request = {};
    if (location.search == "" && location.hash == "") return;
    var url = location.search + location.hash.replace('#', '&');
    url = (url + "#").split('#')[0];
    if (url.indexOf('?') > -1) url = (url + "?").split('?')[1];
    var a = url.split("&"), b, r_c;
    for (var i = 0; i < a.length; i++) {
        b = a[i];
        if (b.indexOf("=") > -1) {
            r_c = b.substring(b.indexOf("=") + 1, b.length);
            b = b.substring(0, b.indexOf("="));
            b = b.replace(/^\d*/, '');
            if ((typeof b == "string") && b.length > 0) {
                request[b] = r_c

                //eval("request."+b+"=\""+r_c+"\"");
            }
        }
    }
};
_request();


var dateformat = DateFormat = function (d, t) {
    var d = StringToDate(d);
    if (typeof d != "date" && typeof d != "object") return d;
    if (!t) {
        nd = new Date();
        dt = nd.getYear() - d.getYear();
        if (dt > 0) return dt + "年前";
        dt = nd.getMonth() - d.getMonth();
        if (dt > 0) return dt + "月前";
        dt = nd.getDate() - d.getDate();
        if (dt > 0) return dt + "日前";
        dt = nd.getHours() - d.getHours();
        if (dt > 0) return dt + "小時前";
        dt = parseInt(nd.getTime() - d.getTime()) / 1000;
        if (dt > 60 * 3) return parseInt(dt / 60) + "分鍾前";
        return "剛剛";
    }
    var y = d.getYear(), fy = d.getFullYear(), m = d.getMonth() + 1, nd = d.getDate(), h = d.getHours(),
        i = d.getMinutes(), s = d.getSeconds(), w = d.getDay();
    t += "";
    t = t.replace(/y/g, y);
    t = t.replace(/Y/g, fy);
    t = t.replace(/m/g, m);
    t = t.replace(/M/g, (m < 10) ? "0" + m : m);
    t = t.replace(/d/g, nd);
    t = t.replace(/D/g, (nd < 10) ? "0" + nd : nd);
    t = t.replace(/h/g, h);
    t = t.replace(/H/g, (h < 10) ? "0" + h : h);
    t = t.replace(/i/g, i);
    t = t.replace(/I/g, (i < 10) ? "0" + i : i);
    t = t.replace(/s/g, s);
    t = t.replace(/S/g, (s < 10) ? "0" + s : s);
    t = t.replace(/t/g, d.getTime() / 1000);
    t = t.replace(/T/g, d.getTime());
    t = t.replace(/w/g, w);
    t = t.replace(/W/g, ["日", "一", "二", "三", "四", "五", "六"][w]);
    return t;
};
var StringToDate = strtodate = function (d) {
    if (typeof d == "undefined" || typeof d == "object") return new Date();
    if (typeof d == "date") return d;
    if (typeof d == "string") if (d == d.replace(/[^\d]/, "")) return new Date(parseInt(d) * (d.length > 10 ? 1 : 1000));
    if (typeof d == "number") return new Date(d * (d.length > 10 ? 1 : 1000));
    d = d.replace(/[-+\. :]/g, '-').replace(/[^\d\-]/, "");
    var a = (d + "-0-0-0-0-0-0-0").split('-');
    if (a[0] == "") return new Date(Math.floor(d));
    return new Date(a[0], --a[1], a[2], a[3], a[4], a[5], a[6]);
};
var dump = print_r = function (arr, isout) {
    var tt = "测试输出数组[" + (typeof arr) + "]:\n";
    var print_out = function (_oarr, n, tn) {
        if (tn == 0) return "";
        var t = "", arr = _oarr;
        for (var prti in arr) {
            for (var i = 0; i < n; i++) t += " ";
            t += "[" + prti + "]";
            switch (typeof arr[prti]) {
                case 'object':
                    t += '=' + (typeof arr[prti]) + "\n";
                    t += print_out(arr[prti], n + (prti + '').length + 2, tn--);
                    break;
                case 'number':
                    t += '=' + arr[prti] + "\n";
                    break;
                case 'string':
                    t += '="' + arr[prti] + "\"\n";
                    break;
                default:
                    t += '=' + (typeof arr[prti]) + "\n";
                    break;
            }
        }
        return t;
    };
    tt += print_out(arr, 0, 1);
    if (!isout) {
        alert(tt);
    } else {
        return tt;
    }
};
var copy = function () {
    var p = {}, _p = {};
    for (var j = 0; j <= arguments.length; j++) {
        _p = arguments[j];
        if (typeof _p == 'object') {
            if (_p.length > 0) {
                for (var i = 0; i < _p.length; i++) p[i] = _p[i];
            } else {
                for (var i in _p) p[i] = _p[i];
            }
        }
    }
    return p;
};
var rand = function (_min, _max) {
    switch (Object.prototype.toString.call(_min)) {
        case "[object Array]":
            return _min[Math.floor(Math.random() * _min.length)];
            break;
        case "[object Object]":
            var _a = [];
            for (var i in _min) _a.push(_min[i]);
            return _a[Math.floor(Math.random() * _a.length)];
            break;
        case "[object Number]":
            return _min + Math.floor(Math.random() * (_max - _min + 1));
            break;
        case "[object String]":
            return _min[Math.floor(Math.random() * _min.length)];
            break;
        case "[object RegExp]":
        case "[object Undefined]":
        case "[object Null]":
        default:
            return '';
            break;
    }
};
var isMobile = function () {
    return /(Mobile|iPhone|Android|WAP|NetFront|JAVA|OperasMini|UCWEB|WindowssCE|Symbian|Series|webOS|SonyEricsson|Sony|BlackBerry|Cellphone|dopod|Nokia|samsung|PalmSource|Xphone|Xda|Smartphone|PIEPlus|MEIZU|MIDP|CLDC)/ig.test(navigator.userAgent) ? true : false;
}
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
//browser.versions.ios


/*单位*/
var Munit = function (num, l) {
    if (num >= 100000000) return (num / 100000000).toFixed(l ? l : 8) + "亿";
    if (num >= 10000) return (num / 10000).toFixed(l ? l : 4) + "万";
    return num + "";
};
var substr2 = function (str, n, ec) {
    ec = ec ? ec : "...";
    str = str.replace(/<[^<>]+>/g, "");
    var r = /[^\x00-\xff]/g;
    if (str.replace(r, "mm").length <= n) {
        return str;
    }
    var m = Math.floor(n / 2);
    for (var i = m; i < str.length; i++) {
        if (str.substr(0, i).replace(r, "mm").length >= n) {
            return str.substr(0, i) + ec;
        }
    }
    return str;
}
var gettime = function () {
    return Math.floor(new Date().getTime() / 1000);
}

var Load = {
    createjs: function (url) {
        var head = document.getElementsByTagName("head")[0];
        var io = document.createElement("script");
        Load.n++;
        io.id = 'loadjs' + Load.n;
        io.charset = 'utf-8';
        io.src = url.toLowerCase();
        head.appendChild(io);
        return Load.n;
    }, checkJsIsLoad: function (url) {
        head = document.getElementsByTagName("head")[0];
        return head.innerHTML.indexOf(url) != -1
    }, n: 0
};


Load.createjs(sys.jqpath);
var readynum = 0, readytime = setInterval(function () {
    readynum++;
    if (typeof $ == "function") {
        jqExpand();
        clearInterval(readytime);
    } else if (readynum == 1000) {
        Load.createjs(sys.jqpath);
    }
}, 20);
/*加载完JQ后扩展方法*/
var jqExpand = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    $.extend({
        includePath: '/js/',
        include: function (file) {
            var files = typeof file == "string" ? [file] : file;
            for (var i = 0; i < files.length; i++) {
                var name = files[i].replace(/^s|s$/g, "");
                var att = name.split('.');
                var ext = att[att.length - 1].toLowerCase();
                var isCSS = ext == "css";
                var tag = isCSS ? "link" : "script";
                var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
                var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "'";
                if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">");
            }
        },
        cookie: function (n, v, p) {
            if (typeof v == 'undefined') {
                if (!document.cookie || document.cookie == '') return null;
                var a = document.cookie.replace(/\s+/ig, "").split(';'), b, c = {}, n1;
                for (var i = 0; i < a.length; i++) {
                    v = a[i];
                    b = v.split('=');
                    if (b.length > 1) c[b[0]] = v.substr(b[0].length + 1, v.length - b[0].length - 1)
                }
                return decodeURIComponent(c[n]);
            }
            p = copy({v: ''}, sys.cookie_config, p);
            var d = new Date();
            p.expires = parseInt(p.expires);
            if (p.expires > 1300000000) {

            } else if (p.expires > 0) {
                p.expires = d.getTime() + p.expires * 1000 * 86400;
            } else {
                p.expires = d.getTime() - 1;
            }
            p.expires = StringToDate(p.expires).toUTCString()
            var t = n + "=" + encodeURIComponent(v);
            t += ';expires=' + p.expires;
            t += ';path=' + p.path
            t += ';domain=' + p.domain
            if (p.secure) t += ';secure'
            document.cookie = t;
        },
        alert: function (title, content) {
            run("ui.box.init", {
                title: title, content: content, bgclick: function (n) {
                    box.close(n);
                }
            })
        },
        browser: {
            version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
            safari: /webkit/.test(userAgent),
            opera: /opera/.test(userAgent),
            msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
            mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
        }


    });

    //$.getScript("/H3.2/js/plugins/layer/layer.js",function(){
    ready = function (cb) {
        $(cb);
    };
    for (readyi = 0; readyi < readyarr.length; readyi++) $(readyarr[readyi]);
    $('body').bind('DOMNodeInserted', check_nodeattr);
    check_nodeattr();
    //});

};
/*检查页面参数加载相关的JS*/
var check_nodeattr = function () {
    clearTimeout(check_nodeattr_time);
    check_nodeattr_time = setTimeout(check_nodeattr2, 50)
}, check_nodeattr_time = 0, check_nodeattr_n = 0, check_nodeattr2 = function () {
    var l = 0;
    /*html标签属性调用run*/
    $('[jsrun]').each(function () {
        var s = $(this).attr('jsrun'), a = (s + ',,,,,,').split(',');
        if (a[1].indexOf('{') > -1) {
            s = a[1];
            for (var i = 2; i < a.length - 6; i++) s += ',' + a[i];
            eval("var jqd=" + s + "");
            run(a[0], jqd);
        } else {
            for (var i = 2; i < a.length - 1; i++) if (a[i] == '') a[i] = null;
            run(a[0], a[1], a[2], a[3], a[4]);
        }
        ;$(this).removeAttr('jsrun');
    });
    /*针对SEO对初始化 a 点击连接*/
    $('[ajs]').each(function () {
        $(this).attr('href', 'javascript:' + $(this).attr('ajs') + ';').removeAttr('ajs');
    });
    //l=$("[data-form]").length;if(l>0)run("form.vform.init");
    //l=$("[data-layout=\"rollshow\"]").length;if(l>0)run("layout.rollshow.findo");
    //l=$("[data-toggle=\"dropdown\"]").length;if(l>0)run("h32.nodeattr.nadropdown.init");
    //l=$("[data-toggle=\"collapse\"]").length;if(l>0)run("h32.nodeattr.nacollapse.init");
    //l=$("[data-ride=\"carousel\"]").length;if(l>0)run("h32.nodeattr.nacarousel.init");
    //l=$("[tips]").length;if(l>0)run("ui.systips.init");/*连接提示美化*/
    //l=$("[imgsrc]").length;if(l>0)run("ui.imgsrc.init");/*图片滚动延时加载*/
    check_nodeattr_n++;
    //document.title=l+'|'+check_nodeattr_n;
}

if (self == top) addlog("欢迎來到" + sys.webname);

var con2html = function (s) {
    s = s.replace(/&quot;/ig, "\"");
    s = s.replace(/\|#\|/ig, "\"");
    s = s.replace(/&nbsp;/ig, " ");
    return s;
}

//缓存封装
var cache = {
    set: function (name, value, timeout) {
        if (name == null || name == "undefined" || name.length == 0) return false;
        var exp = new Date();
        localStorage[name] = JSON.stringify({
            value: value, expires: exp.getTime() + timeout * 1000
        });
    },
    get: function (name) {
        try {
            var text = localStorage[name];
            if (text == null || text == "undefined") return null;
            var o = JSON.parse(text)
            if (!o || o.expires < Date.now()) {
                return null;
            } else {
                return o.value;
            }
        } catch (e) {
            // 兼容其他localstorage
            //console.log(e);
            if (text == null || text == "undefined") return null;
            return text;
        } finally {

        }
    },
    del: function (name) {
        localStorage[name] = null;
    },
    delAll: function () {
        localStorage.clear();
    },
    end: ""
}
