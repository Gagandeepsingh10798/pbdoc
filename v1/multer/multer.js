const multer = require('multer');
const path=require("path");
const models=require('../../data-models');


const storage = multer.diskStorage(
    
    {
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
        || file.mimetype === 'image/jpeg'){
            cb(null, true);
        }else {
            cb(null, false);
        }
}




const upload = multer({storage: storage, fileFilter: filefilter});

module.exports = {upload};