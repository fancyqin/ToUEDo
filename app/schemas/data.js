var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var DataSchema = new mongoose.Schema({
    title: String,
    userId:{
        type:ObjectId,
        ref:'User'
    },
    createAt:{
        type: Date,
        default: Date.now()
    },
    updateAt:{
        type: Date,
        default: Date.now()
    },
    completed: {
        type: Boolean,
        default: 0
    },
    weekData:{
        type: Boolean,
        default: 0
    },
    spentTime: Number,
    jira: String
});

DataSchema.pre('save',function(next){
    if (this.isNew){
        this.createAt = this.updateAt = Date.now();
    }
    next();
});

DataSchema.pre('update',function(next){
    this.updateAt = Date.now();
    next();
});



DataSchema.statics = {
    fetch: function(cb){
        return this
            .find({})
            .sort({'updateAt':1})
            .exec(cb)
    },
    findById: function(id,cb){
        return this
            .findOne({_id: id})
            .exec(cb)
    },
    findCompletedByIdDay:function(userId,firstDay,lastDay,isWeek,cb){
        return this
            .find({
                'completed': 1,
                'updateAt': {
                    $gte: firstDay,
                    $lt: lastDay
                },
                'userId': userId,
                'weekData': isWeek
            })
            .sort({'updateAt': 1})
            .exec(cb)
    }
};



module.exports = DataSchema;