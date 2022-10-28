const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LogsModel = new Schema({
    message: {
        type: String,
        default: '',
    },
    stack: {
        type: String,
        default: '',
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

});
const Logs =mongoose.model('Logs',LogsModel);
module.exports = Logs;