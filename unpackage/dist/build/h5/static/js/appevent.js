if (typeof appevent == 'undefined') var appevent = {
    init: function (_cb) {
        if (typeof _cb == "function") _cb();
    },
    loadwebconfig: function (_cb) { //加载app配置
        rq(sys.webconfigapi, "", function (cb) {
            for (var i in cb) {
                cache.set(i, cb[i], 86400 * 365);
                //console.log(i+"="+cb[i]);
            }
            sys.webname = cache.get("apptitle");
            if (cb.RegisterClause != null) {
                $("#loginclause").attr("href", "newstype.html?id=" + cb.RegisterClause);
                $("#regclause").attr("href", "newstype.html?id=" + cb.RegisterClause);
            } //注册服务条款文章
            if (cb.RewardRuleText != null) {
                $("#rewardruletext").attr("href", "newsinfo.html?id=" + cb.RewardRuleText + "&typeid=3");
            } //回水规则说明文章
            if ($("#apptitle") != null) $("#apptitle").html(cache.get("apptitle"));
            $(".goldname").html(cache.get("goldname"));
            $(document).attr("title", cache.get("apptitle"));
            if (typeof _cb == "function") _cb();
        });
    },
    //是否内嵌到app中
    isInApp: function () {
        try {
            //window.webkit.messageHandlers.ios.postMessage({"method": "isinapp"});
            if (window.webkit.messageHandlers.ios != null && window.webkit.messageHandlers.ios != "undefined") {
                return true;
            }
            return false;
        } catch (e) {
        }
        try {
            //window.Android.isinapp();
            if (window.Android != null && window.Android != "undefined") {
                return true;
            }
            return false;
        } catch (e) {
        }
        return false;
    },
    login: function () { //登录事件
        var username = $("#name").val(); //用户名
        var password = $("#password").val(); //密码
        var cbtest = $("#cbtest").is(":checked"); //记住密码
        var UserUnLoginTip = cache.get("UserUnLoginTip");
        if (username.length == 0 || username == "") {
            comm.tip("请输入用户名", 2);
            return;
        } else if (password.length == 0 || password == "") {
            comm.tip("请输入密码", 2);
            return;
        }
        rq(sys.userapi, {
            action: "login",
            username: $("#name").val(),
            password: md5($("#password").val()),
            userkey: ""
        }, function (cb) {
            switch (cb.code) {
                case 2:
                    comm.tip("登录信息超时请重新登录", 2);
                    return;
                case 3:
                    comm.tip("请输入用户名", 2);
                    return;
                case 4:
                    comm.tip("请输入密码", 2);
                    return;
                case 5:
                    comm.tip("账号名不存在", 2);
                    return;
                case 6:
                    cache.set("ukey", cb.data["userkey"], 86400 * 30);
                    comm.tip(UserUnLoginTip, 2);
                    setTimeout(function () {
                        location.href = "kfclient.html";
                    }, 1000);
                    return;
                case 7:
                    comm.tip("密码错误", 2);
                    return;
                case 0:
                    comm.tip("登录成功", 2);
                    cache.set("ukey", cb.data["userkey"], 86400 * 30);
                    cache.set("uid", cb.data["uid"], 86400 * 30);
                    cache.set("phone", cb.data["phone"], 86400 * 30);
                    cache.set("nickname", cb.data["nickname"], 86400 * 30);
                    cache.set("userpic", cb.data["userpic"], 86400 * 30);
                    cache.set("level", cb.data["level"], 86400);
                    if (cbtest == true) {
                        cache.set("username", username, 86400 * 7);
                        cache.set("password", password, 86400 * 7);
                    }
                    setTimeout(function () {
                        var dcref = document.referrer;
                        if ((dcref.indexOf("register.html") > -1) || (dcref.indexOf("newpassword.html") > -1) || (dcref.indexOf("newstype.html") > -1) || (dcref === ''))
                            location.href = "index.html";
                        else
                            location.href = dcref;
                    }, 2000);
                    return;
            }
        });
    },
    //记住密码读取
    getlogin: function () {
        var username = cache.get("username");
        var password = cache.get("password");
        $("#name").val(username); //用户名
        $("#password").val(password); //用户名
        if (username == null || password == null) {
            $("#login").addClass("login-btn");
            $("#login").removeClass("login-btn1");
        } else {
            $("#login").removeClass("login-btn");
            $("#login").addClass("login-btn1");
        }
    },

    //清除缓存事件
    delcache: function () {
        var ukey = cache.get("ukey");
        var uid = cache.get("uid");
        var phone = cache.get("phone");
        var nickname = cache.get("nickname");
        var userpic = cache.get("userpic");
        var level = cache.get("level");
        var version = cache.get("version");
        cache.delAll();
        cache.set("ukey", ukey, 86400);
        cache.set("uid", uid, 86400);
        cache.set("phone", phone, 86400);
        cache.set("nickname", nickname, 86400);
        cache.set("userpic", userpic, 86400);
        cache.set("level", level, 86400);
        cache.set("version", version, 86400);
        comm.tip("清除完成", 2);
    },
    //保存系统读取状态
    setadminmsg: function (id) {

    },

    //注册事件
    phoneregister: function () {
        var phone = $("#phone").val(); //手机号
        var phone1 = /^[1]{1}[0-9]{10}/; //手机号格式正则表达
        var email = $("#email").val(); //邮箱
        var email1 = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/; //邮箱格式正则表达
        var code = $("#code").val(); //验证码
        var password = $("#password").val(); //密码
        var password1 = /^[0-9A-Za-z]{6,25}/; //密码6-25位的数字字母密码正则表达
        var secondarypw = $("#secondarypw").val(); //二次密码
        var pushid = request.pushid; //获取pushid
        //var cbtest = $("#cbtest").is(":checked");//获取协议是否勾选
        //邮箱注册email必须有
        if ($("#emailreg").hasClass("register-tab")) {
            if (email.length == 0 || email == "") {
                comm.tip("请输入email", 2);
                return;
            } else if (!email1.test(email)) {
                comm.tip("请输入正确email", 2);
                return;
            }
        }
        //手机注册手机必须有
        if ($("#phonereg").hasClass("register-tab")) {
            if (phone.length == 0 || phone == "") {
                comm.tip("请输入手机号码", 2);
                return;
            } else if (!phone1.test(phone)) {
                comm.tip("请输入合法的手机号", 2);
                return;
            }
        }
        if (password.length == 0 || password == "") {
            comm.tip("请输入密码", 2);
            return;
        } else if (!password1.test(password)) {
            comm.tip("请输入6-25位密码", 2);
            return;
        } else if (secondarypw.length == 0 || secondarypw == "") {
            comm.tip("请再次输入密码", 2);
            return;
        } else if (secondarypw != password) {
            comm.tip("密码不一致", 2);
            return;
        } else if (code.length == 0 || code == "") {
            comm.tip("请输入验证码", 2);
            return;
        }
        /*else if (cbtest == false) {
                   comm.tip("请同意协议", 2);
                   return;
               }*/

        rq(sys.userapi, {
            action: "reg",
            password: md5(password),
            phone: phone,
            email: email,
            code: code,
            pushid: pushid
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("注册失败", 2);
                    return;
                case 2:
                    comm.tip("请输入验证码", 2);
                    return;
                case 3:
                    comm.tip("验证码错误", 2);
                    return;
                case 4:
                    comm.tip("手机号已被注册", 2);
                    return;
                case 5:
                    comm.tip("请输入email", 2);
                    return;
                case 6:
                    comm.tip("email已被注册", 2);
                    return;
                case 7:
                    comm.tip("请输入密码", 2);
                    return;
                case 0:
                    comm.tip("注册成功", 2);
                    cache.set("ukey", cb.data["userkey"], 86400 * 30);
                    cache.set("uid", cb.data["uid"], 86400 * 30);
                    cache.set("phone", cb.data["phone"], 86400 * 30);
                    cache.set("nickname", cb.data["nickname"], 86400 * 30);
                    cache.set("userpic", cb.data["userpic"], 86400 * 30);
                    if (pushid == "" || pushid == 0 || pushid == "undefined" || pushid == null) {
                        setTimeout(function () {
                            location.href = "index.html";
                        }, 500);
                        return;
                    }
                    setTimeout(function () {
                        location.href = "/dl.html";
                    }, 500);
                    return;

            }
        });
    },

    /***注册手机和邮箱切换**/
    registertab: function () {
        //手机注册切换
        $("#phonereg").click(function () {
            $("#phonereg").addClass("register-tab");
            $("#emailreg").removeClass("register-tab");
            $("#register").addClass("register-btn");
            $("#register").removeClass("register-btn1");
            $("#phoneregisteryzm").show();
            $("#phone-title").show();
            $("#email-title").hide();
            $("#emailregisteryzm").hide();
            $("#phone").val("");
            $("#email").val("");
            $("#password").val("");
            $("#secondarypw").val("");
            $("#code").val("");
            //设置checkbox为不选中状态  
            $("#cbtest").prop("checked", false);
        });
        //邮箱注册切换
        $("#emailreg").click(function () {
            $("#phonereg").removeClass("register-tab");
            $("#emailreg").addClass("register-tab");
            $("#register").addClass("register-btn");
            $("#register").removeClass("register-btn1");
            $("#email-title").show();
            $("#emailregisteryzm").show();
            $("#phone-title").hide();
            $("#phoneregisteryzm").hide();
            $("#phone").val("");
            $("#email").val("");
            $("#password").val("");
            $("#secondarypw").val("");
            $("#code").val("");
            //设置checkbox为不选中状态  
            $("#cbtest").prop("checked", false);
        });
    },

    /***检查用户是否存在**/
    checkemailandiphone: function (phone, email, _cb) {
        rq(sys.userapi, {
            action: "checkemailandiphone",
            phone: phone,
            email: email
        }, function (cb) {
            if (typeof _cb == "function") _cb(cb.code);
        });
    },

    //忘记密码事件
    resetpwd: function () {
        var phone = $("#phone").val(); //手机号
        var phone1 = /^[1]{1}[0-9]{10}/; //手机号格式正则表达
        var email = $("#email").val(); //邮箱
        var email1 = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/; //邮箱格式正则表达
        var code = $("#code").val(); //验证码
        var password = $("#password").val(); //密码
        var password1 = /^[0-9A-Za-z]{6,25}/; //密码6-25位的数字字母密码正则表达
        var secondarypw = $("#secondarypw").val(); //二次密码
        var pushid = request.paytype; //获取pushid
        //邮箱注册email必须有
        if ($("#emailreg").hasClass("register-tab")) {
            if (email.length == 0 || email == "") {
                comm.tip("请输入email", 2);
                return;
            } else if (!email1.test(email)) {
                comm.tip("请输入正确email", 2);
                return;
            }
        }
        //手机注册手机必须有
        if ($("#phonereg").hasClass("register-tab")) {
            if (phone.length == 0 || phone == "") {
                comm.tip("请输入手机号码", 2);
                return;
            } else if (!phone1.test(phone)) {
                comm.tip("请输入合法的手机号", 2);
                return;
            }
        }
        if (password.length == 0 || password == "") {
            comm.tip("请输入新密码", 2);
            return;
        } else if (!password1.test(password)) {
            comm.tip("请输入6-25位密码", 2);
            return;
        } else if (secondarypw.length == 0 || secondarypw == "") {
            comm.tip("请再次输入密码", 2);
            return;
        } else if (secondarypw != password) {
            comm.tip("密码不一致", 2);
            return;
        } else if (code.length == 0 || code == "") {
            comm.tip("请输入验证码", 2);
            return;
        }
        rq(sys.userapi, {
            action: "resetpwd",
            phone: phone,
            email: email,
            code: code,
            newpwd: md5(password)
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("请输入新的密码", 2);
                    return;
                case 3:
                    comm.tip("请输入验证码", 2);
                    return;
                case 4:
                    comm.tip("验证码错误", 2);
                    return;
                case 5:
                    comm.tip("用户不存在", 2);
                    return;
                case 6:
                    comm.tip("请输入email", 2);
                    return;
                case 7:
                    comm.tip("用户已被封不能找回密码", 2);
                    return;
                case 1008:
                    comm.tip("不能和原密码相同", 2);
                    return;
                case 0:
                    comm.tip("修改成功", 2);
                    setTimeout(function () {
                        location.href = "login.html";
                    }, 500);
                    return;
            }
        });
    },

    //修改密码
    updatepassword: function () {
        var oldpwd = $("#oldpwd").val(); //原密码
        var newpwd = $("#newpwd").val(); //原密码
        var newpwd1 = /^[0-9A-Za-z]{6,25}/; //新密码6-25位的数字字母密码正则表达
        var secondarypw = $("#secondarypw").val(); //二次密码
        var paypwd = $("#paypwd").val(); //手机验证码
        if (oldpwd.length == 0 || oldpwd == "") {
            comm.tip("请输入原密码", 2);
            return;
        } else if (newpwd.length == 0 || newpwd == "") {
            comm.tip("请输入新的密码", 2);
            return;
        } else if (!newpwd1.test(newpwd)) {
            comm.tip("请输入6-25位密码", 2);
            return;
        } else if (secondarypw.length == 0 || secondarypw == "") {
            comm.tip("请再次输入密码", 2);
            return;
        } else if (secondarypw != newpwd) {
            comm.tip("密码不一致", 2);
            return;
        } else if (paypwd.length == 0 || paypwd == "") {
            comm.tip("请输入安全密码", 2);
            return;
        }
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined") {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "uppwd",
            userkey: ukey,
            paypwd: md5(paypwd),
            oldpwd: md5($("#oldpwd").val()),
            newpwd: md5($("#newpwd").val())
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("修改失败，旧密码重复", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请输入旧密码", 2);
                    return;
                case 4:
                    comm.tip("请输入新的密码", 2);
                    return;
                case 5:
                    comm.tip("请输入安全密码", 2);
                    return;
                case 6:
                    comm.tip("不存在用户", 2);
                    return;
                case 7:
                    comm.tip("用户此时状态不能修改密码", 2);
                    return;
                case 8:
                    comm.tip("原密码错误", 2);
                    return;
                case 9:
                    comm.tip("安全密码错误", 2);
                    return;
                case 0:
                    comm.tip("修改成功", 2);
                    setTimeout(function () {
                        location.href = "setup.html";
                    }, 500);
                    return;
            }
        });
    },

    //修改昵称
    upnickname: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var nickname = $("#nickname").val();
        if (nickname.length == 0 || nickname == "") {
            comm.tip("请输入昵称", 2);
            return;
        }

        var regex = /(^[0-9a-zA-Z]{1,12}$)|(^[\u4e00-\u9fa5]{1,6}$)|(^[0-9a-zA-Z\u4e00-\u9fa5]{1,6}$)/;
        if (!regex.test(nickname)) {
            comm.tip("只支持数字、中文、字母1-6个字符，数字、字母1-12个字符", 5);
            return;
        }

        rq(sys.userapi, {
            action: "upnickname",
            userkey: ukey,
            nickname: nickname
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("修改失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("昵称不能为空", 2);
                    return;
                case 4:
                    comm.tip("只支持数字、中文、字母1-8个字符，数字、字母1-12个字符", 2);
                    return;
                case 4:
                    comm.tip("昵称不能有敏感字", 2);
                    return;
                case 0:
                    comm.tip("修改成功", 2);
                    cache.set("nickname", nickname, 86400);
                    setTimeout(function () {
                        location.href = "setup.html";
                    }, 500);
                    return;
            }
        });
    },


    //获取用户余额、回水收益、推广收益
    userpinfo: function (_cb) {
        var goldname = cache.get("goldname"); //读取金钱单位
        var carrycashfee = cache.get("carrycashfee"); //读取手续费
        var uid = cache.get("uid");

        var isLoad = true;
        var userpinfo_cache = cache.get("userpinfo_cache");
        if (userpinfo_cache == null || userpinfo_cache == "undefined") {
            isLoad = true;
            userpinfo_cache = Array();
            userpinfo_cache["balance"] = 0;
            userpinfo_cache["reward"] = 0;
            userpinfo_cache["pushreward"] = 0;
        }

        $("#balance").html(userpinfo_cache["balance"] + goldname); //余额
        $("#reward").html(userpinfo_cache["reward"] + goldname); //回水收益
        $("#pushreward").html(userpinfo_cache["pushreward"] + goldname); //推广收益
        $("#wal-haed-span1").html(userpinfo_cache["balance"]); //余额
        $("#balance1").html(userpinfo_cache["balance"]); //投注页余额
        $("#balance2").html(userpinfo_cache["balance"]); //投注页余额
        $("#company").html(goldname);
        $("#goldname").html(goldname); //读取金钱单位
        $(".goldname").html(goldname); // <- 所以为什么不用class呢？
        $("#am_userid").html(uid); //读取用户ID
        $("#balance3").html(userpinfo_cache["balance"]); //财务中心余额
        $("#unit").html(goldname); //读取单位
        $("#carrycashfee").html(carrycashfee + "%"); //读取手续费

        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "pinfo",
            userkey: ukey
        }, function (cb) {
            switch (cb.code) {
                case 0:
                    cache.set("userpinfo_cache", cb.data, 3600);
                    if (!isLoad) {
                        if (typeof _cb == "function") _cb();
                        return;
                    }
                    $("#balance").html(cb.data["realbalance"] + goldname); //余额
                    $("#reward").html(cb.data["reward"] + goldname); //回水收益
                    $("#pushreward").html(cb.data["pushreward"] + goldname); //推广收益
                    $("#wal-haed-span1").html(cb.data["realbalance"]); //余额
                    $("#balance1").html(cb.data["realbalance"]); //投注页余额
                    $("#balance2").html(cb.data["realbalance"]); //投注页余额
                    $("#company").html(goldname);
                    $("#goldname").html(goldname); //读取金钱单位
                    $(".goldname").html(goldname); // <- 所以为什么不用class呢？
                    $("#am_userid").html(uid); //读取用户ID
                    $("#balance3").html(cb.data["realbalance"]); //财务中心余额
                    $("#unit").html(goldname); //读取单位
                    $("#carrycashfee").html(carrycashfee + "%"); //读取手续费
                    if (typeof _cb == "function") _cb();
                    return;
                case 2:
                    location.href = "login.html";
                    return;
            }
        });
    },

    //检查登录状态
    loginstatus: function (_cb) {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var uid = cache.get("uid");
        var phone = cache.get("phone");
        var nickname = cache.get("nickname");
        var userpic = cache.get("userpic");
        if (uid != null || phone != null || nickname != null || userpic != null) {
            $("#imgheaddiv").html("<img id=\"imghead\" border=\"0\" src=\"" + userpic + "\" class=\"baimg_2\" onclick=\"$('#file').click();\" onerror=\"appevent.defaultUserPic(this)\">");
            // $("#imghead").attr('src', userpic);
            // $("#imghead").attr('onerror', "appevent.defaultUserPic(this)");

            $("#uid").html(uid);
            $("#nickname").html(nickname);
            $("#phone").html(phone);
            if (phone == "") $("#phone").html("未绑定");
        }
        rq(sys.userapi, {
            action: "loginstatus",
            userkey: ukey
        }, function (cb) {
            switch (cb.code) {
                case 2:
                    location.href = "login.html";
                    return;
                case 0:
                    cache.set("uid", cb.data["uid"], 86400 * 30);
                    cache.set("phone", cb.data["phone"], 86400 * 30);
                    cache.set("nickname", cb.data["nickname"], 86400 * 30);
                    cache.set("userpic", cb.data["userpic"], 86400 * 30);
                    cache.set("level", cb.data["level"], 86400 * 30);
                    _cb();
                    return;
            }
        });
    },

    //加载默认头像
    defaultUserPic: function (_this) {
        _this.onerror = null;
        _this.src = "/images/userpic/default.jpg"
    },

    /****点击链接跳转页面是否登录***/
    openhtml: function (cb) {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        if (cb == 1) { //跳转财务页面
            location.href = "finance.html";
            return;
        }
        if (cb == 2) { //跳转个人中心页面
            location.href = "personal.html";
            return;
        }
    },

    //退出登录
    exitlogin: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "exit",
            userkey: ukey
        }, function (cb) {
            if (cb.code == 0) {
                cache.del("ukey");
                cache.del("uid");
                cache.del("phone");
                cache.del("nickname");
                cache.del("userpic");
                location.href = "login.html";
                return;
            }
        });
    },

    //添加支付密码
    addpaypwd: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var paypwd = $("#paypwd").val(); //密码
        var secondarypw = $("#secondarypw").val(); //二次密码
        var code = $("#code").val(); //手机验证码
        var btype = $("#btype").val();
        if (btype == 0) {
            btype = "phone";
        } //验证模式手机验证码
        if (btype == 0) {
            btype = "email";
        } //验证模式邮箱验证码
        if (paypwd.length == 0 || paypwd == "") {
            comm.tip("请输入密码", 2);
            return;
        } else if (secondarypw.length == 0 || secondarypw == "") {
            comm.tip("请再次输入密码", 2);
            return;
        } else if (secondarypw != paypwd) {
            comm.tip("密码不一致", 2);
            return;
        } else if (code.length == 0 || code == "") {
            comm.tip("请输入验证码", 2);
            return;
        }
        rq(sys.userapi, {
            action: "addpaypwd",
            userkey: ukey,
            paypwd: md5($("#paypwd").val()),
            mode: btype, //验证模式：phone为手机验证，email为email验证
            code: code
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时请重新登录", 2);
                    return;
                case 3:
                    comm.tip("请输入安全密码", 2);
                    return;
                case 4:
                    comm.tip("请输入验证码", 2);
                    return;
                case 5:
                    comm.tip("验证码错误", 2);
                    return;
                case 6:
                    comm.tip("用户不存在", 2);
                    return;
                case 7:
                    comm.tip("安全密码已绑定", 2);
                    return;
                case 8:
                    comm.tip("安全密码不能和登录密码相同", 2);
                    return;
                case 0:
                    comm.tip("设置成功", 2);
                    location.href = "setup.html";
                    return;
            }
        });
    },


    //修改支付密码
    uppaypwd: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var newpaypwd = $("#newpaypwd").val(); //新密码
        var secondarypw = $("#secondarypw").val(); //二次密码
        var code = $("#code").val(); //手机验证码
        var btype = $("#btype").val();
        if (btype == 0) {
            btype = "phone";
        } //验证模式手机验证码
        if (btype == 0) {
            btype = "email";
        } //验证模式邮箱验证码
        if (newpaypwd.length == 0 || newpaypwd == "") {
            comm.tip("请输入新密码", 2);
            return;
        } else if (secondarypw.length == 0 || secondarypw == "") {
            comm.tip("请再次输入密码", 2);
            return;
        } else if (secondarypw != newpaypwd) {
            comm.tip("密码不一致", 2);
            return;
        } else if (code.length == 0 || code == "") {
            comm.tip("请输入验证码", 2);
            return;
        }
        rq(sys.userapi, {
            action: "uppaypwd",
            userkey: ukey,
            code: code,
            mode: btype, //验证模式：phone为手机验证，email为email验证
            newpaypwd: md5($("#newpaypwd").val())
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请输入旧安全密码", 2);
                    return;
                case 4:
                    comm.tip("请输入新安全密码", 2);
                    return;
                case 5:
                    comm.tip("请输入验证码", 2);
                    return;
                case 6:
                    comm.tip("验证码错误", 2);
                    return;
                case 7:
                    comm.tip("不存在用户", 2);
                    return;
                case 8:
                    comm.tip("用户此时状态不能修改安全密码", 2);
                    return;
                case 9:
                    comm.tip("原密码错误", 2);
                    return;
                case 1008:
                    comm.tip("不能和原安全密码相同", 2);
                    return;
                case 0:
                    comm.tip("成功", 2);
                    setTimeout(function () {
                        location.href = "setup.html";
                    }, 500);
                    return;
            }
        });
    },

    //判断是否有支付密码
    checkpaypwdloc: function () {
        var uid = cache.get("uid");
        if (uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        var checkpaypwd = cache.get("checkpaypwd_" + uid);
        if (checkpaypwd == "" || checkpaypwd == 0 || checkpaypwd == "undefined" || checkpaypwd == null) {
            comm.tip("还没绑定安全密码,请先绑定", 2);
            setTimeout(function () {
                location.href = "addtewd.html?goto=setup.html";
            }, 1500);
            return;
        }
    },
    //判断是否有支付密码
    checkpaypwd: function (_cb) {
        var ukey = cache.get("ukey");
        var uid = cache.get("uid");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null || uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        var checkpaypwd = cache.get("checkpaypwd_" + uid);
        if (checkpaypwd == 1) {
            $('#tepw').attr('href', 'updatewd.html');
            if (typeof _cb == "function") _cb();
            return;
        }
        rq(sys.userapi, {
            action: "checkpaypwd",
            userkey: ukey
        }, function (cb) {
            switch (cb.code) {
                case 0:
                    if (typeof _cb == "function") _cb();
                    return;
                case 1:
                    cache.set("checkpaypwd_" + uid, 1, 86400000);
                    $('#tepw').attr('href', 'updatewd.html');
                    if (typeof _cb == "function") _cb();
                    return;
            }
        });
    },

    //检查是否绑定手机
    checkphone: function () {
        var ukey = cache.get("ukey");
        var uid = cache.get("uid");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null || uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        var checkphone = cache.get("checkphone_" + uid);
        if (checkphone == 1) {
            $('#phone').attr('href', 'updatephone.html');
            $("#checkph").html("更换手机");
            return;
        }
        rq(sys.userapi, {
            action: "checkphone",
            userkey: ukey
        }, function (cb) {
            switch (cb.code) {
                case 0:
                    return;
                case 1:
                    cache.set("checkphone_" + uid, 1, 86400000);
                    $('#phone').attr('href', 'updatephone.html');
                    $("#checkph").html("更换手机");
                    return;
            }
        });
    },

    //判断是否有邮箱
    checkemail: function () {
        var ukey = cache.get("ukey");
        var uid = cache.get("uid");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null || uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        var checkem = cache.get("checkem_" + uid);
        if (checkem == 1) {
            $('#em').attr('href', 'updateem.html');
            $("#checkem").html("更换邮箱");
            return;
        }
        rq(sys.userapi, {
            action: "checkemail",
            userkey: ukey
        }, function (cb) {
            switch (cb.code) {
                case 0:
                    return;
                case 1:
                    cache.set("checkem_" + uid, 1, 86400000);
                    $('#em').attr('href', 'updateem.html');
                    $("#checkem").html("更换邮箱");
                    return;
            }
        });
    },

    //添加新手机
    addphone: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var phone = $("#phone").val(); //手机号
        var phone1 = /^[1]{1}[0-9]{10}/; //手机号格式正则表达
        var code = $("#code").val(); //手机验证码
        if (phone.length == 0 || phone == "") {
            comm.tip("请输入手机号", 2);
            return;
        } else if (code.length == 0 || code == "") {
            comm.tip("请输入验证码", 2);
            return;
        } else if (!phone1.test(phone)) {
            comm.tip("请输入合法手机号", 2);
            return;
        }
        rq(sys.userapi, {
            action: "addphone",
            userkey: ukey,
            phone: phone,
            code: code
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请输入手机号码", 2);
                    return;
                case 4:
                    comm.tip("请输入验证码", 2);
                    return;
                case 6:
                    comm.tip("此手机号码已经绑定其他用户", 2);
                    return;
                case 0:
                    comm.tip("绑定成功", 2);
                    setTimeout(function () {
                        location.href = "setup.html";
                    }, 1500);
                    return;
            }
        });
    },

    //验证旧手机
    verifyphone: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var pcode = $("#pcode").val(); //手机验证码
        if (pcode.length == 0 || pcode == "") {
            comm.tip("请输入验证码", 2);
            return;
        }
        rq(sys.userapi, {
            action: "verifyphone",
            userkey: ukey,
            code: $("#pcode").val()
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请输入验证码", 2);
                    return;
                case 4:
                    comm.tip("验证码错误", 2);
                    return;
                case 0:
                    comm.tip("成功", 2);
                    location.href = "updatephone.html";
                    return;
            }
        });
    },

    //绑定新手机
    upphone: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var phone = $("#phone").val(); //手机号
        var phone1 = /^[1]{1}[0-9]{10}/; //手机号格式正则表达
        var pcode = $("#pcode").val(); //手机验证码
        if (phone.length == 0 || phone == "") {
            comm.tip("请输入手机号", 2);
            return;
        } else if (pcode.length == 0 || pcode == "") {
            comm.tip("请输入验证码", 2);
            return;
        } else if (!phone1.test(phone)) {
            comm.tip("请输入合法手机号", 2);
            return;
        }
        rq(sys.userapi, {
            action: "upphone",
            userkey: ukey,
            newphone: phone,
            code: pcode
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请输入新绑定的手机", 2);
                    return;
                case 4:
                    comm.tip("请输入验证码", 2);
                    return;
                case 5:
                    comm.tip("验证码错误", 2);
                    return;
                case 6:
                    comm.tip("此手机号码已经绑定其他用户", 2);
                    return;
                case 0:
                    comm.tip("成功", 2);
                    cache.set("phone", phone, 86400);
                    setTimeout(function () {
                        location.href = "setup.html";
                    }, 1500);
                    return;
            }
        });
    },

    //添加Email
    addemail: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var email = $("#email").val();
        var email1 = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
        var code = $("#code").val();
        if (email.length == 0 || email == "") {
            comm.tip("请输入Email", 2);
            return;
        } else if (code.length == 0 || code == "") {
            comm.tip("请输入验证码", 2);
            return;
        } else if (!email1.test(email)) {
            comm.tip("请输入正确邮箱", 2);
            return;
        }
        rq(sys.userapi, {
            action: "addemail",
            userkey: ukey,
            email: email,
            code: code
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时请重新登录", 2);
                    return;
                case 3:
                    comm.tip("请输入Email", 2);
                    return;
                case 4:
                    comm.tip("请输入验证码", 2);
                    return;
                case 5:
                    comm.tip("验证码错误", 2);
                    return;
                case 6:
                    comm.tip("此邮箱地址已经绑定其他用户", 2);
                    return;
                case 0:
                    comm.tip("成功", 2);
                    setTimeout(function () {
                        location.href = "setup.html";
                    }, 500);
                    return;
            }
        });
    },

    //验证旧Email
    verifyemail: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var code = $("#code").val(); //邮箱验证码
        if (code.length == 0 || code == "") {
            comm.tip("请输入验证码", 2);
            return;
        }
        rq(sys.userapi, {
            action: "verifyemail",
            userkey: ukey,
            code: code
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请输入验证码", 2);
                    return;
                case 4:
                    comm.tip("验证码错误", 2);
                    return;
                case 0:
                    comm.tip("成功", 2);
                    setTimeout(function () {
                        location.href = "updateem.html";
                    }, 1500);
                    return;
            }
        });
    },


    //绑定新Email
    upemail: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var email = $("#email").val();
        var emai2 = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
        var code = $("#code").val();
        if (email.length == 0 || email == "") {
            comm.tip("请输入Email", 2);
            return;
        } else if (code.length == 0 || code == "") {
            comm.tip("请输入验证码", 2);
            return;
        } else if (!emai2.test(email)) {
            comm.tip("请输入正确邮箱", 2);
            return;
        }
        rq(sys.userapi, {
            action: "upemail",
            userkey: ukey,
            newemail: email,
            code: code
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请输入新的Email", 2);
                    return;
                case 4:
                    comm.tip("请输入验证码", 2);
                    return;
                case 5:
                    comm.tip("验证码错误", 2);
                    return;
                case 6:
                    comm.tip("此邮箱地址已经绑定其他用户", 2);
                    return;
                case 0:
                    comm.tip("成功", 2);
                    setTimeout(function () {
                        location.href = "setup.html";
                    }, 1500);
                    return;
            }
        });
    },


    //添加银行卡
    addbcard: function () {
        var uid = cache.get("uid");
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var btype = $("#btype").val(); //银行类型
        var bnumber = $("#bnumber").val(); //银行卡号
        var bnumber1 = /^([1-9]{1})(\d{15}|\d{18})$/;
        var btypeqq = /^[1-9]{5,11}$/;
        var rname = $("#rname").val(); //持卡人姓名
        var paypwd = $("#paypwd").val(); //验证码
        if (btype == 0) {
            comm.tip("请选择账号类型", 2);
            return;
        } else if (bnumber.length == 0 || bnumber == "") {
            if (btype == "1") {
                comm.tip("请输入支付宝账号", 2);
                return;
            }
            if (btype == "2") {
                comm.tip("请输入微信账号", 2);
                return;
            }
            if (btype == "3") {
                comm.tip("请输入QQ号", 2);
                return;
            }
            comm.tip("请输入银行卡号", 2);
            return;
        } else if (rname.length == 0 || rname == "") {
            if (btype == "1") {
                comm.tip("请输入支付宝姓名", 2);
                return;
            }
            if (btype == "2") {
                comm.tip("请输入微信姓名", 2);
                return;
            }
            if (btype == "3") {
                comm.tip("请输入QQ姓名", 2);
                return;
            }
            comm.tip("请输入持卡人姓名", 2);
            return;
        } else if (paypwd.length == 0 || paypwd == "") {
            comm.tip("请输入安全密码", 2);
            return;
        } else if (btype == "3") {
            if (!btypeqq.test(bnumber)) {
                comm.tip("请输入正确QQ号", 2);
                return;
            }
        }else if ((!btype.endsWith("1")) && (!btype.endsWith("2")) && (!btype.endsWith("10"))) {
            if (!bnumber1.test(bnumber)) {
                comm.tip("请输入正确的卡号", 2);
                return;
            }
        }
        rq(sys.userapi, {
            action: "addbcard",
            userkey: ukey,
            btype: btype,
            bnumber: bnumber,
            rname: rname,
            address: $("#address").val(),
            paypwd: md5(paypwd)
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请选择账号类型", 2);
                    return;
                case 4:
                    if (btype == "1") {
                        comm.tip("请输入支付宝账号", 2);
                        return;
                    }
                    if (btype == "2") {
                        comm.tip("请输入微信账号", 2);
                        return;
                    }
                    if (btype == "3") {
                        comm.tip("请输入QQ号", 2);
                        return;
                    }
                    comm.tip("请输入银行卡", 2);
                    return;
                case 5:
                    if (btype == "1") {
                        comm.tip("请输入支付宝姓名", 2);
                        return;
                    }
                    if (btype == "2") {
                        comm.tip("请输入微信姓名", 2);
                        return;
                    }
                    if (btype == "3") {
                        comm.tip("请输入QQ姓名", 2);
                        return;
                    }
                    comm.tip("请输入持卡人姓名", 2);
                    return;
                case 6:
                    comm.tip("安全密码错误", 2);
                    return;
                case 7:
                    if (btype == "3") {
                        comm.tip("QQ格式不正确", 2);
                    } else {
                        comm.tip("银行卡格式不正确", 2);
                    }
                    return;
                case 8:
                    comm.tip("此支付宝已绑定其他账号", 2);
                    return;
                case 9:
                    comm.tip("此微信已绑定其他账号", 2);
                    return;
                case 10:
                    comm.tip("此银行卡已绑定其他账号", 2);
                    return;
                case 0:
                    comm.tip("成功", 2);
                    cache.del("bankcardlist_" + uid);
                    cache.del("bankrechargelistid_" + uid);
                    setTimeout(function () {
                        location.href = "bankedit.html";
                    }, 1500);
                    return;
            }
        });
    },


    //获取银行卡列表
    /*
     *page=bankrecharge加载支付、提现页面,page=bankedit加载银行卡编辑页面
     *urlid=1提现url传银行卡ID，0不需要
     */
    getbcardlist: function (page, urlid) {
        var bankdiv = "";
        var strbank = "";
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            if (page == "bankedit") {
                location.href = "login.html";
                return;
            }
            if (page == "bankrecharge") {
                location.href = "../login.html";
                return;
            }
        }
        //获取支付类型
        var paytype = request.paytype; //comm.getUrlParam("paytype");
        var uid = cache.get("uid"); //获取UID
        //cache.del("bankcardlist_"+uid);  //清空银行卡列表缓存
        var bankcardlistuid = cache.get("bankcardlist_" + uid); //根据UID获取银行卡列表
        if (bankcardlistuid != null || bankcardlistuid == "" || bankcardlistuid == 0 || bankcardlistuid == "undefined") {
            var getbanktype = cache.get("getbanktype"); //加载银行类型
            if (page == "bankedit") { //page=bankedit加载银行卡编辑页面
                for (var i = 0; i < bankcardlistuid.length; i++) {
                    for (var j = 0; j < getbanktype.length; j++) {
                        if (getbanktype[j]["ID"] == bankcardlistuid[i]["BankType"]) {
                            bankdiv += "<div class=\"bo1\"  onclick=\"window.open('delbank.html?bankid=" + bankcardlistuid[i]["ID"] + "','_self')\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\">\n";
                            bankdiv += "            <div class=\"haed\">\n";
                            bankdiv += "                <div class=\"haer-bank-1\"><div class=\"haer-bank-y\"><div class=\"haer-bank-img\" style=\"background-image:url(" + getbanktype[j]["icon"] + ");\"><\/div><\/div><\/div>\n";
                            bankdiv += "                <div class=\"haer-bank-2\">\n";
                            bankdiv += "                    <div class=\"haer-bank-span1\">" + getbanktype[j]["BankTypeName"] + "<\/div>\n";
                            bankdiv += "                    <div class=\"haer-bank-span2\"><\/div>\n";
                            bankdiv += "                    <div class=\"haer-bank-span3\"><p class=\"haer-bank-p3\">" + bankcardlistuid[i]["CardNumber"] + "<\/p><\/div>\n";
                            bankdiv += "                <\/div>  \n";
                            bankdiv += "            <\/div>\n";
                            bankdiv += "        <\/div>\n";
                        }
                    }
                }
                $("#bankdiv").html(bankdiv);
                return;
            }
            if (page == "bankrecharge" && paytype != null) { //page=bankrecharge加载支付页面
                if (paytype == 1) { //paytype=1  加载银行卡
                    for (var i = 0; i < bankcardlistuid.length; i++) {
                        for (var j = 0; j < getbanktype.length; j++) {
                            if (getbanktype[j]["ID"] != 1 && getbanktype[j]["ID"] != 2) {
                                if (getbanktype[j]["ID"] == bankcardlistuid[i]["BankType"]) {
                                    if (urlid == 1) {
                                        bankdiv += "<div class=\"bo1\" onclick=\"window.open('../amoney.html?bankid=" + bankcardlistuid[i]["ID"] + "',\'_self')\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\">\n";
                                    }
                                    if (urlid == 0) {
                                        bankdiv += "<div class=\"bo1\" onClick='appevent.confimtransfer(" + bankcardlistuid[i]["ID"] + ")' style=\"background-color:" + getbanktype[j]["BgColor"] + ";\">\n";
                                    }
                                    bankdiv += "            <div class=\"haed\">\n";
                                    bankdiv += "                <div class=\"haer-bank-1\"><div class=\"haer-bank-y\"><div class=\"haer-bank-img\" style=\"background-image:url(" + getbanktype[j]["icon"] + ");\"><\/div><\/div><\/div>\n";
                                    bankdiv += "                <div class=\"haer-bank-2\">\n";
                                    bankdiv += "                    <div class=\"haer-bank-span1\">" + getbanktype[j]["BankTypeName"] + "<\/div>\n";
                                    bankdiv += "                    <div class=\"haer-bank-span2\"><\/div>\n";
                                    bankdiv += "                    <div class=\"haer-bank-span3\"><p class=\"haer-bank-p3\">" + bankcardlistuid[i]["CardNumber"] + "<\/p><\/div>\n";
                                    bankdiv += "                <\/div>  \n";
                                    bankdiv += "            <\/div>\n";
                                    bankdiv += "        <\/div>\n";
                                }
                            }
                        }
                    }
                    strbank += "<a href=\"../addbank.html?paytype=1\">\n";
                    strbank += "            <dl>\n";
                    strbank += "            	<em class=\"bgd-foot-icon foot-icon25\"><\/em>\n";
                    strbank += "                <dt>添加银行卡<\/dt>\n";
                    strbank += "                <dd class=\"bgd-foot-icon foot-icon15\"><\/dd>\n";
                    strbank += "            <\/dl>\n";
                    strbank += "        <\/a>\n";
                    $("#add-bank").html(strbank);
                    $("#bankdiv").html(bankdiv);
                    return;
                }

                if (paytype == 2) { //paytype=1  加载支付宝
                    for (var i = 0; i < bankcardlistuid.length; i++) {
                        for (var j = 0; j < getbanktype.length; j++) {
                            if (getbanktype[j]["ID"] == bankcardlistuid[i]["BankType"]) {
                                if (getbanktype[j]["ID"] == 1 && bankcardlistuid[i]["BankType"] == 1) {
                                    if (urlid == 1) {
                                        bankdiv += "<div class=\"bo1\" onclick=\"window.open('../amoney.html?bankid=" + bankcardlistuid[i]["ID"] + "',\'_self')\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\">\n";
                                    }
                                    if (urlid == 0) {
                                        bankdiv += "<div class=\"bo1\" onClick='appevent.confimtransfer(" + bankcardlistuid[i]["ID"] + ")' style=\"background-color:" + getbanktype[j]["BgColor"] + ";\">\n";
                                    }
                                    bankdiv += "            <div class=\"haed\">\n";
                                    bankdiv += "                <div class=\"haer-bank-1\"><div class=\"haer-bank-y\"><div class=\"haer-bank-img\" style=\"background-image:url(" + getbanktype[j]["icon"] + ");\"><\/div><\/div><\/div>\n";
                                    bankdiv += "                <div class=\"haer-bank-2\">\n";
                                    bankdiv += "                    <div class=\"haer-bank-span1\">" + getbanktype[j]["BankTypeName"] + "<\/div>\n";
                                    bankdiv += "                    <div class=\"haer-bank-span2\"><\/div>\n";
                                    bankdiv += "                    <div class=\"haer-bank-span3\"><p class=\"haer-bank-p3\">" + bankcardlistuid[i]["CardNumber"] + "<\/p><\/div>\n";
                                    bankdiv += "                <\/div>  \n";
                                    bankdiv += "            <\/div>\n";
                                    bankdiv += "        <\/div>\n";
                                }
                            }
                        }
                    }
                    strbank += "<a href=\"../addbank.html?paytype=2\">\n";
                    strbank += "            <dl>\n";
                    strbank += "            	<em class=\"bgd-foot-icon foot-icon25\"><\/em>\n";
                    strbank += "                <dt>添加支付宝<\/dt>\n";
                    strbank += "                <dd class=\"bgd-foot-icon foot-icon15\"><\/dd>\n";
                    strbank += "            <\/dl>\n";
                    strbank += "        <\/a>\n";
                    $("#add-bank").html(strbank);
                    $("#bankdiv").html(bankdiv);
                    return;
                }
                if (paytype == 3) { //paytype=1  加载微信
                    for (var i = 0; i < bankcardlistuid.length; i++) {
                        for (var j = 0; j < getbanktype.length; j++) {
                            if (getbanktype[j]["ID"] == bankcardlistuid[i]["BankType"]) {
                                if (getbanktype[j]["ID"] == 2 && bankcardlistuid[i]["BankType"] == 2) {
                                    if (urlid == 1) {
                                        bankdiv += "<div class=\"bo1\" onclick=\"window.open('../amoney.html?bankid=" + bankcardlistuid[i]["ID"] + "',\'_self')\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\">\n";
                                    }
                                    if (urlid == 0) {
                                        bankdiv += "<div class=\"bo1\" onClick='appevent.confimtransfer(" + bankcardlistuid[i]["ID"] + ")' style=\"background-color:" + getbanktype[j]["BgColor"] + ";\">\n";
                                    }
                                    bankdiv += "            <div class=\"haed\">\n";
                                    bankdiv += "                <div class=\"haer-bank-1\"><div class=\"haer-bank-y\"><div class=\"haer-bank-img\" style=\"background-image:url(" + getbanktype[j]["icon"] + ");\"><\/div><\/div><\/div>\n";
                                    bankdiv += "                <div class=\"haer-bank-2\">\n";
                                    bankdiv += "                    <div class=\"haer-bank-span1\">" + getbanktype[j]["BankTypeName"] + "<\/div>\n";
                                    bankdiv += "                    <div class=\"haer-bank-span2\"><\/div>\n";
                                    bankdiv += "                    <div class=\"haer-bank-span3\"><p class=\"haer-bank-p3\">" + bankcardlistuid[i]["CardNumber"] + "<\/p><\/div>\n";
                                    bankdiv += "                <\/div>  \n";
                                    bankdiv += "            <\/div>\n";
                                    bankdiv += "        <\/div>\n";
                                }
                            }
                        }
                    }
                    strbank += "<a href=\"../addbank.html?paytype=3\">\n";
                    strbank += "            <dl>\n";
                    strbank += "            	<em class=\"bgd-foot-icon foot-icon25\"><\/em>\n";
                    strbank += "                <dt>添加微信<\/dt>\n";
                    strbank += "                <dd class=\"bgd-foot-icon foot-icon15\"><\/dd>\n";
                    strbank += "            <\/dl>\n";
                    strbank += "        <\/a>\n";
                    $("#add-bank").html(strbank);
                    $("#bankdiv").html(bankdiv);
                    return;
                }

            }
        }

        //没有缓存请求服务器
        rq(sys.userapi, {
            action: "getbcardlist",
            userkey: ukey
        }, function (cb) {
            switch (cb.code) {
                case 2:
                    comm.tip("登录超时", 2);
                    if (page == "bankedit") {
                        location.href = "login.html";
                        return;
                    }
                    if (page == "bankrecharge") {
                        location.href = "../login.html";
                        return;
                    }
                    return;
                case 0:
                    if (cb.data == null) {
                        return;
                    }
                    cache.set("bankcardlist_" + uid, cb.data, 86400); //保存银行卡列表数据
                    var getbanktype = cache.get("getbanktype"); //读取银行卡类型
                    if (page == "bankedit") { //page=bankedit加载银行卡编辑页面
                        for (var i = 0; i < cb.data.length; i++) {
                            for (var j = 0; j < getbanktype.length; j++) {
                                if (getbanktype[j]["ID"] == cb.data[i]["BankType"]) {
                                    bankdiv += "<div class=\"bo1\" onclick=\"window.open('delbank.html?bankid=" + cb.data[i]["ID"] + "','_self')\"  style=\"background-color:" + getbanktype[j]["BgColor"] + ";\">\n";
                                    bankdiv += "            <div class=\"haed\">\n";
                                    bankdiv += "                <div class=\"haer-bank-1\"><div class=\"haer-bank-y\"><div class=\"haer-bank-img\" style=\"background-image:url(" + getbanktype[j]["icon"] + ");\"><\/div><\/div><\/div>\n";
                                    bankdiv += "                <div class=\"haer-bank-2\">\n";
                                    bankdiv += "                    <div class=\"haer-bank-span1\">" + getbanktype[j]["BankTypeName"] + "<\/div>\n";
                                    bankdiv += "                    <div class=\"haer-bank-span2\"><\/div>\n";
                                    bankdiv += "                    <div class=\"haer-bank-span3\"><p class=\"haer-bank-p3\">" + cb.data[i]["CardNumber"] + "<\/p><\/div>\n";
                                    bankdiv += "                <\/div>  \n";
                                    bankdiv += "            <\/div>\n";
                                    bankdiv += "        <\/div>\n";
                                }
                            }
                        }
                        $("#bankdiv").html(bankdiv);
                        return;
                    }

                    if (page == "bankrecharge" && paytype != null) { //page=bankedit加载支付页面
                        if (paytype == 1) { //paytype=1  加载银行卡
                            for (var i = 0; i < cb.data.length; i++) {
                                for (var j = 0; j < getbanktype.length; j++) {
                                    if (getbanktype[j]["ID"] != 1 && getbanktype[j]["ID"] != 2) {
                                        if (getbanktype[j]["ID"] == cb.data[i]["BankType"]) {
                                            if (urlid == 1) {
                                                bankdiv += "<div class=\"bo1\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\" onclick=\"window.open('../amoney.html?bankid=" + cb.data[i]["ID"] + "',\'_self')\">\n";
                                            }
                                            if (urlid == 0) {
                                                bankdiv += "<div class=\"bo1\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\" onClick='appevent.confimtransfer(" + cb.data[i]["ID"] + ")'>\n";
                                            }
                                            bankdiv += "            <div class=\"haed\">\n";
                                            bankdiv += "                <div class=\"haer-bank-1\"><div class=\"haer-bank-y\"><div class=\"haer-bank-img\" style=\"background-image:url(" + getbanktype[j]["icon"] + ");\"><\/div><\/div><\/div>\n";
                                            bankdiv += "                <div class=\"haer-bank-2\">\n";
                                            bankdiv += "                    <div class=\"haer-bank-span1\">" + getbanktype[j]["BankTypeName"] + "<\/div>\n";
                                            bankdiv += "                    <div class=\"haer-bank-span2\"><\/div>\n";
                                            bankdiv += "                    <div class=\"haer-bank-span3\"><p class=\"haer-bank-p3\">" + cb.data[i]["CardNumber"] + "<\/p><\/div>\n";
                                            bankdiv += "                <\/div>  \n";
                                            bankdiv += "            <\/div>\n";
                                            bankdiv += "        <\/div>\n";
                                        }
                                    }
                                }
                            }

                            strbank += "<a href=\"../addbank.html?paytype=1\">\n";
                            strbank += "            <dl>\n";
                            strbank += "            	<em class=\"bgd-foot-icon foot-icon25\"><\/em>\n";
                            strbank += "                <dt>添加银行卡<\/dt>\n";
                            strbank += "                <dd class=\"bgd-foot-icon foot-icon15\"><\/dd>\n";
                            strbank += "            <\/dl>\n";
                            strbank += "        <\/a>\n";
                            $("#add-bank").html(strbank);
                            $("#bankdiv").html(bankdiv);
                            return;
                        }
                        if (paytype == 2) { //paytype=1  加载支付宝
                            for (var i = 0; i < cb.data.length; i++) {
                                for (var j = 0; j < getbanktype.length; j++) {
                                    if (getbanktype[j]["ID"] == cb.data[i]["BankType"]) {
                                        if (getbanktype[j]["ID"] == 1 && cb.data[i]["BankType"] == 1) {
                                            if (urlid == 1) {
                                                bankdiv += "<div class=\"bo1\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\" onclick=\"window.open('../amoney.html?bankid=" + cb.data[i]["ID"] + "',\'_self')\">\n";
                                            }
                                            if (urlid == 0) {
                                                bankdiv += "<div class=\"bo1\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\" onClick='appevent.confimtransfer(" + cb.data[i]["ID"] + ")'>\n";
                                            }
                                            bankdiv += "            <div class=\"haed\">\n";
                                            bankdiv += "                <div class=\"haer-bank-1\"><div class=\"haer-bank-y\"><div class=\"haer-bank-img\" style=\"background-image:url(" + getbanktype[j]["icon"] + ");\"><\/div><\/div><\/div>\n";
                                            bankdiv += "                <div class=\"haer-bank-2\">\n";
                                            bankdiv += "                    <div class=\"haer-bank-span1\">" + getbanktype[j]["BankTypeName"] + "<\/div>\n";
                                            bankdiv += "                    <div class=\"haer-bank-span2\"><\/div>\n";
                                            bankdiv += "                    <div class=\"haer-bank-span3\"><p class=\"haer-bank-p3\">" + cb.data[i]["CardNumber"] + "<\/p><\/div>\n";
                                            bankdiv += "                <\/div>  \n";
                                            bankdiv += "            <\/div>\n";
                                            bankdiv += "        <\/div>\n";
                                        }
                                    }
                                }
                            }
                            strbank += "<a href=\"../addbank.html?paytype=2\">\n";
                            strbank += "            <dl>\n";
                            strbank += "            	<em class=\"bgd-foot-icon foot-icon25\"><\/em>\n";
                            strbank += "                <dt>添加支付宝<\/dt>\n";
                            strbank += "                <dd class=\"bgd-foot-icon foot-icon15\"><\/dd>\n";
                            strbank += "            <\/dl>\n";
                            strbank += "        <\/a>\n";
                            $("#add-bank").html(strbank);
                            $("#bankdiv").html(bankdiv);
                            return;
                        }
                        if (paytype == 3) { //paytype=1  加载微信
                            for (var i = 0; i < cb.data.length; i++) {
                                for (var j = 0; j < getbanktype.length; j++) {
                                    if (getbanktype[j]["ID"] == cb.data[i]["BankType"]) {
                                        if (getbanktype[j]["ID"] == 2 && cb.data[i]["BankType"] == 2) {
                                            if (urlid == 1) {
                                                bankdiv += "<div class=\"bo1\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\" onclick=\"window.open('../amoney.html?bankid=" + cb.data[i]["ID"] + "',\'_self')\">\n";
                                            }
                                            if (urlid == 0) {
                                                bankdiv += "<div class=\"bo1\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\" onClick='appevent.confimtransfer(" + cb.data[i]["ID"] + ")'>\n";
                                            }
                                            bankdiv += "            <div class=\"haed\">\n";
                                            bankdiv += "                <div class=\"haer-bank-1\"><div class=\"haer-bank-y\"><div class=\"haer-bank-img\" style=\"background-image:url(" + getbanktype[j]["icon"] + ");\"><\/div><\/div><\/div>\n";
                                            bankdiv += "                <div class=\"haer-bank-2\">\n";
                                            bankdiv += "                    <div class=\"haer-bank-span1\">" + getbanktype[j]["BankTypeName"] + "<\/div>\n";
                                            bankdiv += "                    <div class=\"haer-bank-span2\"><\/div>\n";
                                            bankdiv += "                    <div class=\"haer-bank-span3\"><p class=\"haer-bank-p3\">" + cb.data[i]["CardNumber"] + "<\/p><\/div>\n";
                                            bankdiv += "                <\/div>  \n";
                                            bankdiv += "            <\/div>\n";
                                            bankdiv += "        <\/div>\n";
                                        }
                                    }
                                }
                            }
                            strbank += "<a href=\"../addbank.html?paytype=3\">\n";
                            strbank += "            <dl>\n";
                            strbank += "            	<em class=\"bgd-foot-icon foot-icon25\"><\/em>\n";
                            strbank += "                <dt>添加微信<\/dt>\n";
                            strbank += "                <dd class=\"bgd-foot-icon foot-icon15\"><\/dd>\n";
                            strbank += "            <\/dl>\n";
                            strbank += "        <\/a>\n";
                            $("#add-bank").html(strbank);
                            $("#bankdiv").html(bankdiv);
                            return;
                        }

                    } else {
                        location.href = "../recharge.html";
                    }

            }
        });
    },

    //加载提现银行列表
    bankrechargelist: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var uid = cache.get("uid"); //获取UID
        var bankrechargelistid = cache.get("bankrechargelistid_" + uid); //根据UID获取银行卡列表
        if (bankrechargelistid != null || bankrechargelistid == "" || bankrechargelistid == 0 || bankrechargelistid == "undefined") {
            var getbanktype = cache.get("getbanktype"); //加载银行类型
            var sele = "<option value=\"0\">选择绑定的账号<\/option>\n";
            for (var i = 0; i < bankrechargelistid.length; i++) {
                for (var j = 0; j < getbanktype.length; j++) {
                    if (getbanktype[j]["ID"] == bankrechargelistid[i]["BankType"]) {
                        sele += "<option value=\"" + bankrechargelistid[i]["ID"] + "\">" + getbanktype[j]["BankTypeName"] + bankrechargelistid[i]["CardNumber"] + "<\/option>\n";
                    }
                }
            }
            $("#batype").html(sele);
            return;
        }
        rq(sys.userapi, {
            action: "getbcardlist",
            userkey: ukey
        }, function (cb) {
            switch (cb.code) {
                case 2:
                    comm.tip("登录超时", 2);
                    location.href = "login.html";
                    return;
                case 3:
                    comm.tip("请先绑定提现账号", 2);
                    setTimeout(function () {
                        location.href = "addbank.html";
                    }, 1500);
                    return;
                case 0:
                    if (cb.data == null || cb.data == "undefined") {
                        comm.tip("请先绑定提现账号", 2);
                        setTimeout(function () {
                            location.href = "addbank.html";
                        }, 1500);
                        return;
                    }
                    cache.set("bankrechargelistid_" + uid, cb.data, 86400); //保存银行卡列表数据
                    var getbanktype = cache.get("getbanktype"); //读取银行卡类型
                    var sele = "<option value=\"0\">选择绑定的账号<\/option>\n";
                    for (var i = 0; i < cb.data.length; i++) {
                        for (var j = 0; j < getbanktype.length; j++) {
                            if (getbanktype[j]["ID"] == cb.data[i]["BankType"]) {
                                sele += "<option value=\"" + cb.data[i]["ID"] + "\">" + getbanktype[j]["BankTypeName"] + cb.data[i]["CardNumber"] + "<\/option>\n";
                            }
                        }
                    }
                    $("#batype").html(sele);

                    return;
            }
        });
    },

    //关于我们
    getaboutusinfo: function () {
        rq(sys.dataapi, {
            action: "getaboutusinfo"
        }, function (cb) {
            var rqimg = "";
            var strVar = "";
            for (ea in cb.data) {
                if (cb.data[ea]["TKey"] == "RqImage") {
                    rqimg = cb.data[ea]["TValue"]
                }
                if (cb.data[ea]["TKey"] == "CustomerText") {
                    strVar += "<dl>\n";
                    strVar += "                    <!--<em class=\"bgd-foot-icon foot-icon23\"><\/em>-->\n";
                    strVar += "                    <dt class=\"abutus-no1\">" + cb.data[ea]["TKeyText"] + "<\/dt>\n";
                    strVar += "                    <dt class=\"abutus-no2\" style=\"color:#9a9a9a;\">" + cb.data[ea]["TValue"] + "<\/dt>\n";
                    strVar += "                    <dd class=\"abutus-no3\"style=\"color:#9a9a9a;\"><a href=\"javascript:\" class=\"abutus-copy kf" + ea + "\" data-clipboard-action=\"copy\" data-clipboard-text=\"" + cb.data[ea]["TValue"] + "\"onClick=\"run('page.appevent.copybcard','kf" + ea + "')\">点击复制<\/a><\/dd>\n";
                    strVar += "                <\/dl>\n";
                }
                if (cb.data[ea]["TKey"] == "Domain") {
                    strVar += "<dl>\n";
                    strVar += "                    <!--<em class=\"bgd-foot-icon foot-icon23\"><\/em>-->\n";
                    strVar += "                    <dt class=\"abutus-no1\">" + cb.data[ea]["TKeyText"] + "<\/dt>\n";
                    strVar += "                    <dt class=\"abutus-no2\" style=\"color:#9a9a9a;\">" + cb.data[ea]["TValue"] + "<\/dt>\n";
                    strVar += "                    <dd class=\"abutus-no3\"style=\"color:#9a9a9a;\"><a href=\"javascript:\" class=\"abutus-copy kf" + ea + "\" data-clipboard-action=\"copy\" data-clipboard-text=\"" + cb.data[ea]["TValue"] + "\"onClick=\"run('page.appevent.copybcard','kf" + ea + "')\">点击复制<\/a><\/dd>\n";
                    strVar += "                <\/dl>\n";
                }
            }
            if (rqimg == "") {
                $("#openalipay").hide();
                $("#aboutustab").html(strVar);
            } else {
                $("#openalipay").show();
                $("#aboutusimg").attr("src", rqimg);
                $("#aboutustab").html(strVar);
            }
        });
    },

    //获取商户账号信息
    getbusinesscard: function () {
        //获取支付类型
        var paytype = request.paytype;
        var BusinessBankCardTitle = cache.get("BusinessBankCardTitle"); //商户收款标题
        var BusinessBankCardMemo = cache.get("BusinessBankCardMemo"); // 商家收款备注   转账前请备注账号ID，如有问题请联系客服
        var getbanktype = cache.get("getbanktype"); //读取银行卡类型
        var businesscard_cache = cache.get("businesscard_cache");

        var isLoad = true;
        var strVar = "";
        if (businesscard_cache != null && businesscard_cache != "undefined") {
            isLoad = false;
            for (var i = 0; i < businesscard_cache.length; i++) {
                for (var j = 0; j < getbanktype.length; j++) {
                    if (getbanktype[j]["ID"] == businesscard_cache[i]["BankType"]) {
                        if (paytype == businesscard_cache[i]["PaymentType"]) {
                            if (businesscard_cache[i]["isBankCard"] == 0) {
                                strVar += "<div class=\"payxz-back\">\n";
                                strVar += "<div class=\"payxz\">\n";
                                strVar += "                	<div class=\"payxz-title\">" + BusinessBankCardTitle + "<\/div>\n";
                                strVar += "                	<div class=\"payxz-msg\"><span class=\"payxz-span\">类型：<\/span><span class=\"payxz-span-name\">" + getbanktype[j]["BankTypeName"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">姓名：<\/span><span class=\"payxz-span-name\">" + businesscard_cache[i]["RealName"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909; color:#ffffff;border-radius:0.1rem;margin-top:-0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn xm" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','xm" + i + "')\"  data-clipboard-text=\"" + businesscard_cache[i]["RealName"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">账号：<\/span><span class=\"payxz-span-name\">" + businesscard_cache[i]["CardNumber"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909; color:#ffffff;border-radius:0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn kh" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','kh" + i + "')\"  data-clipboard-text=\"" + businesscard_cache[i]["CardNumber"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "<div class=\"payxz-msg\" style=\" width:97%;color:#ffffff;height:100%;\">" + BusinessBankCardMemo + "<\/div>\n";
                                strVar += "                <\/div>\n";
                                strVar += "                <\/div>\n";
                            } else if (businesscard_cache[i]["isBankCard"] == 1) {
                                strVar += "<div class=\"payxz-back\">\n";
                                strVar += "<div class=\"payxz\">\n";
                                strVar += "                	<div class=\"payxz-title\">" + BusinessBankCardTitle + "<\/div>\n";
                                strVar += "                	<div class=\"payxz-msg\"><span class=\"payxz-span\">银行：<\/span><span class=\"payxz-span-name\">" + getbanktype[j]["BankTypeName"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">收款人：<\/span><span class=\"payxz-span-name\">" + businesscard_cache[i]["RealName"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909;color:#ffffff;border-radius:0.1rem;margin-top:-0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn xm" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','xm" + i + "')\"  data-clipboard-text=\"" + businesscard_cache[i]["RealName"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">卡号：<\/span><span class=\"payxz-span-name\">" + businesscard_cache[i]["CardNumber"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909;color:#ffffff;border-radius:0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn kh" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','kh" + i + "')\"  data-clipboard-text=\"" + businesscard_cache[i]["CardNumber"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">开户行：<\/span><span class=\"payxz-span-name\">" + businesscard_cache[i]["Address"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909;color:#ffffff;border-radius:0.1rem;margin-top:0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn yh" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','yh" + i + "')\"  data-clipboard-text=\"" + getbanktype[j]["BankTypeName"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "<div class=\"payxz-msg\" style=\" width:97%;color:#ffffff;height:100%;\">" + BusinessBankCardMemo + "<\/div>\n";
                                strVar += "                <\/div>\n";
                                strVar += "                <\/div>\n";
                            }
                        }
                    }
                }
            }
            $("#payxz").html(strVar);
        }

        rq(sys.dataapi, {
            action: "getbusinesscard"
        }, function (cb) {
            if (cb.data == "" || cb.data == null || cb.data == "undefined") {
                return;
            }
            cache.set("businesscard_cache", cb.data, 3600);
            if (!isLoad) return;
            strVar = "";
            for (var i = 0; i < cb.data.length; i++) {
                for (var j = 0; j < getbanktype.length; j++) {
                    if (getbanktype[j]["ID"] == cb.data[i]["BankType"]) {
                        if (paytype == cb.data[i]["PaymentType"]) {
                            if (cb.data[i]["isBankCard"] == 0) {
                                strVar += "<div class=\"payxz-back\">\n";
                                strVar += "<div class=\"payxz\">\n";
                                strVar += "                	<div class=\"payxz-title\">" + BusinessBankCardTitle + "<\/div>\n";
                                strVar += "                	<div class=\"payxz-msg\"><span class=\"payxz-span\">类型：<\/span><span class=\"payxz-span-name\">" + getbanktype[j]["BankTypeName"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">姓名：<\/span><span class=\"payxz-span-name\">" + cb.data[i]["RealName"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909; color:#ffffff;border-radius:0.1rem;margin-top:-0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn xm" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','xm" + i + "')\"  data-clipboard-text=\"" + cb.data[i]["RealName"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">账号：<\/span><span class=\"payxz-span-name\">" + cb.data[i]["CardNumber"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909; color:#ffffff;border-radius:0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn kh" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','kh" + i + "')\"  data-clipboard-text=\"" + cb.data[i]["CardNumber"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "<div class=\"payxz-msg\" style=\" width:97%;color:#ffffff;height:100%;\">" + BusinessBankCardMemo + "<\/div>\n";
                                strVar += "                <\/div>\n";
                                strVar += "                <\/div>\n";
                            } else if (cb.data[i]["isBankCard"] == 1) {
                                strVar += "<div class=\"payxz-back\">\n";
                                strVar += "<div class=\"payxz\">\n";
                                strVar += "                	<div class=\"payxz-title\">" + BusinessBankCardTitle + "<\/div>\n";
                                strVar += "                	<div class=\"payxz-msg\"><span class=\"payxz-span\">银行：<\/span><span class=\"payxz-span-name\">" + getbanktype[j]["BankTypeName"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">收款人：<\/span><span class=\"payxz-span-name\">" + cb.data[i]["RealName"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909;color:#ffffff;border-radius:0.1rem;margin-top:-0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn xm" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','xm" + i + "')\"  data-clipboard-text=\"" + cb.data[i]["RealName"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">卡号：<\/span><span class=\"payxz-span-name\">" + cb.data[i]["CardNumber"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909;color:#ffffff;border-radius:0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn kh" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','kh" + i + "')\"  data-clipboard-text=\"" + cb.data[i]["CardNumber"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "                    <div class=\"payxz-msg\"><span class=\"payxz-span\">开户行：<\/span><span class=\"payxz-span-name\">" + cb.data[i]["Address"] + "<\/span><\/div>\n";
                                strVar += "                    <div class=\"payxz-copy\"><a href=\"javascript:\" style=\"width:1.4rem;height:0.4rem;line-height:0.4rem;background-color:#efa909;color:#ffffff;border-radius:0.1rem;margin-top:0.1rem;\" class=\"weui_btn weui_btn weui_btn_mini weui_btn_primary btn yh" + i + "\"  data-clipboard-action=\"copy\" onClick=\"run('page.appevent.copybcard','yh" + i + "')\"  data-clipboard-text=\"" + getbanktype[j]["BankTypeName"] + "\">点击复制<\/a><\/div>\n";
                                strVar += "<div class=\"payxz-msg\" style=\" width:97%;color:#ffffff;height:100%;\">" + BusinessBankCardMemo + "<\/div>\n";
                                strVar += "                <\/div>\n";
                                strVar += "                <\/div>\n";
                            }
                        }
                    }
                }
            }
            $("#payxz").html(strVar);
        });
    },
    //复制卡号和姓名
    copybcard: function (id) {
        var clipboard = new ClipboardJS('.' + id);
        comm.tip("复制成功", 2);
    },

    //获取银行卡列表根据ID查询
    getbcardid: function () {
        var uid = cache.get("uid"); //获取UID
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        //获取银行卡ID
        var bankid = request.bankid; //comm.getUrlParam("bankid");
        if (bankid == "" || bankid == 0 || bankid == "undefined" || bankid == null) {
            location.href = "bankedit.html";
            return;
        }
        var getbanktype = cache.get("getbanktype"); //加载银行卡类型
        var bankcardlist = cache.get("bankcardlist_" + uid); //加载银行卡列表
        var bankdiv = "";
        for (var i = 0; i < bankcardlist.length; i++) {
            if (bankcardlist[i]["ID"] == bankid) {
                for (var j = 0; j < getbanktype.length; j++) {
                    if (getbanktype[j]["ID"] == bankcardlist[i]["BankType"]) {
                        bankdiv += "<div class=\"bo1\" style=\"background-color:" + getbanktype[j]["BgColor"] + ";\">\n";
                        bankdiv += "        <div class=\"haed\">\n";
                        bankdiv += "        	<div class=\"haer-bank-1\"><div class=\"haer-bank-y\"><div class=\"haer-bank-img\" style=\"background-image:url(" + getbanktype[j]["icon"] + ");\"><\/div><\/div><\/div>\n";
                        bankdiv += "           	<div class=\"haer-bank-2\">\n";
                        bankdiv += "            	<div class=\"haer-bank-span1\">" + getbanktype[j]["BankTypeName"] + "<\/div>\n";
                        bankdiv += "                <div class=\"haer-bank-span2\"><\/div>\n";
                        bankdiv += "                <div class=\"haer-bank-span3\"><p class=\"haer-bank-p3\">" + bankcardlist[i]["CardNumber"] + "<\/p><\/div>\n";
                        bankdiv += "            <\/div>  \n";
                        bankdiv += "        <\/div>\n";
                        bankdiv += "    <\/div>\n";
                        $("#bankdiv").html(bankdiv);
                        break;
                    }
                }
            }
        }
    },

    //删除银行卡
    delbcard: function () {
        var uid = cache.get("uid"); //获取UID
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        //获取银行卡ID
        var bankid = request.bankid; //comm.getUrlParam("bankid");
        if (bankid == "" || bankid == 0 || bankid == "undefined" || bankid == null) {
            location.href = "bankedit.html";
            return;
        }
        var paypwd = $("#paypwd").val(); //验证码
        if (paypwd.length == 0 || paypwd == "") {
            comm.tip("请输入安全密码", 2);
            return;
        }
        rq(sys.userapi, {
            action: "delbcard",
            userkey: ukey,
            id: bankid,
            paypwd: md5(paypwd)
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请选择需要删除的银行卡", 2);
                    return;
                case 4:
                    comm.tip("请输入安全密码", 2);
                    return;
                case 5:
                    comm.tip("安全密码错误", 2);
                    return;
                case 6:
                    comm.tip("不能删除银行卡", 2);
                    return;
                case 0:
                    comm.tip("成功", 2);
                    cache.del("bankcardlist_" + uid);
                    cache.del("bankrechargelistid_" + uid);
                    location.href = "bankedit.html";
                    return;
            }
        });
    },

    /******我的回水*****/
    getrewardlog: function (cpage, psize, _cb) {
        if (cpage == 0) cpage = 1; //这个插件是比较坑的，下来的时候必须设置为0，初始化是调用上拉，所以检查到0必须设置回1
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "getrewardlog",
            userkey: ukey,
            cpage: cpage,
            psize: psize
        }, function (cb) {
            var strVar = "";
            if (cpage == 1 && cb.data == null) {
                strVar += "<div class=\"top-null\">暂无记录<\/div>\n";
                $("#comtentmmrtop").html(strVar);
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            if (cb.data == null) {
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            for (ea in cb.data) {
                strVar += "<div class=\"comtentmmr\">\n";
                strVar += "                        <div class=\"cap-list1\">" + comm.formatDate(cb.data[ea]["AddTime"], 2) + "<\/div>\n";
                strVar += "                        <div class=\"cap-list2\">" + cb.data[ea]["PlayModeRoomTypeName"] + "<\/div>\n";
                if (cb.data[ea]["Status"] == 2) {
                    strVar += "<div class=\"cap-list2\" style=\"color:#e21717;\">+" + cb.data[ea]["Amount"] + "<\/div>\n";
                } else {
                    strVar += "                        <div class=\"cap-list2\" style=\"color:#65cb08;\">" + cb.data[ea]["Amount"] + "<\/div>\n";
                }
                strVar += "                        <div class=\"cap-list2\">" + comm.Usergetrewardlog_Text(cb.data[ea]["Status"]) + "<\/div>\n";
                strVar += "                    <\/div>\n";
            }
            if (cpage == 1) {
                $("#comtentmmrtop").html(strVar);
            } else {
                var html = $("#comtentmmrtop").html();
                $("#comtentmmrtop").html(html + strVar);
            }
            if (typeof _cb == "function") _cb(cb.data);
        });
    },

    /*****账变记录******/
    getusercashlog: function (cpage, psize, _cb) {
        if (cpage == 0) cpage = 1; //这个插件是比较坑的，下来的时候必须设置为0，初始化是调用上拉，所以检查到0必须设置回1
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "getusercashlog",
            userkey: ukey,
            cpage: cpage,
            psize: psize
        }, function (cb) {
            var strVar = "";
            if (cpage == 1 && cb.data == null) {
                strVar += "<div class=\"top-null\">暂无记录<\/div>\n";
                $("#comtentmmrtop").html(strVar);
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            if (cb.data == null) {
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            for (ea in cb.data) {
                strVar += "<div class=\"comtentmmr\">\n";
                strVar += "                    <div class=\"m1-cont\">" + comm.formatDate(cb.data[ea]["AddTime"], 2) + "<\/div>\n";
                if (cb.data[ea]["TypeId"] == 1 || cb.data[ea]["TypeId"] == 4 || cb.data[ea]["TypeId"] == 6 || cb.data[ea]["TypeId"] == 7 || cb.data[ea]["TypeId"] == 8
                    || cb.data[ea]["TypeId"] == 9 || cb.data[ea]["TypeId"] == 10 || cb.data[ea]["TypeId"] == 12 || cb.data[ea]["TypeId"] == 13 || cb.data[ea]["TypeId"] == 15) {
                    strVar += "                    <div class=\"m2-cont\" style=\"color:#e21717;\">+" + cb.data[ea]["Money"] + "<\/div>\n";
                } else {
                    strVar += "                    <div class=\"m2-cont\" style=\"color:#65cb08;\">-" + cb.data[ea]["Money"] + "<\/div>\n";
                }
                strVar += "                    <div class=\"m3-cont\">" + comm.Usercashlog_Text(cb.data[ea]["TypeId"]) + "<\/div>\n";
                strVar += "                <\/div>\n";
            }
            if (cpage == 1) {
                $("#comtentmmrtop").html(strVar);
            } else {
                var html = $("#comtentmmrtop").html();
                $("#comtentmmrtop").html(html + strVar);
            }
            if (typeof _cb == "function") _cb(cb.data);
        });
    },

    /*******获取充值记录*******/
    getpaymentlog: function (cpage, psize, _cb) {
        if (cpage == 0) cpage = 1; //这个插件是比较坑的，下来的时候必须设置为0，初始化是调用上拉，所以检查到0必须设置回1
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "getpaymentlog",
            userkey: ukey,
            cpage: cpage,
            psize: psize
        }, function (cb) {
            var strVar = "";
            if (cpage == 1 && cb.data == null) {
                strVar += "<div class=\"top-null\">暂无记录<\/div>\n";
                $("#comtentmmrtop").html(strVar);
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            if (cb.data == null) {
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            var paymenttype = cache.get("paymenttype");
            for (ea in cb.data) {
                strVar += "<div class=\"comtentmmr\">\n";
                strVar += "                        <div class=\"cap-list1\">" + comm.formatDate(cb.data[ea]["AddTime"], 2) + "<\/div>\n";
                if (cb.data[ea]["Status"] == 3 || cb.data[ea]["Status"] == 2) {
                    strVar += "<div class=\"cap-list2\" style=\"color:#e21717;\">+" + cb.data[ea]["Amount"] + "<\/div>\n";
                } else {
                    strVar += "                        <div class=\"cap-list2\" style=\"color:#65cb08;\">" + cb.data[ea]["Amount"] + "<\/div>\n";
                }
                for (var i = 0; i < paymenttype.length; i++) {
                    if (paymenttype[i]["ID"] == cb.data[ea]["PayType"]) {
                        strVar += "                        <div class=\"cap-list2\">" + paymenttype[i]["PNameAB"] + "<\/div>\n";
                    }
                }
                strVar += "                        <div class=\"cap-list2\">" + comm.Userpaymentlog_Text(cb.data[ea]["Status"]) + "<\/div>\n";
                strVar += "                    <\/div>\n";
            }
            if (cpage == 1) {
                $("#comtentmmrtop").html(strVar);
            } else {
                var html = $("#comtentmmrtop").html();
                $("#comtentmmrtop").html(html + strVar);
            }
            if (typeof _cb == "function") _cb(cb.data);
        })
    },

    /******获取提现记录******/
    getcarrycash: function (cpage, psize, _cb) {
        if (cpage == 0) cpage = 1; //这个插件是比较坑的，下来的时候必须设置为0，初始化是调用上拉，所以检查到0必须设置回1
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "getcarrycash",
            userkey: ukey,
            cpage: cpage,
            psize: psize
        }, function (cb) {
            var strVar = "";
            if (cpage == 1 && cb.data == null) {
                strVar += "<div class=\"top-null\">暂无记录<\/div>\n";
                $("#comtentmmrtop").html(strVar);
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            if (cb.data == null) {
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            for (ea in cb.data) {
                strVar += "<div class=\"comtentmmr\">\n";
                strVar += "                        <div class=\"cap-list1\">" + comm.formatDate(cb.data[ea]["AddTime"], 2) + "<\/div>\n";
                if (cb.data[ea]["Status"] == 2) {
                    strVar += "<div class=\"cap-list2\" style=\"color:#65cb08;\">-" + cb.data[ea]["Amount"] + "<\/div>\n";
                } else {
                    strVar += "                        <div class=\"cap-list2\" style=\"color:#e21717;\">" + cb.data[ea]["Amount"] + "<\/div>\n";
                }
                strVar += "                        <div class=\"cap-list2\">" + cb.data[ea]["Fees"] + "<\/div>\n";
                strVar += "                        <div class=\"cap-list2\">" + comm.Usercarrycash_Text(cb.data[ea]["Status"]) + "<\/div>\n";
                strVar += "                    <\/div>\n";
            }
            if (cpage == 1) {
                $("#comtentmmrtop").html(strVar);
            } else {
                var html = $("#comtentmmrtop").html();
                $("#comtentmmrtop").html(html + strVar);
            }
            if (typeof _cb == "function") _cb(cb.data);
        });
    },

    //获取支付链接接口
    getpayurl: function (payid) {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.geturlapi, {
            userkey: ukey,
            paytypeid: payid
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请选择支付方式", 2);
                    return;
                case 1004:
                    comm.tip("请勿重复提交数据", 2);
                    setTimeout(function () {
                        location.href = "../finance.html";
                    }, 2000);
                    return;
                case 1005:
                    comm.tip("提交数据过多请10分钟后再提交", 2);
                    setTimeout(function () {
                        location.href = "../finance.html";
                    }, 2000);
                    return;
                case 0:
                    location.href = cb.data;
                    return;
            }
        });
    },

    //获取支付类型
    //paymenttype 保存支付类型7天
    getpaymenttype: function (paytype, _cb) {
        var paytypeline = '';
        var paytypeonlie = '';
        rq(sys.dataapi, {
            action: "getlist",
            t: "PaymentType"
        }, function (cb) {
            cache.set("paymenttype", cb.data, 86400 * 7); //保存支付类型7天
            for (var i = 0; i < cb.data.length; i++) {
                if (cb.data[i]["isOnline"] == 1) //isOnline = 1  加载线上支付类型
                {
                    if (paytype == 0) {
                        $("#online").show();
                        paytypeonlie += "<a payid=" + cb.data[i]["ID"] + " href=\"javascript:\" onClick='appevent.getpayurl(" + cb.data[i]["ID"] + ")'>\n";
                        paytypeonlie += "                    <dl>\n";
                        paytypeonlie += "                    <em class=\"pay-recharge-icon\"><img src=\"" + cb.data[i]["Icon"] + "\" /><\/em>\n";
                        paytypeonlie += "                        <dt>" + cb.data[i]["PaymentTypeName"] + "（" + cb.data[i]["DES"] + "）<\/dt>\n";
                        paytypeonlie += "                        <dd class=\"bgd-foot-icon foot-icon15\"><\/dd>\n";
                        paytypeonlie += "                    <\/dl>\n";
                        paytypeonlie += "                <\/a>\n";
                    }
                }
                if (cb.data[i]["isOnline"] == 0) //isOnline = 0  加载线下支付类型
                {
                    if (cb.data[i]["Status"] == 1) {
                        $("#line").show();
                        if (paytype == 0) {
                            paytypeline += "<a payid=" + cb.data[i]["ID"] + " href=\"javascript:\" onClick='appevent.getpayurl(" + cb.data[i]["ID"] + ")'>\n";
                        }
                        if (paytype == 1) {
                            paytypeline += "<a payid=" + cb.data[i]["ID"] + " href=\"javascript:\" onclick=\"window.open('pay/carry.html?paytype=" + cb.data[i]["ID"] + "',\'_self')\">\n";
                        }
                        paytypeline += "                    <dl>\n";
                        paytypeline += "                    <em class=\"pay-recharge-icon\"><img src=\"" + cb.data[i]["Icon"] + "\" /><\/em>\n";
                        var str = cb.data[i]["PaymentTypeName"].toString();
                        str = str.replace("线下", "").replace("转账", "提现");
                        if (paytype == 0) {
                            paytypeline += "                        <dt>" + cb.data[i]["PaymentTypeName"] + "（" + cb.data[i]["DES"] + "）<\/dt>\n";
                        }
                        if (paytype == 1) {
                            paytypeline += "                        <dt>" + str + "<\/dt>\n";
                        }
                        paytypeline += "                        <dd class=\"bgd-foot-icon foot-icon15\"><\/dd>\n";
                        paytypeline += "                    <\/dl>\n";
                        paytypeline += "                <\/a>\n";
                    }
                }
            }
            $("#paytypelineonline").html(paytypeonlie);
            $("#paytypeline").html(paytypeline);
            if (typeof _cb == "function") _cb();
        });

    },

    //提现确认操作
    carrycash: function () {
        var carrycashtip = cache.get("carrycashtip"); //读取到账时间提醒
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var CarryCashLimit = cache.get("CarryCashLimit");
        if (CarryCashLimit == "" || CarryCashLimit == 0 || CarryCashLimit == "undefined" || CarryCashLimit == null) {
            comm.tip("返回主页请重新操作", 2);
            setTimeout(function () {
                location.href = "index.html";
            }, 1500);
            return;
        }
        var balance = $("#balance1").html();
        var strlist = CarryCashLimit.split(',');
        var btype = $("#batype").val(); //银行ID
        if (btype == 0) {
            comm.tip("请选择提现账号", 2);
            return;
        }
        var money = $("#money").val(); //提现金额
        if (parseInt(money) > parseInt(balance)) {
            comm.tip("余额不足", 2);
            return;
        }
        if (money == "" || parseInt(money) == 0 || money == "undefined" || money == null) {
            comm.tip("请输入金额", 2);
            return;
        }
        if (parseInt(money) < parseInt(strlist[0]) || parseInt(money) > parseInt(strlist[1])) {
            comm.tip("提现金额最少" + strlist[0] + "最多" + strlist[1], 2);
            return;
        }
        var paypwd = $("#paypwd").val(); //提现密码
        if (paypwd == "" || paypwd == "undefined" || paypwd == null) {
            comm.tip("请输入安全密码", 2);
            return;
        }
        $("#carrycashsubmit").attr("onclick", "repeatsubmit()");
        rq(sys.userapi, {
            action: "carrycash",
            userkey: ukey,
            bcardid: btype,
            money: money,
            paypwd: md5(paypwd)
        }, function (cb) {
            $("#carrycashsubmit").attr("onclick", "run('page.appevent.carrycash')");

            switch (cb.code) {
                case 1:
                    comm.tip("提现失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("缺少参数id", 2);
                    return;
                case 4:
                    comm.tip("缺少参数bcardid", 2);
                    return;
                case 5:
                    comm.tip("请输入安全密码", 2);
                    return;
                case 6:
                    comm.tip("安全密码错误", 2);
                    return;
                case 7:
                    comm.tip("订单不存在", 2);
                    return;
                case 8:
                    comm.tip("最后充值玩" + cb.data["CarryCashPlayCount"] + "次才能提现,您已玩" + cb.data["BuyCount"] + "次");
                    return;
                case 9:
                    comm.tip("系统未能检测到你最后充值时间，请先充值 ", 2);
                    return;
                case 10:
                    comm.tip("操作超时", 2);
                    return;
                case 11:
                    comm.tip("请勿非法操作", 2);
                    return;
                case 1004:
                    comm.tip("请勿重复提交数据", 2);
                    setTimeout(function () {
                        location.href = "../finance.html";
                    }, 2000);
                    return;
                case 1000:
                    comm.tip("余额不足", 2);
                    return;
                case 1005:
                    comm.tip("提交数据过多请10分钟后再提交", 2);
                    setTimeout(function () {
                        location.href = "../finance.html";
                    }, 2000);
                    return;
                case 0:
                    if (carrycashtip == null || carrycashtip == "" || carrycashtip == "undefined") {
                        comm.tip("提现成功", 2);
                    } else {
                        comm.tip(carrycashtip, 2);
                    }
                    setTimeout(function () {
                        location.href = "cg.html?type=2";
                    }, 2000);
                    return;
            }
        });
    },


    //线上转账确认操作
    onlineConfirm: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            comm.tip("登录超时", 2);
            location.href = "../login.html";
            return;
        }
        var PaymentLimit = cache.get("PaymentLimit");
        if (PaymentLimit == "" || PaymentLimit == 0 || PaymentLimit == "undefined" || PaymentLimit == null) {
            comm.tip("返回主页请重新操作", 2);
            setTimeout(function () {
                location.href = "../index.html";
            }, 1500);
            return;
        }
        var money = $("#money").val();
        var y = String(money).indexOf(".") + 1; //获取小数点的位置
        var moneyregular = /^[1-9]\d*$/;
        if (!moneyregular.test(money)) {
            comm.tip("请输入金额或正确金额", 2);
            return;
        }
        if (y > 0) {
            comm.tip("请输入整数金额", 2);
            return;
        }
        if (money == "" || parseInt(money) == 0 || money == "undefined" || money == null) {
            comm.tip("请输入金额", 2);
            return;
        }
        if (parseInt(money) < PaymentLimit) {
            comm.tip("金额不能少于" + PaymentLimit, 2);
            return;
        }
        var ordersn = request.ordersn; //获取订单号
        var paytype = request.paytype; //获取支付ID
        rq(sys.onlineconfirmapi, {
            userkey: ukey,
            ordersn: ordersn,
            paytypeid: paytype,
            money: money
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败返回重新操作", 2);
                    setTimeout(function () {
                        location.href = "../recharge.html";
                    }, 1000);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    setTimeout(function () {
                        location.href = "../login.html";
                    }, 1000);
                    return;
                case 3:
                    comm.tip("缺少参数返回重新操作", 2);
                    setTimeout(function () {
                        location.href = "../recharge.html";
                    }, 1000);
                    return;
                case 1005:
                    comm.tip("获取支付链接出错返回重新操作", 2);
                    setTimeout(function () {
                        location.href = "../recharge.html";
                    }, 1000);
                    return;
                case 0:
                    cache.set("ordersn", cb.data["ordersn"], 86400); //保存订单号
                    cache.set("ordersign", cb.data["ordersign"], 86400); //保存订单号
                    $("#ordernumber").html(cb.data["ordersn"]);
                    $("#payamount").html(money + "元");
                    $("#payconfirm").hide();
                    $("#paycode").show();
                    $("#rqcodeimg").attr("src", cb.data["url"]);
                    //                    var c = document.getElementById("rqcanvas");
                    //                    var ctx = c.getContext("2d");
                    //                    var img = new Image()
                    //                    img.src = cb.data["url"];
                    //                    img.setAttribute("crossOrigin", 'anonymous')
                    //                    img.onload = function () {
                    //                        ctx.drawImage(img, 0, 0, 130, 130);
                    //                    };
                    appevent.checkOrderStatus(cb.data["ordersign"]);
                    return;
            }
        });
    },
    //检查订单是否支付成功
    checkOrderStatus: function (_ordersign) {
        appevent.task_OrderStatus(_ordersign, function (result) {
            if (result == 0) {
                //跳转成功页面
                location.href = "success.html";
            }
            //其他操作
        });
    },
    //开始检查订单状态的任务
    task_OrderStatus: function (_type, _ordersign, _cb) {
        clearTimeout(this);
        rq(sys.checkordersnstatusapi, {
            ordersign: _ordersign
        }, function (cb) {
            console.log("status=" + cb.code);
            if (cb.code == 0 || cb.code == 1 || cb.code == -1) {
                setTimeout(function () {
                    appevent.task_OrderStatus(_ordersign, _cb);
                }, 3000);
            } else _cb(0);
        });
    },
    //查询检查订单状态的任务
    OrderStatus: function () {
        var ordersign = cache.get("ordersign");
        rq(sys.checkordersnstatusapi, {
            ordersign: ordersign
        }, function (cb) {
            console.log("status=" + cb.code);
            if (cb.code == 0 || cb.code == 1 || cb.code == -1) {
                comm.tip("订单待支付", 2);
                return;
            } else {
                //跳转成功页面
                location.href = "success.html";
            }
        });
    },


    //线下转账确认操作
    confimtransfer: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var PaymentLimit = cache.get("PaymentLimit");
        if (PaymentLimit == "" || PaymentLimit == 0 || PaymentLimit == "undefined" || PaymentLimit == null) {
            comm.tip("返回主页请重新操作", 2);
            setTimeout(function () {
                location.href = "index.html";
            }, 1500);
            return;
        }
        //获取ID
        var paytype = request.paytype; // comm.getUrlParam("id");
        if (paytype == "" || paytype == 0 || paytype == "undefined" || paytype == null) {
            location.href = "../recharge.html";
            return;
        }
        var money = $("#money").val();
        var y = String(money).indexOf(".") + 1; //获取小数点的位置
        var moneyregular = /^[1-9]\d*$/;
        if (!moneyregular.test(money)) {
            comm.tip("请输入金额或正确金额", 2);
            return;
        }
        if (y > 0) {
            comm.tip("请输入整数金额", 2);
            return;
        }
        if (money == "" || parseInt(money) == 0 || money == "undefined" || money == null) {
            comm.tip("请输入金额或正确金额", 2);
            return;
        }
        if (parseInt(money) < PaymentLimit) {
            comm.tip("金额不能少于" + PaymentLimit, 2);
            return;
        }
        /*comm.openPasswordKeyBoard(function (password) {
        // 弹出请求中提示框
        YDUI.dialog.loading.open('验证支付密码');
        // 模拟AJAX校验密码
        setTimeout(function () {
        // 关闭请求中提示框
        YDUI.dialog.loading.close();
        }, 1500);*/

        rq(sys.offlinetransferapi, {
            action: "confimtransfer",
            userkey: ukey,
            paytypeid: paytype,
            money: money
            //paypwd: md5(password)//md5(ret.password)
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("支付失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时", 2);
                    return;
                case 3:
                    comm.tip("请选择支付方式", 2);
                    return;
                case 1004:
                    comm.tip("请勿重复提交数据", 2);
                    setTimeout(function () {
                        location.href = "../finance.html";
                    }, 2000);
                    return;
                case 1005:
                    comm.tip("提交数据过多请10分钟后再提交", 2);
                    setTimeout(function () {
                        location.href = "../finance.html";
                    }, 2000);
                    return;
                /*case 4:
                comm.tip("缺少参数bcardid", 2);
                return;
                case 5:
                comm.tip("请输入验证码", 2);
                return;
                case 6:
                comm.tip("支付密码错误", 2);
                return;
                case 7:
                comm.tip("订单不存在", 2);
                return;
                case 8:
                comm.tip("无权操作", 2);
                return;
                case 9:
                comm.tip("请勿重复操作", 2);
                return;
                case 10:
                comm.tip("操作超时", 2);
                return;
                case 11:
                comm.tip("请勿非法操作", 2);
                return;*/
                case 0:
                    //comm.closePasswordKeyBoard();
                    location.href = "../cg.html?type=1";
                    return;
            }
        });

        //});
    },

    //根据支付类型id变动
    bcardtype: function () {
        var btype = $("#btype").val(); //银行类型
        //获取支付类型
        var paytype = request.paytype;
        if (paytype == 2) {
            $("#btype").val("1");
            $("#yhh").text("账号");
            $("#ckr").text("姓名");
            $("#bnumber").attr('placeholder', '请输入支付宝账号');
            $("#rname").attr('placeholder', '请输入支付宝姓名');
            $("#kaihu").hide();
            return;
        }
        if (paytype == 3) {
            $("#btype").val("2");
            $("#yhh").text("账号");
            $("#ckr").text("姓名");
            $("#bnumber").attr('placeholder', '请输入微信账号');
            $("#rname").attr('placeholder', '请输入微信姓名');
            $("#kaihu").hide();
            return;
        }
    },
    //获取银行、支付宝、微信类型列表
    getbanktype: function (_cb) {
        var sele = "";
        var getbanktype = cache.get("getbanktype");
        //获取支付类型
        var paytype = request.paytype;
        if (getbanktype != null || getbanktype == "" || getbanktype == 0 || getbanktype == "undefined") {
            sele = "<option value=\"0\">选择账号类型<\/option>\n";
            for (var i = 0; i < getbanktype.length; i++) {
                sele += "<option value=\"" + getbanktype[i]["ID"] + "\">" + getbanktype[i]["BankTypeName"] + "<\/option>\n";
            }
            $("#btype").html(sele);
            appevent.bcardtype();
            if (typeof _cb == "function") _cb();
            return;
        }
        rq(sys.dataapi, {
            action: "getlist",
            t: "BankType"
        }, function (cb) {
            sele = "<option value=\"0\">选择卡号类型<\/option>\n";
            cache.set("getbanktype", cb.data, 86400 * 7);
            for (var i = 0; i < cb.data.length; i++) {
                if (cb.data[i]["Status" == 0]) continue;
                sele += "<option value=\"" + cb.data[i]["ID"] + "\">" + cb.data[i]["BankTypeName"] + "<\/option>\n";
            }
            $("#btype").html(sele);
            appevent.bcardtype();
            if (typeof _cb ==
                "function") _cb();
            return;
        });
    },

    //跳转页面时检查是否打烊
    checkrootTime: function (roomtype, playid) {
        var CloseTimeTipText = cache.get("CloseTimeTipText" + playid);
        if (CloseTimeTipText == null || CloseTimeTipText == "" || CloseTimeTipText == "undefined") {
            location.href = "index.html";
            return;
        }
        if (!appevent.checkPlayTime(request.playid)) {
            comm.tip(CloseTimeTipText, 2);
            setTimeout(function () {
                location.href = "index.html";
            }, 1000);
            return;
        }
        location.href = "room.html?roomtype=" + roomtype + "&playid=" + playid;
    },

    //加载房间类型
    loadRoomType: function () {
        var roomtypdiv = ""
        //获取地区玩法ID
        var playid = request.playid; //comm.getUrlParam("playid");
        //地区玩法ID是否为空
        if (playid == null || playid == "") {
            location.href = "index.html";
            return;
        }
        rq(sys.dataapi, {
            action: "getroomtype",
            playmode: playid
        }, function (cb) {
            if (cb.data == null || cb.data == "undefined") {
                return;
            }
            appevent.PlaytTitle(playid); //获取地区玩法标题 
            for (var i = 0; i < cb.data.length; i++) {
                roomtypdiv += "<div class=\"con_room_a\" style=\"background: url(" + cb.data[i]["BgImage"] + ") no-repeat center center;\n";
                roomtypdiv += "                            background-size: 6.8rem auto; background-position: -0.5rem -0.35rem;\">\n";
                roomtypdiv += "                            <div class=\"con_room_a1 \">\n";
                roomtypdiv += "                                <a href=\"javascript:appevent.getroomsocket(" + cb.data[i]["Roomid"] + "," + cb.data[i]["ID"] + ","  + playid + ")\" class=\"con_room1\">" + cb.data[i]["RoomTypeName"] + "<\/a>\n";
                roomtypdiv += "                                <a href=\"" + cb.data[i]["Link"] + "&typeid=2\" class=\"con_room_smaa\">赔率说明<\/a>\n";
                roomtypdiv += "                            <\/div>\n";
                roomtypdiv += "                        <\/div>\n";
            }
            $("#con_room").html(roomtypdiv);
            $('#main').fadeIn();
        });
    },
    //房间跳转赔率说明
    loadLink: function () {
        //获取房间类型ID
        var roomtype = request.roomtype;
        var url = cache.get("loadLink_" + roomtype);
        if (url == "" || url == null) {
            return;
        }
        location.href = url;
    },
    //玩法说明和赔率说明
    palyexp: function () {
        //获取类型ID
        var typeid = request.typeid;
        if (typeid == "1") {
            $("#menu2").html("游戏介绍");
        }
        if (typeid == "2") {
            $("#menu2").html("赔率说明");
        }
        if (typeid == "3") {
            $("#menu2").html("回水规则");
        }
    },


    /*获取socket*/
    getroomsocket: function (id, roomtype, playid) {
        appevent.loginstatus(function () {            
            appevent.joinroom(id, function () {
                rq(sys.dataapi, {
                    action: "getroom",
                    playmode: playid, //1为北京玩法，2为加拿大玩法
                    roomtype: roomtype //房间类型ID
                }, function (cb) {
                    cache.set("loadRoom_" + playid + "_" + roomtype, cb.data, 86400);
                    location.href = "roomvip.html?roomlist=" + id + "&roomtype=" + roomtype + "&playid=" + playid;
                });
            });
        });
    },

    //进入房间初始化
    joinroom: function (_rid, _cb) {
        var ukey = cache.get("ukey");
        //获取游戏ID
        var playid = request.playid;
        var BanPlayMode = cache.get("BanPlayMode" + playid);
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "joinroom",
            userkey: ukey,
            rid: _rid
        }, function (cb) {
            switch (cb.code) {
                case 0:
                    if (typeof _cb == "function") _cb();
                    return;
                case 1:
                    comm.tip("进入失败", 2);
                    setTimeout(function () {
                        location.href = "room.html";
                    }, 1000);
                    return;
                case 2:
                    comm.tip("缺少rid", 2);
                    setTimeout(function () {
                        location.href = "room.html";
                    }, 1000);
                    return;
                case 3:
                    comm.tip("无法加入房间", 2);
                    setTimeout(function () {
                        location.href = "room.html";
                    }, 1000);
                    return;
                case 4:
                    comm.tip("余额至少有" + cb.data + "才能进入房间", 2);
                    setTimeout(function () {
                        location.href = "room.html";
                    }, 1000);
                    return;
                case 5:
                    comm.tip(BanPlayMode, 2);
                    setTimeout(function () {
                        location.href = "index.html";
                    }, 1000);
                    return;
            }
        });
    },

    //加载房间名和在线人数
    loadRoom: function (_cb) {
        var roomdiv = "";
        //获取房间类型ID
        var roomtype = request.roomtype; //comm.getUrlParam("roomtype");
        //获取地区玩法ID
        var playid = request.playid; //comm.getUrlParam("playid");
        //判断房间类型ID和地区玩法ID是否为空
        if (roomtype == null || roomtype == "" && playid == null || playid == "") {
            location.href = "index.html";
            return;
        }

        var isLoad = true;
        var cache_data = cache.get("loadRoom_" + playid + "_" + roomtype);
        if (cache_data != null && cache_data != "undefined") {
            isLoad = false;
            for (var i = 0; i < cache_data.length; i++) {
                roomdiv += "<div class=\"con_roomli_a bgd-roomlist-icon1 roomlist-icon\" onclick=\"appevent.getroomsocket(" + cache_data[i]["ID"] + "," + roomtype + "," + playid + ")\">\n";
                roomdiv += "        	<div class=\"con_roomli_a1\"><img src=\"" + cache_data[i]["RoomPic"] + "\" /><\/div>\n";
                roomdiv += "            <div class=\"con_roomli_a2\">\n";
                roomdiv += "            	<p class=\"size4\">" + cache_data[i]["RoomName"] + "<p>\n";
                roomdiv += "                <div class=\"con_roomli_bot\">在线" + cache_data[i]["Count"] + "人<\/div>\n";
                roomdiv += "            <\/div>\n";
                roomdiv += "        <\/div>\n";
            }
            $("#con_roomli").html(roomdiv);
        }

        rq(sys.dataapi, {
            action: "getroom",
            playmode: playid, //1为北京玩法，2为加拿大玩法
            roomtype: roomtype //房间类型ID
        }, function (cb) {
            if (cb.data == null || cb.data == "undefined" || !isLoad) {
                if (typeof _cb == "function") _cb();
                return;
            }
            appevent.PlaytTitle(playid); //获取地区玩法标题 
            cache.set("loadRoom_" + playid + "_" + roomtype, cb.data, 86400);

            for (var i = 0; i < cb.data.length; i++) {
                roomdiv += "<div class=\"con_roomli_a bgd-roomlist-icon1 roomlist-icon\" onclick=\"appevent.getroomsocket(" + cb.data[i]["ID"] + "," + roomtype + "," + playid + ")\">\n";
                roomdiv += "        	<div class=\"con_roomli_a1\"><img src=\"" + cb.data[i]["RoomPic"] + "\" /><\/div>\n";
                roomdiv += "            <div class=\"con_roomli_a2\">\n";
                roomdiv += "            	<p class=\"size4\">" + cb.data[i]["RoomName"] + "<p>\n";
                roomdiv += "                <div class=\"con_roomli_bot\">在线" + cb.data[i]["Count"] + "人<\/div>\n";
                roomdiv += "            <\/div>\n";
                roomdiv += "        <\/div>\n";
            }
            $("#con_roomli").html(roomdiv);
            if (typeof _cb == "function") _cb();
        });
    },

    /*获取地区玩法ID，该变标题
    /*playid：地区玩法ID
    */
    PlaytTitle: function (playid) {
        if (playid == 1) {
            $("#menu2").html("北京");
        } else if (playid == 2) {
            $("#menu2").html("加拿大");
        } else {
            location.href = "index.html";
            return;
        }
    },


    /*
     *获取房间标题
     */
    roomvipTitle: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        //获取房间类型ID
        var roomtype = request.roomtype; //comm.getUrlParam("roomtype");
        //获取地区玩法ID
        var playid = request.playid; //comm.getUrlParam("playid");
        //判断房间类型ID和地区玩法ID是否为空
        if (roomtype == null || roomtype == "" && playid == null || playid == "") {
            location.href = "index.html";
            return;
        }
        var Roomrs = cache.get("loadRoom_" + playid + "_" + roomtype);
        //获取房间ID
        var roomlist = request.roomlist; // comm.getUrlParam("roomlist");
        //判断房间类型ID是否为空
        if (roomlist == null || roomlist == "") {
            location.href = "room.html";
            return;
        }
        if (Roomrs != null || Roomrs == "" || Roomrs == 0 || Roomrs == "undefined") {
            for (var i = 0; i < Roomrs.length; i++) {
                if (Roomrs[i]["ID"] == roomlist) {
                    if (playid == 1) {
                        $(".menu2").html("北京" + Roomrs[i]["RoomName"]);
                        return;
                    }
                    if (playid == 2) {
                        $(".menu2").html("加拿大" + Roomrs[i]["RoomName"]);
                        return;
                    }
                }
            }
        } else {
            location.href = "room.html";
            return;
        }
    },

    //聊天
    joinMessage: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        //获取房间ID
        var roomid = request.roomlist;
        //获取房类型
        var roomtype = request.roomtype;
        //获取地区玩法ID
        var playid = request.playid;
        // var socket = cache.get("socket");
        //获取昵称
        var nickname = cache.get("nickname");
        // if (socket == null || socket == "undefined") {
        //     location.href = "room.html?roomtype=" + roomtype + "&playid=" + playid;
        //     return;
        // }
        run("page.message.init", "", roomid, playid, ukey, function () {
            // 设置内容区的滚动条到底部
            comm.messageScrollTop();
            $("#fs").click(function () {
                var msg = $("#msg").val().trim();
                var level = cache.get("level");
                if (level == 0) {
                    comm.tip("等级不够不能发言", 2);
                    return;
                }
                $("#fs_div").hide();
                $("#betbnt").show();
                if (msg.length > 500) {
                    comm.tip("发送长度不能超过500字符", 2);
                    return;
                }
                if (msg == "" || msg == "undefined" || msg == null) {
                    comm.tip("消息不能为空", 2);
                    return;
                }
                //這一句是發送消息
                message.send_message(msg);

            });
        });
    },
    /***解释表情***/
    replace_em: function (str) {
        if (str == "undefined" || str == null) return str;
        str = str.replace(/\</g, '&lt;');
        str = str.replace(/\>/g, '&gt;');
        str = str.replace(/\n/g, '<br/>');
        str = str.replace(/\[表情_([0-9]*)\]/g, "<img src='images/face/$1.ico' style='max-width:0.5rem;margin-right:0.05rem;'/>");
        return str;
    },

    getPlayModeCloseTime: function (PlayModeId, _cb) {
        var otime = cache.get("PlayModeCloseTime_" + PlayModeId);
        if (otime != null && otime != "undefined") return;
        rq(sys.dataapi, {
            action: "getlist",
            t: "PlayModeCloseTime"
        }, function (cb) {
            if (cb.code != 0) return;
            for (var i in cb.data)
                cache.set("PlayModeCloseTime_" + cb.data[i]["ID"], cb.data[i], 86400);
            if (typeof _cb == "function") _cb();
        });
    },
    //判断开奖时间
    checkPlayTime: function (playmodeId) {
        var data = cache.get("PlayModeCloseTime_" + playmodeId);
        if (data == null || data == "undefined") {
            appevent.getPlayModeCloseTime(playmodeId, function () {
                appevent.checkPlayTime(playmodeId)
            });
            return;
        }
        var week = new Date().getDay();
        var tempOpenTime = "";
        switch (week) {
            case 0:
                tempOpenTime = data.Sunday;
                break;
            case 1:
                tempOpenTime = data.Monday;
                break;
            case 2:
                tempOpenTime = data.Tuesday;
                break;
            case 3:
                tempOpenTime = data.Wednesday;
                break;
            case 4:
                tempOpenTime = data.Thursday;
                break;
            case 5:
                tempOpenTime = data.Friday;
                break;
            case 6:
                tempOpenTime = data.Saturday;
                break;
        }

        var otlist = tempOpenTime.split(',');
        for (var i = 0; i < otlist.length; i++) {
            var st = otlist[i].split('-')[0];
            var et = otlist[i].split('-')[1];

            var nowTime = new Date();
            var sdate = new Date(nowTime.getFullYear() + '/' + (parseInt(nowTime.getMonth()) + 1) + '/' + nowTime.getDate() + ' ' + st);
            var edate = new Date(nowTime.getFullYear() + '/' + (parseInt(nowTime.getMonth()) + 1) + '/' + nowTime.getDate() + ' ' + et);

            var s = sdate.getTime();
            var e = edate.getTime();
            var n = nowTime.getTime();
            if (n >= s && n <= e) return false;
        }
        return true;
    },

    /*
     *获取最新开奖信息
     */
    getnowlottery: function () {
        clearTimeout(this);
        if (!appevent.checkPlayTime(request.playid)) {
            $("#nextSeconds").html("<span style=\"color:#eaca6c;\">打烊了<\/span>\n");
            setTimeout(function () {
                appevent.getnowlottery();
                appevent.getlotterylog();
            }, 60000);
            return;
        }
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }

        //获取房间ID
        var roomlist = request.roomlist; //comm.getUrlParam("roomlist");
        //判断房间类型ID是否为空
        if (roomlist == null || roomlist == "") {
            location.href = "room.html";
            return;
        }

        //看看是不是还有奖励没结算
        appevent.getlotteryresult();

        var lotteryID = cache.get("LotteryID"); //最新期数

        rq(sys.dataapi, {
            action: "getnowlottery",
            rid: roomlist
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("查询失败", 2);
                    return;
                case 3:
                    setTimeout(function () {
                        appevent.getnowlottery();
                        appevent.getlotterylog();
                    }, 1000);
                    return
                case 0:
                    comm.messageScrollTop();
                    //message.loadMessageLog("hide_con");
                    var istip = false; //判断是否在聊天框提示最新一期的开奖信息，并提示最新一期开盘了
                    if (lotteryID != cb.nextid) {
                        lotteryID = cb.nextid
                        cache.set("LotteryID", cb.nextid, 600);
                        appevent.getlotteryresult();
                        istip = true;
                    }
                    publicVar.qs = cb.nextid;
                    $("#nextid").html("<span class=\"header-color\">距离<\/span>" + cb.nextid + "<span class=\"header-color\">期截止<\/span>\n"); //距离xxxx期截止
                    comm.countdown("#nextSeconds", cb.next, cb.endTime, function (nextSeconds) {
                        //message.loadMessageLog("hide_con");
                        //刷新开奖
                        $("#nextSeconds").html("<span style=\"color:#eaca6c;\">正在开奖<\/span>\n");
                        comm.messageScrollTop();
                        publicVar.qs = 0;
                        console.log("刷新开奖1");
                        setTimeout(function () {
                            appevent.getnowlottery();
                            appevent.getlotterylog();
                        }, 1000);
                    });
                    //                    $("#nextSeconds").html(cb.nextSeconds);  //下一期开奖倒计时

                    var kjjg = "";
                    if (cb.data["ID"] == null || cb.data["Q1"] == null || cb.data["Q2"] == null || cb.data["Q3"] == null || cb.data["ResultNum"] == null) {
                        cb.data["ID"] = "0";
                        cb.data["Q1"] = "0";
                        cb.data["Q2"] = "0";
                        cb.data["Q3"] = "0";
                        cb.data["ResultNum"] = "0";
                    }
                    kjjg += "<div id=\"kjjg\" class=\"kjjg\">\n";
                    kjjg += "<div class=\"kjjg-qisu1\">\n";
                    kjjg += "<span style=\"color: #eaca6c;\">第<\/span>" + cb.data["ID"] + "<span style=\"color: #eaca6c;\">期<\/span><\/div>\n";
                    kjjg += "<div class=\"kjjg-qisu2\">\n";
                    kjjg += "<span class=\"span-b1\">" + cb.data["Q1"] + "<\/span><\/div>\n";
                    kjjg += "                    <div class=\"kjjg-qisu3\">\n";
                    kjjg += "                        +<\/div>\n";
                    kjjg += "                    <div class=\"kjjg-qisu2\">\n";
                    kjjg += "                        <span class=\"span-b2\">" + cb.data["Q2"] + "<\/span><\/div>\n";
                    kjjg += "                    <div class=\"kjjg-qisu3\">\n";
                    kjjg += "                        +<\/div>\n";
                    kjjg += "                    <div class=\"kjjg-qisu2\">\n";
                    kjjg += "                        <span class=\"span-b3\">" + cb.data["Q3"] + "<\/span><\/div>\n";
                    kjjg += "                    <div class=\"kjjg-qisu3\">\n";
                    kjjg += "                        =<\/div>\n";
                    kjjg += "                    <div class=\"kjjg-qisu2\">\n";
                    kjjg += "                        <span class=\"span-b4\">" +  (cb.data["ResultNum"]<10 ? '0' : '') + cb.data["ResultNum"] + "<\/span><\/div>\n";
                    kjjg += "                    <div class=\"kjjg-qisu4\">\n";
                    dsbz = comm.DSB_Text(cb.data["DSBZ"], 0);
                    dsbz = dsbz.substr(0, dsbz.length - 1); //截取最后一个|号
                    if (cb.data["DSBZ"] == 0 || cb.data["DSBZ"] == null) {
                        kjjg += "                        <span class=\"span-b5\">无<\/span><\/div>\n";
                    } else {
                        kjjg += "                        <span class=\"span-b5\">" + dsbz + "<\/span><\/div>\n";
                    }
                    kjjg += "                    <div class=\"header3-gd bgd-roomvip-icon roomvip-icon1\">\n";
                    kjjg += "                    <\/div>\n";
                    kjjg += "                <\/div>\n";


                    $("#kjjg").html(kjjg);

                    if (istip) {
                        istip = false;
                        $("#bet").hide(); //关闭层
                        $("#Maskss").hide(); //使其遮罩下方内容不可滚动
                        var num = $(".num");
                        for (var i = 0; i < num.length; i++) {
                            num[i].value = 0; //清空所以下注宽
                        }
                        appevent.updatebalance();
                        var str = cache.get("openlottertext");
                        if (str == undefined) {
                            str = "";
                        }
                        if (cb.data["ID"] == null) {
                            str = "网络有些问题";
                        }
                        str = str.replace('{ID}', cb.data["ID"]);
                        str = str.replace('{LotteryInfo}', cb.data["Q1"] + "+" + cb.data["Q2"] + "+" + cb.data["Q3"] + "=" + cb.data["ResultNum"] + "(" + comm.BigorSmall_Text(cb.data["DorX"], 0) + "," + comm.DanOrShuang_Text(cb.data["DorS"], 0));

                        var str1 = cache.get("startbuytext");
                        if (str1 == undefined) {
                            str1 = "";
                        }
                        str1 = str1.replace('{ID}', cb.nextid);
                        //聊天框提示：【xxxxx期】已经开奖
                        var msgvar = "";
                        msgvar += "<div class=\"clearfloat\">\n";
                        msgvar += "                            <div class=\"author-name-center\">\n";
                        msgvar += "                                <small class=\"chat-date\">" + str + ")<\/small>\n";
                        msgvar += "                            <\/div>\n";
                        msgvar += "                         \n";
                        msgvar += "                        <\/div>\n";

                        //聊天框提示：【cb.nextid期】开盘，请及时下注
                        var msgvar1 = "";
                        msgvar1 += "<div class=\"clearfloat\">\n";
                        msgvar1 += "                            <div class=\"author-name-center\">\n";
                        msgvar1 += "                                <small class=\"chat-date\">" + str1 + "<\/small>\n";
                        msgvar1 += "                            <\/div>\n";
                        msgvar1 += "                         \n";
                        msgvar1 += "                        <\/div>\n";
                        $("#chatBox").append(msgvar);
                        $("#chatBox").append(msgvar1);
                        //                        message.addChatLog(msgvar);
                        //                        message.addChatLog(msgvar1);
                        //message.setMessageLog("hide_con");  //保存聊天日志
                        comm.messageScrollTop();
                    }


            }

        });
    },

    /*
     *获取历史开奖信息：action=getlotterylog
     */
    getlotterylog: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        //获取房间ID
        var roomlist = request.roomlist; //comm.getUrlParam("roomlist");
        //判断房间类型ID是否为空
        if (roomlist == null || roomlist == "") {
            location.href = "room.html";
            return;
        }
        rq(sys.dataapi, {
            action: "getlotterylog",
            rid: roomlist
        }, function (cb) {
            var kjls = "";
            var zst = "";
            var betting = "";
            kjls += "<tr>\n";
            kjls += "                            <td class=\"hetd_a\">期号<\/td>\n";
            kjls += "                            <td class=\"hetd_a\">开奖结果<\/td>\n";
            kjls += "                            <td class=\"hetd_a\">极值<\/td>\n";
            kjls += "                            <td class=\"hetd_a\">龙虎豹<\/td>\n";
            kjls += "                            <td class=\"hetd_a\">对顺豹<\/td>\n";
            kjls += "                        <\/tr>\n";
            betting += "<div class=\"betting_e-cont\">历史:<\/div>\n";
            if (cb.data == null) return;
            for (var i = 0; i < cb.data.length; i++) {
                kjls += "<tr>";
                kjls += "<td class=\"hetd_a\" style=\"color:white;\">" + cb.data[i]["ID"] + "&nbsp;<\/td>";
                kjls += "<td class=\"hetd_a\">" + cb.data[i]["Q1"] + "+" + cb.data[i]["Q2"] + "+" + cb.data[i]["Q3"] + "=<b style=\"color:white;\">" + (cb.data[i]["ResultNum"]<10 ? '0':'')+ cb.data[i]["ResultNum"];
                kjls += "&nbsp;&nbsp;" + comm.BigorSmall_Text(cb.data[i]["DorX"], 0) + comm.DanOrShuang_Text(cb.data[i]["DorS"], 0) + "</b>" + "<\/td>";
//                kjls += comm.ZH_DXDS_Text(cb.data[i]["ZH_DXDS"], 0) + "<\/td>\n";
                kjls += "<td class=\"hetd_a\">" + comm.MaxOrMin_Text(cb.data[i]["JDX"], 0) + "<\/td>";
                kjls += "<td class=\"hetd_a\">" + comm.LHB_Text(cb.data[i]["LHB"], 0) + "<\/td>";
                kjls += "<td class=\"hetd_a\">" + comm.DSB_Text(cb.data[i]["DSBZ"], 0) + "<\/td>";
                kjls += "<\/tr>";
                betting += "<div class=\"betting_e-cont-sum\"><span>" + (cb.data[i]["ResultNum"]<10 ? '0' : '') + cb.data[i]["ResultNum"] + "<\/span><\/div>";
            }
            comm.messageScrollTop();
            $("#betting").html(betting);
            $("#kjls").html(kjls);
            //$("#zst").html(zst);
        });
    },

    /**投注**/
    buylottery: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var uid = cache.get("uid");
        if (uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        //获取房间ID
        var roomlist = request.roomlist; //comm.getUrlParam("roomlist");
        //获取地区玩法ID
        var playid = request.playid;
        //判断房间类型ID是否为空
        if (roomlist == null || roomlist == "") {
            location.href = "room.html";
            return;
        }
        if (publicVar.canbuy == false) {
            comm.tip("已封盘，禁止投注", 2);
            return;
        }
        var BanPlayMode = cache.get("BanPlayMode" + playid);
        if (BanPlayMode == null || BanPlayMode == "" || BanPlayMode == "undefined") {
            BanPlayMode = "禁止投注";
        }
        var d_g = $("#d_g").val(); //买大的金额
        var x_g = $("#x_g").val(); //买小的金额
        var dan_g = $("#dan_g").val(); //买单的金额
        var shuang_g = $("#shuang_g").val(); //买双的金额
        var dd_g = $("#dd_g").val(); //买大单的金额
        var ds_g = $("#ds_g").val(); //买大双的金额
        var xd_g = $("#xd_g").val(); //买小单的金额
        var xs_g = $("#xs_g").val(); //买小双的金额
        var jd_g = $("#jd_g").val(); //买极大的金额
        var jx_g = $("#jx_g").val(); //买极小的金额
        var l_g = $("#l_g").val(); //买龙的金额
        var h_g = $("#h_g").val(); //买虎的金额
        var b_g = $("#b_g").val(); //买豹的金额
        var dz_g = $("#dz_g").val(); //买对子的金额
        var sz_g = $("#sz_g").val(); //买顺子的金额
        var bz_g = $("#bz_g").val(); //买豹子的金额
        var tm = ""; //特码tm=1_200,23_1000,14_5000 表示买200特码1，买1000特码23，买5000特码14
        for (var t = 0; t < 28; t++) {
            var tmval = $("#" + t + "_").val();
            if (tmval != "0" && tmval != "" && typeof (tmval) != "undefined") {
                tm += $("#" + t + "_").attr("id") + tmval + ",";
            }
        }
        var betmoney = $("#betmoney").html(); //获取下注金额
        var balance2 = $("#balance2").html(); //获取余额
        if (parseInt(betmoney) < 10) {
            comm.tip("没有下注金额", 2);
            return;
        }
        if (parseInt(betmoney) > parseInt(balance2)) {
            comm.tip("余额不足", 2);
            return;
        }
        tm = tm.substr(0, tm.length - 1); //截取最后一个,号
        rq(sys.userapi, {
            action: "buylottery",
            userkey: ukey,
            rid: roomlist,
            d_g: d_g,
            x_g: x_g,
            dan_g: dan_g,
            shuang_g: shuang_g,
            dd_g: dd_g,
            ds_g: ds_g,
            xd_g: xd_g,
            xs_g: xs_g,
            jd_g: jd_g,
            jx_g: jx_g,
            dz_g: dz_g,
            sz_g: sz_g,
            bz_g: bz_g,
            l_g: l_g,
            h_g: h_g,
            b_g: b_g,
            tm: tm
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("失败", 2);
                    return;
                case -1:
                    comm.tip('下注失败，请勿重复点击',3)
                    return
                case 2:
                    comm.tip("登录超时,请重新登录", 2);
                    setTimeout(function () {
                        location.href = "login.html";
                    }, 1000);
                    return;
                case 3:
                    comm.tip("您已经退出房间", 2);
                    return;
                case 4:
                    comm.tip("已经封盘,停止投注", 2);
                    return;
                case 5:
                    comm.tip("同一游戏不能在多个房间投注", 2);
                    return;
                case 6:
                    comm.tip("玩法已经关闭不能投注", 2);
                    setTimeout(function () {
                        location.href = "index.html";
                    }, 1000);
                    return;
                case 7:
                    comm.tip(BanPlayMode, 2);
                    setTimeout(function () {
                        location.href = "index.html";
                    }, 1000);
                    return;
                case 101:
                    comm.tip("买大不能买小双、小单、小", 2);
                    return;
                case 102:
                    comm.tip("买小不能买大双、大单、大", 2);
                    return;
                case 103:
                    comm.tip("买单不能买大双、小双、双", 2);
                    return;
                case 104:
                    comm.tip("买双不能买大单、小单、单", 2);
                    return;
                case 105:
                    comm.tip("买小单不能买大单、大双、小双、大", 2);
                    return;
                case 106:
                    comm.tip("买大单不能买小单、小双、大双、小", 2);
                    return;
                case 107:
                    comm.tip("买小双不能买大双、大单、小单、大", 2);
                    return;
                case 108:
                    comm.tip("买大双不能买小双、大单、小单、小", 2);
                    return;
                case 400:
                    comm.tip("投注总额限制：" + cb.data["min"] + "-" + cb.data["max"], 3);
                    return;
                case 401:
                    comm.tip("投注四项限制：" + cb.data["min"] + "-" + cb.data["max"], 3);
                    return;
                case 402:
                    comm.tip("投注组合限制：" + cb.data["min"] + "-" + cb.data["max"], 3);
                    return;
                case 403:
                    comm.tip("投注特码限制：" + cb.data["min"] + "-" + cb.data["max"], 3);
                    return;
                case 404:
                    comm.tip("投注极值限制：" + cb.data["min"] + "-" + cb.data["max"], 3);
                    return;
                case 405:
                    comm.tip("投注对子限制：" + cb.data["min"] + "-" + cb.data["max"], 3);
                    return;
                case 406:
                    comm.tip("投注顺子限制：" + cb.data["min"] + "-" + cb.data["max"], 3);
                    return;
                case 407:
                    comm.tip("投注豹子限制：" + cb.data["min"] + "-" + cb.data["max"], 3);
                    return;
                case 408:
                    comm.tip("投注龙虎豹限制：" + cb.data["min"] + "-" + cb.data["max"], 3);
                    return;
                case 1000:
                    comm.tip("您的余额不足", 3);
                    return;
                case 0:
                    var buylotteryList = cache.get("buylotteryList");
                    if (buylotteryList == null || buylotteryList == "undefined") buylotteryList = new Array();
                    //                    buylotteryList.pop(cb.data);
                    buylotteryList = comm.removeArray(buylotteryList, cb.data);
                    buylotteryList.push(cb.data);
                    cache.set("buylotteryList", buylotteryList, 86400);
                    //                    cache.set("buylotteryid", cb.data, 86400);

                    $("#bet").hide(); //关闭层
                    $("#Maskss").hide(); //使其遮罩下方内容不可滚动
                    appevent.betnumber(); //投注后显示在聊天下注记录
                    /***获取今天时间***/
                    var mydate = new Date();
                    var str = "" + mydate.getFullYear();
                    var mm = mydate.getMonth() + 1
                    if (mydate.getMonth() > 9) {
                        str += "-" + mm + "-";
                    } else {
                        str += "-0" + mm + "-";
                    }
                    if (mydate.getDate() > 9) {
                        str += mydate.getDate();
                    } else {
                        str += "0" + mydate.getDate();
                    }
                    str = Date.parse(new Date(str));
                    str = str / 1000 - 28800;
                    cache.del("getlotterybuyLog_" + str + uid); //清空今天保存投注记录

                    var num = $(".num");
                    for (var i = 0; i < num.length; i++) {
                        num[i].value = 0; //清空所以下注宽
                    }
                    appevent.updatebalance();

                    comm.tip("下注成功", 2);
                    return;
            }
        });
    },
    undobuylottery: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var uid = cache.get("uid");
        if (uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        //获取房间ID
        var roomlist = request.roomlist; //comm.getUrlParam("roomlist");
        //获取地区玩法ID
        var playid = request.playid;
        //判断房间类型ID是否为空
        if (roomlist == null || roomlist == "") {
            location.href = "room.html";
            return;
        }
        if (publicVar.canbuy == false) {
            comm.tip("已封盘，禁止取消投注", 2);
            return;
        }
        var BanPlayMode = cache.get("BanPlayMode" + playid);
        if (BanPlayMode == null || BanPlayMode == "" || BanPlayMode == "undefined") {
            BanPlayMode = "禁止取消投注";
        }
        layer.open({
            content: '您确定要取消本期所有投注吗？'
            ,btn: ['确定','返回']
            ,style: 'color:white;background:rgba(28, 24, 24,0.86);'
            ,yes: function(index){
                rq(sys.userapi, {
                    action: "undobuylottery",
                    userkey: ukey,
                    rid: roomlist,
                }, function (cb) {
                    if(cb.code>0){
                        appevent.updatebalance();
                        comm.tip("取消下注成功，退回 "+cb.code+' 金币', 2);
                    }else if(cb.code==-1){
                        comm.tip("取消下注失败，请勿重复点击", 2);
                    }else if(cb.code==-11){
                        comm.tip("取消下注失败，当期无下注记录", 2);
                    }else{
                        comm.tip("取消下注失败，系统已封盘", 2);
                    }
                });
            }
          });
    },
    //投注变更文本框,加减按钮,投注按钮样式
    updatebalance: function () {
        appevent.userpinfo(true);

        // var betmoney = $("#betmoney").html(); //获取下注金额
        // var balance2 = $("#balance2").html(); //获取余额
        // balance2 = parseInt(balance2) - parseInt(betmoney);
        // $("#balance1").html(balance2); //变更余额
        // $("#balance2").html(balance2); //变更余额

        $("#qrtz").removeAttr("onclick");
        $("#qrtz").addClass("betting_g1-bnt2");
        $("#qrtz").removeClass("betting_g1-bnt3");
        $("#betmoney").html(0); //清空总下注金额显示

        var num = $(".num"); //获取文本框值
        var jian = $(".ji"); //获取减
        var tu = $(".c2");
        for (var i = 0; i < num.length; i++) {
            var sum = parseInt(num[i].value);
            if (sum == 0 || sum == "" || sum == null) {
                jian[i].setAttribute("class", "jian ji");
                tu[i].setAttribute("class", "betting_c2 c2");
            } else {
                jian[i].setAttribute("class", "jian1 ji");
                tu[i].setAttribute("class", "betting_c3 c2");
            }
        }

    },

    //投注后显示在聊天下注记录
    betnumber: function () {
        var d_g = $("#d_g").val(); //买大的金额
        var x_g = $("#x_g").val(); //买小的金额
        var dan_g = $("#dan_g").val(); //买单的金额
        var shuang_g = $("#shuang_g").val(); //买双的金额
        var dd_g = $("#dd_g").val(); //买大单的金额
        var ds_g = $("#ds_g").val(); //买大双的金额
        var xd_g = $("#xd_g").val(); //买小单的金额
        var xs_g = $("#xs_g").val(); //买小双的金额
        var jd_g = $("#jd_g").val(); //买极大的金额
        var jx_g = $("#jx_g").val(); //买极小的金额
        var l_g = $("#l_g").val(); //买龙的金额
        var h_g = $("#h_g").val(); //买虎的金额
        var b_g = $("#b_g").val(); //买豹的金额
        var dz_g = $("#dz_g").val(); //买对子的金额
        var sz_g = $("#sz_g").val(); //买顺子的金额
        var bz_g = $("#bz_g").val(); //买豹子的金额
        var strVar = "";
        var nickname = cache.get("nickname"); //获取昵称
        var userpic = cache.get("userpic"); //获取头像
        var data = ""; //获取 100,大|200,小 格式
        var numcolor = ""; //气泡颜色
        strVar += "<div class=\"clearfloat\">\n";
        if (message.showMsgTime) {
            var now = (new Date()).toLocaleString(); //获取时间
            message.showMsgTime = false;
            strVar += "                            <div class=\"author-name\">\n";
            strVar += "                                <small class=\"chat-date\">" + now + "<\/small>\n";
            strVar += "                            <\/div>\n";
        }
        strVar += "                            <div class=\"right\">\n";
        var num = Math.random(); //Math.random()：得到一个0到1之间的随机数
        num = Math.ceil(num * 4); //num*4的取值范围在0~4之间,使用向上取整就可以得到一个1~4的随机数
        strVar += "                                <div class=\"chat-message" + num + " bgd-roomvip-iocn" + num + "\">\n";
        strVar += "<div class=\"clearfloat-tb\"><img src=\"images/qishu3.png\" /><\/div>\n";
        strVar += "                                	<div class=\"clearfloat-qs\">第" + publicVar.qs + "期<\/div>\n";
        if (d_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(d_g) + "<\/span><span>大<\/span><\/div>\n";
            data += "" + parseInt(d_g) + ",大|";
        } //买大的金额
        if (x_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(x_g) + "<\/span><span>小<\/span><\/div>\n";
            data += "" + parseInt(x_g) + ",小|";
        } //买小的金额
        if (dan_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(dan_g) + "<\/span><span>单<\/span><\/div>\n";
            data += "" + parseInt(dan_g) + ",单|";
        } //买单的金额
        if (shuang_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(shuang_g) + "<\/span><span>双<\/span><\/div>\n";
            data += "" + parseInt(shuang_g) + ",双|";
        } //买双的金额
        if (dd_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(dd_g) + "<\/span>大单<span><\/span><\/div>\n";
            data += "" + parseInt(dd_g) + ",大单|";
        } //买大单的金额
        if (ds_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(ds_g) + "<\/span>大双<span><\/span><\/div>\n";
            data += "" + parseInt(ds_g) + ",大双|";
        } //买大双的金额
        if (xd_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(xd_g) + "<\/span>小单<span><\/span><\/div>\n";
            data += "" + parseInt(xd_g) + ",小单|";
        } //买小单的金额
        if (xs_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(xs_g) + "<\/span>小双<span><\/span><\/div>\n";
            data += "" + parseInt(xs_g) + ",小双|";
        } //买小双的金额
        if (jd_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(jd_g) + "<\/span>极大<span><\/span><\/div>\n";
            data += "" + parseInt(jd_g) + ",极大|";
        } //买极大的金额
        if (jx_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(jx_g) + "<\/span>极小<span><\/span><\/div>\n";
            data += "" + parseInt(jx_g) + ",极小|";
        } //买极小的金额
        if (l_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(l_g) + "<\/span>龙<span><\/span><\/div>\n";
            data += "" + parseInt(l_g) + ",龙|";
        } //买龙的金额
        if (h_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(h_g) + "<\/span>虎<span><\/span><\/div>\n";
            data += "" + parseInt(h_g) + ",虎|";
        } //买虎的金额
        if (b_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(b_g) + "<\/span>豹<span><\/span><\/div>\n";
            data += "" + parseInt(b_g) + ",豹|";
        } //买豹的金额
        if (dz_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(dz_g) + "<\/span>对子<span><\/span><\/div>\n";
            data += "" + parseInt(dz_g) + ",对子|";
        } //买龙的金额
        if (sz_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(sz_g) + "<\/span>顺子<span><\/span><\/div>\n";
            data += "" + parseInt(sz_g) + ",顺子|";
        } //买虎的金额
        if (bz_g != 0) {
            strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(bz_g) + "<\/span>豹子<span><\/span><\/div>\n";
            data += "" + parseInt(bz_g) + ",豹子|";
        } //买豹的金额
        for (var t = 0; t < 28; t++) {
            var tmval = $("#" + t + "_").val();
            if (tmval != "0" && tmval != "" && typeof (tmval) != "undefined") {
                strVar += "<div class=\"clearfloat-cont\"><span>" + parseInt(tmval) + "<\/span>点" + t + "<span><\/span><\/div>\n";
                data += "" + parseInt(tmval) + ",点" + t + "|";
            }
        }
        strVar += "                                <\/div>\n";
        strVar += "								   <div class=\"chat-right\">\n";
        strVar += "                                    <div class=\"chat-avatars\"><img src=\"" + userpic + "\" alt=\"头像\" onerror='javascript:appevent.defaultUserPic(this)/><\/div>\n";
        strVar += "                                    <div class=\"chat-nic\">" + nickname + "<\/div>\n";
        strVar += "                                <\/div>\n";
        strVar += "                            <\/div>\n";
        strVar += "                        <\/div>\n";
        //$("#chatBox").append(strVar);
        data = data.substr(0, data.length - 1); //截取最后一个|号
        data = publicVar.qs + "|" + num + "|" + data;
        message.send_buymessage(data);
        comm.messageScrollTop();
    },

    //加载赔率
    getrule: function () {
        //获取房间ID
        var roomlist = request.roomlist; //comm.getUrlParam("roomlist");
        ///这里需要读取一下缓存，再显示
        var data = cache.get("getrule");
        if (data != null && data != "undefined") {
            $("#DXDSRate_d").html("X" + data["DXDSRate"]);
            $("#DXDSRate_x").html("X" + data["DXDSRate"]);
            $("#DXDSRate_dan").html("X" + data["DXDSRate"]);
            $("#DXDSRate_s").html("X" + data["DXDSRate"]);
            $("#DSRate").html("X" + data["DSRate"]);
            $("#XSRate").html("X" + data["XSRate"]);
            $("#DDRate").html("X" + data["DDRate"]);
            $("#XDRate").html("X" + data["XDRate"]);
            $("#TM0_Rate").html("X" + data["TM0_Rate"]);
            $("#TM1_Rate").html("X" + data["TM1_Rate"]);
            $("#TM2_Rate").html("X" + data["TM2_Rate"]);
            $("#TM3_Rate").html("X" + data["TM3_Rate"]);
            $("#TM4_Rate").html("X" + data["TM4_Rate"]);
            $("#TM5_Rate").html("X" + data["TM5_Rate"]);
            $("#TM6_Rate").html("X" + data["TM6_Rate"]);
            $("#TM7_Rate").html("X" + data["TM7_Rate"]);
            $("#TM8_Rate").html("X" + data["TM8_Rate"]);
            $("#TM9_Rate").html("X" + data["TM9_Rate"]);
            $("#TM10_Rate").html("X" + data["TM10_Rate"]);
            $("#TM11_Rate").html("X" + data["TM11_Rate"]);
            $("#TM12_Rate").html("X" + data["TM12_Rate"]);
            $("#TM13_Rate").html("X" + data["TM13_Rate"]);
            $("#TM14_Rate").html("X" + data["TM14_Rate"]);
            $("#TM15_Rate").html("X" + data["TM15_Rate"]);
            $("#TM16_Rate").html("X" + data["TM16_Rate"]);
            $("#TM17_Rate").html("X" + data["TM17_Rate"]);
            $("#TM18_Rate").html("X" + data["TM18_Rate"]);
            $("#TM19_Rate").html("X" + data["TM19_Rate"]);
            $("#TM20_Rate").html("X" + data["TM20_Rate"]);
            $("#TM21_Rate").html("X" + data["TM21_Rate"]);
            $("#TM22_Rate").html("X" + data["TM22_Rate"]);
            $("#TM23_Rate").html("X" + data["TM23_Rate"]);
            $("#TM24_Rate").html("X" + data["TM24_Rate"]);
            $("#TM25_Rate").html("X" + data["TM25_Rate"]);
            $("#TM26_Rate").html("X" + data["TM26_Rate"]);
            $("#TM27_Rate").html("X" + data["TM27_Rate"]);
            $("#JDRate").html("X" + data["JDRate"]);
            $("#JXRate").html("X" + data["JXRate"]);
            $("#LHBRate_l").html("X" + data["LHBRate"]);
            $("#LHBRate_h").html("X" + data["LHBRate"]);
            $("#LHBRate_b").html("X" + data["LHBRate"]);
            $("#DZRate").html("X" + data["DZRate"]);
            $("#SZRate").html("X" + data["SZRate"]);
            $("#BZRate").html("X" + data["BZRate"]);
        }
        rq(sys.dataapi, {
            action: "getrule",
            roomid: roomlist
        }, function (cb) {
            if (data == null && data == "undefined") {
                return;
            }
            cache.set("getrule", cb.data, 2592000);
            $("#DXDSRate_d").html("X" + cb.data["DXDSRate"]);
            $("#DXDSRate_x").html("X" + cb.data["DXDSRate"]);
            $("#DXDSRate_dan").html("X" + cb.data["DXDSRate"]);
            $("#DXDSRate_s").html("X" + cb.data["DXDSRate"]);
            $("#DSRate").html("X" + cb.data["DSRate"]);
            $("#XSRate").html("X" + cb.data["XSRate"]);
            $("#DDRate").html("X" + cb.data["DDRate"]);
            $("#XDRate").html("X" + cb.data["XDRate"]);
            $("#TM0_Rate").html("X" + cb.data["TM0_Rate"]);
            $("#TM1_Rate").html("X" + cb.data["TM1_Rate"]);
            $("#TM2_Rate").html("X" + cb.data["TM2_Rate"]);
            $("#TM3_Rate").html("X" + cb.data["TM3_Rate"]);
            $("#TM4_Rate").html("X" + cb.data["TM4_Rate"]);
            $("#TM5_Rate").html("X" + cb.data["TM5_Rate"]);
            $("#TM6_Rate").html("X" + cb.data["TM6_Rate"]);
            $("#TM7_Rate").html("X" + cb.data["TM7_Rate"]);
            $("#TM8_Rate").html("X" + cb.data["TM8_Rate"]);
            $("#TM9_Rate").html("X" + cb.data["TM9_Rate"]);
            $("#TM10_Rate").html("X" + cb.data["TM10_Rate"]);
            $("#TM11_Rate").html("X" + cb.data["TM11_Rate"]);
            $("#TM12_Rate").html("X" + cb.data["TM12_Rate"]);
            $("#TM13_Rate").html("X" + cb.data["TM13_Rate"]);
            $("#TM14_Rate").html("X" + cb.data["TM14_Rate"]);
            $("#TM15_Rate").html("X" + cb.data["TM15_Rate"]);
            $("#TM16_Rate").html("X" + cb.data["TM16_Rate"]);
            $("#TM17_Rate").html("X" + cb.data["TM17_Rate"]);
            $("#TM18_Rate").html("X" + cb.data["TM18_Rate"]);
            $("#TM19_Rate").html("X" + cb.data["TM19_Rate"]);
            $("#TM20_Rate").html("X" + cb.data["TM20_Rate"]);
            $("#TM21_Rate").html("X" + cb.data["TM21_Rate"]);
            $("#TM22_Rate").html("X" + cb.data["TM22_Rate"]);
            $("#TM23_Rate").html("X" + cb.data["TM23_Rate"]);
            $("#TM24_Rate").html("X" + cb.data["TM24_Rate"]);
            $("#TM25_Rate").html("X" + cb.data["TM25_Rate"]);
            $("#TM26_Rate").html("X" + cb.data["TM26_Rate"]);
            $("#TM27_Rate").html("X" + cb.data["TM27_Rate"]);
            $("#JDRate").html("X" + cb.data["JDRate"]);
            $("#JXRate").html("X" + cb.data["JXRate"]);
            $("#LHBRate_l").html("X" + cb.data["LHBRate"]);
            $("#LHBRate_h").html("X" + cb.data["LHBRate"]);
            $("#LHBRate_b").html("X" + cb.data["LHBRate"]);
            $("#DZRate").html("X" + cb.data["DZRate"]);
            $("#SZRate").html("X" + cb.data["SZRate"]);
            $("#BZRate").html("X" + cb.data["BZRate"]);
        });
    },

    //加载投注记录
    //start_date时间
    getlotterybuyLog: function (starttime) {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var uid = cache.get("uid");
        if (uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        starttime = Date.parse(new Date(starttime));
        starttime = starttime / 1000 - 28800;
        //var starttime = 1517414400;//这个的时间戳必须获取一天的00：00时间戳
        ///这里需要读取一下缓存，再显示, 
        /*var data = cache.get("getlotterybuyLog_" + starttime + uid);
        //这里有个很坑的操作，就是需要再投注的时候清空今天的记录，不然无法更新今天的记录： cache.del("getlotterybuyLog_" + starttime);
        if (data != null && data != "undefined") {
        var strVar = "";
        for (var i = 0; i < data.length; i++) {
        strVar += "<div class=\"gamere-list\">\n";
        strVar += "<div class=\"gamere-list1\"><span class=\"gamere-list1-span2\">" + cache.get("playmode_" + data[i]["PlayMode"]).PlayModeName + " " + data[i]["ID"] + " " + data[i]["RateRuleTitle"] + "<\/span><span class=\"gamere-list1-span1\">" + data[i]["Time"] + "<\/span><\/div>\n";
        strVar += "            <div class=\"gamere-list1\">开奖结果：" + data[i]["Result"] + "  " + data[i]["ResultType"] + "<\/div>\n";
        strVar += "            <div class=\"gamere-list1\">我的投注：" + data[i]["BuyLottery"] + "<\/div>\n";
        strVar += "            <div class=\"gamere-list1\">中奖金额：" + data[i]["Amount"] + "(含本金)<\/div>\n";
        strVar += "            <div class=\"gamere-list1\">购买ID：" + data[i]["bid"] + "<\/div>\n";
        strVar += "        <\/div>\n";
        }
        $("#gamere-list").html(strVar);
        return;
        }*/
        rq(sys.dataapi, {
            action: "getlist",
            t: "PlayMode"
        }, function (cb) {
            for (var i = 0; i < cb.data.length; i++) {
                cache.set("playmode_" + cb.data[i]["ID"], cb.data[i], 604800);
            }
            rq(sys.userapi, {
                action: "getlotterybuyLog",
                userkey: ukey,
                starttime: starttime
            }, function (cb) {
                var strVar = "";
                if (cb.data == null || cb.data.length < 0) {
                    strVar += "<div class=\"gdata-null\">暂无记录<\/div>\n";
                    $("#gamere-list").html(strVar);
                    return;
                }
                cache.set("getlotterybuyLog_" + starttime + uid, cb.data, 2592000);
                for (var i = 0; i < cb.data.length; i++) {
                    strVar += "<div class=\"gamere-list\">\n";
                    strVar += "<div class=\"gamere-list1\"><span class=\"gamere-list1-span2\">" + cache.get("playmode_" + cb.data[i]["PlayMode"]).PlayModeName + "第" + cb.data[i]["ID"] + "期" + cb.data[i]["RateRuleTitle"] + "<\/span><span class=\"gamere-list1-span1\">" + cb.data[i]["Time"] + "<\/span><\/div>\n";
                    strVar += "            <div class=\"gamere-list1\">开奖结果：" + cb.data[i]["Result"] + "  " + cb.data[i]["ResultType"] + "<\/div>\n";
                    strVar += "            <div class=\"gamere-list1\">我的投注：" + cb.data[i]["BuyLottery"] + "<\/div>\n";
                    strVar += "            <div class=\"gamere-list1\">中奖金额：" + cb.data[i]["Amount"] + "(含本金)<\/div>\n";
                    //strVar += "            <div class=\"gamere-list1\">购买ID：" + cb.data[i]["bid"] + "<\/div>\n";
                    strVar += "        <\/div>\n";
                }
                $("#gamere-list").html(strVar);
            });
        });
    },


    //检查获取投注结果
    getlotteryresult: function () {
        console.log("检查投注结果");
        var buylotteryList = cache.get("buylotteryList");
        if (buylotteryList == null || buylotteryList == "undefined") return;
        if (buylotteryList.length == 0) return;
        var id = buylotteryList[0];

        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined") {
            location.href = "login.html";
            return;
        }
        var uid = cache.get("uid");
        if (uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        console.log("向服务器结单投注：id=" + id);
        rq(sys.userapi, {
            action: "getlotteryresult",
            userkey: ukey,
            id: id
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    console.log("失败", 2);
                    return;
                case 2:
                    comm.tip("登录超时,请重新登录", 2);
                    setTimeout(function () {
                        location.href = "login.html";
                    }, 1000);
                    return;
                case 3:
                    return;
                case 4:
                    console.log("查询数据出错");
                    return;
                case 5:
                    console.log("已经结算");
                    buylotteryList = comm.removeArray(buylotteryList, id);
                    cache.set("buylotteryList", buylotteryList, 86400);
                    //如果还有投注结果没结算的话
                    if (buylotteryList.length > 0) {
                        setTimeout(function () {
                            appevent.getlotteryresult();
                        }, 1000);
                    }
                    return;
                case 6:
                    console.log("查询房间失败");
                    return;
                case 99://表示没有开这一期
                    buylotteryList = comm.removeArray(buylotteryList, id);
                    cache.set("buylotteryList", buylotteryList, 86400);
                    //setTimeout(function () { appevent.getlotteryresult() }, 5000); comm.tip("99"); 
                    return;
                case 999:
                    setTimeout(function () {
                        appevent.getlotteryresult()
                    }, 5000);
                    comm.tip("999");
                    return;
                case 0:
                    //                    buylotteryList.pop(id);
                    buylotteryList = comm.removeArray(buylotteryList, id);
                    cache.set("buylotteryList", buylotteryList, 86400);

                    //                    cache.set("buylotteryid", 0, 86400);
                    //记录最新头奖记录
                    console.log(cb.data);
                    var strmsg = "恭喜你第" + cb.data["LID"] + "期中奖：";
                    if (cb.data["isD"] > 0) {
                        strmsg += " 大";
                    } else if (cb.data["isX"] > 0) {
                        strmsg += " 小";
                    } else if (cb.data["isDan"] > 0) {
                        strmsg += " 单";
                    } else if (cb.data["isShuang"] > 0) {
                        strmsg += " 双";
                    } else if (cb.data["isDD"] > 0) {
                        strmsg += " 大单";
                    } else if (cb.data["isDS"] > 0) {
                        strmsg += " 大双";
                    } else if (cb.data["isXD"] > 0) {
                        strmsg += " 小单";
                    } else if (cb.data["isXS"] > 0) {
                        strmsg += " 小双";
                    } else if (cb.data["isJD"] > 0) {
                        strmsg += " 极大";
                    } else if (cb.data["isJX"] > 0) {
                        strmsg += " 极小";
                    } else if (cb.data["isL"] > 0) {
                        strmsg += " 龙";
                    } else if (cb.data["isH"] > 0) {
                        strmsg += " 虎";
                    } else if (cb.data["isB"] > 0) {
                        strmsg += " 豹";
                    } else if (cb.data["isTM"] > -1) {
                        strmsg += " 特码" + cb.data["isTM"] + "";
                    } else if (cb.data["isDSBZ"] == 1) {
                        strmsg += " 对子";
                    } else if (cb.data["isDSBZ"] == 2) {
                        strmsg += " 顺子";
                    } else if (cb.data["isDSBZ"] == 3) {
                        strmsg += " 豹子";
                    } else {
                        comm.information("很遗憾一个都没中");
                        appevent.userpinfo();
                        $("#petalbox").hide();
                        return;
                    }

                    strmsg += " 获得金额" + cb.data["Amount"];
                    comm.information(strmsg);
                    $("#petalbox").show();
                    comm.petalbox(); //下落红包
                    setTimeout(function () {
                        $("#petalbox").hide();
                    }, 6500);
                    /***获取今天时间***/
                    var mydate = new Date();
                    var str = "" + mydate.getFullYear();
                    var mm = mydate.getMonth() + 1
                    if (mydate.getMonth() > 9) {
                        str += "-" + mm + "-";
                    } else {
                        str += "-0" + mm + "-";
                    }
                    if (mydate.getDate() > 9) {
                        str += mydate.getDate();
                    } else {
                        str += "0" + mydate.getDate();
                    }
                    str = Date.parse(new Date(str));
                    str = str / 1000 - 28800;
                    cache.del("getlotterybuyLog_" + str + uid); //清空今天保存投注记录
                    appevent.userpinfo(); //刷新余额

                    //如果还有投注结果没结算的话
                    if (buylotteryList.length > 0) {
                        setTimeout(function () {
                            appevent.getlotteryresult();
                        }, 1000);
                    }
                    break;
            }


        });

    },

    /**投注按钮是否收盘**/
    betbnt: function () {
        if (publicVar.canbuy) {
            $("#emoji-box").hide(); //如果元素为隐藏,则将它显现
            $("#emoji-div").hide();
            $("#bet").show();
            $("#Maskss").show(); //使其遮罩下方内容不可滚动
            $("#head4").hide(); //如果元素为显现,则将其隐藏
            $(".header3-gd").removeAttr("style");
        } else {
            comm.tip("已封盘，禁止投注", 2);
            return;
        }
    },

    /***获取手机验证码**/
    phonecode: function (ukey, phone) {
        rq(sys.sendcodeapi, {
            action: "phone",
            userkey: ukey,
            phone: phone
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("发送失败", 2);
                    return;
                case 2:
                    comm.tip("请重新登录", 2);
                    return;
                case 3:
                    comm.tip("请不要频繁获取验证码", 2);
                    return;
                case 4:
                    comm.tip("用户没有绑定手机", 2);
                    return;
                case 0:
                    comm.tip("发送成功", 2);
                    return;
            }
        });
    },

    /***获取邮箱验证码**/
    emailcode: function (ukey, email) {
        rq(sys.sendcodeapi, {
            action: "email",
            userkey: ukey,
            email: email
        }, function (cb) {
            switch (cb.code) {
                case 1:
                    comm.tip("发送失败", 2);
                    return;
                case 2:
                    comm.tip("请重新登录", 2);
                    return;
                case 3:
                    comm.tip("请不要频繁获取验证码", 2);
                    return;
                case 4:
                    comm.tip("用户没有绑定Email", 2);
                    return;
                case 0:
                    comm.tip("发送成功", 2);
                    return;
            }
        });
    },

    //根据ukey获取手机验证码
    clickButtonukeyphone: function (obj) {
        obj = $(obj);
        obj.attr("disabled", "disabled");
        /*按钮倒计时*/
        var time = 60;
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined") {
            location.href = "login.html";
            return;
        }
        appevent.phonecode(ukey, "");
        var set = setInterval(function () {
            obj.val(--time + "(s)");
        }, 1000);
        /*等待时间*/
        setTimeout(function () {
            obj.attr("disabled", false).val("重新获取");
            /*倒计时*/
            clearInterval(set);
        }, 60000);
    },
    //根据ukey获取邮箱验证码
    clickButtonukeyemail: function (obj) {
        obj = $(obj);
        obj.attr("disabled", "disabled");
        /*按钮倒计时*/
        var time = 60;
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined") {
            location.href = "login.html";
            return;
        }
        appevent.emailcode(ukey, "");
        var set = setInterval(function () {
            obj.val(--time + "(s)");
        }, 1000);
        /*等待时间*/
        setTimeout(function () {
            obj.attr("disabled", false).val("重新获取");
            /*倒计时*/
            clearInterval(set);
        }, 60000);
    },

    //获取验证码加手机参数
    clickButtonphone: function (obj) {
        obj = $(obj);
        obj.attr("disabled", "disabled");
        /*按钮倒计时*/
        var time = 60;
        var phone = $("#phone").val(); //手机号
        var phone1 = /^[1]{1}[0-9]{10}/; //手机号格式正则表达
        if (phone.length == 0 || phone == "") {
            comm.tip("请输入手机号码", 2);
            obj.attr("disabled", false).val("获取验证码");
            /*倒计时*/
            clearInterval(set);
            return;
        } else if (!phone1.test(phone)) {
            comm.tip("请输入合法的手机号", 2);
            obj.attr("disabled", false).val("获取验证码");
            /*倒计时*/
            clearInterval(set);
            return;
        }
        appevent.phonecode("", phone);
        var set = setInterval(function () {
            $("#registeryzm").addClass("register-yzm");
            $("#registeryzm").removeClass("register-yzm1");
            obj.val(--time + "(s)");
        }, 1000);
        /*等待时间*/
        setTimeout(function () {
            $("#registeryzm").removeClass("register-yzm");
            $("#registeryzm").addClass("register-yzm1");
            obj.attr("disabled", false).val("重新获取");
            /*倒计时*/
            clearInterval(set);
        }, 60000);
    },

    //获取验证码加邮箱参数
    clickButtonname: function (obj) {
        obj = $(obj);
        obj.attr("disabled", "disabled");
        /*按钮倒计时*/
        var time = 60;
        var email = $("#email").val();
        var email2 = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/;
        if (email.length == 0 || email == "") {
            comm.tip("请输入Email", 2);
            obj.attr("disabled", false).val("获取验证码");
            /*倒计时*/
            clearInterval(set);
            return;
        } else if (!email2.test(email)) {
            comm.tip("请输入正确邮箱", 2);
            obj.attr("disabled", false).val("获取验证码");
            /*倒计时*/
            clearInterval(set);
            return;
        }
        appevent.emailcode("", email);
        var set = setInterval(function () {
            $("#registeryzm1").addClass("register-yzm");
            $("#registeryzm1").removeClass("register-yzm1");
            obj.val(--time + "(s)");
        }, 1000);
        /*等待时间*/
        setTimeout(function () {
            $("#registeryzm1").removeClass("register-yzm");
            $("#registeryzm1").addClass("register-yzm1");
            obj.attr("disabled", false).val("重新获取");
            /*倒计时*/
            clearInterval(set);
        }, 60000);
    },

    /***主页加载玩法***/
    playmode: function (_cb) {
        var isLoad = true;
        var playmodes = cache.get("playmodes");
        if (playmodes != null || playmodes == "" || playmodes == 0 || playmodes == "undefined") {
            isLoad = false;
            var strVar = "";
            for (var i = 0; i < playmodes.length; i++) {
                strVar += "<div class=\"img\" data-id=\"" + playmodes[i]["ID"] + "\"><img src=\"" + playmodes[i]["BgImage"] + "\" /><\/div>\n";
                if (playmodes[i]["ID"] == 1) {
                    strVar += "<div id=\"wfdiv1\" style=\"width:1.8rem; height:0.45rem;position:absolute; top:3.99rem; left:38%; z-index:100; display: none\" onclick=\"window.location.href='" + playmodes[0]["Link"] + "&typeid=1'\"><\/div>\n";
                }
                if (playmodes[i]["ID"] == 2) {
                    strVar += "<div id=\"wfdiv\" style=\"width:1.8rem; height:0.45rem;position:absolute; top:3.99rem; left:38%; z-index:100;\" onclick=\"window.location.href='" + playmodes[1]["Link"] + "&typeid=1'\"><\/div>\n";
                }
            }
            strVar += "<div class=\"img\" data-id=\"0\"><img src=\"images/jqqd.png\" /><\/div>\n";
            $("#slide").hide();
            $("#slide").html(strVar);
            comm.tabimg(); //图片切换
        }
        rq(sys.dataapi, {
            action: "getlist",
            t: "PlayMode"
        }, function (cb) {
            cache.set("playmodes", cb.data, 86400 * 7); //保存支付类型7天
            if (!isLoad) {
                if (typeof _cb == "function") _cb(true);
                return;
            }

            var strVar = "";
            if (cb.data == null || cb.data == "undefined") {
                strVar += "<div class=\"img\" data-id=\"0\"><img src=\"images/jqqd.png\" /><\/div>\n";
                $("#slide").html(strVar);
                comm.tabimg(0); //图片切换
                if (typeof _cb == "function") _cb(true);
                return;
            }
            for (var i = 0; i < cb.data.length; i++) {
                cache.set("playmode_" + cb.data[i]["ID"], cb.data[i], 604800);
                strVar += "<div class=\"img\" data-id=\"" + cb.data[i]["ID"] + "\"><img src=\"" + cb.data[i]["BgImage"] + "\" /><\/div>\n";
                if (cb.data[i]["ID"] == 1) {
                    strVar += "<div id=\"wfdiv1\" style=\"width:1.8rem; height:0.45rem;position:absolute; top:3.99rem; left:38%; z-index:100; display: none\" onclick=\"window.location.href='" + cb.data[0]["Link"] + "&typeid=1'\"><\/div>\n";
                }
                if (cb.data[i]["ID"] == 2) {
                    strVar += "<div id=\"wfdiv\" style=\"width:1.8rem; height:0.45rem;position:absolute; top:3.99rem; left:38%; z-index:100;\" onclick=\"window.location.href='" + cb.data[1]["Link"] + "&typeid=1'\"><\/div>\n";
                }
            }
            strVar += "<div class=\"img\" data-id=\"0\"><img src=\"images/jqqd.png\" /><\/div>\n";
            $("#slide").hide();
            $("#slide").html(strVar);
            comm.tabimg(); //图片切换
            if (typeof _cb == "function") _cb(true);
        });
    },

    /*检查开关状态*/
    checkswitch: function (_playmodeid, _cb) {
        var _switch = "";
        switch (_playmodeid) {
            case 1:
                _switch = "banbuy1";
                break;
            case 2:
                _switch = "banbuy2";
                break;
            default:
                _switch = "";
                break;
        }
        rq(sys.dataapi, {
            action: "checkswitch",
            _switch: _switch
        }, function (cb) {
            switch (cb.code) {
                case 0: //开
                    if (typeof _cb == "function") _cb(true);
                    return;
                case 1: //关
                    if (typeof _cb == "function") _cb(false);
                    return;
            }
        });
    },

    /******主页加载公告******/
    getnewstitle: function (_cb) {
        rq(sys.dataapi, {
            action: "getnewstitle"
        }, function (cb) {
            var newstitle = "";
            var newsimg = "";
            for (ea in cb.data) {
                if (cb.data[ea]["isTop"] == 1) {
                    newsimg += "                        <div class=\"swiper-slide\">\n";
                    newsimg += "                            <a href=\"newsinfo.html?id=" + cb.data[ea]["ID"] + "\"><img src=\"" + cb.data[ea]["BannerImage"] + "\" alt=\"\" /><\/a><\/div>\n";
                }
                if (cb.data[ea]["isTop"] == 0) {
                    newstitle += "<a class=\"newswidu\" style=\"margin-left:0.3rem;\" href=\"newsinfo.html?id=" + cb.data[ea]["ID"] + "\" >" + cb.data[ea]["Title"] + "<\/a>\n";
                }
            }
            //$("#topnews").show();
            $("#newstitle").html(newstitle);
            $("#newsimg").html(newsimg);
            if (newstitle == "") {
                newstitle += "<span id=\"newswidu\" >暂无公告<\/span>\n";
                $("#newstitle").html(newstitle);
                if (typeof _cb == "function") _cb();
                return;
            }
            if (typeof _cb == "function") _cb();
        });
    },
    //公告跑马灯(暂时用着)
    gonewsLeft: function () {
        var w = 0;
        var html = $("#newswidu").html();
        if (html == "暂无公告") {
            return;
        }
        var newswidu = $(".newswidu");
        if (newswidu.length == 1) {
            $(".newswidu").removeAttr("style");
			w = $(".newswidu").outerWidth();
            if (w < 250) {
                return;
            }
        }else{
			$('.newswidu').each(function () {
            	w += $(this).outerWidth();
        	})
		}
        if (publicVar.newsnum < -w) {
            publicVar.newsnum = 0;
        }
        publicVar.newsnum -= 1;
        $("#newstitle").css({
            left: publicVar.newsnum
        })
    },
    //恭喜跑马灯(暂时用着)
    gotopLeft: function () {
        var s = 0;
        var html = $("#widu").html();
        if (html == "还没有玩家盈利!") {
            return;
        }
        $('.widu').each(function () {
            s += $(this).outerWidth();
        })
        if (publicVar.topnum < -s) {
            publicVar.topnum = 0;
        }
        publicVar.topnum -= 1;
        $("#toplottery").css({
            left: publicVar.topnum
        })
    },
    UsegonewsLeft: function () {
        setInterval(appevent.gonewsLeft, 20);
    },
    UsegotopLeft: function () {
        setInterval(appevent.gotopLeft, 20);
    },

    /*********读取游戏介绍、赔率说明公告详细内容********/
    getnewsinfo: function () {
        //获取公告ID
        var id = request.id; //comm.getUrlParam("roomlist");
        var typeid = request.typeid;
        //判断公告ID是否为空
        if (id == null || id == "") {
            location.href = "index.html";
            return;
        }
        rq(sys.dataapi, {
            action: "getnewsinfo",
            id: id
        }, function (cb) {
            var strVar = "";
            if (typeid == "" || typeid == null || typeid == "undefined") {
                strVar += "<div class=\"details1\">\n";
                strVar += "                        <p class=\"size4\">" + cb.data["Title"] + "<\/p>\n";
                strVar += "<p class=\"size3\">" + comm.formatDate(cb.data["AddTime"], 2) + "<\/p>\n";
                strVar += "                    <\/div>\n";
                strVar += "                    <div class=\"details2\">\n";
                strVar += "                        <span>" + cb.data["Context"] + "<\/span>\n";
                strVar += "                    <\/div>\n";
                $("#menu2").html("公告");
            } else {
                strVar += "                    <div class=\"details2\">\n";
                strVar += "                        <span>" + cb.data["Context"] + "<\/span>\n";
                strVar += "                    <\/div>\n";
                $("#menu2").html(cb.data["Title"]);
            }
            $("#details").html(strVar);
        });
    },

    /*********读取公告详细内容********/
    getnewstype: function () {
        //获取公告ID
        var id = request.id; //comm.getUrlParam("roomlist");
        //判断公告ID是否为空
        if (id == null || id == "") {
            location.href = "index.html";
            return;
        }
        rq(sys.dataapi, {
            action: "getnewsinfo",
            id: id
        }, function (cb) {
            var strVar = "";
            strVar += "                    <div class=\"details2\">\n";
            strVar += "                        <span>" + cb.data["Context"] + "<\/span>\n";
            strVar += "                    <\/div>\n";
            $("#details").html(strVar);
            $("#menu2").html(cb.data["Title"]);
        });
    },

    /*******获取最新一期盈利最高的玩家*******/
    gettoplottery: function (playmodeid, _cb) {
        var goldname = cache.get("goldname"); //读取金钱单位
        if (goldname == null || goldname == "" || goldname == "undefined") {
            goldname = "";
        }
        rq(sys.dataapi, {
            action: "gettoplottery",
            playmodeid: playmodeid
        }, function (cb) {
            var strVar = "";
            /*if (cb.data == "" || cb.data == null) {
            //strVar += "<span id=\"widu\">还没有玩家盈利!<\/span>\n"; $("#toplottery").html(strVar);
            if (typeof _cb == "function") _cb();
            return;
            }*/
            for (ea in cb.data) {
                if (playmodeid == 1) {
                    strVar += "<span  class=\"widu\" style=\"margin-left:0.3rem;\">" + cb.data[ea]["NickName"] + "在北京第" + cb.data[ea]["LID"] + "期盈利" + cb.data[ea]["Amount"] + goldname + "!<\/span>\n";
                }
                if (playmodeid == 2) {
                    strVar += "<span  class=\"widu\" style=\"margin-left:0.3rem;\">" + cb.data[ea]["NickName"] + "在加拿大第" + cb.data[ea]["LID"] + "期盈利" + cb.data[ea]["Amount"] + goldname + "!<\/span>\n";
                }
            }
            if (playmodeid == 1) {
                if (strVar == "") {
                    ;
                    if (typeof _cb == "function") _cb();
                    return;
                }
            } else {
                if (strVar == "") {
                    strVar += "<span id=\"widu\">还没有玩家盈利!<\/span>\n";
                    $("#toplottery").html(strVar);
                    if (typeof _cb == "function") _cb();
                    return;
                }
            }
            //$("#topnews").show();
            var html = $("#toplottery").html();
            $("#toplottery").html(html + strVar);
            if (typeof _cb == "function") _cb();
        });
    },

    /*****日排行榜统计******/
    topday: function (playmode) {
        var goldname = cache.get("goldname");
        if (goldname == "" || goldname == 0 || goldname == "undefined") {
            location.href = "index.html";
            return;
        }
        rq(sys.dataapi, {
            action: "topday",
            playmode: playmode
        }, function (cb) {
            var strVar = "";
            var top2 = "";
            var top1 = "";
            var top3 = "";
            var num = 0;
            if (cb.data == null) {
                strVar += "<div class=\"top-null\">暂无数据<\/div>\n";
                $("#ann-cont").html(strVar);
                $("#ann-top2").html(top2);
                $("#ann-top1").html(top1);
                $("#ann-top3").html(top3);
                $("#ann-top").hide();
                return;
            }
            //if (cb.data.length < 3) { strVar += "<div class=\"top-null\">还没有人上榜<\/div>\n"; $("#ann-cont").html(strVar); $("#ann-top2").html(top2); $("#ann-top1").html(top1); $("#ann-top3").html(top3); $("#ann-top").hide(); return; }
            for (var i = 0; i < cb.data.length; i++) {
                $("#ann-top").show();
                num++;
                if (i == 1) {
                    /*top2 += "						   <div class=\"ann-top-img2\" style=\"background-image:url(" + cb.data[i]["UserPic"] + ")\"><\/div>\n";
                    top2 += "                        <div>" + cb.data[i]["NickName"] + "<\/div>\n";
                    top2 += "                        <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + "<\/div>\n";*/
                    top2 += "<div class=\"ann-top-img2\"> \n";
                    top2 += "                        <img src=\"" + cb.data[i]["UserPic"] + "\" class=\"top-imgcont\" onerror='appevent.defaultUserPic(this)'>\n";
                    top2 += "                    <\/div>\n";
                    top2 += "                    <div class=\"bgd-ann-icon ann-icon3 ann-icon-top2\"><span class=\"ann-top-span\">第二名<\/span><\/div>\n";
                    top2 += "                    <div class=\"bgd-ann-icon ann-icon4 ann-icon-top3\"><\/div>\n";
                    top2 += "                    <div class=\"ann-top-name\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    top2 += "                    <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                }
                if (i == 0) {
                    /*top1 += "						   <div class=\"ann-top-img\" style=\"background-image:url(" + cb.data[i]["UserPic"] + ")\"><\/div>\n";
                    top1 += "                        <div>" + cb.data[i]["NickName"] + "<\/div>\n";
                    top1 += "                        <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + "<\/div>\n";*/
                    top1 += "<div class=\"ann-top-img\">\n";
                    top1 += "                    	<img src=\"" + cb.data[i]["UserPic"] + "\" class=\"top-imgcont\" onerror='appevent.defaultUserPic(this)'>\n";
                    top1 += "                    <\/div>\n";
                    top1 += "                    <div class=\"bgd-ann-icon ann-icon1 ann-icon-top\"><span class=\"ann-top-span\">第一名<\/span><\/div>\n";
                    top1 += "                    <div class=\"bgd-ann-icon ann-icon2 ann-icon-top1\"><\/div>\n";
                    top1 += "                    <div class=\"ann-top-name\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    top1 += "                    <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                }
                if (i == 2) {
                    /*top3 += "						   <div class=\"ann-top-img2\" style=\"background-image:url(" + cb.data[i]["UserPic"] + ")\"><\/div>\n";
                    top3 += "                        <div>" + cb.data[i]["NickName"] + "<\/div>\n";
                    top3 += "                        <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + "<\/div>\n";*/
                    top3 += "<div class=\"ann-top-img2\">\n";
                    top3 += "                    	<img src=\"" + cb.data[i]["UserPic"] + "\" class=\"top-imgcont\" onerror='appevent.defaultUserPic(this)'>\n";
                    top3 += "                    <\/div>\n";
                    top3 += "                    <div class=\"bgd-ann-icon ann-icon5 ann-icon-top4\"><span class=\"ann-top-span\">第三名<\/span><\/div>\n";
                    top3 += "                    <div class=\"bgd-ann-icon ann-icon6 ann-icon-top5\"><\/div>\n";
                    top3 += "                    <div class=\"ann-top-name\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    top3 += "                    <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                }
                if (i > 2) {
                    strVar += "                    <div class=\"ann-cont1\">\n";
                    strVar += "                        <div class=\"ann-cont2\">" + num + "<\/div>\n";
                    strVar += "                        <div class=\"ann-cont3\"><span style=\"background-image:url(" + cb.data[i]["UserPic"] + ")\"><\/span><\/div>\n";
                    strVar += "                        <div class=\"ann-cont4\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    strVar += "                        <div class=\"ann-cont5\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                    strVar += "                    <\/div>\n";
                }
            }
            $("#ann-top").show();
            $("#ann-cont").html(strVar);
            $("#ann-top2").html(top2);
            $("#ann-top1").html(top1);
            $("#ann-top3").html(top3);
        });
    },

    /*****周排行榜统计******/
    topweek: function (playmode) {
        var goldname = cache.get("goldname");
        if (goldname == "" || goldname == 0 || goldname == "undefined") {
            location.href = "index.html";
            return;
        }
        rq(sys.dataapi, {
            action: "topweek",
            playmode: playmode
        }, function (cb) {
            var strVar = "";
            var top2 = "";
            var top1 = "";
            var top3 = "";
            var num = 0;
            if (cb.data == null) {
                strVar += "<div class=\"top-null\">暂无数据<\/div>\n";
                $("#ann-cont").html(strVar);
                $("#ann-top2").html(top2);
                $("#ann-top1").html(top1);
                $("#ann-top3").html(top3);
                $("#ann-top").hide();
                return;
            }
            //if (cb.data.length < 3) { strVar += "<div class=\"top-null\">还没有人上榜<\/div>\n"; $("#ann-cont").html(strVar); $("#ann-top2").html(top2); $("#ann-top1").html(top1); $("#ann-top3").html(top3);$("#ann-top").hide(); return; }
            for (var i = 0; i < cb.data.length; i++) {
                num++;
                if (i == 1) {
                    top2 += "<div class=\"ann-top-img2\"> \n";
                    top2 += "                        <img src=\"" + cb.data[i]["UserPic"] + "\" class=\"top-imgcont\">\n";
                    top2 += "                    <\/div>\n";
                    top2 += "                    <div class=\"bgd-ann-icon ann-icon3 ann-icon-top2\"><span class=\"ann-top-span\">第二名<\/span><\/div>\n";
                    top2 += "                    <div class=\"bgd-ann-icon ann-icon4 ann-icon-top3\"><\/div>\n";
                    top2 += "                    <div class=\"ann-top-name\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    top2 += "                    <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                }
                if (i == 0) {
                    top1 += "<div class=\"ann-top-img\">\n";
                    top1 += "                    	<img src=\"" + cb.data[i]["UserPic"] + "\" class=\"top-imgcont\">\n";
                    top1 += "                    <\/div>\n";
                    top1 += "                    <div class=\"bgd-ann-icon ann-icon1 ann-icon-top\"><span class=\"ann-top-span\">第一名<\/span><\/div>\n";
                    top1 += "                    <div class=\"bgd-ann-icon ann-icon2 ann-icon-top1\"><\/div>\n";
                    top1 += "                    <div class=\"ann-top-name\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    top1 += "                    <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                }
                if (i == 2) {
                    top3 += "<div class=\"ann-top-img2\">\n";
                    top3 += "                    	<img src=\"" + cb.data[i]["UserPic"] + "\" class=\"top-imgcont\">\n";
                    top3 += "                    <\/div>\n";
                    top3 += "                    <div class=\"bgd-ann-icon ann-icon5 ann-icon-top4\"><span class=\"ann-top-span\">第三名<\/span><\/div>\n";
                    top3 += "                    <div class=\"bgd-ann-icon ann-icon6 ann-icon-top5\"><\/div>\n";
                    top3 += "                    <div class=\"ann-top-name\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    top3 += "                    <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                }
                if (i > 2) {
                    strVar += "                    <div class=\"ann-cont1\">\n";
                    strVar += "                        <div class=\"ann-cont2\">" + num + "<\/div>\n";
                    strVar += "                        <div class=\"ann-cont3\"><span style=\"background-image:url(" + cb.data[i]["UserPic"] + ")\"><\/span><\/div>\n";
                    strVar += "                        <div class=\"ann-cont4\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    strVar += "                        <div class=\"ann-cont5\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                    strVar += "                    <\/div>\n";
                }
            }
            $("#ann-top").show();
            $("#ann-cont").html(strVar);
            $("#ann-top2").html(top2);
            $("#ann-top1").html(top1);
            $("#ann-top3").html(top3);
        });
    },

    /*****月排行榜统计******/
    topmonth: function (playmode) {
        var goldname = cache.get("goldname");
        if (goldname == "" || goldname == 0 || goldname == "undefined") {
            location.href = "index.html";
            return;
        }
        rq(sys.dataapi, {
            action: "topmonth",
            playmode: playmode
        }, function (cb) {
            var strVar = "";
            var top2 = "";
            var top1 = "";
            var top3 = "";
            var num = 0;
            if (cb.data == null) {
                strVar += "<div class=\"top-null\">暂无数据<\/div>\n";
                $("#ann-cont").html(strVar);
                $("#ann-top2").html(top2);
                $("#ann-top1").html(top1);
                $("#ann-top3").html(top3);
                $("#ann-top").hide();
                return;
            }
            for (var i = 0; i < cb.data.length; i++) {
                num++;
                if (i == 1) {
                    top2 += "<div class=\"ann-top-img2\"> \n";
                    top2 += "                        <img src=\"" + cb.data[i]["UserPic"] + "\" class=\"top-imgcont\">\n";
                    top2 += "                    <\/div>\n";
                    top2 += "                    <div class=\"bgd-ann-icon ann-icon3 ann-icon-top2\"><span class=\"ann-top-span\">第二名<\/span><\/div>\n";
                    top2 += "                    <div class=\"bgd-ann-icon ann-icon4 ann-icon-top3\"><\/div>\n";
                    top2 += "                    <div class=\"ann-top-name\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    top2 += "                    <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                }
                if (i == 0) {
                    top1 += "<div class=\"ann-top-img\">\n";
                    top1 += "                    	<img src=\"" + cb.data[i]["UserPic"] + "\" class=\"top-imgcont\">\n";
                    top1 += "                    <\/div>\n";
                    top1 += "                    <div class=\"bgd-ann-icon ann-icon1 ann-icon-top\"><span class=\"ann-top-span\">第一名<\/span><\/div>\n";
                    top1 += "                    <div class=\"bgd-ann-icon ann-icon2 ann-icon-top1\"><\/div>\n";
                    top1 += "                    <div class=\"ann-top-name\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    top1 += "                    <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                }
                if (i == 2) {
                    top3 += "<div class=\"ann-top-img2\">\n";
                    top3 += "                    	<img src=\"" + cb.data[i]["UserPic"] + "\" class=\"top-imgcont\">\n";
                    top3 += "                    <\/div>\n";
                    top3 += "                    <div class=\"bgd-ann-icon ann-icon5 ann-icon-top4\"><span class=\"ann-top-span\">第三名<\/span><\/div>\n";
                    top3 += "                    <div class=\"bgd-ann-icon ann-icon6 ann-icon-top5\"><\/div>\n";
                    top3 += "                    <div class=\"ann-top-name\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    top3 += "                    <div class=\"top-size\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                }
                if (i > 2) {
                    strVar += "                    <div class=\"ann-cont1\">\n";
                    strVar += "                        <div class=\"ann-cont2\">" + num + "<\/div>\n";
                    strVar += "                        <div class=\"ann-cont3\"><span style=\"background-image:url(" + cb.data[i]["UserPic"] + ")\"><\/span><\/div>\n";
                    strVar += "                        <div class=\"ann-cont4\">" + cb.data[i]["NickName"] + "<\/div>\n";
                    strVar += "                        <div class=\"ann-cont5\">盈利：" + cb.data[i]["Money"] + goldname + "<\/div>\n";
                    strVar += "                    <\/div>\n";
                }
            }
            $("#ann-top").show();
            $("#ann-cont").html(strVar);
            $("#ann-top2").html(top2);
            $("#ann-top1").html(top1);
            $("#ann-top3").html(top3);
        });
    },

    /****获取用户推广URL***/
    getuserpushurl: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "getuserpushurl",
            userkey: ukey
        }, function (cb) {
            $("#url-u").val(cb.data);
            $("#linkqr").attr('src', '//api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + cb.data)
        });
    },

    /*****获取推广的用户列表*****/
    getpushuserlist: function (cpage, psize, _cb) {
        if (cpage == 0) cpage = 1; //这个插件是比较坑的，下来的时候必须设置为0，初始化是调用上拉，所以检查到0必须设置回1
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "getpushuserlist",
            userkey: ukey,
            cpage: cpage, //第几页，可选（默认1）
            psize: psize //每页显示多少，可选（默认100）
        }, function (cb) {
            var strVar = "";
            if (cpage == 1 && cb.data == null) {
                strVar += "<div class=\"top-null\">暂无记录<\/div>\n";
                $("#comtentmmrtop").html(strVar);
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            if (cb.data == null) {
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            for (ea in cb.data) {
                strVar += "<div class=\"comtentmmr\">\n";
                strVar += "                        <div class=\"m2-cont\" style=\"width:36%\">" + cb.data[ea]["NickName"] + "<\/div>\n";
                if (cb.data[ea]["LastLoginTime"] == 0) {
                    strVar += "<div class=\"m2-cont\" style=\"width:33%\">未登录<\/div>\n";
                } else {
                    strVar += "                        <div class=\"m1-cont\" style=\"width:33%\">" + comm.formatDate(cb.data[ea]["LastLoginTime"], 2) + "<\/div>\n";
                }
                strVar += "                        <div class=\"m3-cont\" style=\"width:27%\">" + cb.data[ea]["Cash"] + "<\/div>\n";
                strVar += "                    <\/div>\n";
            }
            if (cpage == 1) {
                $("#comtentmmrtop").html(strVar);
            } else {
                var html = $("#comtentmmrtop").html();
                $("#comtentmmrtop").html(html + strVar);
            }
            if (typeof _cb == "function") _cb(cb.data);
        });
    },

    /******统计推广用户数据******/
    pushusercount: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "pushusercount",
            userkey: ukey
        }, function (cb) {
            if (cb.data == null) {
                $("#total").html("0");
                $("#valid").html("0");
                $("#newreg").html("0");
                return;
            }
            $("#total").html(cb.data["total"]);
            $("#valid").html(cb.data["valid"]);
            $("#newreg").html(cb.data["newreg"]);
        });
    },

    /*****统计推广用户的盈亏情况*******/
    pushusercashcount: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "pushusercashcount",
            userkey: ukey
        }, function (cb) {
            if (cb.data == null) {
                $("#totamoney").html("0");
                $("#totalReward").html("0");
                $("#totalWinOrLoss").html("0");
                $("#lastMonthTotalWinOrLoss").html("0");
                return;
            }
            $("#totamoney").html(cb.data["total"]);
            $("#totalReward").html(cb.data["totalReward"]);
            $("#totalWinOrLoss").html(cb.data["totalWinOrLoss"]);
            $("#lastMonthTotalWinOrLoss").html(cb.data["lastMonthTotalWinOrLoss"]);
        });
    },

    /*****读取系统消息的标题*******/
    getsysmsgtitlelist: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var uid = cache.get("uid");
        if (uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.dataapi, {
            action: "getsysmsgtitlelist",
            userkey: ukey
        }, function (cb) {
            if (cb.code == 2) {
                location.href = "login.html";
                return;
            }
            var strVar = "";
            var date = new Date();
            var Y = date.getFullYear() + '/';
            var M = date.getMonth() + 1 + '/';
            var thisdate = Y + M + "1";
            if (cb.data == null) {
                strVar += "<div class=\"top-null\">暂无消息<\/div>\n";
                $("#systemmsg").html(strVar);
                return;
            }
            for (var i = 0; i < cb.data.length; i++) {
                strVar += "<div class=\"comtentmmr\" onclick=\"window.open('news.html?typeid=1&id=" + cb.data[i]["ID"] + "','_self')\">\n"; //typeid=1读取系统消息&typeid=2读取用户消息
                if (cb.data[i]["Status"] == 1) { //状态为已读
                    strVar += "                    <div class=\"m1\"><p>" + cb.data[i]["Title"] + "<\/p><\/div>\n";
                } else {
                    strVar += "                    <div class=\"m1\"><span class=\"unread\" id=\"unread_" + cb.data[i]["ID"] + "\"><\/span><p>" + cb.data[i]["Title"] + "<\/p><\/div>\n";
                }
                strVar += "                    <div class=\"m2\"><p>" + comm.formatDate(cb.data[i]["AddTime"], 1) + "<\/p><\/div>\n";
                strVar += "                <\/div>\n";
            }
            $("#systemmsg").html(strVar);
        });
    },

    /*****读取系统消息的内容*****/
    getsysmessageinfo: function () {
        //获取系统消息ID
        var id = request.id;
        if (id == "" || id == 0 || id == "undefined" || id == null) {
            location.href = "anncen.html";
            return;
        }
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var getsysmessageinfoid = cache.get("getsysmessageinfo_" + id);
        if (getsysmessageinfoid != null || getsysmessageinfoid == "" || getsysmessageinfoid == 0 || getsysmessageinfoid == "undefined") {
            var strVar = "";
            strVar += "<div class=\"details1\">\n";
            strVar += "                        <p class=\"size4\">" + getsysmessageinfoid["Title"] + "<\/p>\n";
            strVar += "<p class=\"size3\">" + comm.formatDate(getsysmessageinfoid["AddTime"], 2) + "<\/p>\n";
            strVar += "                    <\/div>\n";
            strVar += "                    <div class=\"details2\">\n";
            strVar += "                        <p>" + getsysmessageinfoid["Context"] + "<\/p>\n";
            strVar += "                    <\/div>\n";
            $("#details").html(strVar);
        }
        rq(sys.dataapi, {
            action: "getsysmessageinfo",
            id: id,
            userkey: ukey
        }, function (cb) {
            if (cb.code == 2) {
                location.href = "login.html";
                return;
            }
            var strVar = "";
            if (cb.data == null) {
                location.href = "anncen.html";
                return;
            }
            cache.set("getsysmessageinfo_" + id, cb.data, 86400 * 7); //保存7天
            strVar += "<div class=\"details1\">\n";
            strVar += "                        <p class=\"size4\">" + cb.data["Title"] + "<\/p>\n";
            strVar += "<p class=\"size3\">" + comm.formatDate(cb.data["AddTime"], 2) + "<\/p>\n";
            strVar += "                    <\/div>\n";
            strVar += "                    <div class=\"details2\">\n";
            strVar += "                        <p>" + cb.data["Context"] + "<\/p>\n";
            strVar += "<\/div>\n";
            $("#details").html(strVar);
        });
    },

    /******读取用户消息的标题*******/
    getusermsgtitlelist: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        var uid = cache.get("uid");
        if (uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "getusermsgtitlelist",
            userkey: ukey
        }, function (cb) {
            if (cb.code == 2) {
                location.href = "login.html";
                return;
            }
            var strVar = "";
            if (cb.data == null) {
                strVar += "<div class=\"top-null\">暂无消息<\/div>\n";
                $("#mymsg").html(strVar);
                return;
            }
            for (var i = 0; i < cb.data.length; i++) {
                strVar += "<div class=\"comtentmmr\" onclick=\"window.open('news.html?typeid=2&id=" + cb.data[i]["ID"] + "','_self')\">\n"; //typeid=1读取系统消息&typeid=2读取用户消息
                if (cb.data[i]["Status"] == 1) { //状态为已读
                    strVar += "                    <div class=\"m1\"><p>" + cb.data[i]["Title"] + "<\/p><\/div>\n";
                } else {
                    strVar += "                    <div class=\"m1\"><span class=\"unread\" id=\"unread_" + cb.data[i]["ID"] + "\"><\/span><p>" + cb.data[i]["Title"] + "<\/p><\/div>\n";
                }
                strVar += "                    <div class=\"m2\"><p>" + comm.formatDate(cb.data[i]["AddTime"]) + "<\/p><\/div>\n";
                strVar += "                <\/div>\n";
            }
            $("#mymsg").html(strVar);
        });
    },

    /********读取用户消息的内容*********/
    getusermessageinfo: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        //获取用户消息ID
        var id = request.id;
        var getusermessageinfo = cache.get("getusermessageinfo_" + id);
        if (getusermessageinfo != null || getusermessageinfo == "" || getusermessageinfo == 0 || getusermessageinfo == "undefined") {
            var strVar = "";
            strVar += "<div class=\"details1\">\n";
            strVar += "                        <p class=\"size4\">" + getusermessageinfo["Title"] + "<\/p>\n";
            strVar += "<p class=\"size3\">" + comm.formatDate(getusermessageinfo["AddTime"], 2) + "<\/p>\n";
            strVar += "                    <\/div>\n";
            strVar += "                    <div class=\"details2\">\n";
            strVar += "                        <p>" + getusermessageinfo["Context"] + "<\/p>\n";
            strVar += "                    <\/div>\n";
            $("#details").html(strVar);
        }
        rq(sys.userapi, {
            action: "getusermessageinfo",
            userkey: ukey,
            id: id
        }, function (cb) {
            if (cb.code == 2) {
                location.href = "login.html";
                return;
            }
            var strVar = "";
            if (cb.data == null) {
                location.href = "anncen.html";
                return;
            }
            cache.set("getusermessageinfo_" + id, cb.data, 86400 * 7); //保存7天
            strVar += "<div class=\"details1\">\n";
            strVar += "                        <p class=\"size4\">" + cb.data["Title"] + "<\/p>\n";
            strVar += "<p class=\"size3\">" + comm.formatDate(cb.data["AddTime"], 2) + "<\/p>\n";
            strVar += "                    <\/div>\n";
            strVar += "                    <div class=\"details2\">\n";
            strVar += "                        <p>" + cb.data["Context"] + "<\/p>\n";
            strVar += "                    <\/div>\n";
            $("#details").html(strVar);
        });
    },


    /***读取消息条数***/
    getmessagecount: function (_cb) {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            $(".spanmsgnum").hide();
            return;
        }
        var uid = cache.get("uid");
        if (uid == "" || uid == 0 || uid == "undefined" || uid == null) {
            $(".spanmsgnum").hide();
            return;
        }
        var readsum = cache.get("readsum_" + uid); //加载已读总数
        rq(sys.userapi, {
            action: "getmessagecount",
            userkey: ukey
        }, function (cb) {
            if (cb.data == null) {
                $(".spanmsgnum").hide();
                if (typeof _cb == "function") _cb();
                return;
            }
            var sysmsgcount = cb.data["sysmsgcount"];
            var usermsgcount = cb.data["usermsgcount"];
            var sum = parseInt(sysmsgcount) + parseInt(usermsgcount);
            if (parseInt(sum) <= 0) {
                $(".spanmsgnum").hide();
            } else {
                $(".spanmsgnum").show();
                $(".spanmsgnum").html(parseInt(sum));
            }
            if (typeof _cb == "function") _cb();
        });
    },

    /***读取消息内容***/
    getmsgcontext: function () {
        //获取消息类型ID
        var typeid = request.typeid;
        if (typeid == "" || typeid == 0 || typeid == "undefined" || typeid == null) {
            location.href = "anncen.html";
            return;
        }
        if (typeid == 1) { //typeid = 1读取系统消息
            appevent.getsysmessageinfo();
        }
        if (typeid == 2) { //typeid = 2读取用户消息
            appevent.getusermessageinfo();
        }
    },

    /***充值和提现结果**/
    cgtype: function () {
        //获取结果类型
        var type = request.type;
        if (type == "" || type == null) {
            location.href = "index.html";
            return;
        }
        if (type == 1) {
            $(".menu2").html("充值记录");
            var str = "<a class=\"weui_btn weui_btn_primary\" style=\"background: #efa909; width:80%; height:0.8rem; line-height:0.8rem; border-radius:0.1rem;\" href=\"paycord.html\" >充值记录<\/a>\n";
            $("#mrecord").html(str);
            return;
        }
        if (type == 2) {
            $(".menu2").html("提现记录");
            var str = "<a class=\"weui_btn weui_btn_primary\" style=\"background: #efa909; width:80%; height:0.8rem; line-height:0.8rem; border-radius:0.1rem;\" href=\"withdrawrecord.html\" >提现记录<\/a>\n";
            $("#mrecord").html(str);
            return;
        }
    },

    /**表情按钮事件***/
    btnInsertMsg: function (id) {
        var msg = $("#msg").val(); //获取文本框值
        var qqemoji = $("#" + id).attr("alt"); //获取id
        $("#fs_div").show();
        $("#betbnt").hide();
        $("#msg").val(msg + qqemoji);
    },

    /******获取抽奖配置******/
    config: function (_cb) {
        var isLoad = true;
        var turmconfig = cache.get("turmconfig");
        if (turmconfig != null || turmconfig == "" || turmconfig == 0 || turmconfig == "undefined") {
            isLoad = false;
            $("#turnimage").attr("src", turmconfig["TurnImage"]);
            $("#btnStartimg").attr("src", "/images/zhizhen.png");
            $("#load").show();
        }
        rq(sys.truntableapi, {
            action: "config"
        }, function (cb) {
            cache.set("turmconfig", cb.data, 86400 * 365);
            cache.set("RuleNewsId", cb.data["RuleNewsId"], 86400 * 365);
            if (!isLoad) {
                if (typeof _cb == "function") _cb();
                return;
            }
            $("#turnimage").attr("src", cb.data["TurnImage"]);
            $("#btnStartimg").attr("src", "images/zhizhen.png");
            $("#load").show();
            if (typeof _cb == "function") _cb();
        });
    },

    /*********读取抽奖规则********/
    rulenews: function () {
        var rulenewsid = cache.get("RuleNewsId");
        rq(sys.dataapi, {
            action: "getnewsinfo",
            id: rulenewsid
        }, function (cb) {
            var strVar = "";
            strVar += "<span>" + cb.data["Context"] + "<\/span>\n";
            $("#zjcontentlist").html(strVar);
        });
    },

    /********获得用户抽奖次数*******/
    turncount: function () {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.truntableapi, {
            action: "count",
            userkey: ukey
        }, function (cb) {
            $('#cishu').html(cb.data); //读取次数
            cache.set("turncount_" + ukey, cb.data, 86400); //保存抽奖次数
        });
    },

    /********开始抽奖********/
    start: function () {
        if (publicVar.isture) return; // 如果在执行就退出
        publicVar.isture = true; // 标志为 在执行
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        $(".zz").hide();
        var turncount = cache.get("turncount_" + ukey);
        if (turncount == 0) {
            $(".zz").show();
            $(".wcs").show();
            publicVar.isture = false;
            $(".ok-img").on('click', function () {
                $(".wcs").hide();
                $(".zz").hide();
            });
            return;
        }
        rq(sys.truntableapi, {
            action: "start",
            userkey: ukey
        }, function (cb) {
            if (cb.code == 4) {
                $(".texts").html("<br/>必须玩够" + cb.data + "局后才能抽奖");
                $(".zz").show();
                $(".jl-tk").show();
                publicVar.isture = false;
                $(".cjgz-c").on('click', function () {
                    $(".zz").hide();
                    $(".jl-tk").hide();
                });
                $(".ok-img").on('click', function () {
                    $(".zz").hide();
                    $(".jl-tk").hide();
                });
                return;
            }
            var winnum = cb.data["winnum"];
            var count = cb.data["count"];
            $('#cishu').html(count); //读取次数
            cache.set("turncount_" + ukey, count, 86400); //保存抽奖次数
            switch (winnum) {
                case 0:
                    appevent.rotateFunc(1, 340, cb.data["wintext"]);
                    break;
                case 1:
                    appevent.rotateFunc(2, 290, cb.data["wintext"]);
                    break;
                case 2:
                    appevent.rotateFunc(3, 245, cb.data["wintext"]);
                    break;
                case 3:
                    appevent.rotateFunc(4, 203, cb.data["wintext"]);
                    break;
                case 4:
                    appevent.rotateFunc(5, 160, cb.data["wintext"]);
                    break;
                case 5:
                    appevent.rotateFunc(6, 115, cb.data["wintext"]);
                    break;
                case 6:
                    appevent.rotateFunc(7, 70, cb.data["wintext"]);
                    break;
                case 7:
                    appevent.rotateFunc(8, 25, cb.data["wintext"]);
                    break;
            }
        });
    },

    //旋转抽奖
    rotateFunc: function (awards, angle, text) {
        publicVar.isture = true;
        var btn = $('.g-lottery-img'); // 旋转的div
        btn.stopRotate();
        btn.rotate({
            angle: 0, //旋转的角度数
            duration: 4000, //旋转时间
            animateTo: angle + 1440, //给定的角度,让它根据得出来的结果加上1440度旋转
            callback: function () {
                publicVar.isture = false;
                $(".texts").html("恭喜您，已获得<br>" + text);
                $(".zz").show();
                $(".jl-tk").show();
                $(".cjgz-c").on('click', function () {
                    $(".zz").hide();
                    $(".jl-tk").hide();
                });
                $(".ok-img").on('click', function () {
                    $(".zz").hide();
                    $(".jl-tk").hide();
                });
            }
        });
    },


    /******获取抽奖日志******/
    turnlog: function (cpage, psize, _cb) {
        if (cpage == 0) cpage = 1; //这个插件是比较坑的，下来的时候必须设置为0，初始化是调用上拉，所以检查到0必须设置回1
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.truntableapi, {
            action: "log",
            userkey: ukey,
            cpage: cpage,
            psize: psize
        }, function (cb) {
            var strVar = "";
            if (cpage == 1 && cb.data == null) {
                strVar += "<li>暂无记录<\/li>\n";
                $("#zjlist").html(strVar);
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            if (cb.data == null) {
                if (typeof _cb == "function") _cb(cb.data);
                return;
            }
            for (ea in cb.data) {
                strVar += "<li><span>" + comm.formatDate(cb.data[ea]["AddTime"], 1) + "<\/span><span>" + cb.data[ea]["WinText"] + "<\/span><\/li>\n";
            }
            if (cpage == 1) {
                $("#zjlist").html(strVar);
            } else {
                var html = $("#zjlist").html();
                $("#zjlist").html(html + strVar);
            }
            if (typeof _cb == "function") _cb(cb.data);
        });
    },

    /*特殊跳转事件*/
    go: function (url) {
        var pathname = window.location.pathname;
        cache.set("backurl" + pathname, window.location.href, 3600);
        location.href = url;
    },
    /*返回按钮事件*/
    backs: function () {
        var pathname = window.location.pathname;
        //alert(pathname);
        if (pathname.indexOf("setup.html") > -1) {
            //此为手动关闭输入法键盘核心api
            document.activeElement.blur();
            $("input").blur();
            location.href = "personal.html";
            return;
        } else if (pathname.indexOf("login.html") > -1) {
            location.href = "index.html";
            return;
        } else if (pathname.indexOf("cg.html") > -1) {
            location.href = "finance.html";
            return;
        } else if (pathname.indexOf("room.html") > -1) {
            location.href = "index.html";
            return;
        } else if (pathname.indexOf("register.html") > -1) {
            location.href = "login.html";
            return;
        } else if (pathname.indexOf("newpassword.html") > -1) {
            location.href = "login.html";
            return;
        } else if (pathname.indexOf("news.html") > -1) {
            location.href = "anncen.html";
            return;
        } else if (pathname.indexOf("success.html") > -1) {
            location.href = "../finance.html";
            return;
        } else if (pathname.indexOf("bankedit.html") > -1) {
            location.href = "finance.html";
            return;
        } else {
            var url = document.referrer;
            if (url.indexOf("index.html") > -1) {
                location.href = "index.html";
            } else if (url.indexOf('login.html') > -1)
                location.href = "index.html";
            else
                history.back(-1);
        }
    },
    locationhref: function (url) {
        location.href = url;
    },


    /********分享*******/
    share: function (type) {
        appevent.getsharetext(function (context) {
            //$('.btn_wx').attr('data-clipboard-text', context);
            var clipboard = new ClipboardJS('.btn');
            clipboard = new ClipboardJS('.btn', {
                // 点击copy按钮，直接通过text直接返回复印的内容
                text: function () {
                    return context;
                }
            });
            $("#share").removeClass("am-modal-active");
            layer.open({
                content: context,
                style: 'word-wrap: break-word;word-break:break-all;',
                btn: ['复制并分享', '取消分享'],
                yes: function (index) {
                    switch (type) {
                        case 1: //唤醒微信
                            try {
                                window.webkit.messageHandlers.ios.postMessage({
                                    "method": "callapp",
                                    "url": "weixin://",
                                    "context": context
                                });
                            } catch (e) {
                            }
                            try {
                                window.Android.callapp("weixin://", context);
                                layer.close(index);
                                return;
                            } catch (e) {
                            }
                            window.location.href = "weixin://";
                            break;
                        case 2:
                            try {
                                window.webkit.messageHandlers.ios.postMessage({
                                    "method": "callapp",
                                    "url": "mqq://",
                                    "context": context
                                });
                            } catch (e) {
                            }
                            try {
                                window.Android.callqqapp(context);
                                layer.close(index);
                                return;
                            } catch (e) {
                            }
                            window.location.href = "mqqwpa://im/chat";
                            break;
                    }
                    layer.close(index);
                }
            });
        });
    },

    /******读取分享链接******/
    getsharetext: function (_cb) {
        var ukey = cache.get("ukey");
        if (ukey == "" || ukey == 0 || ukey == "undefined" || ukey == null) {
            location.href = "login.html";
            return;
        }
        rq(sys.userapi, {
            action: "getsharetext",
            userkey: ukey
        }, function (cb) {
            switch (cb.code) {
                case 0:
                    if (cb.data == "" || cb.data == null || cb.data == "undefined") {
                        cb.data = "管理员什么都没添加";
                    }
                    $("#url-share").val(cb.data);
                    if (typeof _cb == "function") _cb(cb.data);
                    break;
                case 1:
                    comm.tip("复制失败", 2);
                    break;
                case 2:
                    comm.tip("登录超时", 2);
                    break;
            }
        });
    },

    /******判断是否有网络******/
    wifinull: function (_cb) {
        if (navigator.onLine) {
            $("#wifi").hide();
            $("#main").show();
            if (typeof _cb == "function") _cb(true);
        } else {
            $("#wifi").show();
            $("#main").hide();
            //执行离线状态时的任务
            if (typeof _cb == "function") _cb(false);
        }
    },


    test: function () {
        /*comm.petalbox();
        comm.information("asdasdasdasdal加速度就爱上了凯迪拉克阿喀琉斯登记卡数据来看大家快来撒俺是快乐的健康拉上来看见大家立刻受到卢卡斯的接口连接柯兰多skd");*/
        //var str = cache.get("openlottertext");
        /*var str = undefined;
        str = str.replace('{ID}', '15');
        str = str.replace('{LotteryInfo}', '1+1+1=2');
        alert(str);*/
        $("#petalbox").show();
        comm.petalbox(); //下落红包
        setTimeout(function () {
            $("#petalbox").hide();
        }, 6500);
    },

    end: ""
}

