var Data = require('../models/data');
var moment = require('moment');

exports.save = function (req, res) {
    var _data;
    var newTitle = req.body.title;
    var userId = req.body.userId;
    _data = new Data({
        title: newTitle,
        userId: userId,
        weekData: 0
    });
    Data.find({'completed': 0,'userId': userId,'weekData':0},function(err,data){
        if(err){console.log(err)}
        var num = data.length;
        if(num < 30){
            _data.save(function (err, data) {
                if (err) {
                    console.log(err)
                }
                var id = data.id;
                res.json({newId: id});
            })
        }else {
            res.json({overflow:1})
        }
    })

};


exports.del = function (req, res) {
    var id = req.query.id;
    if (id) {
        Data.remove({_id: id}, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                res.json({success: 1})
            }
        })
    }
};


exports.change = function (req, res) {
    var id = req.query.id;
    var stus = req.query.status;
    if (id) {
        if (stus === 'true') {
            Data.update({_id: id}, {
                $set: {
                    'completed': 1,
                    'updateAt': Date.now()
                }
            }, function (err, data) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json({success: 1})
                }
            })
        } else if (stus === 'false') {
            Data.update({_id: id}, {
                $set: {
                    'completed': 0,
                    'updateAt': Date.now()
                }
            }, function (err, data) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.json({success: 2})
                }
            })
        } else {
            console.log("wrong");
        }

    }
};

exports.edit = function (req, res) {
    var id = req.body.id;
    var editInner = req.body.inner;
    if (id) {
        Data.update({_id: id}, {
            $set: {
                'title': editInner
            }
        }, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                res.json(true)
            }
        })
    }
};

exports.list = function (req, res) {
    Data.fetch(function (err, datas) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            datas: datas
        })
    })
};

exports.durationChange = function (req, res) {
    var sessionUser = req.session.user;
    var box = req.body.box;
    var first = box.first;
    var last = box.last;
    var day;
    var datas = [];
    if (sessionUser) {
        if (box.type === 'week') {
            day = 7;
        } else if (box.type === 'month') {
            day = moment(first).daysInMonth();
        }
        var f, l;
        var findDayData = function (i) {
            if (i > day) {
                return false;
            }
            f = moment(first).add(i, 'day').format();
            l = moment(first).add(i + 1, 'day').format();
            Data.findCompletedByIdDay(sessionUser[0]._id, f, l, 0, function (err, data) {
                if (err) {
                    console.log(err)
                }
                datas.push(data);
                if (i === day - 1) {
                    res.json({datas: datas});
                }
                findDayData(i + 1);
            })
        };
        findDayData(0);
    }
    else {
        res.redirect('/signin');
    }

};