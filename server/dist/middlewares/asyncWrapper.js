"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const asyncWrapper = (asyncFunc) => {
    return (req, res, next) => {
        asyncFunc(req, res, next).catch((err) => {
            const message = err.message;
            const statusCode = 500;
            const error = new AppError_1.default().Create(message, statusCode);
            next(error);
        });
    };
};
exports.default = asyncWrapper;
