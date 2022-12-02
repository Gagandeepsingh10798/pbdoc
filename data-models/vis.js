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
        heading: String,
        description: String
     }] ,
    edges : [{
        from : String,
        to : String
         }],
});
const Vis =mongoose.model('Vis',VisModel);
module.exports = Vis;
