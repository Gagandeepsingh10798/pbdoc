const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const VisModel = new Schema({
    moduleId: {
        type: ObjectId,
        ref: 'modules'
    },
    nodes: [{
        id:String,
        label:String,
        title:String,
        x:String,
        y:String,
        icon: String
     }] ,
    edges : [{
        from : String,
        to : String
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
});
const Vis =mongoose.model('Vis',VisModel);
module.exports = Vis;
