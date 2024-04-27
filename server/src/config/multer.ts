const multer = require('multer');
import { Request } from "express";
import AppError from "../utils/AppError";

const maxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
    destination: function(req:Request,file:any,cb:any){
        cb(null,'uploads');
    },
    filename:function(req:Request,file:any,cb:any){
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = file.originalname.split('.')[1];
      const filename = `post-${uniqueSuffix}.${ext}`;
      cb(null, filename);
    }
})


const fileFilter = function(req: Request, file: any, cb: any) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        const error = new AppError().Create(`Not supported type`, 401);
        cb(error, false);
    }
}

const upload = multer({
    storage,
    limits:{fileSize:maxFileSizeBytes},
    fileFilter
})


export default upload;
