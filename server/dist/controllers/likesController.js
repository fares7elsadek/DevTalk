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
const verifyMongoId_1 = __importDefault(require("../utils/verifyMongoId"));
const asyncWrapper_1 = __importDefault(require("../middlewares/asyncWrapper"));
const httpMessage_1 = require("../utils/httpMessage");
const AppError_1 = __importDefault(require("../utils/AppError"));
const Posts_1 = __importDefault(require("../models/Posts"));
const Likes_1 = __importDefault(require("../models/Likes"));
const LikePost = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const userId = req.user.id;
    (0, verifyMongoId_1.default)(postId);
    const alreadyLiked = yield Likes_1.default.findOne({ $and: [{ user: userId }, { post: postId }] });
    if (alreadyLiked != null) {
        console.log("first", alreadyLiked);
        const Lid = alreadyLiked._id;
        const done = yield Posts_1.default.findByIdAndUpdate({ _id: postId }, { $pull: { likes: Lid } }, { new: true });
        if (!done) {
            return next(new AppError_1.default().Create(`something wrong has happened`, 400));
        }
        yield Likes_1.default.deleteOne({ _id: Lid });
        res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS });
    }
    else {
        console.log("second", alreadyLiked);
        const Like = new Likes_1.default({
            user: userId,
            post: postId
        });
        yield Like.save();
        const done = yield Posts_1.default.findByIdAndUpdate({ _id: postId }, { $push: { likes: Like._id } }, { new: true });
        if (!done) {
            return next(new AppError_1.default().Create(`something wrong has happened`, 400));
        }
        res.status(200).json({ status: httpMessage_1.HttpMessage.SUCCESS });
    }
}));
exports.default = {
    LikePost
};
