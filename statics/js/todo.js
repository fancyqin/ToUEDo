$(function () {

    //日期
    var i18n = {
        previousMonth: '上个月',
        nextMonth: '下个月',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
    };

    var $datePicker = $('#datepicker');


    function setToday(e) {
        var today = Date.now();
        e.val(moment(today).format('YYYY-MM-DD'));
    }

    setToday($datePicker);

    var $duration = $('.durating-date');
    var durationBox;

    function setWeek(e) {
        var firstDay, lastDay;
        if (moment().day() === 0) {
            firstDay = moment().subtract(1, 'day').startOf('week').add(1, 'day');
            lastDay = moment().subtract(1, 'day').endOf('week').add(1, 'day');
        } else {
            firstDay = moment().startOf('week').add(1, 'day');
            lastDay = moment().endOf('week').add(1, 'day');
        }
        e.val(moment(firstDay).format('YYYY-MM-DD') + " ~ " + moment(lastDay).format('MM-DD')).width(220)

    }

    setWeek($duration);


    var picker = new Pikaday(
        {
            field: $datePicker[0],
            format: 'YYYY-MM-DD',
            i18n: i18n,
            yearRange: [2016, 2026]
        }
    );


    //date change
    var cover = $('.main-cover');
    $datePicker.on('change', function () {
        var date = $datePicker.val();
        cover.show();
        $.ajax({
            url: '/date',
            dataType: 'json',
            data: {
                date: date
            }
        }).done(function (results) {
            if (results.update) {
                location.href = location.href;
            }
            var tasks = results.DoneTasks;
            if (tasks) {
                var num = tasks.length;
                cover.hide();
                $('.press-in').hide();
                $('.list-now').hide();
                $('.main .list *').remove();
                $('#modeToday').removeClass('on');
                var completedList = $('.main .list-completed');
                for (var i = 0; i < num; i++) {
                    completedList.append(
                        "<li class='item-id-" + tasks[i]._id + " past' data-id='" + tasks[i]._id + "'>" + tasks[i].title + "</li>"
                    )
                }
                if (tasks.length === 0) {
                    completedList.append("<div>该日没有已完成任务</div>")
                }
            }
        })
    });

    //date mode change


    function setDurationBox(firstDay, lastDay, durationType) {
        if (durationType === 'week') {
            $duration.val(moment(firstDay).format('YYYY-MM-DD') + " ~ " + moment(lastDay).format('MM-DD')).width(220);

        } else if (durationType === 'month') {
            $duration.val(moment(firstDay).format('YYYY-MM')).width(110)
        }
        durationBox = {
            first: firstDay,
            last: lastDay,
            type: durationType
        };
        $trigger.attr('data-type', durationType);
        return durationBox;
    }


    function durationModeChange(timetype) {
        $datePicker.hide();
        $duration.show();
        cover.show();
        $.ajax({
            url: '/duration/change',
            type: 'POST',
            dataType: 'json',
            data: {
                box: durationBox
            }
        }).done(function (results) {
            var datas = results.datas;
            var num = datas.length;
            if (datas) {
                $('.press-in').hide();
                $('.list-now').hide();
                $('.main .list *').remove();
                cover.hide();
                var completedList = $('.main .list-completed');
                for (var i = 0; i < num; i++) {
                    var innerNum = datas[i].length;

                    if (datas[i].length > 0) {
                        var time = moment(datas[i][0].updateAt).format('YYYY-MM-DD');
                        completedList.append("<div class='date'>" + time + "</div>");
                    }
                    for (var j = 0; j < innerNum; j++) {

                        completedList.append(
                            "<li class='item-id-" + datas[i][j]._id + " past' data-id='" + datas[i][j]._id + "'>" + datas[i][j].title + "</li>"
                        )
                    }
                }
            }
        })


    }

    $('#modeWeek').click(function () {
        var firstDay = moment().startOf('week').add(1, 'day').format();
        var lastDay = moment().endOf('week').add(1, 'day').format();

        if (moment().day() === 0) {
            firstDay = moment(firstDay).subtract(7, 'day').format();
            lastDay = moment(lastDay).subtract(7, 'day').format();
        }

        var durationType = 'week';
        setDurationBox(firstDay, lastDay, durationType);
        durationModeChange(durationType);
        $('.mode-item').removeClass('on');
        $(this).addClass('on');

    });


    $('#modeMonth').click(function () {
        var firstDay = moment().startOf('month').format();
        var lastDay = moment().endOf('month').format();

        var durationType = 'month';
        setDurationBox(firstDay, lastDay, durationType);
        durationModeChange(durationType);
        $('.mode-item').removeClass('on');
        $(this).addClass('on');

    });

    ///////////////////////////////////////
    //date trigger

    var $trigger = $('.J-trigger');

    function dateTrigger(direction) {
        var val = $trigger.attr('data-type');
        var firstDay, lastDay;
        if (val === 'day') {
            var date;
            if (direction === 'left') {
                date = moment($datePicker.val()).subtract(1, 'day').format('YYYY-MM-DD');
            } else if (direction === 'right') {
                date = moment($datePicker.val()).add(1, 'day').format('YYYY-MM-DD');
            }
            $datePicker.val(date).change();
        }
        else if (val === 'week') {
            var thisDay = moment($duration.val()).format('YYYY-MM-DD');
            if (direction === 'left') {
                firstDay = moment(thisDay).subtract(7, 'day').format();
            } else if (direction === 'right') {
                firstDay = moment(thisDay).add(7, 'day').format();
            }
            lastDay = moment(firstDay).add(6, 'day').format();
            $duration.val(moment(firstDay).format('YYYY-MM-DD') + " ~ " + moment(lastDay).format('MM-DD')).width(220);
            durationBox = {
                first: firstDay,
                last: lastDay,
                type: val
            };
            if ($trigger.attr('data-week') === 'yes') {
                var thisWeekFirstDay;
                if(moment().day() === 0){
                    thisWeekFirstDay = moment().startOf('week').subtract(6,'day').format()
                }else {
                    thisWeekFirstDay = moment().startOf('week').add(1,'day').format()
                }
                cover.show();
                if (firstDay === thisWeekFirstDay) {
                    location.href = location.href;
                }else {
                    $.ajax({
                        url: '/week/change',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            box: durationBox
                        }
                    }).done(function (results) {
                        var datas = results.datas;
                        var completedList = $('.main .list-completed');
                        var num = datas.length;
                        if (datas) {
                            $('.press-in').hide();
                            $('.list-now').hide();
                            $('.main .list *').remove();
                            cover.hide();
                            for (var i = 0; i < num; i++) {
                                completedList.append(
                                    "<li class='item-id-" + datas[i]._id + " past' data-id='" + datas[i]._id + "'>" + datas[i].title + "</li>"
                                )
                            }
                        }

                    })
                }


            }
            else {
                durationModeChange(val);
            }

        }
        else if (val === 'month') {
            var thisMonth = moment($duration.val()).format('YYYY-MM');
            if (direction === 'left') {
                firstDay = moment(thisMonth).subtract(1, 'month').startOf('month').format();
                lastDay = moment(thisMonth).subtract(1, 'month').endOf('month').format();
            } else if (direction === 'right') {
                firstDay = moment(thisMonth).add(1, 'month').startOf('month').format();
                lastDay = moment(thisMonth).add(1, 'month').endOf('month').format();
            }
            $duration.val(moment(firstDay).format('YYYY-MM')).width(110);
            durationBox = {
                first: firstDay,
                last: lastDay,
                type: val
            };
            durationModeChange(val);
        }
        else if (val === 'weekData') {

        }
    }

//////////////////////
    $trigger
        .on('click', '#prevDate', function () {
            dateTrigger('left');
        })
        .on('click', '#nextDate', function () {
            dateTrigger('right');
        });

    //添加 data
    var listNow = $('.list-now');
    var inputBox = $('#press');
    var userId = $('#userId');
    var inner, newId;

    function addItem() {
        inner = inputBox.val();
        var addUrl;
        if (inputBox.attr('data-week') === 'yes') {
            addUrl = '/newWeek'
        } else {
            addUrl = '/new';
        }
        $.ajax({
            url: addUrl,
            data: {
                title: inner,
                userId: userId.val()
            },
            type: 'POST'
        }).done(function (results) {
            if(results.newId){
            newId = results.newId;
            var tmpItem =
                "<li class='item-id-" + newId + "'>" +
                "<div class='box' data-id='" + newId + "'>" +
                "<label class='check J-check'><input type='checkbox' ></label>" +
                "<p class='J-inner'>" + inner + "</p>" +
                "<i class='J-del'></i>" +
                "<span class='J-edit'></span>" +
                "</div>" +
                "</li>";
            listNow.append(tmpItem);
            }
            if(results.overflow === 1){
                alert('您已经有30个未完成的任务了，别再加了');
            }
        });
        inputBox.val('');
    }


    $(".press-in").on('keyup', '#press', function (e) {
        if (inputBox.val() !== "" && e.which === 13) {
            if (userId.val() && userId.val() != "") {
                addItem();
            } else {
                alert("请登录！");
            }
        }
    }).on('click', '.sumbit', function () {
        if (inputBox.val() !== "") {
            if (userId.val() && userId.val() != "") {
                addItem();
            } else {
                alert("请登录！");
            }
        }
    });


    var opId, opItem;

    function getIDItem(e) {
        var target = $(e.target);
        opId = target.closest('.box').data('id');
        opItem = $('.item-id-' + opId);
    }

    //删除
    $('.list')
        .on('click', '.J-del', function (e) {
            getIDItem(e);
            if (confirm('Are u sure ？')) {
                $.ajax({
                        url: '/del?id=' + opId,
                        type: 'DELETE'
                    })
                    .done(function (results) {
                        if (results.success === 1) {
                            if (opItem.length > 0) {
                                opItem.remove();
                            }
                        }
                    })
            }
        })
        //完成
        .on('change', '.J-check input', function (e) {
            var status = $(e.target).is(':checked');
            getIDItem(e);
            $.ajax({
                    url: '/change?id=' + opId + '&status=' + status,
                    type: 'POST'
                })
                .done(function (results) {
                    if (results.success === 1) {
                        $('.list-completed').append(opItem);
                        opItem.addClass('completed').find('.J-check input').attr('checked');
                    } else if (results.success === 2) {
                        $('.list-now').append(opItem);
                        opItem.removeClass('completed').find('.J-check input').removeAttr('checked');
                    }
                })
        })
        //编辑
        .on('click', '.J-edit', function (e) {
            getIDItem(e);
            var inner = opItem.find('.J-inner');
            var innerTxt = inner.text();
            inner.text('').prepend("<input class='J-editInput' type='text' />");
            inner.children('input').focus().val(innerTxt);
            return false;
        })
        .on('blur', '.J-editInput', function (e) {
            getIDItem(e);
            var val = $(this).val();
            var _this = $(this);
            $.ajax({
                    url: '/edit',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: opId,
                        inner: val
                    }
                })
                .done(function () {
                    _this.parent('').text(val);
                    _this.remove();
                })
        });
    setTimeout(function () {
        var $tips = $('.tip-wrap');
        if ($tips.length > 0) {
            $tips.fadeOut(1000);
        }
    }, 3000)


});

