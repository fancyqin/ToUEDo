var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');

var SALT_WORT_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    meta:{
        createAt:{
            type: Date,
            default: Date.now()
        },
        updateAt:{
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.pre('save', function(next){
    var user = this;

    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    // not work

    //bcrypt.genSalt(SALT_WORT_FACTOR, function(err,salt){
    //    if(err) return next(err)
    //
    //        bcrypt.hash(uesr.password,salt,function(err,hash){
    //            if(err) return next(err)
    //
    //            user.password = hash;
    //            next()
    //        })
    //})


    next();
});


//UserSchema.method = {
//    comparePassword: function(_password,cb){
//        if (_password ===  this.password){
//            cb(null, isMatch)
//        }
//        else{
//            return cb(err);
//        }
//        //bcrypt.compare(_password, this.password, function(err, isMatch){
//        //    if (err) return cb(err)
//        //
//        //    cb(null, isMatch)
//        //})
//    }
//}

UserSchema.statics = {
    fetch: function(cb){
        return this
            .find({})
            .sort({'meta.updateAt':-1})
            .exec(cb)
    },
    findById: function(id,cb){
        return this
            .findOne({_id: id})
            .exec(cb)
    }
};

module.exports = UserSchema;