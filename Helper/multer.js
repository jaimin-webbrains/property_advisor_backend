const multer = require('multer')
const path = require('path')
const formatter = require('date-fns')
let tsDataUploadFileType=""
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve() + '/uploads/')
    },
    filename: (req, file, cb) => {
        if(file.fieldname==="certFileName") tsDataUploadFileType="-C-"
        if(file.fieldname==="certExtFileName") tsDataUploadFileType="-CE-"
        if(file.fieldname==="detailsFileName") tsDataUploadFileType="-D-"
        cb(null, req.body.reraNumber + tsDataUploadFileType + formatter.format(new Date(req.body.lastModifiedDate),'dd-MM-yyyy')+path.extname(file.originalname))
    }
});
exports.upload = multer({ storage: storage });
