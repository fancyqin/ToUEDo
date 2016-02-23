var Index = require('../app/controllers/index');
var Data = require('../app/controllers/data');
var User = require('../app/controllers/user');

var Week = require('../app/controllers/week');

module.exports = function(app){
    //pre hanadle user

    app.use(function (req, res, next) {
        var _user = req.session.user;
        app.locals.uzer = _user;

        app.locals.needTip = req.session.needTip;
        app.locals.tipWrong = req.session.tipWrong;
        app.locals.tips = req.session.tips;

        next();
    });



    //index
    app.get('/', Index.index);
    app.get('/date', Index.date);

    //data
    app.post('/new', Data.save);
    app.delete('/del', Data.del);
    app.post('/change', Data.change);
    app.post('/edit', Data.edit);
    app.get('/list', Data.list);
    app.post('/duration/change' ,Data.durationChange)

    //user
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    app.get('/logout', User.logout);
    app.get('/signin', User.signInPage);
    app.get('/signup', User.signUpPage);
    app.get('/users', User.users);

    //week

    app.get('/week', Week.index);
    app.post('/newWeek' ,Week.save);
    app.post('/week/change', Week.change)
};