//常用静态方法
var comm = {
    /***********弹出宽*****************/
    //    sharelayerwx: function (con) { //唤醒微信
    //        layer.open({
    //            content: con,
    //            btn: ['复制并分享', '取消分享']
    //			, yes: function (index) {
    //			    try {
    //			        window.webkit.messageHandlers.ios.postMessage({
    //			            "method": "callweixin"
    //                       , "context": con
    //			        });
    //			    } catch (e) { }
    //			    window.location.href = "weixin://";
    //			    layer.close(index);
    //			}
    //        });
    //    },
    //    sharelayerqq: function (con) { //唤醒qq
    //        layer.open({
    //            content: con,
    //            btn: ['复制并分享', '取消分享']
    //			, yes: function (index) {
    //			    try {
    //			        window.webkit.messageHandlers.ios.postMessage({
    //			            "method": "callqq"
    //                      , "context": con
    //			        });
    //			    } catch (e) { }
    //			    window.location.href = "mqqwpa://im/chat";
    //			    layer.close(index);
    //			}
    //        });
    //    },

    /*信息宽
    con:设置弹层内容 类型：String
    bn:按钮
    */
    information: function (con) {
        layer.open({
            style: "background:#1f1f21;border:none;width: 55%;color:#FFF;",
            shade: "background-color: rgba(0,0,0,0.5)",
            content: con, //设置弹层内容 类型：String
            time: 2.5
        });
    },

    /***时间缀转时间**/
    formatDate: function (nows, type) {
        var date = new Date(nows * 1000);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        //var D = date.getDate() + ' ';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        ;
        var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        if (type == 1) {
            return Y + M + D;
        }
        if (type == 2) {
            return Y + M + D + " " + h + m + s;
        }
        return Y + M + D;
    },

    /*提示
    con:设置弹层内容 类型：String
    ti:控制自动关闭层所需秒数 类型：Number 支持整数和浮点数
    */
    tip: function (con, ti) {
        if (ti == null || ti == "undefined") ti = 3;
        layer.open({
            content: con //设置弹层内容 类型：String
            ,
            skin: 'msg' //设定弹层显示风格目前支持配置 footer（即底部对话框风格）、msg（普通提示） 两种风格
            ,
            time: ti //2秒后自动关闭
        });
    },

    /*询问框
    con:设置弹层内容 类型：String
    q:确认内容
    b:取消内容
    */
    inquiry: function (con, q, b) {
        layer.open({
            content: con,
            btn: [q, b],
            yes: function (index) { //类型：Function  点确定按钮触发的回调函数，返回一个参数为当前层的索引
                location.reload();
                layer.close(index);
            }
        });
    },

    //页面层
    /*
     *htmldiv:html内容
     */
    divalert: function (htmldiv) {
        layer.open({
            type: 1,
            content: htmldiv,
            anim: 'up',
            style: 'position:fixed; bottom:0; left:0; width: 100%; height: 5rem; padding:10px 0; border:none;'
        });
    },

    countdown: function (id, next, endTime, cb) { //下一期开奖倒计时
        //clearTimeout(this);
        //计算时间显示分钟：
        let nowtime = Math.floor(new Date().getTime()/1000);
        let nextSeconds = next - nowtime;
        let i = parseInt(nextSeconds / 60);
        let s = parseInt(nextSeconds % 60);
        if (nextSeconds <= endTime + 60 && nextSeconds > endTime) {
            //添加封盘提示：JR
            //倒计时框：还有 nextSeconds - endTime 秒封盘
            var nex = nextSeconds - endTime //总时间-60
            $(id).html("\n" + nex + "<span style=\"color:#eaca6c;\">秒 后封盘<\/span>\n");
        } else if (nextSeconds == endTime) {
            //添加封盘提示：JR
            //聊天框提示：【xxxx期】已封盘，下注结果以系统开奖为准，如有异议，请及时联系客服
            var str = cache.get("stopbuytext");
            if (str == undefined || str == "") {
                str = "";
            }
            str = str.replace('{ID}', publicVar.qs);
            var msgvar = "";
            msgvar += "<div class=\"clearfloat\">\n";
            msgvar += "                            <div class=\"author-name-center\">\n";
            msgvar += "                                <small class=\"chat-date\">" + str + "<\/small>\n";
            msgvar += "                            <\/div>\n";
            msgvar += "                         \n";
            msgvar += "                        <\/div>\n";
            $("#chatBox").append(msgvar);
            //            message.addChatLog(msgvar);
            comm.messageScrollTop();
            $(id).html("<span style=\"color:#eaca6c;\">已封盘<\/span>\n" + nextSeconds + "<span style=\"color:#eaca6c;\">秒 后开奖<\/span>\n");
        }
        //判断是否到结束下单时间
        else if (nextSeconds <= endTime) {
            publicVar.canbuy = false;
            //添加封盘提示
            //倒计时框：已封盘，nextSeconds 秒后开奖
            $(id).html("<span style=\"color:#eaca6c;\">已封盘<\/span>\n" + nextSeconds + "<span style=\"color:#eaca6c;\">秒 后开奖<\/span>\n");
        } else {
            publicVar.canbuy = true;
            $(id).html("<span style=\"color:#eaca6c;\">剩余<\/span>\n" + i + "<span style=\"color:#eaca6c;\">分<\/span>\n" + s + "<span style=\"color:#eaca6c;\">秒<\/span>\n");
        }
        //message.setMessageLog("hide_con");  //保存聊天日志
        nextSeconds--; //倒计时总时间
        if (nextSeconds > 0) {
            setTimeout(function () {
                comm.countdown(id, next, endTime, cb);
            }, 1000);
        } else if (nextSeconds == 0) {
            $(id).html("开奖中...");
            // 设置内容区的滚动条到底部
            comm.messageScrollTop();
            cb(nextSeconds);

        } else {
            $(id).html("开奖中...");
            // 设置内容区的滚动条到底部
            comm.messageScrollTop();
            cb(nextSeconds);
        }
    },
    getrewardlog_Text: function (istype) { //显示我的回水状态
        var TypeName = "";
        switch (istype) {
            case 1:
                TypeName = "取消";
                break;
            case 2:
                TypeName = "确认回水";
                break;
            case 0:
                TypeName = "等待审核";
                break;
        }
        return TypeName;
    },

    Usercashlog_Text: function (istype) { //显示账变记录类型
        var TypeName = "";
        switch (istype) {
            case 1:
                TypeName = "充值";
                break;
            case 2:
                TypeName = "提现";
                break;
            case 3:
                TypeName = "系统扣取";
                break;
            case 4:
                TypeName = "推广收益";
                break;
            case 5:
                TypeName = "投注";
                break;
            case 6:
                TypeName = "回水";
                break;
            case 7:
                TypeName = "中奖";
                break;
            case 8:
                TypeName = "转盘抽奖";
                break;
            case 9:
                TypeName = "取消提现";
                break;
            case 10:
                TypeName = "取消回水";
                break;
            case 11:
                TypeName = "回调";
                break;
            case 12:
                TypeName = "取消推广提成";
                break;
            case 13:
                TypeName = "退款";
                break;
            case 15:
                TypeName = "取消投注";
                break;
        }
        return TypeName;
    },
    UserPayType_Text: function (istype) { //显示支付类型
        var TypeName = "";
        switch (istype) {
            case 1:
                TypeName = "银行卡";
                break;
            case 2:
                TypeName = "支付宝";
                break;
            case 3:
                TypeName = "微信";
                break;
            case 4:
                TypeName = "支付宝扫码";
                break;
            case 5:
                TypeName = "手动充值";
                break;
        }
        return TypeName;
    },
    Userpaymentlog_Text: function (istype) { //显示充值记录类型
        var TypeName = "";
        switch (istype) {
            case 0:
                TypeName = "等待支付";
                break;
            case 1:
                TypeName = "等待审核";
                break;
            case 2:
                TypeName = "支付完成";
                break;
            case 3:
                TypeName = "确认转账";
                break;
            case 4:
                TypeName = "已取消";
                break;
            case 5:
                TypeName = "坏账";
                break;
        }
        return TypeName;
    },
    Usergetrewardlog_Text: function (istype) { //显示回水类型
        switch (istype) {
            case 0:
                TypeName = "等待审核";
                break;
            case 1:
                TypeName = "已取消";
                break;
            case 2:
                TypeName = "确认回水";
                break;
        }
        return TypeName;
    },

    Usercarrycash_Text: function (istype) { //显示提现记录类型
        var TypeName = "";
        switch (istype) {
            case 0:
                TypeName = "等待确认";
                break;
            case 1:
                TypeName = "提现失败";
                break;
            case 2:
                TypeName = "提现成功";
                break;
        }
        return TypeName;
    },

    BigorSmall_Text: function (index, iscolor) { //显示大小
        if (index == 1) return iscolor == 0 ? "小" : "<span style=\" background:#ffa200;\">小</span>";
        else return iscolor == 0 ? "大" : "<span style=\" background:#ffa200;\">大</span>";
    },
    DanOrShuang_Text: function (index, iscolor) { //显示单双
        if (index == 1) return iscolor == 0 ? "单" : "<span style=\" background:#00aa4c;\">单</span>";
        else return iscolor == 0 ? "双" : "<span style=\" background:#00aa4c;\">双</span>";
    },
    ZH_DXDS_Text: function (index, iscolor) { //显示大单小单，
        var ZH_DXDS = "";
        switch (index) {
            case 1:
                ZH_DXDS = iscolor == 0 ? "小单" : "<span style=\" background:#3CC;\">小单</span>";
                break;
            case 2:
                ZH_DXDS = iscolor == 0 ? "小双" : "<span style=\" background:#3CC;\">小双</span>";
                break;
            case 3:
                ZH_DXDS = iscolor == 0 ? "大单" : "<span style=\" background:#3CC;\">大单</span>";
                break;
            case 4:
                ZH_DXDS = iscolor == 0 ? "大双" : "<span style=\" background:#3CC;\">大双</span>";
                break;
        }
        return ZH_DXDS;
    },
    MaxOrMin_Text: function (index, iscolor) {
        if (index == 0) return iscolor == 0 ? "" : "";
        if (index == 1) return iscolor == 0 ? "极小" : "<span style=\" background:#6400ff;\">极小</span>";
        else return iscolor == 0 ? "极大" : "<span style=\" background:#6400ff;\">极大</span>";
    },
    LHB_Text: function (index, iscolor) {
        var LHB = "";
        switch (index) {
            case 1:
                LHB = iscolor == 0 ? "龙" : "<span style=\" background:#ff00e9;\">龙</span>";
                break;
            case 2:
                LHB = iscolor == 0 ? "虎" : "<span style=\" background:#ff00e9;\">虎</span>";
                break;
            case 3:
                LHB = iscolor == 0 ? "豹" : "<span style=\" background:#ff00e9;\">豹</span>";
                break;
        }
        return LHB;
    },

    DSB_Text: function (index, iscolor) {
        var DSB = "";
        switch (index) {
            case 1:
                DSB = iscolor == 0 ? "对子" : "<span style=\" background:#ff00e9;\">对子</span>";
                break;
            case 2:
                DSB = iscolor == 0 ? "顺子" : "<span style=\" background:#ff00e9;\">对子</span>";
                break;
            case 3:
                DSB = iscolor == 0 ? "豹子" : "<span style=\" background:#ff00e9;\">对子</span>";
                break;
        }
        return DSB;
    },

    //打开安全键盘
    openPasswordKeyBoard: function (__callfun) {
        var dialog = YDUI.dialog;
        var $keyboard = $("#SafetyPassword_KeyBoard");
        // 初始化参数
        $keyboard.keyBoard({
            disorder: false, // 是否打乱数字顺序
            title: '安全键盘' // 显示标题
        });
        // 打开键盘
        $keyboard.keyBoard('open');

        // 六位密码输入完毕后执行
        $keyboard.on('done.ydui.keyboard', function (ret) {
            if (typeof __callfun == "function") __callfun(ret.password);


            //            // 弹出请求中提示框
            //            dialog.loading.open('验证支付密码');
            //            // 模拟AJAX校验密码
            //            setTimeout(function () {
            //                // 关闭请求中提示框
            //                dialog.loading.close();
            ////                if (typeof __cb == "function") __cb();
            //            }, 1500);
            //            // 关闭键盘
            //            // $keyboard.keyBoard('close');
        });
    },
    closePasswordKeyBoard: function () {
        var $keyboard = $("#SafetyPassword_KeyBoard");
        $keyboard.keyBoard('close');
    },


    /**图片轮播图**/
    tabimg: function () {
        var autoLb = false; //autoLb=true为开启自动轮播
        var autoLbtime = 1; //autoLbtime为轮播间隔时间（单位秒）
        var touch = true; //touch=true为开启触摸滑动
        var slideBt = true; //slideBt=true为开启滚动按钮
        var slideNub; //轮播图片数量
        $(".slide").height($(".slide").width() * 0.56);
        slideNub = $(".slide .img").length; //获取轮播图片数量
        for (i = 0; i < slideNub; i++) {
            $(".slide .img:eq(" + i + ")").attr("data-slide-imgId", i);
        }

        //根据轮播图片数量设定图片位置对应的class
        if (slideNub == 1) {
            for (i = 0; i < slideNub; i++) {
                $(".slide .img:eq(" + i + ")").addClass("img3");
            }
        }
        if (slideNub == 2) {
            for (i = 0; i < slideNub; i++) {
                $(".slide .img:eq(" + i + ")").addClass("img" + (i + 3));
            }
        }
        if (slideNub == 3) {
            for (i = 0; i < slideNub; i++) {
                $(".slide .img:eq(" + i + ")").addClass("img" + (i + 2));
            }
        }
        if (slideNub > 3 && slideNub < 6) {
            for (i = 0; i < slideNub; i++) {
                $(".slide .img:eq(" + i + ")").addClass("img" + (i + 1));
            }
        }
        if (slideNub >= 6) {
            for (i = 0; i < slideNub; i++) {
                if (i < 5) {
                    $(".slide .img:eq(" + i + ")").addClass("img" + (i + 1));
                } else {
                    $(".slide .img:eq(" + i + ")").addClass("img5");
                }
            }
        }


        //根据轮播图片数量设定轮播图按钮数量
        if (slideBt) {
            for (i = 1; i <= slideNub; i++) {
                $(".slide-bt").append("<span data-slide-bt='" + i + "' onclick='comm.tz(" + i + ")'></span>");
            }
            $(".slide-bt").width(slideNub * 34);
            $(".slide-bt").css("margin-left", "-" + slideNub * 17 + "px");
        }


        //自动轮播
        if (autoLb) {
            setInterval(function () {
                comm.right();
            }, autoLbtime * 1000);
        }


        if (touch) {
            comm.k_touch();
        }
        comm.slideLi();
        comm.imgClickFy();
    },

    //右滑动
    right: function () {
        var slideNub; //轮播图片数量
        slideNub = $(".slide .img").length; //获取轮播图片数量
        var fy = new Array();
        for (i = 0; i < slideNub; i++) {
            fy[i] = $(".slide .img[data-slide-imgId=" + i + "]").attr("class");
        }
        for (i = 0; i < slideNub; i++) {
            if (i == 0) {
                $(".slide .img[data-slide-imgId=" + i + "]").attr("class", fy[slideNub - 1]);
            } else {
                $(".slide .img[data-slide-imgId=" + i + "]").attr("class", fy[i - 1]);
            }
        }
        comm.imgClickFy();
        comm.slideLi();
    },

    //左滑动
    left: function () {
        var slideNub; //轮播图片数量
        slideNub = $(".slide .img").length; //获取轮播图片数量
        var fy = new Array();
        for (i = 0; i < slideNub; i++) {
            fy[i] = $(".slide .img[data-slide-imgId=" + i + "]").attr("class");
        }
        for (i = 0; i < slideNub; i++) {
            if (i == (slideNub - 1)) {
                $(".slide .img[data-slide-imgId=" + i + "]").attr("class", fy[0]);
            } else {
                $(".slide .img[data-slide-imgId=" + i + "]").attr("class", fy[i + 1]);
            }
        }
        comm.imgClickFy();
        comm.slideLi();
    },

    //轮播图片左右图片点击翻页
    imgClickFy: function () {
        $(".slide .img").removeAttr("onclick");
        $(".slide .img2").attr("onclick", "comm.left()");
        $(".slide .img4").attr("onclick", "comm.right()");
        $(".slide .img3").attr("onclick", "comm.gotoroom(2)");
    },


    /**检查维护状态**/
    gotoroom: function (playmodeid) {
        var CloseTimeTipText = cache.get("CloseTimeTipText" + playmodeid);
        var BanPlayMode = cache.get("BanPlayMode" + playmodeid);
        if (CloseTimeTipText == null || CloseTimeTipText == "" || CloseTimeTipText == "undefined" || BanPlayMode == null || BanPlayMode == "" || BanPlayMode == "undefined") {
            location.href = "index.html";
            return;
        }
        appevent.checkswitch(playmodeid, function (_cb) {
            if (_cb) {
                if (appevent.checkPlayTime(playmodeid)) window.location.href = 'room.html?playid=' + playmodeid;
                else {
                    comm.tip(CloseTimeTipText, 2);
                }
            } else {
                comm.tip(BanPlayMode, 2);
            }
        });
    },

    //修改当前最中间图片对应按钮选中状态
    slideLi: function () {
        //var slideList = parseInt($(".slide .img3").attr("data-slide-imgId"))+1 ;
        var slideList = parseInt($(".slide .img3").attr("data-id"));
        if (slideList == 1) { //1北京
            //$(".slide .img3").attr("onclick", "window.open('room.html?playid=1','_self')");
            $(".slide .img3").attr("onclick", "comm.gotoroom(" + slideList + ")");
            $("#wfdiv1").show();
            $("#wfdiv").hide();
        }
        if (slideList == 2) { //2加拿大
            //$(".slide .img3").attr("onclick", "window.open('room.html?playid=2','_self')");
            $(".slide .img3").attr("onclick", "comm.gotoroom(" + slideList + ")");
            $("#wfdiv").show();
            $("#wfdiv1").hide();
        }
        if (slideList == 0) { //3尽情期待删除点击事件
            $(".slide .img3").removeAttr("onclick");
            $("#wfdiv").hide();
            $("#wfdiv1").hide();
        }
        $(".slide-bt span").removeClass("on");
        $(".slide-bt span[data-slide-bt=" + slideList + "]").addClass("on");
    },

    //轮播按钮点击翻页
    tz: function (id) {
        var tzcs = id - (parseInt($(".slide .img3").attr("data-slide-imgId")) + 1);
        if (tzcs > 0) {
            for (i = 0; i < tzcs; i++) {
                setTimeout(function () {
                    comm.right();
                }, 1);
            }
        }
        if (tzcs < 0) {
            tzcs = (-tzcs);
            for (i = 0; i < tzcs; i++) {
                setTimeout(function () {
                    comm.left();
                }, 1);
            }
        }
        comm.slideLi();
    },

    //触摸滑动模块
    k_touch: function () {
        var _start = 0,
            _end = 0,
            _content = document.getElementById("slide");
        _content.addEventListener("touchstart", touchStart, false);
        _content.addEventListener("touchmove", touchMove, false);
        _content.addEventListener("touchend", touchEnd, false);

        function touchStart(event) {
            var touch = event.targetTouches[0];
            _start = touch.pageX;
        }

        function touchMove(event) {
            var touch = event.targetTouches[0];
            _end = (_start - touch.pageX);
        }

        function touchEnd(event) {
            if (_end < -100) {
                comm.left();
                _end = 0;
            } else if (_end > 100) {
                comm.right();
                _end = 0;
            }
        }
    },

    /**
     * 请勿重复提交
     */
    repeatsubmit: function () {
        comm.tip("请勿重复提交", 2);
    },

    /**下落红包**/
    petalbox: function () {
        var NUMBER_OF_LEAVES = 80;
        /* Get a reference to the element that will contain the leaves */
        var container = document.getElementById('petalbox');
        /* Fill the empty container with new leaves */
        try {
            for (var i = 0; i < NUMBER_OF_LEAVES;

                 i++) {
                container.appendChild(comm.createALeaf());
            }
        } catch (e) {
        }
    },

    /****禁用手指双击缩放****/
    touchendpreventDefault: function () {
        var lastTouchEnd = 0;
        document.documentElement.addEventListener('touchend', function (event) {
            var now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    },

    /***红包**/
    createALeaf: function () {
        /* Start by creating a wrapper div, and an empty img element */
        var leafDiv = document.createElement('div');
        var image = document.createElement('img');

        /* Randomly choose a leaf image and assign it to the newly created element */
        image.src = 'images/hb/petal' + comm.randomInteger(1, 10) + '.png';

        /* Position the leaf at a random location along the screen */
        leafDiv.style.top = comm.pixelValue(comm.randomInteger(-200, -100));
        leafDiv.style.left = comm.pixelValue(comm.randomInteger(0, 1920));

        /* Randomly choose a spin animation */
        var spinAnimationName = (Math.random() < 0.5) ? 'clockwiseSpin' : 'counterclockwiseSpinAndFlip';
        /* Set the -webkit-animation-name property with these values */
        leafDiv.style.webkitAnimationName = 'fade, drop';
        leafDiv.style.animationName = 'fade, drop';
        image.style.webkitAnimationName = spinAnimationName;
        image.style.animationName = spinAnimationName;

        /* 随机下落时间 */
        var fadeAndDropDuration = comm.durationValue(comm.randomFloat(1.2, 6.2));

        /* 随机旋转时间 */
        var spinDuration = comm.durationValue(comm.randomFloat(3, 4));

        leafDiv.style.webkitAnimationDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;
        leafDiv.style.animationDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;

        // 随机delay时间
        var leafDelay = comm.durationValue(comm.randomFloat(0, 2));

        leafDiv.style.webkitAnimationDelay = leafDelay + ', ' + leafDelay;
        leafDiv.style.animationDelay = leafDelay + ', ' + leafDelay;
        image.style.webkitAnimationDuration = spinDuration;
        image.style.animationDuration = spinDuration;
        leafDiv.appendChild(image);
        return leafDiv;
    },
    randomInteger: function (low, high) {
        return low + Math.floor(Math.random() * (high - low));
    },
    randomFloat: function (low, high) {
        return low + Math.random() * (high - low);
    },
    pixelValue: function (value) {
        return value + 'px';
    },
    durationValue: function (value) {
        return value + 's';
    },
    removeArray: function (_dataArray, _indexid) {
        var arr = new Array();
        for (var i = 0; i < _dataArray.length; i++)
            if (_dataArray[i] != _indexid) arr.push(_dataArray[i]);
        return arr;
    },

    messageScrollTop: function () {
        var lastdiv = $("#chatBox").children("div:last-child");
        if (lastdiv == null || lastdiv == "undefined") return;
        if (lastdiv.offset() == null || lastdiv.offset() == "undefined") return;
        $("#chatBox").stop(true);
        $("#chatBox").animate({
            scrollTop: lastdiv.offset().top - $("#chatBox").offset().top + $("#chatBox").scrollTop()
        }, 0);
    },


    end: ""
}

var publicVar = {
    canbuy: true,
    qs: 0, //期数
    isture: 0, //是否正在抽奖
    newsnum: 0,
    topnum: 0,
    end: ""
}