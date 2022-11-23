const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ModulesModel = new Schema({
    title: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    heading: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
    },
    subHeading: {
        type: String,
        lowercase: true,
        trim: true
    },
    businessDocument: {
        type: String,
        trim: true,
        default: ''
    },
    figmaLink: {
        type: String,
        trim: true,
        default: ''
    },
    bfDiagram: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

},{
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const Modules =mongoose.model('Modules',ModulesModel);
module.exports = Modules;