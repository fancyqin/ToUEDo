var User = require('../models/user');

function showTip(req,a,b,c){
    req.session.needTip = a;
    req.session.tipWrong = b;
    req.session.tips = c;
}

exports.signup = function (req, res) {
    var _user = req.body.user;

    User.find({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (user.length !== 0) {
            showTip(req,true,true,"用户名已存在！");
            return res.redirect('/signup')
        } else {
            var nwuser = new User(_user);
            nwuser.save(function (err, user) {
                if (err) {
                    console.log(err)
                }
                showTip(req,true,false,"注册成功！");
                res.redirect('/signin')
            })
        }
    })
};

exports.signin = function (req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.find({name: name, password: password}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (user.length === 0) {
            showTip(req,true,true,"用户名或密码错误！");
            return res.redirect('/signin')
        } else {
            req.session.user = user;
            console.log("nice");
            return res.redirect('/')
        }
    })
};

exports.logout = function (req, res) {
    delete req.session.user;
    //delete app.locals.uzer;
    showTip(req,true,false,"注销成功！");
    res.redirect("/signin");
};

exports.signInPage = function (req, res) {
    delete req.session.needTip;
    res.render('signin');
};

exports.signUpPage = function (req, res) {
    delete req.session.needTip;
    res.render('signup');
};


exports.users = function(req,res){
    User.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render('users',{
            users:users
        })
    })
};
