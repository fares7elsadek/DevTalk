"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require('multer');
const AppError_1 = __importDefault(require("../utils/AppError"));
const maxFileSizeBytes = 5 * 1024 * 1024; // 5 MB
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.')[1];
        const filename = `post-${uniqueSuffix}.${ext}`;
        cb(null, filename);
    }
});
const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        const error = new AppError_1.default().Create(`Not supported type`, 401);
        cb(error, false);
    }
};
const upload = multer({
    storage,
    limits: { fileSize: maxFileSizeBytes },
    fileFilter
});
exports.default = upload;
