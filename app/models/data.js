var mongoose = require('mongoose');
var DataSchema = require('../schemas/data');
var Data = mongoose.model('Data', DataSchema);

module.exports = Data;