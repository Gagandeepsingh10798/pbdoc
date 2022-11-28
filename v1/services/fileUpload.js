const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const FileUpload = multer({ storage: inMemoryStorage });
module.exports = {
    FileUpload
};