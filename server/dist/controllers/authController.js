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
const Users_1 = __importDefault(require("../models/Users"));
const express_validator_1 = require("express-validator");
const AppError_1 = __importDefault(require("../utils/AppError"));
const jwt = require('jsonwebtoken');
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
const UserDao_1 = __importDefault(require("../models/Dao/UserDao"));
const httpMessage_1 = require("../utils/httpMessage");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//register
const registerUser = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, title, username, password, confirmedPassword } = req.body;
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const message = error.array();
        const statusCode = 400;
        const result = message.map(obj => obj.msg);
        const err = new AppError_1.default().Create("FAIL", statusCode, result);
        return next(err);
    }
    const user = yield Users_1.default.findOne({ email: email });
    if (user) {
        const err = new AppError_1.default().Create("email is already exist", 400);
        return next(err);
    }
    const userna = yield Users_1.default.findOne({ username });
    if (userna) {
        const err = new AppError_1.default().Create("username already exist", 400);
        return next(err);
    }
    const object = new UserDao_1.default();
    const PsswordToken = object.generatePasswordToken(firstname, lastname, email, title);
    yield object.CreateNewUser(firstname, lastname, password, email, username, title, PsswordToken);
    const emailOptions = {
        email,
        subject: "confirm email for DevTalk",
        url: `${req.protocol}://${req.get('host')}/api/auth/email_confirmation/${PsswordToken}`
    };
    object.sendPasswordEmail(emailOptions);
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, message: `email has been sent successfuly for ${email}` });
}));
const loginUser = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty()) {
        const message = err.array();
        const statusCode = 400;
        const result = message.map(obj => obj.msg);
        const error = new AppError_1.default().Create("FAIL", statusCode, result);
        return next(error);
    }
    const user = yield Users_1.default.findOne({ email });
    if (!user) {
        return next(new AppError_1.default().Create("invalid email or password", 400));
    }
    const result = yield bcryptjs_1.default.compare(String(password), user.password);
    if (!result) {
        return next(new AppError_1.default().Create("invalid email or password", 400));
    }
    if (!user.verified) {
        return next(new AppError_1.default().Create("email has not been verified yet", 400));
    }
    const accessToken = new UserDao_1.default().generateJwtToken(user._id.toString(), user.firstname, user.role, user.isBlocked);
    const RefreshToken = new UserDao_1.default().generateRefreshToken(user._id.toString(), user.firstname, user.role, user.isBlocked);
    res.cookie("refresh_token", RefreshToken, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000
    });
    res.cookie("DevTalk_token", accessToken, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000
    });
    const data = {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        title: user.title,
        DevTalk_token: accessToken
    };
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, user: { data } });
}));
const verifyEmail = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    if (!token) {
        return next(new AppError_1.default().Create('invalid request', 403));
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
        return next(new AppError_1.default().Create('invalid or expired token', 403));
    }
    const user = verify;
    const userData = yield Users_1.default.findOne({ email: user.email });
    if (!userData || (userData.tokens && userData.tokens.verifyToken && token != userData.tokens.verifyToken)) {
        console.log("hello");
        return next(new AppError_1.default().Create('invalid or expired token', 403));
    }
    const done = yield Users_1.default.findOneAndUpdate({ email: user.email }, { $set: { verified: true, 'tokens.verifyToken': "" } });
    if (!done) {
        return next(new AppError_1.default().Create('invalid or expired token', 403));
    }
    const accessToken = new UserDao_1.default().generateJwtToken(userData._id.toString(), userData.firstname, userData.role, userData.isBlocked);
    const RefreshToken = new UserDao_1.default().generateRefreshToken(userData._id.toString(), userData.firstname, userData.role, userData.isBlocked);
    res.cookie("DevTalk_token", accessToken, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000
    });
    res.cookie("refresh_token", RefreshToken, {
        httpOnly: true,
        maxAge: 48 * 60 * 60 * 1000
    });
    const data = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        title: user.title,
        username: user.username,
        token: accessToken
    };
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, user: { message: "the email has been verified", data } });
}));
const ResetPasswordToken = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty()) {
        const message = err.array();
        const statusCode = 400;
        const result = message.map(obj => obj.msg);
        const error = new AppError_1.default().Create("FAIL", statusCode, result);
        return next(error);
    }
    const user = yield Users_1.default.findOne({ email });
    if (!user) {
        return next(new AppError_1.default().Create(`email has been sent successfuly for ${email}`, 200));
    }
    const object = new UserDao_1.default();
    const passwordToken = object.generatePasswordToken(user.firstname, user.lastname, user.email, user.title);
    const done = yield Users_1.default.findByIdAndUpdate({ _id: user._id }, { $set: { 'tokens.passwordResetToken.passwordResetToken': passwordToken } });
    if (!done) {
        return next(new AppError_1.default().Create(`something wrong has happened`, 200));
    }
    const emailOptions = {
        email,
        subject: "reset password link for DevTalk",
        url: `${req.protocol}://${req.get('host')}/api/auth/reset-password/${passwordToken}`
    };
    object.sendPasswordEmail(emailOptions);
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, message: `email has been sent successfuly for ${email}` });
}));
const resetPassword = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty()) {
        const message = err.array();
        const statusCode = 400;
        const result = message.map(obj => obj.msg);
        const error = new AppError_1.default().Create("FAIL", statusCode, result);
        return next(error);
    }
    if (!token) {
        return next(new AppError_1.default().Create('invalid request', 403));
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
        return next(new AppError_1.default().Create('invalid or expired token', 403));
    }
    const user = verify;
    const userData = yield Users_1.default.findOne({ email: user.email });
    if (!userData || (userData.tokens && userData.tokens.passwordResetToken && token != userData.tokens.passwordResetToken.token)) {
        return next(new AppError_1.default().Create('invalid or expired token', 403));
    }
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        return next(new AppError_1.default().Create('password did not match', 400));
    }
    const done = yield Users_1.default.findOneAndUpdate({ email: user.email }, { $set: { 'tokens.passwordResetToken.token': "", 'tokens.passwordResetToken.passwordChangedAt': Date.now() } });
    if (!done) {
        return next(new AppError_1.default().Create('invalid or expired token', 403));
    }
    const hashedPassword = yield bcryptjs_1.default.hash(String(password), 10);
    const userPassword = Users_1.default.findByIdAndUpdate({ email: user.email }, { $set: { password: hashedPassword } });
    if (!userPassword) {
        return next(new AppError_1.default().Create('something wrong has happened', 400));
    }
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, message: `password has been changed successfully` });
}));
const Logout_GET = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('DevTalk_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS, message: `logout` });
}));
const authControler = {
    registerUser,
    loginUser,
    verifyEmail,
    ResetPasswordToken,
    resetPassword,
    Logout_GET
};
exports.default = authControler;
