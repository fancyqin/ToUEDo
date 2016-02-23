var Data = require('../models/data');
var moment = require('moment');

exports.index = function (req, res) {
    var sessionUser = req.session.user;
    //var userId = sessionUser[0]._id;
    //console.log('user in session:');
    //console.log(sessionUser);
    var firstDay = moment().startOf('day');
    var lastDay = moment(firstDay).add(1, 'days');
    var isWeek = 0;
    if (sessionUser) {
        Data.find({
                'completed': 0,
                'userId': sessionUser[0]._id,
                'weekData': 0
            }, function (err, dataToday) {
                if (err) {
                    console.log(err)
                }
                Data.findCompletedByIdDay(sessionUser[0]._id,firstDay,lastDay,isWeek, function (err, dataTodayDone) {
                    if (err) {
                        console.log(err)
                    }
                    res.render('index', {
                        todayTasks: dataToday,
                        todayDoneTasks: dataTodayDone,
                        isIndex: true
                    })
                })
            }
        ).sort({'updateAt': 1})
    }
    else{
        res.redirect('/signin');
    }

};

exports.date = function (req, res) {
    var today = moment(today).format('YYYY-MM-DD');
    var firstDay = req.query.date;
    var lastDay = moment(firstDay).add(1, 'days').format('YYYY-MM-DD');
    var sessionUser = req.session.user;
    var isWeek = 0;
    if(sessionUser){
        if (today === firstDay) {
            res.json({
                update: true
            })
        } else {
            Data.findCompletedByIdDay(sessionUser[0]._id,firstDay,lastDay,isWeek, function (err, dataDone) {
                if (err) {
                    console.log(err)
                }
                res.json({
                    DoneTasks: dataDone
                })
            })
        }
    }
    else{
        res.redirect('/signin');
    }

};