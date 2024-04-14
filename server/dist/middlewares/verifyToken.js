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
exports.verifyToken = void 0;
const jwt = require('jsonwebtoken');
const AppError_1 = __importDefault(require("../utils/AppError"));
const Users_1 = __importDefault(require("../models/Users"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    if (!cookie.DevTalk_token) {
        return next(new AppError_1.default().Create("token is required", 403));
    }
    try {
        const curUser = jwt.verify(cookie.DevTalk_token, process.env.JWT_SECRET);
        if (!curUser) {
            return next(new AppError_1.default().Create("not authorized", 403));
        }
        const user = yield Users_1.default.findById({ _id: curUser.id });
        if (!user) {
            return next(new AppError_1.default().Create("not authorized", 403));
        }
        if (!user.tokens || !user.tokens.DevTalk_Token || cookie.DevTalk_token != user.tokens.DevTalk_Token) {
            return next(new AppError_1.default().Create("not authorized", 403));
        }
        req.user = curUser;
        next();
    }
    catch (err) {
        const error = new AppError_1.default().Create("not authorized", 401);
        return next(error);
    }
});
exports.verifyToken = verifyToken;
