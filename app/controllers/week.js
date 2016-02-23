var Data = require('../models/data');
var moment = require('moment');

exports.index = function (req, res) {
    var sessionUser = req.session.user;
    //console.log('user in session:');
    //console.log(sessionUser);
    var firstDay = moment().startOf('week').add(1, 'day');
    var lastDay = moment().endOf('week').add(2, 'day');
    var isWeek = 1;
    if (sessionUser) {
        Data.find({
                'completed': 0,
                'userId': sessionUser[0]._id,
                'weekData': 1
            }, function (err, dataWeek) {
                if (err) {
                    console.log(err)
                }
                Data.findCompletedByIdDay(sessionUser[0]._id, firstDay, lastDay, isWeek, function (err, dataWeekDone) {
                    if (err) {
                        console.log(err)
                    }
                    res.render('week', {
                        todayTasks: dataWeek,
                        todayDoneTasks: dataWeekDone,
                        isIndex: true
                    })
                })
            }
        ).sort({'updateAt': 1})
    }
    else {
        res.redirect('/signin')
    }
};


exports.save = function (req, res) {
    var _data;
    var newTitle = req.body.title;
    var userId = req.body.userId;
    _data = new Data({
        title: newTitle,
        userId: userId,
        weekData: 1
    });
    _data.save(function (err, data) {
        if (err) {
            console.log(err)
        }
        var id = data.id;
        res.json({newId: id});
    })
};

exports.change = function (req, res) {
    var sessionUser = req.session.user;
    var box = req.body.box;
    var first = box.first;
    var last = box.last;
    if (sessionUser) {
        Data.findCompletedByIdDay(sessionUser[0]._id, first, last, 1, function (err, data) {
            if (err) {
                console.log(err)
            }
            res.json({datas: data})
        })
    } else {
        res.redirect('/signin');
    }
};