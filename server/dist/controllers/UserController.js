"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const Users_1 = __importDefault(require("../models/Users"));
const httpMessage_1 = require("../utils/httpMessage");
const deleteFile_1 = __importDefault(require("../utils/deleteFile"));
const UploadAvatar = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const avatar = req.file;
    if (!avatar) {
        return next(new AppError_1.default().Create(`somthing wrong has happend`, 400));
    }
    try {
        const result = yield cloudinary_1.default.uploader.upload(avatar.path);
        const user = yield Users_1.default.findByIdAndUpdate({ _id: userId }, { $set: { avatar: result.secure_url } });
        if (!user) {
            console.log("here");
            return next(new AppError_1.default().Create(`somthing wrong has happend`, 400));
        }
        (0, deleteFile_1.default)(avatar.path);
        res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, message: "uploaded" });
    }
    catch (err) {
        return next(new AppError_1.default().Create(`somthing wrong has happend`, 400));
    }
}));
exports.default = {
    UploadAvatar
};
