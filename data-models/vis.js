const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Vis = new Schema({
   nodes: [{
        id: String,
        label: String,
        title : String,
        x: String,
        y: String
    }],
    edges:[ {
        from: String,
        to: String     
    }],
});
const visModel= mongoose.model('Viz', Vis);
module.exports = visModel;