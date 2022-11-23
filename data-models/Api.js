const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Apis = new Schema({
   name: {
        type: String,
        default: ''
    },
    methods: {
        type: [String],
        default: ''     
    },
    path: {
        type: String,
        default: ''
    },
    isDeleted:{
        type: String,
        default: false,
    }
});
const apiModel= mongoose.model('Apis', Apis);
module.exports = apiModel;