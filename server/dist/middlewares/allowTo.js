"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const Comments_1 = __importDefault(require("../models/Comments"));
const Posts_1 = __importDefault(require("../models/Posts"));
const allowTo = (type, ...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.default().Create(`allowed only for ${roles}`, 401));
        }
        if (req.user.role == "User") {
            if (type == "comment") {
                const id = req.params.id;
                const userId = Comments_1.default.findById({ _id: id }, { user: true });
                if (userId == req.user.id) {
                    next();
                }
                else {
                    return next(new AppError_1.default().Create(`not authorized`, 401));
                }
            }
            if (type == "post") {
                const id = req.params.id;
                const userId = Posts_1.default.findById({ _id: id }, { user: true });
                if (userId == req.user.id) {
                    next();
                }
                else {
                    return next(new AppError_1.default().Create(`not authorized`, 401));
                }
            }
        }
        next();
    };
};
exports.default = allowTo;
