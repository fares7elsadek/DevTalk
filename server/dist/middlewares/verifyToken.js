"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jwt = require('jsonwebtoken');
const AppError_1 = __importDefault(require("../utils/AppError"));
const UserDao_1 = __importDefault(require("../models/Dao/UserDao"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => {
    const { DevTalk_token, refresh_token } = req.cookies;
    if (!DevTalk_token) {
        return next(new AppError_1.default().Create("token is required", 403));
    }
    try {
        let curUser = jwt.verify(DevTalk_token, process.env.JWT_SECRET);
        if (!curUser) {
            return next(new AppError_1.default().Create("not authorized", 403));
        }
        req.user = curUser;
        next();
    }
    catch (err) {
        try {
            const User = jwt.verify(refresh_token, process.env.JWT_SECRET);
            if (!User) {
                return next(new AppError_1.default().Create("not authorized", 403));
            }
            const accessToken = new UserDao_1.default().generateJwtToken(User.id, User.firstname, User.role, User.isBlocked);
            res.cookie("DevTalk_token", accessToken, {
                httpOnly: true,
                maxAge: 48 * 60 * 60 * 1000
            });
            req.user = User;
            next();
        }
        catch (err) {
            const error = new AppError_1.default().Create("not authorized", 401);
            return next(error);
        }
    }
};
exports.verifyToken = verifyToken;
